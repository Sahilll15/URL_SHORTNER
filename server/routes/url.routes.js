const express = require('express')

const router = express.Router();

const { createShortUrl, visitShortUrl } = require('../controllers/url.controllers')

router.post('/shorten', createShortUrl)
router.get('/:shortUrl', visitShortUrl)

module.exports = router;

