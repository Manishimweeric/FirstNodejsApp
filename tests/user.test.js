import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../index.js';
import { User } from '../Models/User.js';  // Ensure this import path is correct

describe('User API', () => {
  let mongoServer;

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
    try {
      const res = await request(app)
        .post('/user/usersignup')
        .send({
          email: 'testuser@gmail.com',
          password: 'password123',
        });

      console.log('Received response:', res.status, res.body);
      expect(res.status).toBe(201);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });

  it('should log in an existing user', async () => {
    try {
      // Ensure the user exists in the database before attempting to log in
      let existingUser = await User.findOne({ email: 'testuser@gmail.com' });

      if (!existingUser) {
        existingUser = await User.create({
          email: 'testuser@gmail.com',
          password: 'password123', // Ensure your model hashes passwords appropriately
        });
      }

      const res = await request(app)
        .post('/user/userlogin')
        .send({
          email: 'testuser@gmail.com',
          password: 'password123',
        });

      console.log('Received response:', res.status, res.body);
      expect(res.status).toBe(200); // Assuming 200 status code for successful login
      expect(res.body).toHaveProperty('token'); // Assuming login returns a token
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });
});
