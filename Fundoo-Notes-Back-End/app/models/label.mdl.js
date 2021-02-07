/*************************************************************************
* Purpose : to recieve request from service layer and then query DB
*
* @file : label.mdl.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const mongoose = require('mongoose');
const User = require('./user.mdl').User;
const config = require('../../config').get();
const { logger } = config;

const LabelSchema = mongoose.Schema({
	name: {
		type: String
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timeStamps: true
});

const Label = mongoose.model('Label', LabelSchema);

class LabelModel {
	/**
	 * @description Create a new label
	 * @method User.findOne finds user with specific Id
	 * @method save will save object into DB
	 */
	create = (labelData) => {
		return User.findOne({ _id: labelData.userId })
			.then(user => {
				if (user) {
					logger.info('user found');
					const label = new Label({
						name: labelData.name,
						userId: labelData.userId
					});
					return label.save({});
				}
			});
	}

	// Retrieve all labels
	findAll = () => {
		return Label.find();
	}

	// Retrieve all labels by user
	findLabelByUser = (labelData) => {
		return Label.find({ userId: labelData.userId });
	}

	/**
	 * @description Update label
	 * @method User.findOne finds User with specific Id
	 * @method Label.find finds label with specific label Id and user Id
	 * @method Label.findByIdAndUpdate updates label 
	 */
	update = (labelData) => {
		return User.findOne({ _id: labelData.userId })
			.then(user => {
				if (user) {
					logger.info('user found');
					return Label.find({ _id: labelData.labelID, userId: labelData.userId })
						.then(label => {
							if (label.length == 1) {
								logger.info('label found removing label');
								return Label.findByIdAndUpdate(labelData.labelID, {
									name: labelData.name
								}, { new: true });
							}
						});
				}
			});
	}

	/**
	 * @description Delete label
	 * @method User.findOne finds user with specific Id
	 * @method Label.find finds label with specific label Id and user Id
	 * @method Label.findByIdAndUpdate sets isDeleted flag to true
	 */
	delete = (labelData) => {
		return User.findOne({ _id: labelData.userId })
			.then(user => {
				if (user) {
					logger.info('user found');
					return Label.find({ _id: labelData.labelID, userId: labelData.userId })
						.then(label => {
							if (label.length == 1 && !(label[0].isDeleted))
								return Label.findByIdAndUpdate(labelData.labelID, { isDeleted: true }, { new: true });
						});
				}
			});
	}

	/**
	 * @description find user by id
	 * @method User.findOne searches in User collection for specific Id
	 */
	findById = (decodeData) => {
		return User.findOne({ _id: decodeData.userId });
	}
}
module.exports = {
	labelModel: new LabelModel(),
	Label: Label
};