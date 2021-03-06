/*************************************************************************
* Purpose : to recieve request from routes and forward it to service layer
*
* @file : label.ctr.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const Joi = require('joi');
const labelService = require('../services/label.svc');
const config = require('../../config').get();
const { logger } = config;

const inputPattern = Joi.object({
	name: Joi.string().required().messages({
		'string.empty': 'name can not be empty'
	})
}).unknown(true);

class LabelController {
	/**
	 * @description Create a new label
	 * @method validate validates input using Joi
	 * @method labelService.createLabel service class method for adding label
	 */
	createLabel = (req, res) => {
		try {
			const labelData = {
				name: req.body.name,
				userId: req.decodeData.userId
			};

			const validationResult = inputPattern.validate(labelData);

			if (validationResult.error) {
				const response = { success: false, message: validationResult.error.message };
				return res.status(400).send(response);
			}

			labelService.createLabel(labelData)
				.then(data => {
					logger.info('Successfully added label !');
					const response = { success: true, message: 'Successfully added label !', data: data };
					return res.status(200).send(response);
				})
				.catch(error => {
					console.log(error);
					logger.info('Some error occurred while adding label');
					const response = { success: false, message: 'Some error occurred while adding label' };
					return res.status(500).send(response);
				});
		}
		catch (error) {
			console.log(error);
			const response = { success: false, message: 'Some error occurred' };
			return res.status(500).send(response);
		}
	}

	/**
	 * @description Retrieve all the labels
	 * @method labelService.findLabels service class method for adding label
	 */
	findLabelsByUserId = (req, res) => {
		try {
			const labelData = {
				userId: req.decodeData.userId
			};
			labelService.findLabelsByUserId(labelData)
				.then(data => {
					if (!data) {
						const response = { success: false, message: 'No labels found' };
						return res.status(404).send(response);
					}
					logger.info('Successfully retrieved labels !');
					const response = { success: true, message: 'Successfully retrieved labels!', data: data };
					return res.status(200).send(response);
				})
				.catch(error => {
					logger.error('Some error occurred while retrieving labels'+error);
					const response = { success: false, message: 'Some error occurred while retrieving labels' };
					return res.status(500).send(response);
				});
		}
		catch (error) {
			const response = { success: false, message: 'Some error occurred' };
			return res.status(500).send(response);
		}
	}


	/**
	 * @description Retrieve all the labels based on userId
	 * @method labelService.findLabels service class method for retrieving label
	 */
	findLabels = (req, res) => {
		try {
			labelService.findLabels()
				.then(data => {
					if (!data) {
						const response = { success: false, message: 'No labels found' };
						return res.status(404).send(response);
					}
					logger.info('Successfully retrieved labels !');
					const response = { success: true, message: 'Successfully retrieved labels!', data: data };
					return res.status(200).send(response);
				})
				.catch(error => {
					logger.error('Some error occurred while retrieving labels'+error);
					const response = { success: false, message: 'Some error occurred while retrieving labels' };
					return res.status(500).send(response);
				});
		}
		catch (error) {
			const response = { success: false, message: 'Some error occurred' };
			return res.status(500).send(response);
		}
	}

	/**
	 * @description Update label
	 * @method validate validates new data using Joi
	 * @method labelService.updateLabel service class method for updating label
	 */
	updateLabel = (req, res) => {
		try {
			const labelData = {
				labelID: req.params.labelID,
				name: req.body.name,
				userId: req.decodeData.userId
			};

			const validationResult = inputPattern.validate(labelData);

			if (validationResult.error) {
				const response = { success: false, message: validationResult.error.message };
				return res.status(400).send(response);
			}

			labelService.updateLabel(labelData)
				.then(data => {
					if (!data) {
						const response = { success: false, message: 'Label not found with this id' };
						logger.error('label not found with this id');
						return res.status(404).send(response);
					}
					logger.info('Successfully updated label !');
					const response = { success: true, message: 'Successfully updated label!', data: data };
					return res.status(200).send(response);
				})
				.catch(error => {
					const response = { success: false, message: 'Some error occurred while updating label' };
					logger.error('Could not able to update label'+error);
					return res.status(500).send(response);
				});

		}
		catch (error) {
			const response = { success: false, message: 'Some error occurred' };
			logger.error('Some error occurred');
			return res.send(response);
		}
	}

	/**
	 * @description Delete label
	 * @method labelService.deleteLabel service class method for deleting label
	 */
	deleteLabel = (req, res) => {
		try {
			const labelData = {
				labelID: req.params.labelID,
				userId: req.decodeData.userId
			};

			labelService.deleteLabel(labelData)
				.then(data => {
					if (!data) {
						const response = { success: false, message: 'Label not found with this id' };
						logger.error('Label not found with this id');
						return res.status(404).send(response);
					}
					logger.info('Successfully deleted label !');
					const response = { success: true, message: 'Successfully deleted label!', data: data };
					return res.status(200).send(response);
				})
				.catch(error => {
					const response = { success: false, message: 'Some error occurred while deleting labell' };
					logger.error('Some error occurred while deleting label'+error);
					return res.status(500).send(response);
				});
		}
		catch (error) {
			const response = { success: false, message: 'Some error occurred' };
			logger.error('Some error occurred');
			return res.send(response);
		}
	}
}
module.exports = new LabelController();