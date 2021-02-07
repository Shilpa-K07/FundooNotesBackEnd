let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);
let inputData = require('./note-test-sample.json')

describe('/POST notes', () => {
    it.skip('given proper data should create note', (done) => {
        let noteData = {
            title: inputData['create-note'].title,
            description: inputData['create-note'].description
        };
        let token = inputData['valid-token'].token;
        chai.request(server)
            .post('/notes')
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property('_id');
                done();
        });
    });

    it('given empty title should not create note', (done) => {
        let noteData = {
            title: inputData['invalid-create-note-sample-1'].title,
            description: inputData['invalid-create-note-sample-1'].description
        };
        let token = inputData['valid-token'].token;
        chai.request(server)
            .post('/notes')
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given empty description should not create note', (done) => {
        let noteData = {
            title: inputData['invalid-create-note-sample-2'].title,
            description: inputData['invalid-create-note-sample-2'].description
        };
        let token = inputData['valid-token'].token;
        chai.request(server)
            .post('/notes')
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/GET notes', () => {
    it('given request should get all the notes', () => {
        let token = inputData['valid-token'].token;
        chai.request(server)
            .get('/notes')
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
        });
    });

    it('given request with invalid token should not get notes', (done) => {
        let token = inputData['invalid-token'].token;
        chai.request(server)
            .get('/notes')
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe.only('/GET notes by label', () => {
    it('given request should get all the notes', () => {
        let labelId = inputData['get-notes-by-label'].labelId;
        let token = inputData['valid-token'].token
        chai.request(server)
            .get('/notesByLabel/'+labelId)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
        });
    });

    it('given request with invalid token should not get notes', (done) => {
        let labelId = inputData['get-notes-by-label'].labelId;
        let token = inputData['invalid-token'].token;
        chai.request(server)
            .get('/notesByLabel/'+labelId)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/PUT notes', () => {
    it('given proper data should update note', (done) => {
        let noteData = {
            title: inputData['update-note'].title,
            description: inputData['update-note'].description
        };
        let noteId = inputData['update-note'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/notes/'+noteId)
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given empty title should not update note', (done) => {
        let noteData = {
            title: inputData['invalid-update-note-sample-1'].title,
            description: inputData['invalid-update-note-sample-1'].description
        };
        let noteId = inputData['invalid-update-note-sample-1'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/notes/'+noteId)
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given empty description should not update note', (done) => {
        let noteData = {
            title: inputData['invalid-update-note-sample-2'].title,
            description: inputData['invalid-update-note-sample-2'].description
        };
        let noteId = inputData['invalid-update-note-sample-2'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/notes/'+noteId)
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/DELETE notes', () => {
    it('given id should delete note',(done) => {
        let noteId = inputData['delete-note'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .delete('/notes/'+noteId)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given non-exists id should not delete note',(done) => {
        let noteId = inputData['delete-note'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .delete('/notes/'+noteId)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/DELETE hard delete note', () => {
    it('given id should delete note',(done) => {
        let noteId = inputData['delete-note'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .delete('/notes-h-delete/'+noteId)
            .set('token', token)
            .end((err, res) => {console.log('res: '+JSON.stringify(res));
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given non-exists should not delete note',(done) => {
        let noteId = inputData['delete-note'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .delete('/notes-h-delete/'+noteId)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/PUT restore note', () => {
    it('given id should restore note',(done) => {
        let noteId = inputData['restore-note'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/restoreNote/'+noteId)
            .set('token', token)
            .end((err, res) => {console.log('res: '+JSON.stringify(res));
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given non-exists id should not restore note',(done) => {
        let noteId = inputData['restore-note'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/restoreNote/'+noteId)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
        });
    });
});
