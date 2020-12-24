/**
 * @description Controller class takes request from the routes and sends response back
 * @method createLabel creates a new label for the particular user
 */
const Joi = require('joi');
const logger = require('../logger/logger')
const labelService = require('../services/label.svc')

const inputPattern = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'name can not be empty'
    })
}).unknown(true)

class LabelController {
    createLabel = (req, res) => {
        try {
            const labelData = {
                name: req.body.name,
                userId: req.decodeData.userId
            }

            /* const token = req.session.fundoNotes.token

             labelService.validateUser(token)
                .then(user => {
                    if (!user) {
                        const response = { success: false, message: "Authorization failed" };
                        return res.status(401).send(response);
                    }

                    const validationResult = inputPattern.validate(labelData)
                    if (validationResult.error) {
                        const response = { success: false, message: validationResult.error.message };
                        return res.status(400).send(response);
                    }
                    labelData.userId = user._id
                })
                .catch(error => {
                    const response = { success: false, message: "some error occurred.." };
                    logger.error("Some error occurred")
                    return res.status(500).send(response)
                })

            await labelService.validateUser(token) */

            labelService.createLabel(labelData)
                .then(data => {
                    logger.info("Successfully added label !")
                    const response = { success: true, message: "Successfully added label !", data: data }
                    return res.status(200).send(response)
                })
                .catch(error => {
                    logger.info("Some error occurred while adding label")
                    const response = { success: false, message: "Some error occurred while adding label" }
                    return res.status(200).send(response)
                })
        }
        catch (error) {console.log(error)
            const response = { success: false, message: "Some error occurred" }
            return res.status(500).send(response)
        }
    }

    // Retrieve labels
    findLabels = (req, res) => {
        try {
            labelService.findLabels()
                .then(data => {
                    if (!data) {
                        const response = { success: false, message: "No labels found" }
                        return res.status(404).send(response)
                    }
                    logger.info("Successfully retrieved labels !")
                    const response = { success: true, message: "Successfully retrieved labels!", data: data }
                    return res.status(200).send(response)
                })
                .catch(error => {
                    logger.info("Some error occurred while retrieving labels")
                    const response = { success: false, message: "Some error occurred while retrieving labels" }
                    return res.status(500).send(response)
                })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred" }
            return res.status(500).send(response)
        }
    }

    // Update label
    updateLabel = (req, res) => {
        try {
            const labelData = {
                labelID: req.params.labelID,
                name: req.body.name,
                userId: req.decodeData.userId
            }

         /*    const token = req.session.fundoNotes.token
           
            labelService.validateUser(token)
                .then(user => { 
                    if (!user) {
                        const response = { success: false, message: "Authorization failed" };
                        return res.status(401).send(response);
                    }
                    const validationResult = inputPattern.validate(labelData)
                    if (validationResult.error) {
                        const response = { success: false, message: validationResult.error.message };
                        return res.status(400).send(response);
                    }

                    labelData.userId = user._id
                })
                .catch(error => {
                    const response = { success: false, message: "Some error occurred" };
                    logger.error("Some error occurred")
                    return res.status(401).send(response)
                })
            await labelService.validateUser(token) */

            labelService.updateLabel(labelData)
                .then(data => {
                    if (!data) {
                        const response = { success: false, message: "Label not found with this id" };
                        logger.error("label not found with this id")
                        return res.status(404).send(response)
                    }
                    logger.info("Successfully updated label !")
                    const response = { success: true, message: "Successfully updated label!", data: data }
                    return res.status(200).send(response)
                })
                .catch(error => {
                    const response = { success: false, message: "Some error occurred while updating label" };
                    logger.error("Could not able to update label")
                    return res.status(500).send(response)
                })

        }
        catch (error) {
            const response = { success: false, message: "Some error occurred" }
            return res.send(response)
        }
    }

    // Delete label
    deleteLabel = (req, res) => {
        try {
            const labelData = {
                labelID: req.params.labelID,
                userId: req.decodeData.userId
            }

            /* const token = req.session.fundoNotes.token

            labelService.validateUser(token)
                .then(user => {
                    if (!user) {
                        const response = { success: false, message: "Authorization failed" };
                        return res.status(401).send(response);
                    }
                    labelData.userId = user._id
                })
                .catch(error => {
                    const response = { success: false, message: "Some error occurred" };
                    logger.error("Some error occurred")
                    return res.status(401).send(response)
                })
            await labelService.validateUser(token) */

            labelService.deleteLabel(labelData)
            .then(data => {
                if (!data) {
                    const response = { success: false, message: "Label not found with this id" };
                    logger.error("Label not found with this id")
                    return res.status(404).send(response)
                }
                logger.info("Successfully deleted label !")
                const response = { success: true, message: "Successfully deleted label!", data: data }
                return res.status(200).send(response)
            })
            .catch(error => {
                const response = { success: false, message: "Some error occurred while deleting labell" };
                logger.error("Some error occurred while deleting label")
                return res.status(500).send(response)
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred" }
            logger.error("Some error occurred")
            return res.send(response)
        }
    }
}
module.exports = new LabelController()