/*************************************************************************
* Purpose : to keep log of both error and info
*
* @file : logger.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const winston = require('winston')
const logger = winston.createLogger({
	format : winston.format.json(),
	transports : [
		new winston.transports.File({filename : './logs/error.log', level : 'error'}),
		new winston.transports.File({filename : './logs/info.log'})
	]
})
module.exports = logger