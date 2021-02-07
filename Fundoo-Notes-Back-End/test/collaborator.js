let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI1NDAyNTUsImV4cCI6MTYxMjU0MTQ1NX0.bIehbkzY14kyiv69C8Pxiew8C-wWNpeV649Rk13X6Ec';

describe('/PUT create collaborator for note', () => {
    it('given proper data should create collaborator', (done) => {
        let noteData = {
            noteId: '600d0d9645b58e2c78fe66b1',
            userId: '5fe32aeb2c6d752298503627'
        };
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
            noteId: '600c49c5580eb62c385aa213',
            userId: '5fe32aeb2c6d752298503627'
        };
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
            noteId: '600d0d9645b58e2c78fe66b1',
            userId: '5fe32aeb2c6d752298503627'
        };
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
            noteId: '600c49c5580eb62c385aa213',
            userId: '5fe32aeb2c6d752298503627'
        };
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
