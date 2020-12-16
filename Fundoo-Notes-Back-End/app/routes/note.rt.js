module.exports = (app) => {
    const note = require('../controllers/note.ctr')

    /**
     * @description Create new note
     */
    app.post('/note', note.create)

    /**
     * @description Get notes
     */
    app.get('/notes', note.findAll)
}