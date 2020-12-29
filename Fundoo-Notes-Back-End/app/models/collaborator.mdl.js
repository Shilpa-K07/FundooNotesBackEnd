/**
 * @description Model class interacts with dataBase to perform tasks
 * @param CollaboratorSchema is the schema for the label created by the users
 */
const mongoose = require('mongoose')
const User = require('../models/user.mdl').User

const CollaboratorSchema = mongoose.Schema({
    noteId: {
        type: String,
        unique: true
    },
    userId: [{
        type: String
    }]
}, {
    timeStamps: true
})

const Collaborator = mongoose.model('Collaborator', CollaboratorSchema)

class CollaboratorModel {

    /**
     * @description Create new collaborator
     */
    create = (collaboratorData) => {
        const collaborator = new Collaborator({
            noteId: collaboratorData.noteId,
            userId: collaboratorData.userId
        })
        return collaborator.save({})
    }
}
module.exports = {
    collaboratorModel: new CollaboratorModel(),
    collaboratorSchema: Collaborator
}