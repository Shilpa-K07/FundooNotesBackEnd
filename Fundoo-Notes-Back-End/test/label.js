let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI1Mzg3OTEsImV4cCI6MTYxMjUzOTk5MX0.qLkg7TS0L9_LSRLP0CyRKrZFaEgYYYwq1CLfd_Gat48';

describe('/POST create label', () => {
    it('given proper data create label', (done) => {
        let labelData = {
           name: 'label1'
        };
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
           name: ''
        };
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
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI1MzE4NDcsImV4cCI6MTYxMjUzMzA0N30.FDDmECm1hE8H1ya-NokUC_y94mikByDZNmgIJBBnNWA';
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
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI1MzE4NDcsImV4cCI6MTYxMjUzMzA0N30.FDDmECm1hE8H1ya-NokUC_y94mikByDZNmgIJBBnNWA';
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
           name: 'label2'
        };
        let labelId = '5fe4ac0fe8129b38c8b6b8b8';
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
           name: ''
        };
        let labelId = '5fe4ac0fe8129b38c8b6b8b8';
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
           labelId: '5fe4ad7f5167332d38056d47'
        };
        let noteId = '600d0d9645b58e2c78fe66b1';
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
           labelId: '5fe4ad7f5167332d38056d47'
        };
        let noteId = '600c49c5580eb62c385aa213';
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
           labelId: '5fe4ad7f5167332d38056d47'
        };
        let noteId = '600d0d9645b58e2c78fe66b1';
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
           labelId: '5fe4ad7f5167332d38056d47'
        };
        let noteId = '600c49c5580eb62c385aa213';
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
        let labelId = '5fe4ac0fe8129b38c8b6b8b8';
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
        let labelId = '5fe4ac0fe8129b38c8b6b8b8';
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