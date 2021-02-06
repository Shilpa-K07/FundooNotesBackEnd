let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

describe('Registration', () => {
	it('given proper details should do user registration', (done) => {
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
	})

	it('given already exists emailId should not do register', (done) => {
		let userData = {
			firstName: 'Shilpa',
			lastName: 'K',
			emailId: 'Shilpak09@gmail.com',
			password: 'Abcd@11DR'
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

	it('given improper name should not do register', (done) => {
		let userData = {
			firstName: 'S',
			lastName: 'K',
			emailId: 'Shilpak09@gmail.com',
			password: 'Abcd@11DR'
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
	it('given proper crendentials should do login', (done) => {
		let userData = {
			emailId: 'shilpa07udupi@gmail.com',
			password: 'abcd@123A'
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

	it('given improper credentials should not do login', (done) => {
		let userData = {
			emailId: 'shilpa017udupi@gmail.com',
			password: 'Abfcd@12345'
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
	it('given proper emailId should send password reset link', (done) => {
		let userData = {
			emailId: 'shilpa07udupi@gmail.com',
		}
		chai.request(server)
			.post('/forgot-password')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				done()
			})
	})

	it('given non-exists emailId should not send password reset link', (done) => {
		let userData = {
			emailId: 'shilpa012udupi@gmail.com',
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
	it('given proper new password should do reset password', (done) => {
		let userData = {
			newPassword: 'aabb@123AA',
		}
		let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI0NTk0NDYsImV4cCI6MTYxMjQ2MDY0Nn0.Jfaws6NTjNbzM4-bZwZf0Re2yuHnl65LlEU2yyucaHU'
		chai.request(server)
			.put('/reset-password')
			.send(userData)
			.set('token', token)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				done()
			})
	})
	it('given improper new password should not do reset password', (done) => {
		let userData = {
			newPassword: 'aab123AA',
		}
		let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI0NTk0NDYsImV4cCI6MTYxMjQ2MDY0Nn0.Jfaws6NTjNbzM4-bZwZf0Re2yuHnl65LlEU2yyucaHU'
		chai.request(server)
			.put('/reset-password')
			.send(userData)
			.set('token', token)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				done()
			})
	})
})

describe.only('/POST verify email address', () => {
	it('given emailId should send verification link to user emailId', () => {
		let userData = {
			emailId: "shilpa07udupi@gmail.com"
		}
		chai.request(server)
			.post('/verifyEmail')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(200)
				res.body.should.be.a('object')
				done()
			})
	})

	it('given emailId if not found should not send verification link', (done) => {
		let userData = {
			emailId: "shilpa9087udupi@gmail.com"
		}
		chai.request(server)
			.post('/verifyEmail')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(401)
				res.body.should.be.a('object')
				done()
			})
	})

	it('given emailId is empty should not send verification link', (done) => {
		let userData = {
			emailId: ""
		}
		chai.request(server)
			.post('/verifyEmail')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(400)
				res.body.should.be.a('object')
				done()
			})
	})
})

describe('/PUT activate account', () => {
	it('given token if verified should activate user account', (done) => {
		let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI1NDIwNDksImV4cCI6MTYxMjU0MzI0OX0.NGgHNdyag3vZjYosJ42kVPndaevHoW6QEXoMSqYcMUo"
		chai.request(server)
			.put('/activateAccount')
			.set('token', token)
			.end((err, res) => {console.log("res: "+JSON.stringify(res))
				res.should.have.status(200);
				res.body.should.be.a('object');
				done()
			})
	})

	it('given token if not verified should not activate user account', (done) => {
		let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbElkIjoic2hpbHBhMDd1ZHVwaUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZmUzMjNhYTA5ZmI0MjM2MWM3NDhjMmIiLCJpYXQiOjE2MTI1NDIwNDksImV4cCI6MTYxMjU0MzI0OX0.NGgHNdyag3vZjYosJ42kVPndaevHoW6QEXoMSqYcMUo"
		chai.request(server)
			.put('/activateAccount')
			.set('token', token)
			.end((err, res) => {
				res.should.have.status(401)
				res.body.should.be.a('object')
				done()
			})
	})
})