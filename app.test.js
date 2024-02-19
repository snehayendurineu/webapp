const supertest = require('supertest');
const assert = require('assert');
const app = require('./app');
const { sequelize } = require('./models/dbConnection');


beforeAll(async () => {
    await sequelize.sync({ force: false });
    console.log('Database schema synchronized successfully');
  });
  

afterAll(async () => {
    await sequelize.close();
    console.log('Database connection closed');
});

describe('Integration tests', ()=>{
    const createUsr = {
        "username": "test@gmail.com",
        "password": "test123",
        "first_name": "test_fn",
        "last_name": "test_ln"
    }
    describe('Create account validation using GET call', ()=>{
        it('executing test case 1', async () => {
           
            await supertest(app).post("/v1/user").send(createUsr).expect(200);

            const getres = await supertest(app).get("/v1/user/self").set('Authorization', `Basic ${Buffer.from('test@gmail.com:test123').toString('base64')}`).expect(200);

            const getUsr = getres.body;

            assert.strictEqual(getUsr.username, createUsr.username);
            assert.strictEqual(getUsr.first_name, createUsr.first_name);
            assert.strictEqual(getUsr.last_name, createUsr.last_name);

        })
    });

    describe("Update account validation using GET call", ()=>{
        it('executing test case 2', async () => {
            const updateUsr = {
                "password": "newtest123",
                "first_name": "test_fn",
                "last_name": "test_ln"
            }

            await supertest(app).put(`/v1/user/self`).set('Authorization', `Basic ${Buffer.from('test@gmail.com:test123').toString('base64')}`).send(updateUsr).expect(204);

            const getres = await supertest(app).get("/v1/user/self").set('Authorization', `Basic ${Buffer.from('test@gmail.com:newtest123').toString('base64')}`).expect(200);

            const getUsr = getres.body;

            assert.strictEqual(getUsr.first_name, updateUsr.first_name);
            assert.strictEqual(getUsr.last_name, updateUsr.last_name);

            await supertest(app).delete("/v1/user/self").set('Authorization', `Basic ${Buffer.from('test@gmail.com:newtest123').toString('base64')}`).expect(200);

            
        })

    });
});
