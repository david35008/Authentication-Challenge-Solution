const request = require('supertest');
const server = require('../app');

const userMock = {
    name: 'test3',
    email: 'test3@test.com',
    password: 'Aa123456!'
}

describe('Token expiration and refresh test', () => {
    afterAll(async () => {
        server.close()
    })
    test('Access Token expires after 10s and can be renewed with refresh token', async (done) => {

        const registerResponse = await request(server)
            .post('/users/register')
            .send(userMock)


        expect(registerResponse.status).toBe(201)

        const loginRes = await request(server)
            .post('/users/login')
            .send(userMock)

        expect(loginRes.status).toBe(200)
        expect(loginRes.body.accessToken.length > 100).toBe(true)
        expect(typeof loginRes.body.accessToken).toBe('string')

        const infoRes = await request(server)
            .get('/api/v1/information')
            .set('authorization', `bearer ${loginRes.body.accessToken}`)

        expect(infoRes.status).toBe(200)
        expect(infoRes.body.length > 0).toBe(true)
        await timeout(10500)

        const serverResponse = await request(server)
            .get('/api/v1/information')
            .set('authorization', `bearer ${loginRes.body.accessToken}`)

        expect(serverResponse.status).toBe(403)

        const serverResponse1 = await request(server)
            .post('/users/token')
            .send({ blabla: 'no token' })

        expect(serverResponse1.status).toBe(401)

        const serverResponse2 = await request(server)
            .post('/users/token')
            .send({ token: 'not valid token' })

        expect(serverResponse2.status).toBe(403)

        const data = await request(server)
            .post('/users/token')
            .send({ token: loginRes.body.refreshToken })

        expect(data.status).toBe(200)
        expect(data.body.accessToken.length > 100).toBe(true)
        expect(typeof data.body.accessToken).toBe('string')

        const infoRes2 = await request(server)
            .get('/api/v1/information')
            .set('authorization', `bearer ${data.body.accessToken}`)

        expect(infoRes2.status).toBe(200)
        expect(infoRes2.body.length > 0).toBe(true)
        done();
    }, 35000)
}, 35000)


function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
