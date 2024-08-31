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
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../index.js';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

describe('Blog Post API', () => {
  let mongoServer;
  let server;
  let authToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Generate a valid auth token
    const payload = { id: new mongoose.Types.ObjectId().toString() };
    authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Start the server
    server = app.listen(4000, () => console.log('Test server running on port 4000'));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    server.close(); // Stop the server after all tests are done
  });

  it('should create a new blog post with an image', async () => {
    const blogData = {
      title: 'Sample Blog Post',
      publisher: 'Test Publisher',
      Discription: 'This is a sample blog post description.',
    };

    // Use the absolute path directly
    const imagePath = 'D:\\THINGS\\Doc.!@\\image.jpg';
    fs.writeFileSync(imagePath, 'dummy image content');

    const res = await request(app)
      .post('/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .field('title', blogData.title)
      .field('publisher', blogData.publisher)
      .field('Discription', blogData.Discription)
      .attach('image', imagePath);

    expect(res.status).toBe(201);
    expect(res.body.post).toHaveProperty('_id');
    expect(res.body.post).toHaveProperty('image');

    fs.unlinkSync(imagePath);
  });
});
