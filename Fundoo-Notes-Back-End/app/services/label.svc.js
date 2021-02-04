/**
 * @description service class takes request from controller and sends this request to model
 */
const logger = require('../logger/logger')
const label = require('../models/label.mdl')
const util = require('../utility/util')

class LabelService {
    /**
     * @description Create a new label 
     * @method labelModel.create calls model class method
     */
    createLabel = (labelData) => {
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