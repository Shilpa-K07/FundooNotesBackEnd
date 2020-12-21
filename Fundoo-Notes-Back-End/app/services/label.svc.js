/**
 * @description service class takes request from controller and sends this request to model
 */
const label = require('../models/label.mdl')

class LabelService {
    // Create new label
    createLabel = (labelData) => {
     return label.labelModel.create(labelData)
    }

    validateUser = (labelData) => {
        return label.labelModel.findByEmailId(labelData)
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