let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
chai.use(chaiHttp);
let inputData = require('./label-test-samples.json');

describe('/POST create label', () => {
    it('given proper data create label', (done) => {
        let labelData = {
           name: inputData['create-label'].name
        };
        let token = inputData['valid-token'].token;
        chai.request(server)
            .post('/labels')
            .send(labelData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property('_id');
                done();
        });
    });

    it('given empty name should not create label', (done) => {
        let labelData = {
           name: inputData['invalid-create-label'].name
        };
        let token = inputData['valid-token'].token;
        chai.request(server)
            .post('/labels')
            .send(labelData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/GET labels', () => {
    it('given request should get all the labels', (done) => {
        let token = inputData['valid-token'].token;
        chai.request(server)
            .get('/labels')
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given incorrect token should not get the labels', (done) => {
        let token = inputData['invalid-token'].token;
        chai.request(server)
            .get('/labels')
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/GET labels by user', () => {
    it('given request should get all the labels', (done) => {
        let token = inputData['valid-token'].token;
        chai.request(server)
            .get('/labelsByUser')
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given incorrect token should not get the labels', (done) => {
        let token = inputData['invalid-token'].token;
        chai.request(server)
            .get('/labelsByUser')
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/PUT update label', () => {
    it('given proper data should update label', (done) => {
        let labelData = {
           name: inputData['update-label'].name
        };
        let labelId = inputData['update-label'].labelId
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/labels/'+labelId)
            .send(labelData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given empty name should not update label', (done) => {
        let labelData = {
           name: inputData['invalid-update-label'].name
        };
        let labelId = inputData['invalid-update-label'].labelId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/labels/'+labelId)
            .send(labelData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/PUT add label to note', () => {
    it('given proper labelId should add label to note', (done) => {
        let noteData = {
           labelId: inputData['add-label-to-note'].labelId
        };
        let noteId = inputData['add-label-to-note'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/addLabelToNote/'+noteId)
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });
    it('given noteId if not found do not add label to note', (done) => {
        let noteData = {
           labelId: inputData['invalid-add-label-to-note'].labelId
        };
        let noteId = inputData['invalid-add-label-to-note'].noteId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/addLabelToNote/'+noteId)
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/PUT remove label from note', () => {
    it('given proper labelId should remove label from note', (done) => {
        let noteData = {
            labelId: inputData['add-label-to-note'].labelId
         };
         let noteId = inputData['add-label-to-note'].noteId;
         let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/removeLabelFromNote/'+noteId)
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });
    it('given noteId if not found do not remove label from note', (done) => {
        let noteData = {
            labelId: inputData['invalid-add-label-to-note'].labelId
         };
         let noteId = inputData['invalid-add-label-to-note'].noteId;
         let token = inputData['valid-token'].token;
        chai.request(server)
            .put('/removeLabelFromNote/'+noteId)
            .send(noteData)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
        });
    });
});

describe('/DELETE labels', () => {
    it('given id should delete label',(done) => {
        let labelId = inputData['add-label-to-note'].labelId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .delete('/labels/'+labelId)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
        });
    });

    it('given non-exists id should not delete label',(done) => {
        let labelId = inputData['add-label-to-note'].labelId;
        let token = inputData['valid-token'].token;
        chai.request(server)
            .delete('/labels/'+labelId)
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
        });
    });
});