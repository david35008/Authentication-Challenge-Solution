const request = require('supertest');
const server = require('../app');

//Admin tests
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

describe('Admin Tests', () => {
    afterAll(async () => {
        await server.close();
    })
    test('Only Admin Can Get Users List', async (done) => {

        const { body: adminLoginRes } = await request(server)
            .post('/users/login')
            .send(userAdminMock)
            .expect(200)

        expect(adminLoginRes.isAdmin).toBe(true)
        expect(typeof adminLoginRes.accessToken).toBe('string')
        expect(adminLoginRes.accessToken.length > 100).toBe(true)

        const { body: infoRes } = await request(server)
            .get('/api/v1/information')
            .set('authorization', `bearer ${adminLoginRes.accessToken}`)
            .expect(200)

        expect(infoRes.length > 0).toBe(true)

        const { body: getAllUsersRes } = await request(server)
            .get('/api/v1/users')
            .set('authorization', `Bearer ${adminLoginRes.accessToken}`)
            .expect(200)

        expect(getAllUsersRes[0].email).toBe(userAdminMock.email)
        expect(getAllUsersRes.length > 0).toBe(true)

        const { body: getAllUsersNoAdminRes } = await request(server)
            .get('/api/v1/users')
            .set('authorization', `Bearer token`)
            .expect(403)

        expect(getAllUsersNoAdminRes.length > 0).toBe(false)
        done();
    })

    test('Passwords must be stored with hash', async (done) => {
        await request(server)
            .post('/users/register')
            .send(userRegisterMock)
            .expect(201);

        const { body: adminLoginRes } = await request(server)
            .post('/users/login')
            .send(userAdminMock)
            .expect(200)

        const { body: infoRes } = await request(server)
            .get('/api/v1/users')
            .set('authorization', `bearer ${adminLoginRes.accessToken}`)
            .expect(200)

        const userMock = infoRes.filter(user => user.name === userRegisterMock.name)[0]

        expect(userMock.password === userRegisterMock.password).toBe(false)
        expect(userMock.password.length).toBe(60)
        done()
    })
})