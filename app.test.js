const supertest = require('supertest');
const assert = require('assert');
const app = require('./app');
const { sequelize } = require('./models/dbConnection');
const logger = require('./loggerModel.js');
const db =  require('./models/dbConnection')
const User = db.users

beforeAll(async () => {
    await sequelize.sync({ force: false });
    logger.info('Database schema synchronized successfully')
    console.log('Database schema synchronized successfully');
  });
  

afterAll(async () => {
    await sequelize.close();
    logger.info('Database connection closed');
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
           
            await supertest(app).post("/v11/user").send(createUsr).expect(201);

            await User.update({ is_verified: true }, { where: { username: "test@gmail.com"} });

            const getres = await supertest(app).get("/v11/user/self").set('Authorization', `Basic ${Buffer.from('test@gmail.com:test123').toString('base64')}`).expect(200);

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

            await supertest(app).put(`/v11/user/self`).set('Authorization', `Basic ${Buffer.from('test@gmail.com:test123').toString('base64')}`).send(updateUsr).expect(204);

            const getres = await supertest(app).get("/v11/user/self").set('Authorization', `Basic ${Buffer.from('test@gmail.com:newtest123').toString('base64')}`).expect(200);

            const getUsr = getres.body;

            assert.strictEqual(getUsr.first_name, updateUsr.first_name);
            assert.strictEqual(getUsr.last_name, updateUsr.last_name);

            await supertest(app).delete("/v11/user/self").set('Authorization', `Basic ${Buffer.from('test@gmail.com:newtest123').toString('base64')}`).expect(200);

            
        })

    });
});
