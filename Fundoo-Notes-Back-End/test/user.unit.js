let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let user = require('../app/controllers/user.ctr');
chai.use(chaiHttp);

describe('Registrtaion', () => {
    it('given proper details should register user', async () => {
        const req = { body: { firstName: 'Siri', lastName: 'Rk', emailId:'sirih712@gmail.com', password:'Bcd@123B' } };
        const response = await user.register(req, res);
        console.log('response: '+JSON.stringify(response));
    });
});