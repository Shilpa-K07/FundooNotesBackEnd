/*************************************************************************
* Purpose : Development file is the default setup expected to have on a local machine to work with the development config
*
* @file : development.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 06/02/2021
*
**************************************************************************/

const winston = require('winston')
module.exports = config => {
    return {
        name: process.env.NODE_ENV,
        port: process.env.PORT,
        logger:
            winston.createLogger({
                format: winston.format.json(),
                transports: [
                    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
                    new winston.transports.File({ filename: './logs/info.log', level: 'info' })
                ]
            }),
        redisClientConfig: {
            redisEndPoint: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            flushRedisOnServerRestart: true,
        },
        database: {
            dbURL: process.env.DB_URL
        },
    }
}