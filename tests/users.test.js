const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app'); // Assuming your Express app is defined in app.js

describe('User Routes', function() {
    describe('POST /register/guest', function() {
        it('should register a new guest user', function(done) {
            const user = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password'
            };

            request(app)
                .post('/register/guest')
                .send(user)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);

                    expect(res.body).to.have.property('name', user.name);
                    expect(res.body).to.have.property('email', user.email);
                    expect(res.body).to.have.property('role', 'guest');

                    done();
                });
        });

        // Add more test cases for different scenarios, such as invalid input, duplicate registration, etc.
    });

    describe('POST /login/guest', function() {
        it('should log in a guest user with valid credentials', function(done) {
            const credentials = {
                email: 'john@example.com',
                password: 'password'
            };

            request(app)
                .post('/login/guest')
                .send(credentials)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);

                    expect(res.body).to.have.property('message', 'Guest user logged in successfully');

                    done();
                });
        });

        // Add more test cases for different scenarios, such as invalid credentials, non-existing user, etc.
    });

    // Add more describe blocks and test cases for other routes, such as /register/employee and /login/employee
});