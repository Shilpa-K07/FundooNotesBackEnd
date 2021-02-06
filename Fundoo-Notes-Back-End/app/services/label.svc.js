/*************************************************************************
* Purpose : to recieve request from controller and send it to model layer 
    and perform some intermediate business logic
*
* @file : label.svc.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const label = require('../models/label.mdl')
const util = require('../utility/util')
const config = require('../../config').get()
const { logger } = config

class LabelService {
    /**
     * @description Create a new label 
     * @method labelModel.create calls model class method
     */
    createLabel=(labelData) => {
    	return label.labelModel.create(labelData)
    }

    /**
     * @description validate user
     * @method util.verifyUser decodes token
     * @method labelModel.findById calls model class method
     */
    validateUser = (token) => {
    	const decodeData = util.verifyUser(token)
    	if(!decodeData){
    		logger.error('Could not able to decode token')
    		return
    	}
    	return label.labelModel.findById(decodeData)
    }

    /**
     * @description Retrieve all labels
     * @method labelModel.findAll calls model class method
     */
    findLabels = () => {
    	return label.labelModel.findAll()
    }

    /**
     * @description Retrieve all labels based on UserId
     * @method labelModel.findAll calls model class method
     */
    findLabelsByUserId = (labelData) => {
    	return label.labelModel.findLabelByUser(labelData)
    }

    /**
     * @description Update label
     * @method labelModel.update calls model class method
     */
    updateLabel = (labelData) => {
    	return label.labelModel.update(labelData)
    }

    /**
     * @description Delete label
     * @method labelModel.delete calls model class method
     */
    deleteLabel = (labelData) => {
    	return label.labelModel.delete(labelData)
    }
}
module.exports = new LabelService()