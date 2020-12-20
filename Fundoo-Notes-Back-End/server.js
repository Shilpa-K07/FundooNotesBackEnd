const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const logger = require('./app/logger/logger')
//create express app
const app = express()

//parse requests of content type application/json
app.use(bodyParser.json())

/**
 * @description configuring the database
 */
require('./config/mongoDb.js');

/**
 * @description require user routes
 */
require('./app/routes/user.rt')(app)

// Cookies for session management
app.use(cookieParser())

 /**
 * @description require swagger-ui and swagger.json
 */
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./app/lib/api-docs.json')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @description listen for requests
 * @param process.env.PORT is the port number 3000
 */
app.listen(process.env.PORT, () => {
    logger.info("Server is listening on port ",process.env.PORT);
})