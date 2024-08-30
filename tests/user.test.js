import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../index.js';

describe('User API', () => {
  let mongoServer;
  let userData;

  // Set up in-memory MongoDB and connect before tests
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // Disconnect and stop in-memory MongoDB after tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should sign up a new user', async () => {
    // Define user data
    userData = {
      email: 'testuser@gmail.com',
      password: 'password123',
    };

    const res = await request(app)
      .post('/user/usersignup')
      .send(userData);

    console.log('Received response:', res.status, res.body);
    expect(res.status).toBe(201);
  });

  it('should log in the signed-up user', async () => {
    const res = await request(app)
      .post('/user/userlogin')
      .send(userData);
       
    console.log('Received response:', res.status, res.body);
    console.log('Sent data:', userData);
    
    expect(res.status).toBe(200); 
    expect(res.body).toHaveProperty('token');
  });
});
