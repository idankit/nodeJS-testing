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

describe('Search for app - Integration Tests', () => {
	beforeAll(() => {
		req = {method: 'GET', query: {}, headers: {}}
		resSpy.send = sinon.spy()
		resSpy.status = sinon.spy()
		nextSpy = sinon.spy()
		headers = {}
	})

	describe('Search for app authorization tests', () => {
		it('Should fail due to missing authorization header', async () => {
			expect.assertions(1)
			await expect(axios.get(`${serverUrl}/search/com.instagram.android`,
				{headers: headers})).rejects.toThrow('Request failed with status code 401')
		})

		it('Should fail due to unauthorized token', async () => {
			headers['authorization'] = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJqb2huLmRvZSJ9.CuScq77_iCP4XsYGCMgGnQiATOmQwu_rR1LEB2Pcd_I'
			expect.assertions(1)
			await expect(axios.get(`${serverUrl}/search/com.instagram.android`,
				{headers: headers})).rejects.toThrow('Request failed with status code 401')
		})

		it('Should pass with authorized user', async () => {
			req['query']['userName'] = faker.name.findName()
			req['query']['password'] = faker.internet.password()
			await getBearerToken(req, resSpy)
			authToken = resSpy.send.args[0][0]
			headers['authorization'] = authToken
			const response = await axios.get(`${serverUrl}/search/com.strava`, {headers: headers})
			expect(response).toMatchObject({status: 200})
			expect(response).toMatchObject({statusText: 'OK'})
			expect(response.data).toEqual(expect.arrayContaining([
				expect.objectContaining({title: 'Strava: Track Running, Cycling & Swimming'})
			]))
		})
	})

	describe('Search App', () => {
		beforeEach(async () => {
			req['query']['userName'] = faker.name.findName()
			req['query']['password'] = faker.internet.password()
			await getBearerToken(req, resSpy)
			headers['authorization'] = resSpy.send.args[0][0]
		})

		it('Should pass finding multiple apps', async () => {
			const response = await axios.get(`${serverUrl}/search/com.stra`, {headers: headers})
			expect(response).toMatchObject({status: 200})
			expect(response).toMatchObject({statusText: 'OK'})
			expect(response.data).toEqual(expect.arrayContaining([
				expect.objectContaining({title: 'Strava: Track Running, Cycling & Swimming'})
			]))
			expect(response.data).toEqual(expect.arrayContaining([
				expect.objectContaining({title: 'Star Walk - Night Sky Map and Stargazing Guide'})
			]))
		})

		it('Should pass with no apps found', async () => {
			const response = await axios.get(`${serverUrl}/search/com.nonexistentappitem`, {headers: headers})
			expect(response).toMatchObject({status: 200})
			expect(response).toMatchObject({statusText: 'OK'})
			expect(response.data).toEqual([])
		})
	})
})
