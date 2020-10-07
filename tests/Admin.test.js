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

        const adminLoginRes = await request(server)
            .post('/users/login')
            .send(userAdminMock)

        expect(adminLoginRes.status).toBe(200)
        expect(adminLoginRes.body.isAdmin).toBe(true)
        expect(typeof adminLoginRes.body.accessToken).toBe('string')
        expect(adminLoginRes.body.accessToken.length > 100).toBe(true)

        const infoRes = await request(server)
            .get('/api/v1/information')
            .set('authorization', `bearer ${adminLoginRes.body.accessToken}`)

        expect(infoRes.status).toBe(200)
        expect(infoRes.body.length > 0).toBe(true)

        const getAllUsersRes = await request(server)
            .get('/api/v1/users')
            .set('authorization', `Bearer ${adminLoginRes.body.accessToken}`)

        expect(getAllUsersRes.status).toBe(200)
        expect(getAllUsersRes.body[0].email).toBe(userAdminMock.email)
        expect(getAllUsersRes.body.length > 0).toBe(true)

        const getAllUsersNoAdminRes = await request(server)
            .get('/api/v1/users')
            .set('authorization', `Bearer token`)

        expect(getAllUsersNoAdminRes.status).toBe(403)
        expect(getAllUsersNoAdminRes.body.length > 0).toBe(false)
        done();
    })

    test('Passwords must be stored with hash', async (done) => {
        const registerResponse = await request(server)
            .post('/users/register')
            .send(userRegisterMock)

        expect(registerResponse.status).toBe(201)

        const adminLoginRes = await request(server)
            .post('/users/login')
            .send(userAdminMock)

        expect(adminLoginRes.status).toBe(200)

        const infoRes = await request(server)
            .get('/api/v1/users')
            .set('authorization', `bearer ${adminLoginRes.body.accessToken}`)

        expect(infoRes.status).toBe(200)
        const userMock = infoRes.body.filter(user => user.email === userRegisterMock.email)[0]

        expect(userMock.password === userRegisterMock.password).toBe(false)
        expect(userMock.password.length).toBe(60)
        done()
    })
})