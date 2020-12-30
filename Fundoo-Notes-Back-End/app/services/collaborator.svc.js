/**
 * @description CollaboratorService class contains methods which will call model class method for querying DB
 * @method createCollaborator creates collaborator
 */
const collaboratorModel = require('../models/collaborator.mdl').collaboratorModel
class CollaboratorService {
    /**
     * @description create new collaborator
     * @method create calls model class method
     */
    createCollaborator = (collaboratorData) => {
        return collaboratorModel.create(collaboratorData)
    }

    /**
     * @description delete  collaborator
     * @method delete calls model class method
     */
    deleteCollaborator = (collaboratorData) => {
        return collaboratorModel.delete(collaboratorData)
    }
}
module.exports = new CollaboratorService()