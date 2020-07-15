const {getBearerToken} = require('../src/app/auth')
const faker = require('faker')
const sinon = require("sinon")
const axios = require('axios')

let req
let resSpy = {}
let authToken
let nextSpy
let serverUrl = 'http://localhost:3000/app'
let headers


describe('Retrieve app details - Integration Tests', () => {
	beforeAll(() => {
		req = {method: 'GET', query: {}, headers: {}}
		resSpy.send = sinon.spy()
		resSpy.status = sinon.spy()
		nextSpy = sinon.spy()
		headers = {}
	})

	describe('Get App details authorization tests', () => {
		it('Should fail Missing authorization in header', async () => {
			expect.assertions(1)
			await expect(axios.get(`${serverUrl}/com.instagram.android`,
				{headers: headers})).rejects.toThrow('Request failed with status code 401')
		})

		it('Should fail dude to unauthorized token', async () => {
			headers['authorization'] = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJqb2huLmRvZSJ9.CuScq77_iCP4XsYGCMgGnQiATOmQwu_rR1LEB2Pcd_I'
			expect.assertions(1)
			await expect(axios.get(`${serverUrl}/com.instagram.android`,
				{headers: headers})).rejects.toThrow('Request failed with status code 401')
		})

		it('Should pass with Authorized User', async () => {
			req['query']['userName'] = faker.name.findName()
			req['query']['password'] = faker.internet.password()
			await getBearerToken(req, resSpy)
			authToken = resSpy.send.args[0][0]
			headers['authorization'] = authToken
			const response = await axios.get(`${serverUrl}/com.strava`, {headers: headers})
			expect(response).toMatchObject({status: 200})
			expect(response).toMatchObject({statusText: 'OK'})
			expect(response.data).toMatchObject({title: 'Strava: Track Running, Cycling & Swimming'})
		})
	})

	describe('Find app by id tests', () => {
		beforeEach(async () => {
			req['query']['userName'] = faker.name.findName()
			req['query']['password'] = faker.internet.password()
			await getBearerToken(req, resSpy)
			headers['authorization'] = resSpy.send.args[0][0]
		})

		it('Should pass with valid app id', async () => {
			const response = await axios.get(`${serverUrl}/io.strongapp.strong`, {headers: headers})
			expect(response).toMatchObject({status: 200})
			expect(response).toMatchObject({statusText: 'OK'})
			expect(response.data).toMatchObject({title: 'Strong - Workout Tracker Gym Log'})
		})

		it('Should fail with invalid app id', async () => {
			expect.assertions(1)
			await expect(axios.get(`${serverUrl}/io.strongapp.`,
				{headers: headers})).rejects.toThrow('Request failed with status code 404')
		})
	})
})
