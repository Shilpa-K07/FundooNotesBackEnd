/*************************************************************************
* Purpose : pushing data to rabbit mq
*
* @file : publisher.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const amqp = require('amqplib/callback_api')
const config = require('../../config').get()
const { logger } = config

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
