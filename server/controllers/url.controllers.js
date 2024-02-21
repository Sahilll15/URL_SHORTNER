const { PrismaClient } = require('@prisma/client')
const z = require('zod')


const prisma = new PrismaClient()

const shortUrlGenerator = async (originalUrl) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 6;
    let shortUrl = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        shortUrl += chars[randomIndex];
    }

    try {
        const existingUrl = await prisma.uRL.findFirst({
            where: {
                shortURL: shortUrl,
            }
        })

        if (existingUrl) {
            clg('Short URL already exists, generating new one');
            return shortUrlGenerator(originalUrl);
        } else {
            return shortUrl;
        }

    } catch (error) {
        console.error("Error checking existing URL:", error);
        throw error;
    }
};



const isUrlValid = (url) => {
    const urlRegex = new RegExp(/^(http|https):\/\/[^ "]+$/);
    return urlRegex.test(url);
}



const createShortUrl = async (req, res) => {
    const { originalUrl } = req.body;

    if (!isUrlValid(originalUrl)) {
        return res.status(400).json({
            message: 'Invalid URL'
        });
    }

    const urlSchema = z.object({
        originalUrl: z.string().url()
    });

    try {
        isvalidation = urlSchema.parse(req.body);

        if (!isvalidation) {
            throw new Error('Invalid URL');
        }

        const shortUrl = await shortUrlGenerator(originalUrl); // Generate short URL
        const newUrl = await prisma.uRL.create({
            data: {
                longURL: originalUrl,
                shortURL: shortUrl // Pass generated short URL here
            }
        });

        res.status(200).json({
            message: "URL created successfully",
            data: newUrl
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating URL",
            error: error.message
        });
    }
};


const visitShortUrl = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await prisma.uRL.findFirst({
            where: {
                shortURL: shortUrl
            }
        });

        if (!url) {
            return res.status(404).json({
                message: 'URL not found'
            });
        }

        res.redirect(url.longURL);
    } catch (error) {
        res.status(500).json({
            message: 'Error redirecting',
            error: error.message
        });
    }
}


module.exports = {
    createShortUrl,
    visitShortUrl
}
