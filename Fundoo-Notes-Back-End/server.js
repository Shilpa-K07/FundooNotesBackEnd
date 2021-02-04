/*************************************************************************
* Purpose : to configure appication
*
* @file : server.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
require('./config/mongoDb.js')
const uuid = require('uuid').v4
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session)
const logger = require('./app/logger/logger')

// create express app
const app = express()

// parse requests of content type application/json
app.use(bodyParser.json())

// require cors
var cors = require('cors')
app.use(cors(/* {
    origin: ['http://localhost:8080'],
    credentials: true,
} */))

// Storing session
/* const store = new mongoDbSession ({
    url: 'mongodb://localhost:27017/fundoo-notes',
    databaseName: 'fundoo-notes',
    collection: 'sessions'
}) */

/**
 * @description creating session
 * @method uuid generates unique universal identifier which is used as session Id
 */
app.use(session({
    genid: (req) => {
        return uuid()
    },
    secret: 'key to sign cookie',
    resave: false,
    saveUninitialized: false,
    /* cookie: {
        'name': 'test',
        httpOnly: false,
        secure: false,
        maxAge: ((60 * 1000) * 60)
      } */
    //name: 'fundooNotes',
    // store: store
}))

// require user routes
require('./app/routes/user.rt')(app)

// Cookies for session management
app.use(cookieParser())



// require swagger-ui and swagger.json
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./app/lib/api-docs.json')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

 // If no routes matches execute this 
 app.use('*/*',(req, res, next) => {
   const response = {success:false, message:"Route Not found"}
    res.status(404).send(response)
})

/**
 * @description listen for requests
 * @param process.env.PORT is the port number 3000
 */
app.listen(process.env.PORT, () => {
    logger.info("Server is listening on port ", process.env.PORT);
})


