/**
 * @description service class takes request from controller and sends this request to model
 */
const label = require('../models/label.mdl')
const util = require('../utility/util')

class LabelService {
    // Create new label
    createLabel = (labelData) => {
        return label.labelModel.create(labelData)
    }

    validateUser = (token) => {
        const decodeData = util.verifyUser(token)
        if(!decodeData)
            return
        return label.labelModel.findById(decodeData)
    }

    // Retrieve labels
    findLabels = () => {
        return label.labelModel.findAll()
    }

    // Update label
    updateLabel = (labelData) => {
        return label.labelModel.update(labelData)
    }

    //deleteLabel
    deleteLabel = (labelData) => {
        return label.labelModel.delete(labelData)
    }
}
module.exports = new LabelService()