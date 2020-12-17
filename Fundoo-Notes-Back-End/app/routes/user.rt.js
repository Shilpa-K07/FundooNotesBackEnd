/**
 * @description Defining routes
 * @methods post, put are the http methods
 */
module.exports = (app) => {
    const user = require('../controllers/user.ctr.js')
    const util = require('../utility/user.utl.js')

    // New registration
    app.post('/registration', user.register)

    // Login
    app.post('/login', user.login)

    // Forgot password
    app.post('/forgot-password', user.forgotPassword)

    // Reset password
    app.put('/reset-password', (req, res) => {
        util.verifyToken(req.headers.token, (error, decodeData) => {
            if (error) {
                const response = { success: false, message: "Incorrect token or token is expired" };
                return res.status(401).send(response)
            }
            user.resetPassword(req, res, decodeData)
        })
    })
}