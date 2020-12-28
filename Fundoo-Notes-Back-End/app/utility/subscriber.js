/**
 * @description This class contains @method consume which is used to pop emailIds from the queue
 * @method used are connect, createChannel, assertQueue, consume
 */
const amqp = require('amqplib/callback_api')

class Subscriber {
    consume = (callBack) => {
        amqp.connect(process.env.REDIS_URL, (error, connection) => {
            if (error)
                return callBack(error, null)
            connection.createChannel((error, channel) => {
                if (error)
                    return callBack(error, null)
                let queName = 'Emails'
                channel.assertQueue(queName, {
                    durable: true
                })
                channel.consume(queName, (msg) => {
                    console.log(`Message: ${msg.content.toString()}`)
                    channel.ack(msg)
                    return callBack(null, msg.content.toString())
                })
            })
        })
    }
}
module.exports = new Subscriber()