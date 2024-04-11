import supertest from 'supertest';
import app from '../../src/app';
import User from '../../src/models/user';
import mongoose from 'mongoose';

const api = supertest(app);

const testUsers = [
    {
        name: 'test1',
        username: 'test1',
        password: 'test1',
    },
    {
        name: 'test2',
        username: 'test2',
        password: 'test2',
    },
];

const urlUser = '/api/user';
const urlLogin = '/api/login';

beforeEach(async () => {
    await User.deleteMany({});
});

describe('User', () => {
    test('create users', async () => {
        const responseCreateOneUser = await api.post(urlUser).send(testUsers[0]).expect(201);
        const obj = {
            name: testUsers[0].name,
            username: testUsers[0].username,
        };
        expect(responseCreateOneUser.body).toMatchObject(obj);
    });

    test('login user', async () => {
        await api.post(urlUser).send(testUsers[0]);
        const result = await api
            .post(urlLogin)
            .send(testUsers[0])
            .expect(201)
            .expect('Content-Type', /application\/json/);

        expect(result.body.token).toBeDefined();
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
