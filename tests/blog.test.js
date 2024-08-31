// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import request from 'supertest';
// import { app } from '../index.js';
// import path from 'path';
// import fs from 'fs';

// describe('Blog Post API', () => {
//   let mongoServer;

//   beforeAll(async () => {
//     if (mongoose.connection.readyState !== 0) {
//       await mongoose.disconnect();
//     }

//     mongoServer = await MongoMemoryServer.create();
//     const mongoUri = mongoServer.getUri();
//     await mongoose.connect(mongoUri);
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

//   it('should create a new blog post with an image', async () => {
//     const blogData = {
//       title: 'Sample Blog Post',
//       publisher: 'Test Publisher',
//       Discription: 'This is a sample blog post description.',
//     };

//     const imagePath = 'D:\\THINGS\\Doc.!@\\image.jpg';

//     if (!fs.existsSync(imagePath)) {
//       fs.writeFileSync(imagePath, 'dummy image content');
//     }

//     const res = await request(app)
//       .post('/blogs')
//       .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2UyNjZhMTdmYjZlYzk3MWUzMjQ0MyIsImlhdCI6MTcyNTAxMzE4NSwiZXhwIjoxNzI1MDIwMzg1fQ.bXaOWTP2zawT26Oi6ZEeRyNrZTxkly0_bXTC614sTGs')  
//       .field('title', blogData.title)
//       .field('publisher', blogData.publisher)
//       .field('Discription', blogData.Discription)
//       .attach('image', imagePath);

//     expect(res.status).toBe(201);
//     expect(res.body.post).toHaveProperty('_id');
//     expect(res.body.post).toHaveProperty('image');

//     fs.unlinkSync(imagePath);
//   });

//   it('should return all blog posts', async () => {
//     const res = await request(app)
//       .get('/blogs')
//       .send();

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });
// });

import request from 'supertest';
import { app } from '../index.js'; 
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Blog Post API', () => {
  let mongoServer;
  let server;
  let authToken;
  let blogId; 

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    process.env.JWT_SECRET = 'testsecret'; 

    // Generate a valid auth token
    const payload = { id: new mongoose.Types.ObjectId().toString() };
    authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated Token:', authToken);

    server = app.listen(0, () => console.log(`Test server running on port ${server.address().port}`));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    if (server) {
      server.close();
    }
  });

  it('should create a new blog post with an image', async () => {
    const blogData = {
      title: 'Sample Blog Post',
      publisher: 'Test Publisher',
      Discription: 'This is a sample blog post description.',
    };

    const res = await request(app)
      .post('/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .field('title', blogData.title)
      .field('publisher', blogData.publisher)
      .field('Discription', blogData.Discription)
      .attach('image', Buffer.from('dummy image content'), 'hhhh.jpg');

    console.log('Create Blog Response:', res.body); 

    expect(res.status).toBe(201);
    expect(res.body.post).toHaveProperty('_id');
    expect(res.body.post).toHaveProperty('image');

    blogId = res.body.post._id;
  });

  it('should get all blog posts', async () => {
    const res = await request(app)
      .get('/blogs')
      .set('Authorization', `Bearer ${authToken}`);

    console.log('Get All Blogs Response:', res.body);

    expect(res.status).toBe(200);
    expect(res.body.posts).toBeInstanceOf(Array);
    expect(res.body.posts.length).toBeGreaterThan(0);
  });

  it('should update an existing blog post', async () => {
    const updatedBlogData = {
      title: 'Updated Blog Post Title',
      Discription: 'Updated blog post description.',
    };

    const res = await request(app)
      .put(`/blogs/${blogId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedBlogData);

    console.log('Update Blog Response:', res.body);

    expect(res.status).toBe(200);
    expect(res.body.post.title).toBe(updatedBlogData.title);
    expect(res.body.post.Discription).toBe(updatedBlogData.Discription);
  });

  it('should delete a blog post', async () => {
    const res = await request(app)
      .delete(`/blogs/${blogId}`)
      .set('Authorization', `Bearer ${authToken}`);

    console.log('Delete Blog Response:', res.body);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Blog post deleted successfully');

  });
});
