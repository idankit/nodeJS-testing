# Pre-Requisites
    * Make sure node and npm is installed https://docs.npmjs.com/getting-started/installing-node
    * Clone the repository to your computer using `git clone git@github.com:idankit/nodeJS-testing.git`
    * Go into the created directory `cd nodejs-testing`
    * run `npm i`
    * Run the app using `node server.js`. The app is now running on port 3000
    
# Description
Our app gets applications from google play store.
It contains three routes:
* /auth - gets 'userName' and 'password' query params and returns a token
* /app/:appId - gets an app from the store based on the unique store id.
For example, the store url of instagram:
https://play.google.com/store/apps/details?id=com.instagram.android
the appId is: com.instagram.android
* /app/search/:term - searches for apps in the store based in a term.
The endpoint support limiting the amount of the results using a query param called 'count' (default 20, max 250)

Both /app/:appId and /app/search/:term requires authentication. 
Using /auth with randomly chosen userName and passowrd you generate the bearer token.
Afterwards, simply add this token to you requests using 'authorization' header

# Tests instructions
## Integration tests
Write integration tests for the following routes:
* /app/:appId
* /app/search/:term

## Unit tests
* Write unit tests for 'isAuthorized' middleware
* Make sure you expect the errors
* Think whether to stub the jwt functions or not

## Guidelines
The tests should contain tests for some valid requests, and invalid requests
* Choose whether you want to work with 'Mocha' or 'Jest'
* Start with writing the test plan before writing the code 
* Use stubs
* Expect the errors(invalid token for example)
* Write tests for invalid params as well(f.e. can 'count' be a string?)
* Try using as much as Do's as possible - write declarative code, independent tests. 
You can even think of a way to use 'faker' or 'fast-check' :)
* There are some bugs in the codes(for example, appId that doesn't exist). 
Make sure you write a tests that catches the bug(and fails) before fixing the actual bug(and making the test pass by fixing the bug)
