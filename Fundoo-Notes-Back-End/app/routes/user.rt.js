module.exports = (app) => {
    const user = require('../controllers/user.ctr.js')

    /**
     * @description new registration
     */
    app.post('/registration', user.register)

    /**
     * @description login
     */
    app.post('/login', user.login)

    /**
     * @description forgot password
     */
    app.put('/forgot-password', user.forgotPassword)
}