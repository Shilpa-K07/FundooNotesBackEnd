let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let routes = require('../app/routes/user.rt')
let should = chai.should();
chai.use(chaiHttp);

    describe('Registration', () => {
       /*  it('it should add new user', (done) => {
            let userData = {
                firstName: "Shilpa",
                lastName: "Kundapur",
                emailId: "Shilpak0007@gmail.com",
                password: "Abcd@123A"
            }
            chai.request(server)
                .post('/registration')
                .send(userData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done()
                })
        }) */

        it('it should not register if user already exists', (done) => {
            let userData = {
                firstName: "Shilpa",
                lastName: "K",
                emailId: "Shilpak09@gmail.com",
                password: "Abcd@11DR"
            }
            chai.request(server)
                .post('/registration')
                .send(userData)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    done()
                })
        })

        it('it should not register user if name is not proper', (done) => {
            let userData = {
                firstName: "S",
                lastName: "K",
                emailId: "Shilpak09@gmail.com",
                password: "Abcd@11DR"
            }
            chai.request(server)
                .post('/registration')
                .send(userData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    done()
                })
        })
    })

    describe('Login', () => {
        it('it should do user login when proper credentials are passed', (done) => {
            let userData = {
                emailId: "shilpa07udupi@gmail.com",
                password: "abcd@123A"
            }
            chai.request(server)
                .post('/login')
                .send(userData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done()
                })
        })

        it('it should not do user login when improper credentials are passed', (done) => {
            let userData = {
                emailId: "shilpa017udupi@gmail.com",
                password: "Abfcd@12345"
            }
            chai.request(server)
                .post('/login')
                .send(userData)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    done()
                })
        })
    })

    describe('ForgotPassword', () => {
        it('it should send reset password link to user', () => {
            let userData = {
                emailId: "shilpa07udupi@gmail.com",
            }
            chai.request(server)
                .post('/forgot-password')
                .send(userData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                })
        })

        it('it should not send reset password link to if the user is not found', (done) => {
            let userData = {
                emailId: "shilpa012udupi@gmail.com",
            }
            chai.request(server)
                .post('/forgot-password')
                .send(userData)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    done()
                })
        })
    })
    describe('Resetpassword', () => {
        /* it('it should reset user password to new value', (done) => {
            let userData = {
                newPassword: "aabb@123AA",
            }
            chai.request(server)
                .post('/reset-password')
                .send(userData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done()
                })
        }) */
        it('it should reset user password to new value', (done) => {
                    let userData = {
                        newPassword: "aabb@123AA",
                    }
                    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI0NTk0NDYsImV4cCI6MTYxMjQ2MDY0Nn0.Jfaws6NTjNbzM4-bZwZf0Re2yuHnl65LlEU2yyucaHU"
                    chai.request(server)
                        .put('/reset-password')
                        .send(userData)
                        .set('token',token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            done()
                        })
                })
                it('it should not reset user password to new value if the value is improper', (done) => {
                    let userData = {
                        newPassword: "aab123AA",
                    }
                    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI0NTk0NDYsImV4cCI6MTYxMjQ2MDY0Nn0.Jfaws6NTjNbzM4-bZwZf0Re2yuHnl65LlEU2yyucaHU"
                    chai.request(server)
                        .put('/reset-password')
                        .send(userData)
                        .set('token',token)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            done()
                        })
                })
    })