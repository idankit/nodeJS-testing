const {isAuthorized} = require('../src/middlewares/isAuthorized');
const {getBearerToken} = require('../src/app/auth');
const faker = require('faker')
const sinon = require('sinon')

let req, res, next

describe('Testing isAuthorized:', () => {

    describe('Testing isAuthorized Method:', () => {

        describe('Testing valid inputs', () => {
            it('Should Pass Authorization', async () => {
                req = {
                    method: 'GET',
                    headers: {},
                    query: {
                        userName: faker.name.findName(),
                        password: faker.internet.password(),
                    }
                }
                res =  {
                    status: sinon.spy(),
                    send: sinon.spy()
                }
                next = sinon.spy()

                await getBearerToken(req, res)
                console.log(res.send)
                req['headers']['authorization'] = res.send.args[0][0]
                await isAuthorized(req, res, next)
                expect(next.firstCall.callId).toBe(1)
            })
        })

        describe('Testing invalid inputs', () => {
            beforeEach(() => {
                req = {
                    method: 'GET',
                    headers: {},
                    query: {}
                }
                next = sinon.spy()
                res =  {
                    status: sinon.spy(),
                    send: sinon.spy()
                }
            })
            it('Should fail because authorization string is invalid', async () => {
                req.headers['authorization'] = "This+IS*F**Invali4"
                await isAuthorized(req, res, next)
                let sendArgs = res.send.args[0][0]
                let statusArgs = res.status.args[0][0]
                expect(statusArgs).toBe(401)
                expect(sendArgs.name).toBe('JsonWebTokenError')
                expect(sendArgs.message).toBe('jwt malformed')
            })
            it('Should fail because header is empty', async () => {
                await isAuthorized(req, res, next)
                let sendArgs = res.send.args
                let statusArgs = res.status.args[0][0]
                expect(statusArgs).toBe(401)
                expect(sendArgs[0][0]).toBe('Unauthorized user')
                expect(sendArgs[1][0].message).toBe('jwt must be provided')
            })
        })
    })
})
