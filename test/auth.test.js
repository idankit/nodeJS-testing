const {getBearerToken} = require('../src/app/auth')
const faker = require('faker')
const sinon = require("sinon")

let req
let resSpy

describe('Verifying getBearerToken', () => {

	beforeAll(() => {
		console.log('Tests starting')
		req = {method: 'GET'}
		resSpy = {}
	})

	describe('The getBearerToken Function', () => {
		describe('Validate Input', () => {
			beforeEach(() => {
				req.query = {}
				resSpy.send = sinon.spy()
				resSpy.status = sinon.spy()
			})

			it('Correct Params', async () => {
				req['query']['userName'] = faker.name.findName()
				req['query']['password'] = faker.internet.password()
				const token = await getBearerToken(req, resSpy)
				expect(resSpy.send.args[0][0]).toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
			})

			it('Missing Username', async () => {
				req['query']['password'] = faker.internet.password()
				await getBearerToken(req, resSpy)
				expect(resSpy.status.args[0][0]).toBe(400)
				expect(resSpy.send.args[0][0]).toBe("userName and password are missing")
			})

			it('Username misspelled', async () => {
				req['query']['username'] = faker.name.findName()
				req['query']['password'] = faker.internet.password()
				await getBearerToken(req, resSpy)
				expect(resSpy.status.args[0][0]).toBe(400)
				expect(resSpy.send.args[0][0]).toBe("userName and password are missing")
			})
		})
	})
})
