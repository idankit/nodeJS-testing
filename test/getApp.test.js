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


describe('GET App Details - Integration Tests', () => {
	beforeAll(() => {
		req = {method: 'GET', query: {}, headers: {}}
		resSpy.send = sinon.spy()
		resSpy.status = sinon.spy()
		nextSpy = sinon.spy()
		headers = {}
	})

	describe('Authorization tests', () => {
		describe('getApp by ID as Unauthorized user', () => {
			it('Missing Authorization header', async () => {
				expect.assertions(1)
				await expect(axios.get(`${serverUrl}/com.instagram.android`,
					{headers: headers})).rejects.toThrow('Request failed with status code 401')
			})

			it('Unauthorized Token', async () => {
				headers['authorization'] ='eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJqb2huLmRvZSJ9.CuScq77_iCP4XsYGCMgGnQiATOmQwu_rR1LEB2Pcd_I'
				expect.assertions(1)
				await expect(axios.get(`${serverUrl}/com.instagram.android`,
					{headers: headers})).rejects.toThrow('Request failed with status code 401')
			})

			it('Authorized User', async () => {
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
	})

	describe('GET Find app by id', () => {
		beforeEach(async () => {
			req['query']['userName'] = faker.name.findName()
			req['query']['password'] = faker.internet.password()
			await getBearerToken(req, resSpy)
			headers['authorization'] = resSpy.send.args[0][0]
		})

		it('Valid App ID', async () => {
			const response = await axios.get(`${serverUrl}/io.strongapp.strong`, {headers: headers})
			expect(response).toMatchObject({status: 200})
			expect(response).toMatchObject({statusText: 'OK'})
			expect(response.data).toMatchObject({title: 'Strong - Workout Tracker Gym Log'})
		})

		it('Invalid App ID', async () => {
			expect.assertions(1)
			await expect(axios.get(`${serverUrl}/io.strongapp.`,
				{headers: headers})).rejects.toThrow('Request failed with status code 404')
		})
	})
})
