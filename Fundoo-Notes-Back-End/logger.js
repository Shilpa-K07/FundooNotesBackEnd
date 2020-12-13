const winston = require('winston')
const logger = winston.createLogger({
    format : winston.format.json(),
    transports : [
        new winston.transports.File({filename : './log/error.log', level : 'error'}),
        new winston.transports.File({filename : './log/info.log'})
    ]
})
module.exports = logger