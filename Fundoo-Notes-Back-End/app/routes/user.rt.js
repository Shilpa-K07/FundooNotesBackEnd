/**
 * @description Defining routes
 * @methods post, put are the http methods
 */
module.exports = (app) => {
    const user = require('../controllers/user.ctr.js')
    const util = require('../utility/user.utl.js')
    const note = require('../controllers/note.ctr')

    // New registration
    app.post('/registration', user.register)

    // Login
    app.post('/login', user.login)

    // Forgot password
    app.post('/forgot-password', user.forgotPassword)

    // Reset password
    app.put('/reset-password', util.verifyToken, user.resetPassword)

     // Create a new note
    app.post('/notes', note.create)

    // Retrieve all notes
    app.get('/notes', note.findAll)

   // Update note
    app.put('/notes/:noteID', note.update)
}