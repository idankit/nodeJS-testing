const {isAuthorized} = require('../src/middlewares/isAuthorized')
const {getBearerToken} = require('../src/app/auth')
const faker = require('faker')
const sinon = require("sinon")

let req
let resSpy = {}
let authToken
let nextSpy

describe('Verifying the isAuthorized middleware', () => {

	describe('Test isAuthorized Function', () => {

		describe('Checking valid inputs', () => {
			beforeEach(async () => {
				req = {method: 'GET', query: {}, headers: {}}
				resSpy.send = sinon.spy()
				resSpy.status = sinon.spy()
				nextSpy = sinon.spy()
				req['query']['userName'] = faker.name.findName()
				req['query']['password'] = faker.internet.password()
				await getBearerToken(req, resSpy)
				authToken = resSpy.send.args[0][0]
				req['headers']['authorization'] = authToken
			})
			it('Should pass user is authorized', async () => {
				await isAuthorized(req, resSpy, nextSpy)
				expect(nextSpy.firstCall.callId).toBe(1)
			})
		})

		describe('Checking with invalid inputs', () => {
			beforeEach(() => {
				req = {method: 'GET', query: {}, headers: {}}
				resSpy.send = sinon.spy()
				resSpy.status = sinon.spy()
				nextSpy = sinon.spy()
			})
			it('Should Fail no authorization in Header', async () => {
				await isAuthorized(req, resSpy, nextSpy)
				expect(resSpy.status['args'][0][0]).toBe(401)
				expect(resSpy.send['args'][0][0]).toBe('Unauthorized user')
				expect(resSpy.send['args'][1][0].message).toBe('jwt must be provided')
			})
			it('Should fail invalid JWT signature', async () => {
				req.headers['authorization'] = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJqb2huLmRvZSJ9.CuScq77_iCP4XsYGCMgGnQiATOmQwu_rR1LEB2Pcd_I'
				await isAuthorized(req, resSpy)
				expect(resSpy.send.args[0][0].name).toBe('JsonWebTokenError')
				expect(resSpy.send.args[0][0].message).toBe('invalid signature')
			})
		})
	})
})
