const {getBearerToken} = require('../src/app/auth')
const faker = require('faker')
const sinon = require("sinon")
const axios = require('axios')

let req
let resSpy
let serverUrl = 'http://localhost:3000'

describe('Verifying getBearerToken', () => {

	beforeAll(() => {
		req = {method: 'GET'}
		resSpy = {}
	})

	describe('Validate JWT Token Generation', () => {
		beforeEach(() => {
			req.query = {}
			resSpy.send = sinon.spy()
			resSpy.status = sinon.spy()
		})

		describe('Validate the use of the getBearerToken() function ', () => {
			it('Should pass function test', async () => {
				req['query']['userName'] = faker.name.findName()
				req['query']['password'] = faker.internet.password()
				await getBearerToken(req, resSpy)
				expect(resSpy.send.args[0][0]).toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
			})

			it('Should fail missing username', async () => {
				req['query']['password'] = faker.internet.password()
				await getBearerToken(req, resSpy)
				expect(resSpy.status.args[0][0]).toBe(400)
				expect(resSpy.send.args[0][0]).toBe("userName and password are missing")
			})

			it('Should fail username misspelled', async () => {
				req['query']['username'] = faker.name.findName()
				req['query']['password'] = faker.internet.password()
				await getBearerToken(req, resSpy)
				expect(resSpy.status.args[0][0]).toBe(400)
				expect(resSpy.send.args[0][0]).toBe("userName and password are missing")
			})
		})

		describe('Validate the /auth endpoint', () => {
			it('Should pass with code 200 and issued token', async () => {
				const userName = faker.name.findName()
				const password = faker.internet.password()
				const response = await axios.get(`${serverUrl}/auth`, { params: {userName: userName, password: password}})
				expect(response.status).toBe(200)
				expect(response.data).toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
			})
		})
	})
})
