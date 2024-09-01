import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../Models/User.js';
import { createUser, login } from '../Controller/userController.js';  // Named imports
import { validateINPUT } from '../Controller/validateiniput.js';  
import { authenticateJWT } from '../Controller/authtoken.js'; 

// Load environment variables
const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';

const app = express();
app.use(express.json());

app.post('/users/signup', validateINPUT, createUser);
app.post('/users/login', validateINPUT, login);

const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: 'mockUserId' }; 
  next();
};

jest.mock('../Controller/authtoken.js', () => ({ 
  authenticateJWT: mockAuthMiddleware,
}));

describe('User API', () => {
  let mongoServer;
  let authToken;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    const user = await UserModel.create({
      email: 'testuser@gmail.com',
      password: await bcrypt.hash('password123', 10),
    });

    // Check if jwtSecret is loaded
    console.log('JWT_SECRET:', jwtSecret);
    
    authToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

    console.log('Generated Token:', authToken);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Uncomment the below tests once you have confirmed the basic functionality is working

  // it('should get all blog posts', async () => {
  //   const res = await request(app)
  //     .get('/blogs')
  //     .set('Authorization', `Bearer ${authToken}`);

  //   console.log('Get All Blogs Response:', res.body);

  //   expect(res.status).toBe(200);
  //   expect(res.body.posts).toBeInstanceOf(Array);
  //   expect(res.body.posts.length).toBeGreaterThan(0);
  // });

  // it('should update an existing blog post', async () => {
  //   const updatedBlogData = {
  //     title: 'Updated Blog Post Title',
  //     Discription: 'Updated blog post description.',
  //   };

  //   const res = await request(app)
  //     .put(`/blogs/${blogId}`)
  //     .set('Authorization', `Bearer ${authToken}`)
  //     .send(updatedBlogData);

  //   console.log('Update Blog Response:', res.body);

  //   expect(res.status).toBe(200);
  //   expect(res.body.post.title).toBe(updatedBlogData.title);
  //   expect(res.body.post.Discription).toBe(updatedBlogData.Discription);
  // });

  // it('should delete a blog post', async () => {
  //   const res = await request(app)
  //     .delete(`/blogs/${blogId}`)
  //     .set('Authorization', `Bearer ${authToken}`);

  //   console.log('Delete Blog Response:', res.body);

  //   expect(res.status).toBe(200);
  //   expect(res.body.message).toBe('Blog post deleted successfully');
  // });
});


export { app };
