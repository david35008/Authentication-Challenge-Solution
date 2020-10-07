const request = require('supertest');
const server = require('../app');

// authorized user tests
const userInfoMock = {
    name: 'test',
    email: 'test@test.com',
    password: 'Aa123456!'
}

describe('Authorized User Tests', () => {
    afterAll(async () => {
        await server.close();
    })

    //authorized user can get info
    test('Authorized User Can Get Info', async (done) => {

        const registerResponse = await request(server)
            .post('/users/register')
            .send(userInfoMock)

        expect(registerResponse.status).toBe(201)

        const loginRes = await request(server)
            .post('/users/login')
            .send(userInfoMock)

        expect(loginRes.status).toBe(200)

        const infoRes = await request(server)
            .get('/api/v1/information')
            .set('authorization', `bearer ${loginRes.body.accessToken}`)

        expect(infoRes.status).toBe(200)
        expect(infoRes.body.length > 0).toBe(true)
        expect(infoRes.body[0].email).toBe(userInfoMock.email)

        const informationResponse = await request(server)
            .get('/api/v1/information')
            .set('authorization', 'bearer notValidToken')

        expect(informationResponse.status).toBe(403)
        done()
    })
})

