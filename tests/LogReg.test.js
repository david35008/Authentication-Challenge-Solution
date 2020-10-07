const request = require('supertest');
const server = require('../app');

//login logout and register tests
const userRegisterMock = {
    name: 'test',
    email: 'test@test.com',
    password: 'Aa123456!'
}

const userLoginMock = {
    name: 'test1',
    email: 'test1@test.com',
    password: 'Aa123456!'
}

const userLogoutMock = {
    name: 'test2',
    email: 'test2@test.com',
    password: 'Aa123456!'
}

describe('Register & Login Tests', () => {
    afterAll(async () => {
        await server.close();
    })

    // user register
    test('User Can Register', async (done) => {
        const registerResponse = await request(server)
            .post('/users/register')
            .send(userRegisterMock)

        expect(registerResponse.status).toBe(201)
        done();
    })

    // user login
    test('User Can Login', async (done) => {
        const registerResponse = await request(server)
            .post('/users/register')
            .send(userLoginMock)

        expect(registerResponse.status).toBe(201)

        const loginResponse = await request(server)
            .post('/users/login')
            .send(userLoginMock)

        expect(loginResponse.status).toBe(200)
        expect(loginResponse.body.accessToken.length > 0).toBe(true)
        expect(loginResponse.body.refreshToken.length > 0).toBe(true)
        expect(loginResponse.body.name).toBe(userLoginMock.name)
        done();
    })

    // user logout
    test('User Can Logout', async (done) => {
        const registerResponse = await request(server)
            .post('/users/register')
            .send(userLogoutMock)

        expect(registerResponse.status).toBe(201)

        const loginResponse = await request(server)
            .post('/users/login')
            .send(userLogoutMock)

        expect(loginResponse.status).toBe(200)

        const logOutResponse = await request(server)
            .post('/users/logout')
            .send({ token: loginResponse.body.refreshToken })

        expect(logOutResponse.status).toBe(200)
        done();
    })

    test('check unknown endpoint handler', async (done) => {
        await request(server)
            .delete('/blabla')
            .expect(404)
        await request(server)
            .post('/blabla')
            .expect(404)
        await request(server)
            .get('/blabla')
            .expect(404)
        await request(server)
            .put('/blabla')
            .expect(404)
        await request(server)
            .options('/blabla')
            .expect(404)

        done()
    })
})
