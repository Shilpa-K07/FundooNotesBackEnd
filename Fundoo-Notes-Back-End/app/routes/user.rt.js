/**
 * @description Defining routes
 * @methods post, put are the http methods
 */
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

    // Create a new note
    app.post('/notes', note.createNote)

    // Retrieve all notes
    app.get('/notes', note.findAll)

    // Update note
    app.put('/notes/:noteID', note.updateNote)

    // Delete note
    app.delete('/notes/:noteID', note.deleteNote)

    // Create a new label
    app.post('/labels/', label.createLabel)

    // Retrieve all labels
    app.get('/labels',  label.findLabels)

    // Update label
    app.put('/labels/:labelID', label.updateLabel)

    // Delete label
    app.delete('/labels/:labelID', label.deleteLabel)
}