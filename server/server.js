const express = require('express')
const cors = require('cors')
const urlRoutes = require('./routes/url.routes')

const app = express()


app.use(express.json())
app.use(cors())


app.use('/', urlRoutes)
app.listen(4000, () => {
    console.log('Server is running on port 4000')
}
)


