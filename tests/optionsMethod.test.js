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

        const { body: data } = await request(server)
            .post('/users/login')
            .send(userAdminMock)
            .expect(200)

        const { body: adminOptionsRes } = await request(server)
            .options('/')
            .set('authorization', `Bearer ${data.accessToken}`)
            .expect(200)

        expect(adminOptionsRes.length >= 7).toBe(true)
        done();
    })

    test('Client with no token can view only Register and login APIs', async (done) => {
        const { body: noTokenOptionsRes } = await request(server)
            .options('/')
            .expect(200)

        expect(noTokenOptionsRes.length >= 2).toBe(true)
        done();
    })

    test('Client with invalid token can view only Register, login and refresh token APIs', async (done) => {
        const { body: invalidTokenOptionsRes } = await request(server)
            .options('/')
            .set('authorization', `Bearer invalidtoken`)
            .expect(200)

        expect(invalidTokenOptionsRes.length >= 3).toBe(true)
        done();
    })

    test('non-admin user with valid access token can view all APIs except the /api/v1/users API', async (done) => {
        await request(server)
            .post('/users/register')
            .send(userRegisterMock)
            .expect(201);

        const { body: loginRes } = await request(server)
            .post('/users/login')
            .send(userRegisterMock)
            .expect(200);

        const { body: nonAdminOptionsRes } = await request(server)
            .options('/')
            .set('authorization', `Bearer ${loginRes.accessToken}`)
            .expect(200)

        expect(nonAdminOptionsRes.length >= 6).toBe(true)
        done();
    })
})