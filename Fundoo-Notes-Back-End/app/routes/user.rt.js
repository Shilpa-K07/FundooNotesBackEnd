module.exports = (app) => {
    const user = require('../controllers/user.ctr.js')

    /**
     * @description New registration
     */
    app.post('/registration', user.register)

    /**
     * @description Login
     */
    app.post('/login', user.login)

    /**
     * @description Forgot password
     */
    app.put('/forgot-password', user.forgotPassword)

    /**
     * @description Reset password
     */
    app.put('/reset-password', user.resetPassword)
}