let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
chai.use(chaiHttp);
let inputData = require('./collaborator-test-samples.json');

describe('/PUT create collaborator for note', () => {
    it('given proper data should create collaborator', (done) => {
        let noteData = {
            noteId: inputData['create-collaborator'].noteId,
            userId: inputData['create-collaborator'].userId
        };
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/addCollaborator/')
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });
    it('given noteId if collaborator exists do not create collaborator for note', (done) => {
        let noteData = {
            noteId: inputData['invalid-create-collaborator'].noteId,
            userId: inputData['invalid-create-collaborator'].userId
        };
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/addCollaborator/')
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(409);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/PUT remove collaborator from note', () => {
    it('given proper data should remove collaboratorId from note', (done) => {
        let noteData = {
            noteId: inputData['create-collaborator'].noteId,
            userId: inputData['create-collaborator'].userId
        };
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/removeCollaborator/')
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });
    it('given improper data should not remove collaboratorId from note', (done) => {
        let noteData = {
            noteId: inputData['create-collaborator'].noteId,
            userId: inputData['create-collaborator'].userId
        };
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/removeCollaborator/')
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
        });
    });
});
