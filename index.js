import express from 'express';
import mongoose from 'mongoose'; 
import Blogs from './Models/blogs.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const app = express();


//this db am using 
const mongoURI = 'mongodb://localhost:27017/Nodejs_db';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Configure multer
const storage = multer.memoryStorage(); // Use memoryStorage to store file data in memory
const upload = multer({ storage });

// POST endpoint to create a new blog with a photo
app.post('/blogs', upload.single('photo'), async (req, res) => {
  try {
    const { Tittle, publisher } = req.body;
    const photo = req.file ? {
      data: req.file.buffer, 
      contentType: req.file.mimetype
    } : null;

    const blog = new Blogs({
      Tittle,
      publisher,
      Date: new Date(), 
      photo
    });

    const savedBlog = await blog.save();
    res.json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//To desply data of blogs
app.get('/Blogs', async (req, res) => {
  try {
    const blogs = await Blogs.find(); 
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//to update the blog

app.put('/Blogs/:id', upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }
    if (req.file) {
      updatedData.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    const blog = await Blogs.findByIdAndUpdate(id, updatedData, { new: true });

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE endpoint to remove a user by ID
app.delete('/Blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Blogs.findByIdAndDelete(id);

    if (user) {
      res.json({ message: 'User successfully deleted', Blogs });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
