# backend-authentication-challenge

## Description
Welcome to the <b>Best Authentication Challenge</b> ever existed.<br>
This challenge's goal is to learn and practice building a *User Authentication and Authorization System* in your project.<br>
In order to pass this challenge successfully you should follow all of the requirements detailed below.<br>

## Preparations
- Install [Node.js](https://nodejs.org/en/download/) (if you haven't already).
- Install a code editor of your choice (recommended: [Visual Studio Code](https://code.visualstudio.com/download)).
- Fork [this Github repository](https://github.com/suvelocity/Authentication-Challenge-TEMPLATE) to your computer.
- Run `npm install` on your terminal, **both** in **the main** directory and **client** folder.

After these steps, you are good to go. **Good Luck!**

## Libraries 
- [`express`](https://www.npmjs.com/package/express) - server framework.
- [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken) - for user validation.
- [`bcrypt`](https://www.npmjs.com/package/bcrypt) - for password hashing and comparing.
- [`morgan`](https://www.npmjs.com/package/morgan) - for easy request/response logging.
- [`nodemon`](https://www.npmjs.com/package/nodemon) - auto restarts server onSave. 
- [`jest`](https://www.npmjs.com/package/jest) - tests library.
- [`supertest`](https://www.npmjs.com/package/supertest) - backend test addition.

## Important Note
- **Do Not** try to change dependencies in `package.json`/`package.json.lock`, the initial libraries are the **only** libraries allowed to use in order to pass the challenge successfully, it will be **Tested**.

## Requirements
- Access tokens should expire after 30 seconds.
- Server must have an unknown endpoint handler (status 404 "unknown endpoint").
- Server must contain the following variables: USERS [...{email, user, password, isAdmin},{}...], INFORMATION [...{user, info},{}...], 
- Passwords cannot be stored as plain-text - only as hash+salt(10!)
- USERS array on server must have an admin user with the props mentioned bellow: 
{ email: "admin@email.com", name: "admin", password: "**hashed password**", isAdmin: true }. admin's password **must** be `Rc123456!`.
- Server must work with content/type: application/JSON 
- **RESTFull API requirements:**
  - `POST` path: `"/users/register"`, description: sign up to the server.
    - request template: body: {email, user, password}
    - server responses:  status 201 "Register Success" | status 409 "user already exists".
    - When a user registers, the INFORMATION variable is updated with new info {name: ${username}, info: "${username} info"} 
  - `POST` path: `"/users/login"`, description: Login.
    - request template: body: {email ,password}
    - server responses: status 200, body {accessToken, refreshToken , userName, isAdmin} | status 404 "cannot find user" | status 403 "User or Password incorrect".

  - `POST` path: `"/users/tokenValidate"`, description: Access Token Validation, required: 
    - request template header: {Authorization: "Bearer -access token-"}
    - server responses: status 200, body: {valid: `true`} | status 401 "Access Token Required" | status 403 "Invalid Access Token".

  - `GET` path: `"/api/v1/information"`, description: Access user's information, required: header: {Authorization: "Bearer -access token-"}
    - request template: header {Authorization: "Bearer -access token-"}
    - server responses: status 200, body: {user, info} | status 401 "Access Token Required" | status 403 "Invalid Access Token".
    
  - `POST` path: `"/users/token"`, description: Renew access token, 
    - request template: body: {token: -refresh token-}.
    - server responses: status 200, body: {accessToken} | status 401 "Refresh Token Required" | status 403 "Invalid Refresh Token".
  
  - `POST` path: `"/users/logout"`, description: Logout Session. 
    - Request template: body: {token: -refresh token-"}
    - server responses: status 200 "User Logged Out Successfully" | status 400 "Refresh Token Required" | status 400 "Invalid Refresh Token".

  - `GET` path: `/api/v1/users`, description: Get users DB (admin only), 
    - Request template: header {Authorization: "Bearer -access token-"}
    - Server Responses: status 200, body: {USERS: [...[{email, name, password, isAdmin}]} | status 401 "Refresh Token Required" | status 403 "Invalid Refresh Token".

  - `OPTIONS` path: `"/"`, description: returns an array of all APIs and endpoints. (sends only the available options for the currnet logged user premissions)
    - Request template: `optional` header {Authorization: "Bearer -access token-"}
    - Server Response: status 200, header: {Allow: "OPTIONS, GET, POST"},
    body: returns an array of all the server's APIs:
      - client with no token gets only register and login APIs. 
      - client with invalid token can use register, login and refresh token APIs.
      - authenticated user can access login, register, refresh token, information and logout APIs.
      - admin user can see all the server's APIs (including the get **api/v1/users**)
        - options array:
        [
    { method: "post", path: "/users/register", description: "Register, required: email, user, password", example: { body: { email: "user@email.com", name: "user", password: "password" } } },
    { method: "post", path: "/users/login", description: "Login, required: valid email and password", example: { body: { email: "user@email.com", password: "password" } } },
    { method: "post", path: "/users/token", description: "Renew access token, required: valid refresh token", example: { headers: { token: "\*Refresh Token\*" } } },
    { method: "post", path: "/users/tokenValidate", description: "Access Token Validation, required: valid access token", example: { headers: { authorization: "Bearer \*Access Token\*" } } },
    { method: "get", path: "/api/v1/information", description: "Access user's information, required: valid access token", example: { headers: { authorization: "Bearer \*Access Token\*" } } },
    { method: "post", path: "/users/logout", description: "Logout, required: access token", example: { body: { token: "\*Refresh Token\*" } } },
    { method: "get", path: "api/v1/users", description: "Get users DB, required: Valid access token of admin user", example: { headers: { authorization: "Bearer \*Access Token\*" } } }
  ]
## How to run tests
- Run all tests (tokenExpire.test takes 30s) - CLI command - npm run test.
- Run single test suite -  CLI command - npm run test -- SomeTestFileToRun.

## Resources
- HTTP Status Codes - [Rest API Tutorials](https://www.restapitutorial.com/httpstatuscodes.html), [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- `jwt` - https://www.npmjs.com/package/jsonwebtoken.
- `jwt` - https://www.youtube.com/watch?v=7Q17ubqLfaM.
- `jwt` - https://jwt.io/introduction/.
- `jwt` - https://www.youtube.com/watch?v=2jqok-WgelI&t=472s.
- `jwt` - https://www.youtube.com/watch?v=Ud5xKCYQTjM.
- `bcrypt` - https://www.npmjs.com/package/bcrypt.
- `bcrypt` - https://www.youtube.com/watch?v=O6cmuiTBZVs.
- `bcrypt` - https://www.youtube.com/watch?v=rYdhfm4m7yg.
- `options method` - https://developer.mozilla.org/en-US/docs/Web/HTTP/.Methods/OPTIONS.
- `express` - https://medium.com/@onejohi/building-a-simple-rest-api-with-nodejs-and-express-da6273ed7ca9.
- `nodemon` - https://www.youtube.com/watch?v=kV6MJ9W4whM.
- `morgan` - https://www.youtube.com/watch?v=IdsdQuC13P0.

