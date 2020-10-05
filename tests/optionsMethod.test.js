const request = require('supertest');
const server = require('../app');

const userAdminMock = {
    name: 'admin',
    email: 'admin@email.com',
    password: 'Rc123456!'
}

const userRegisterMock = {
    name: 'test',
    email: 'test@test.com',
    password: 'Aa123456!'
}


describe('Options method test', () => {
    afterAll(async () => {
        await server.close();
    })
    test('Only Admin Can Get all server APIs', async (done) => {

        const data = await request(server)
            .post('/users/login')
            .send(userAdminMock)

        expect(data.status).toBe(200)

        const adminOptionsRes = await request(server)
            .options('/')
            .set('authorization', `Bearer ${data.body.accessToken}`)

        expect(adminOptionsRes.status).toBe(200)
        expect(adminOptionsRes.body.length >= 7).toBe(true)
        done();
    })

    test('Client with no token can view only Register and login APIs', async (done) => {
        const noTokenOptionsRes = await request(server)
            .options('/')

        expect(noTokenOptionsRes.status).toBe(200)
        expect(noTokenOptionsRes.body.length >= 2).toBe(true)
        done();
    })

    test('Client with invalid token can view only Register, login and refresh token APIs', async (done) => {
        const invalidTokenOptionsRes = await request(server)
            .options('/')
            .set('authorization', `Bearer invalidtoken`)

        expect(invalidTokenOptionsRes.status).toBe(200)
        expect(invalidTokenOptionsRes.body.length >= 3).toBe(true)
        done();
    })

    test('non-admin user with valid access token can view all APIs except the /api/v1/users API', async (done) => {
        const registerResponse = await request(server)
            .post('/users/register')
            .send(userRegisterMock)

        expect(registerResponse.status).toBe(201)

        const loginRes = await request(server)
            .post('/users/login')
            .send(userRegisterMock)

        expect(loginRes.status).toBe(200)

        const nonAdminOptionsRes = await request(server)
            .options('/')
            .set('authorization', `Bearer ${loginRes.body.accessToken}`)

        expect(nonAdminOptionsRes.status).toBe(200)
        expect(nonAdminOptionsRes.body.length >= 6).toBe(true)
        done();
    })
})