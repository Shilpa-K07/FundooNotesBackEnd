let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI1MzU4NDcsImV4cCI6MTYxMjUzNzA0N30.kHMvdhvmDY3Bz8gP30REZ6pBCcYoPey8gDxIOgxXkXg';

describe('/POST notes', () => {
    it.skip('given proper data should create note', (done) => {
        let noteData = {
            title: '1st note..',
            description: 'My first note..'
        };
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
            title: '',
            description: 'My first note..'
        };
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
            title: '1st note',
            description: ''
        };
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
        chai.request(server)
            .get('/notes')
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
        });
    });

    it('given request with invalid token should not get notes', (done) => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI1MjM4NTAsImV4cCI6MTYxMjUyNTA1MH0.as4GvCZqjhk9ofdkKB8cQuwtJnHvI8dH8RlnmF5F7r0';
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
        let labelId = '600ff20ca9ab2734d80a38b3';
        chai.request(server)
            .get('/notesByLabel/'+labelId)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
        });
    });

    it('given request with invalid token should not get notes', (done) => {
        let labelId = '600ff20ca9ab2734d80a38b3';
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI1MjM4NTAsImV4cCI6MTYxMjUyNTA1MH0.as4GvCZqjhk9ofdkKB8cQuwtJnHvI8dH8RlnmF5F7r0';
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
            title: '!st note..',
            description: 'My first note..'
        };
        let noteId = '601d27b832e61107643cc693';
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
            title: '',
            description: 'My first note..'
        };
        let noteId = '601d27b832e61107643cc693';
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
            title: '1st note',
            description: ''
        };
        let noteId = '601d27b832e61107643cc693';
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
        let noteId = '600d0d9645b58e2c78fe66b1';
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
        let noteId = '600d0d9645b58e2c78fe66b1';
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
        let noteId = '600c49c5580eb62c385aa213';
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
        let noteId = '600c49c5580eb62c385aa213';
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
        let noteId = '600d0dbe45b58e2c78fe66b3';
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
        let noteId = '600d0dbe45b58e2c78fe66b3';
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
