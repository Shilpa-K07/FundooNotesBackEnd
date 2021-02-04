/*************************************************************************
* Purpose : to recieve client request and hit particular API
*
* @file : user.rt.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
module.exports = (app) => {
    const user = require('../controllers/user.ctr.js')
    const util = require('../utility/util.js')
    const note = require('../controllers/note.ctr')
    const label = require('../controllers/label.ctr')

    // New registration
    app.post('/registration', user.register)

    // Login
    app.post('/login', user.login)

    // Forgot password
    app.post('/forgot-password', user.forgotPassword)

    // Reset password
    app.put('/reset-password', util.verifyToken, user.resetPassword)

    // Retrieve users by emailId 
    app.get('/users/:emailID', user.findAll)

    // Create a new note
    app.post('/notes', util.verifyUser, note.createNote)

    // Retrieve all notes
    app.get('/notes', util.verifyUser, note.findAll)

    // Retrieve notes by labelId
    app.get('/notesByLabel/:labelId', util.verifyUser, note.findNotesByLabel)

    // Update note
    app.put('/notes/:noteID', util.verifyUser, note.updateNote)

    // Delete note
    app.delete('/notes/:noteID', util.verifyUser, note.deleteNote)

    // Restore note
    app.put('/restoreNote/:noteID', util.verifyUser, note.restoreNote)

    // Hard delete note 
    app.delete('/notes-h-delete/:noteID', util.verifyUser, note.hardDeleteNote)

    // Create a new label
    app.post('/labels/', util.verifyUser, label.createLabel)

    // Retrieve all labels
    app.get('/labels', util.verifyUser, label.findLabels)

    // Retrieve label by user
    app.get('/labelsByUser', util.verifyUser, label.findLabelsByUserId)

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
    app.post('/addCollaborator', util.verifyUser, note.createCollaborator)

    // Delete collaborator
    app.put('/removeCollaborator', util.verifyUser, note.removeCollaborator)
}