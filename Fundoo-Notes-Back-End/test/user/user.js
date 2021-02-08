let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
chai.use(chaiHttp);
let inputData = require('./user-test-samples.json')

describe('Registration', () => {
	it('given proper details should do user registration', (done) => {
		let userData = {
			firstName: inputData.registration.firstName,
			lastName: inputData.registration.lastName,
			emailId: inputData.registration.emailId,
			password: inputData.registration.password
		};
		chai.request(server)
			.post('/registration')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				done();
			});
	});

	it('given already exists emailId should not do register', (done) => {
		let userData = {
			firstName: inputData['invalid-registration-sample1'].firstName,
			lastName: inputData['invalid-registration-sample1'].lastName,
			emailId: inputData['invalid-registration-sample1'].emailId,
			password: inputData['invalid-registration-sample1'].password
		};
		chai.request(server)
			.post('/registration')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(409);
				res.body.should.be.a('object');
				done();
			});
	});

	it('given improper name should not do register', (done) => {
		let userData = {
			firstName: inputData['invalid-registration-sample2'].firstName,
			lastName: inputData['invalid-registration-sample2'].lastName,
			emailId: inputData['invalid-registration-sample2'].emailId,
			password: inputData['invalid-registration-sample2'].password
		}
		chai.request(server)
			.post('/registration')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				done();
			});
	});
});

describe('Login', () => {
	it('given proper crendentials should do login', (done) => {
		let userData = {
			emailId: inputData.login.emailId,
			password: inputData.login.password
		}
		chai.request(server)
			.post('/login')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				done();
			});
	});

	it('given improper credentials should not do login', (done) => {
		let userData = {
			emailId: inputData['invalid-login-sample1'].emailId,
			password: inputData['invalid-login-sample1'].password
		};
		chai.request(server)
			.post('/login')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				done();
			});
	});
});

describe('ForgotPassword', () => {
	it('given proper emailId should send password reset link', (done) => {
		let userData = {
			emailId: inputData['forgot-password'].emailId,
		};
		chai.request(server)
			.post('/forgot-password')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				done();
			});
	});

	it('given non-exists emailId should not send password reset link', (done) => {
		let userData = {
			emailId: inputData['invalid-forgot-password'].emailId,
		};
		chai.request(server)
			.post('/forgot-password')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				done();
			});
	});
});
describe('Resetpassword', () => {
	it('given proper new password should do reset password', (done) => {
		let userData = {
			newPassword: inputData['reset-password'].newPassword,
		};
		let token = inputData['reset-password'].token;
		chai.request(server)
			.put('/reset-password')
			.send(userData)
			.set('token', token)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				done();
			});
	});
	it('given improper new password should not do reset password', (done) => {
		let userData = {
			newPassword: inputData['invalid-reset-password'].newPassword,
		};
		let token = inputData['reset-password'].token;
		chai.request(server)
			.put('/reset-password')
			.send(userData)
			.set('token', token)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				done();
			});
	});
});

describe('/POST verify email address', () => {
	it('given emailId should send verification link to user emailId', (done) => {
		let userData = {
			emailId: inputData['verify-email'].emailId
		};
		chai.request(server)
			.post('/verifyEmail')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				done();
			});
	});

	it('given emailId if not found should not send verification link', (done) => {
		let userData = {
			emailId: inputData['invalid-verify-email'].emailId
		};
		chai.request(server)
			.post('/verifyEmail')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				done();
			});
	});

	it('given emailId is empty should not send verification link', (done) => {
		let userData = {
			emailId: inputData['invalid-verify-email-1'].emailId
		};
		chai.request(server)
			.post('/verifyEmail')
			.send(userData)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				done();
			});
	});
});

describe('/PUT activate account', () => {
	it('given token if verified should activate user account', (done) => {
		let token = inputData['activate-account'].token
		chai.request(server)
			.put('/activateAccount')
			.set('token', token)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				done();
			});
	});

	it('given token if not verified should not activate user account', (done) => {
		let token = inputData['invalid-activate-account'].token
		chai.request(server)
			.put('/activateAccount')
			.set('token', token)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				done();
			});
	});
});