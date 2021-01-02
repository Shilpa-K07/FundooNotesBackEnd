/**
 * @description This class contains @method publish which is used to push emailIds into Queue 
 * @method used are connect, createChannel, sendToQueue
 */
const amqp = require('amqplib/callback_api')
const logger = require('../logger/logger')
class Publisher {
    /**
     * @description Pushes emailId to queue
     * @method connect establishes connection with rabbitMq
     * @method createChannel creates channel for creating queue
     * @method assertQueue queue creates queue
     * @method sendToQueue sends emailIds to queue
     */
    publish = (userData, callBack) => {
        amqp.connect(process.env.RABBIT_URL, (error, connection) => {
            if (error){
                logger.connect('Error while connecting to Rabbit Mq')
                callBack(error, null)
            }
            connection.createChannel((error, channel) => {
                if (error){
                    logger.error('Error while creating chnannel')
                    callBack(error, null)
                }
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
