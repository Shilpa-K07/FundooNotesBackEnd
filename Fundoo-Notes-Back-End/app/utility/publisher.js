const amqp = require('amqplib/callback_api')
class Publisher {
    publish = (userData, callBack) => {
        amqp.connect(`amqp://localhost`, (error, connection) => {
            if (error)
                callBack(error, null)
            connection.createChannel((error, channel) => {
                if (error)
                    callBack(error, null)
                let queName = 'Emails'
                let message = userData.emailId
                channel.assertQueue(queName, {
                    durable: false
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
