module.exports = (app) => {
    const user = require('../controllers/user.ctr.js')
    const util = require('../utility/user.utl')

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
    app.put('/reset-password', (req, res) => {
        util.verifyToken(req.headers.resetlink, (error, decodeData) => {
            if (error) {
                const response = { success: false, message: "Incorrect token or token is expired" };
                return res.status(401).send(response)
            }
            user.resetPassword(req,res,decodeData)
        })
    })
}