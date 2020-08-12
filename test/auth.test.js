const {getBearerToken} = require("../src/app/auth")
const jwt = require('jsonwebtoken')
const faker = require("faker")

const tokenPrefix = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6I"

let request
let response

function verifyWrongCredentials(response) {
    expect(response.send).toHaveBeenCalledTimes(1)
    expect(response.status.mock.calls[0][0]).toBe(400)
    expect(response.send.mock.calls[0][0]).toBe("userName and password are missing")
}

describe("getBearerToken() testing", () => {
    beforeEach(() => {
        response = {
            send: jest.fn(),
            status: jest.fn()
        }
        request = {
            query: {
                userName: faker.name.findName(),
                password: faker.internet.password()
            }
        }
    })

    it("Smoke test", async () => {
        await getBearerToken(request, response)
        let token = response.send.mock.calls[0][0]
        let decoded = jwt.decode(token)
        expect(response.send).toHaveBeenCalledTimes(1)
        expect(token).toContain(tokenPrefix)
        expect(decoded).toHaveProperty("userName")
        expect(decoded.userName).toBe(request.query.userName)
        expect(decoded).toHaveProperty("password")
        expect(decoded.password).toBe(request.query.password)
    })

    it("No credentials provided", async () => {
        delete request.query.userName
        delete request.query.password
        await getBearerToken(request, response)
        verifyWrongCredentials(response)
    })

    it("No password provided", async () => {
        delete request.query.password
        await getBearerToken(request, response)
        verifyWrongCredentials(response)
    })
    it("No username provided", async () => {
        delete request.query.userName
        await getBearerToken(request, response)
        verifyWrongCredentials(response)
    })


})