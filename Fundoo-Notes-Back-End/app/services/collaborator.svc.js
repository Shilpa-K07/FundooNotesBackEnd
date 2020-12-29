const collaboratorModel = require('../models/collaborator.mdl').collaboratorModel
class CollaboratorService {
    createCollaborator = (collaboratorData) => {
        return collaboratorModel.create(collaboratorData)
    }
}
module.exports = new CollaboratorService()