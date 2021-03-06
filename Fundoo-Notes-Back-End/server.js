/*************************************************************************
* Purpose : to configure appication
*
* @file : server.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/mongoDb.js');
const uuid = require('uuid').v4;
const cookieParser = require('cookie-parser');
const session = require('express-session');

// create express app
const app = express();

require('./config').set(process.env.NODE_ENV, app);

// parse requests of content type application/json
app.use(bodyParser.json());

// get config
const config = require('./config').get();

// get logger from config
const { logger } = config;

// require cors
var cors = require('cors');
app.use(cors());

// define static file directory
app.use(express.static('public'));

/**
 * @description creating session
 * @method uuid generates unique universal identifier which is used as session Id
 */
app.use(session({
	genid: () => {
		return uuid();
	},
	secret: 'key to sign cookie',
	resave: false,
	saveUninitialized: false,
}));

// require user routes
require('./app/routes/user.rt')(app);

// Cookies for session management
app.use(cookieParser());

// require swagger-ui and swagger.json
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./app/lib/api-docs.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// If no routes matches execute this 
app.use('*',(req, res) => {
	res.status(404).send({success:false, message:'Route Not found'});
});

/**
 * @description listen for requests
 * @param config.port is the port on which server is listening
 */
var server = app.listen(config.port, () => {
	logger.info('Server is listening on port '+config.port);
});

module.exports = server;