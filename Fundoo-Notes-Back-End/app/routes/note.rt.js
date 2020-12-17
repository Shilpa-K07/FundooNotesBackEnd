module.exports = (app) => {
    const note = require('../controllers/note.ctr')

    /**
     * @description Create new note
     */
    app.post('/notes', note.create)

    /**
     * @description Get notes
     */
    app.get('/notes', note.findAll)

    /**
     * @description Update note
     */
    app.put('/notes/:noteID', note.update)
}