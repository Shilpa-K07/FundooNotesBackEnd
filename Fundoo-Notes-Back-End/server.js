const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
require('./config/mongoDb.js')
const uuid = require('uuid').v4
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session)
const logger = require('./app/logger/logger')
//create express app
const app = express()

//parse requests of content type application/json
app.use(bodyParser.json())

// Storing session
/* const store = new mongoDbSession ({
    url: 'mongodb://localhost:27017/fundoo-notes',
    databaseName: 'fundoo-notes',
    collection: 'sessions'
}) */

// Session creation
app.use(session({
    genid: (req) => {
        return uuid() 
      },
    secret: 'key to sign cookie',
    resave: false,
    saveUninitialized: false,
    name: 'fundooNotes',
   // store: store
}))


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
/* const { TokenExpiredError } = require('jsonwebtoken') */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @description listen for requests
 * @param process.env.PORT is the port number 3000
 */
app.listen(process.env.PORT, () => {
    logger.info("Server is listening on port ",process.env.PORT);
})