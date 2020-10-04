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
        const { body: response } = await request(server)
            .post('/users/register')
            .send(userRegisterMock)
            .expect(201);

        expect(response.message).toBe("Register Success")
        done();
    })

    // user login
    test('User Can Login', async (done) => {
        await request(server)
            .post('/users/register')
            .send(userLoginMock)
            .expect(201);

        const response = await request(server)
            .post('/users/login')
            .send(userLoginMock)
            .expect(200)

        expect(response.body.accessToken.length > 0).toBe(true)
        expect(response.body.refreshToken.length > 0).toBe(true)
        expect(response.body.userName).toBe(userLoginMock.name)
        done();
    })

    // user logout
    test('User Can Logout', async (done) => {
        await request(server)
            .post('/users/register')
            .send(userLogoutMock)
            .expect(201);

        const response = await request(server)
            .post('/users/login')
            .send(userLogoutMock)
            .expect(200)

        const { body: responseOut } = await request(server)
            .post('/users/logout')
            .send({ token: response.body.refreshToken })
            .expect(200)
        expect(responseOut.message).toBe("User Logged Out Successfully")
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
