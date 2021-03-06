/*************************************************************************
* Purpose : to provide methods which are most reusable
*
* @file : util.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const config = require('../../config').get();
const { logger } = config;

class Util {
	/**
	 * @description generate token
	 * @method jwt.sign takes @var emailId and @var userId to generate token
	 */
	generateToken = (user) => {
		logger.info('Generating token');
		const token = jwt.sign({
			emailId: user.emailId,
			userId: user._id
		},
			process.env.RESET_PASSWORD_KEY,
			{
				expiresIn: '20m'
			});
		return token;
	}

	/**
	 * @description sends mail for reset password
	 * @method createTransport creates transport for sending mail
	 * @method sendMail sends email
	 */
	nodeEmailSender = (userData, callBack) => {
		let mailTransporter = this.createTransport();
		ejs.renderFile('app/views/resetPassword.ejs', { link: process.env.URL + '/resetPassword/' + userData.token, user_firstname: userData.name}, (error, data) => {
			if (error) {
				logger.error('Error while rendering ejs template file');
				callBack(error, null);
			}
			else {
				var mailDetails = {
					from: process.env.AUTH_USER,
					to: userData.emailId,
					subject: 'Reset Password',
					html: data
				};
				const mailData = {
					mailTransporter: mailTransporter,
					mailDetails: mailDetails
				};
				logger.info('Sending email');
				this.sendMail(mailData, (error, data) => {
					if (error)
						return callBack(error, null);
					return callBack(null, data);
				});
			}
		});
	}

	/**
	 * @description verifytoken
	 * @param next calls next middleware function
	 * @method jwt.verify decodes token
	 */
	verifyToken = (req, res, next) => {
		logger.info('Verifying token');
		jwt.verify(req.headers.token, process.env.RESET_PASSWORD_KEY, (error, decodeData) => {
			if (error) {
				logger.error('Incorrect token or token is expired');
				const response = { success: false, message: 'Incorrect token or token is expired' };
				return res.status(401).send(response);
			}
			req.decodeData = decodeData;
			next();
		});
	}

	// decoding token for user verfification using promise
	decodeToken = (token) => {
		logger.info('Decoding token');
		return jwt.verify(token, process.env.RESET_PASSWORD_KEY);
	}

	/**
	 * @description verify user by decoding token
	 * @method jwt.verify decodes token
	 * @param next calls next middleware function
	 */
	verifyUser = (req, res, next) => {
		//console.log("session: "+req.session.token)
		logger.info('Verifying user');
		if (req.headers.token === undefined) {
			logger.error('Incorrect token or token is expired');
			const response = { success: false, message: 'Incotrrect token or token is expired' };
			return res.status(401).send(response);
		}
		const token = req.headers.token;
		return jwt.verify(token, process.env.RESET_PASSWORD_KEY, (error, decodeData) => {
			if (error) {
				logger.error('Incorrect token or token is expired');
				const response = { success: false, message: 'Incorrect token or token is expired' };
				return res.status(401).send(response);
			}
			req.decodeData = decodeData;
			next();
		});
	}

	/**
	 * @description Encrypting password
	 * @method bcrypt.hash used to encrypt password
	 * @var saltRounds is the number of rounds used for hashing
	 */
	encryptData = (password, callBack) => {
		logger.info('Encrypting password');
		var saltRounds = 10;
		bcrypt.hash(password, saltRounds, (err, hash) => {
			if (err)
				return callBack(err, null);
			return callBack(null, hash);
		});
	}

	// Creating mail transport
	createTransport = () => {
		logger.info('Creating mail transport');
		let mailTransporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.AUTH_USER,
				pass: process.env.AUTH_PASSWORD
			}
		});
		return mailTransporter;
	}

	/**
	 *@description send email
	 *@method sendEmail sends email to specific mailId 
	 */
	sendMail = (mailData, callBack) => {
		logger.info('Sending email');
		mailData.mailTransporter.sendMail(mailData.mailDetails, (error, data) => {
			if (error)
				return callBack(error, null);
			return callBack(null, data);
		});
	}

	/**
	* @description sends email verification link
	* @method createTransport creates transport for sending mail
	* @method sendMail sends email
	*/
	sendEmailVerificationMail = (userData, callBack) => {
		let mailTransporter = this.createTransport();
		ejs.renderFile('app/views/emailVerification.ejs', { link: process.env.URL + '/activateAccount/' + userData.token, user_firstname: userData.name}, (error, htmlData) => {
			if (error) {
				logger.error('Error while rendering ejs template file');
				return callBack(error, null);
			}
			else {
				var mailDetails = {
					from: process.env.AUTH_USER,
					to: userData.emailId,
					subject: 'Verify Email',
					html: htmlData
				};
				const mailData = {
					mailTransporter: mailTransporter,
					mailDetails: mailDetails
				};
				this.sendMail(mailData, (error, data) => {
					if (error)
						return callBack(error, null);
					return callBack(null, data);
				});
			}
		});
	}
}
module.exports = new Util();