/*************************************************************************
* Purpose : pulling data from rabbit mq
*
* @file : publisher.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const amqp = require('amqplib/callback_api');
const config = require('../../config').get();
const { logger } = config;

//const logger = require('../logger/logger')
class Subscriber {
	/**
	 * @description Consumes emailId to queue
	 * @method connect establishes connection with rabbitMq
	 * @method createChannel creates channel for creating queue
	 * @method assertQueue queue creates queue
	 * @method consume consumes emailIds from queue
	 */
	consume = (callBack) => {
		amqp.connect(process.env.RABBIT_URL, (error, connection) => {
			if (error) {
				logger.connect('Error while connecting to Rabbit Mq');
				return callBack(error, null);
			}
			connection.createChannel((error, channel) => {
				if (error) {
					logger.error('Error while creating chnannel');
					return callBack(error, null);
				}
				let queName = 'Emails';
				channel.assertQueue(queName, {
					durable: true
				});
				channel.consume(queName, (msg) => {
					console.log(`Message: ${msg.content.toString()}`);
					channel.ack(msg);
					return callBack(null, msg.content.toString());
				});
			});
		});
	}
}
module.exports = new Subscriber();