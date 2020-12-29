/**
 * @description This class contains @method publish which is used to push emailIds into Queue 
 * @method used are connect, createChannel, sendToQueue
 */
const amqp = require('amqplib/callback_api')
class Publisher {
    //Push emailIds to queue
    publish = (userData, callBack) => {
        amqp.connect(process.env.RABBIT_URL, (error, connection) => {
            if (error)
                callBack(error, null)
            connection.createChannel((error, channel) => {
                if (error)
                    callBack(error, null)
                let queName = 'Emails'
                let message = userData.emailId
                channel.assertQueue(queName, {
                    durable: true
                })
                channel.sendToQueue(queName, Buffer.from(message))
                console.log(`Message: ${message}`)
                setTimeout(() => {
                    connection.close()
                }, 1000)
            })
        })
    }
}
module.exports = new Publisher();
