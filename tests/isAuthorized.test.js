const { isAuthorized } = require('../src/middlewares/isAuthorized');
const sinon = require('sinon');
const request = require('request');
const authFixtures = require('./fixtures/auth.json');

const base = 'http://localhost:3000';

describe('authTest', () => {
    beforeEach(() => {
        this.get = sinon.stub(request, 'get');
    });
    afterEach(() => {
        request.restore();
    });

    describe('GET /auth', () => {
        it('should respond with success', (done) => {
            const obj = authFixtures.success;
            this.get.yields(null, obj.res, JSON.stringify(obj.body));
            request.get(`${base}/auth`, (err, res, body) => {
                res.statusCode.should.equal(200);
                res.headers['content-type'].should.contain('application/json');
                body = JSON.parse(body);
                body.status.should.eql('success');
                done();
            });
        });
        it('should respond with an error of missing auth in header', (done) => {
            const obj = authFixtures.failure;
            this.get.yields(null, obj.res, JSON.stringify(obj.body));
            request.get(`${base}/api/v1/movies/999`, (err, res, body) => {
                res.statusCode.should.equal(404);
                res.headers['content-type'].should.contain('application/json');
                body = JSON.parse(body);
                body.status.should.eql('error');
                body.message.should.eql('That movie does not exist.');
                done();
            });
        });
    });
})