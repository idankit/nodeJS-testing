describe("isAuthorized middleware", ()=> {
    const isAuthorized = require("./isAuthorized")
    const jwt = require("jsonwebtoken")    

    jest.mock("jsonwebtoken")
    const mockRequest = (headers, query, params) => ({
        headers: headers,
        query: query,
        params: params
    });
    const mockResponse = (fSend, fStatus) => ({
        send:fSend,
        status: fStatus
    });

    describe("isAuthorized", ()=> {
        test("if the headers are correct, next is called",async ()=>{
            const spynext = jest.fn();
            jwt.verify.mockReturnValue({
                iat:1595399171,
                password:'1234',
                userName:'anat'})
            await isAuthorized.isAuthorized(mockRequest({authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFuYXQiLCJwYXNzd29yZCI6IjEyMzQiLCJpYXQiOjE1OTUzOTkxNzF9.vm2MnUzjQ4hykm8Np4V1-QOD1mIfMX4ylYqa9_WP27k"}, {}, {}), mockResponse(), spynext)
            expect(spynext).toHaveBeenCalled()
        })
        test("if there is no authorization header, response status is 401 and the string 'Unauthorized user' is sent to the response",async ()=>{
            const spynext = jest.fn();
            const spystatus = jest.fn()
            const spysend = jest.fn()
            await isAuthorized.isAuthorized(mockRequest({}, {}, {}), mockResponse(spysend, spystatus), spynext)
            expect(spystatus).toHaveBeenCalledWith(401)
            expect(spysend).toHaveBeenCalledWith('Unauthorized user')            
        })

        test("if the user has wrong authorization header,  response status is 401 and the string 'Unauthorized user' is sent to the response", async ()=>{
            const spynext = jest.fn();
            const spystatus = jest.fn()
            const spysend = jest.fn()
            await isAuthorized.isAuthorized(mockRequest({authrization: "anat"}, {}, {}), mockResponse(spysend, spystatus), spynext)
            expect(spystatus).toHaveBeenCalledWith(401)
            expect(spysend).toHaveBeenCalledWith('Unauthorized user')                 
        })
        test("if jwt.verify throws an error, response status is 401 and the error is sent to the response",async ()=>{
            const spynext = jest.fn();
            const spystatus = jest.fn()
            const spysend = jest.fn()            
            jwt.verify.mockRejectedValue(new Error("now you broke it!"))
            await isAuthorized.isAuthorized(mockRequest({authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFuYXQiLCJwYXNzd29yZCI6IjEyMzQiLCJpYXQiOjE1OTUzOTkxNzF9.vm2MnUzjQ4hykm8Np4V1-QOD1mIfMX4ylYqa9_WP27k"}, {}, {}), mockResponse(spysend, spystatus), spynext)
            expect(spystatus).toHaveBeenCalledWith(401)
            expect(spysend).toHaveBeenCalledWith(new Error("now you broke it!"))
        })
    })
})