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

        await request(server)
            .post('/users/register')
            .send(userInfoMock)
            .expect(201);

        const { body: loginRes } = await request(server)
            .post('/users/login')
            .send(userInfoMock)
            .expect(200)

        const { body: infoRes } = await request(server)
            .get('/api/v1/information')
            .set('authorization', `bearer ${loginRes.accessToken}`)
            .expect(200)

        expect(infoRes.length > 0).toBe(true)
        expect(infoRes[0].user).toBe(userInfoMock.name)

        await request(server)
            .get('/api/v1/information')
            .set('authorization', 'bearer notValidToken')
            .expect(403)

        done()
    })
})

