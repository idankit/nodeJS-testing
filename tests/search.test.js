const {getBearerToken} = require('../src/app/auth')
const faker = require('faker')
const sinon = require("sinon")
const axios = require('axios')

let req, res, next, headers
let url = 'http://localhost:3000/app'

describe('Testing the search functionality', () => {
    beforeAll(() => {
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

    describe('Search for app authorization tests', () => {
        it('Should fail because header is empty', async () => {
            // expect.assertions(1)
            await expect(axios.get(`${url}/search/com.instagram.android`,
                {headers: {}})).rejects.toThrow('Request failed with status code 401')
        })

    })
})
