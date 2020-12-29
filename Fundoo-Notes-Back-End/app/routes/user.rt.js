/**
 * @description Defining routes
 * @methods post, put are the http methods
 */
module.exports = (app) => {
    const user = require('../controllers/user.ctr.js')
    const util = require('../utility/util.js')
    const note = require('../controllers/note.ctr')
    const label = require('../controllers/label.ctr')
    const collaborator = require('../controllers/collaborator.ctr')

    // New registration
    app.post('/registration', user.register)

    // Login
    app.post('/login', user.login)

    // Forgot password
    app.post('/forgot-password', user.forgotPassword)

    // Reset password
    app.put('/reset-password', util.verifyToken, user.resetPassword)

    // Create a new note
    app.post('/notes', util.verifyUser, note.createNote)

    // Retrieve all notes
    app.get('/notes', note.findAll)

    // Update note
    app.put('/notes/:noteID', util.verifyUser, note.updateNote)

    // Delete note
    app.delete('/notes/:noteID', util.verifyUser, note.deleteNote)

    // Create a new label
    app.post('/labels/', util.verifyUser, label.createLabel)

    // Retrieve all labels
    app.get('/labels', label.findLabels)

    // Update label
    app.put('/labels/:labelID', util.verifyUser, label.updateLabel)

    // Delete label
    app.delete('/labels/:labelID', util.verifyUser, label.deleteLabel)

    // Add label to note
    app.put('/addLabelToNote/:noteID', util.verifyUser, note.addLabelToNote)

    // Remove label from note
    app.put('/removeLabelFromNote/:noteID', util.verifyUser, note.removeLabelFromNote)

    // Send email verification link
    app.post('/verifyEmail', user.emailVerification)

    // activate account
    app.put('/activateAccount', util.verifyToken, user.activateAccount)

    // Create new collaborator
    app.post('/collaborator', util.verifyUser, collaborator.createCollaborator)

    // If no routes matches execute this 
    app.use((req, res, next) => {
        res.status(404).send({
            error: 'Not found'
        })
    })
}