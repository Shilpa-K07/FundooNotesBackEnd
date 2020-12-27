const amqp = require('amqplib/callback_api')

class Subscriber {
    consume = (callBack) => {
        amqp.connect(`amqp://localhost`, (error, connection) => {
            if (error)
                return callBack(error, null)
            connection.createChannel((error, channel) => {
                if (error)
                    return callBack(error, null)
                let queName = 'Emails'
                channel.assertQueue(queName, {
                    durable: false
                })
                channel.consume(queName, (msg) => {
                    console.log(`Message: ${msg.content.toString()}`)
                    return callBack(null, msg.content.toString())
                })
                /*  console.log(`Message: ${message}`)
                 setTimeout(() => {
                     connection.close
                 }, 1000) */
            })
        })
    }
}
module.exports = new Subscriber()