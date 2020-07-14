const {isAuthorized} = require('../src/middlewares/isAuthorized')
const {getBearerToken} = require('../src/app/auth')
const faker = require('faker')
const sinon = require("sinon")

let req
let resSpy = {}
let authToken
let nextSpy

describe('Testing the isAuthorized middleware', () => {
	beforeAll(() => {
		console.log('Tests starting')
	})

	describe('Test isAuthorized Function', () => {

		describe('Validate Input', () => {
			beforeAll(async () => {
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
			it('Authorized User', async () => {
				await isAuthorized(req, resSpy, nextSpy)
				expect(nextSpy.firstCall.callId).toBe(1)
			})
		})

		describe('Not authorization in Header', () => {
			beforeEach(() => {
				req = {method: 'GET', query: {}, headers: {}}
				resSpy.send = sinon.spy()
				resSpy.status = sinon.spy()
				nextSpy = sinon.spy()
			})
			it('Missing JWT Token', async () => {
				await isAuthorized(req, resSpy, nextSpy)
				expect(resSpy.status['args'][0][0]).toBe(401)
				expect(resSpy.send['args'][0][0]).toBe('Unauthorized user')
				expect(resSpy.send['args'][1][0].message).toBe('jwt must be provided')
			})
		})

		describe('Invalid JWT Signature', () => {
			beforeEach(() => {
				req = {method: 'GET', query: {}, headers: {}}
				resSpy.send = sinon.spy()
				resSpy.status = sinon.spy()
				nextSpy = sinon.spy()
				req.headers['authorization'] = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJqb2huLmRvZSJ9.CuScq77_iCP4XsYGCMgGnQiATOmQwu_rR1LEB2Pcd_I'
			})
			it('Invalid Signature', async () => {
				await isAuthorized(req, resSpy)
				expect(resSpy.send.args[0][0].name).toBe('JsonWebTokenError')
				expect(resSpy.send.args[0][0].message).toBe('invalid signature')
			})
		})
	})
})
