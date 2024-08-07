import Post from '../Models/blogs.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to create a blog post and upload an image
export const createBlogs = async (req, res) => {
  if (!req.body.title || !req.body.publisher || !req.body.Discription) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const post = new Post({
      title: req.body.title,
      publisher: req.body.publisher,
      Discription: req.body.Discription,
    });

    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Posts"
      });

      // Attach image details to post
      post.image = result.secure_url;
      post.public_id = result.public_id;

      // Remove the temporary file
      await fs.unlink(req.file.path);
    }

    await post.save();

    res.status(201).json({
      message: 'Blog post created successfully',
      post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to update a blog post
export const updateblogs = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (req.body.title) {
      post.title = req.body.title;
    }
    if (req.body.publisher) {
      post.publisher = req.body.publisher;
    }
    if (req.body.Discription) {
      post.Discription = req.body.Discription;
    }
    await post.save();
    res.send(post);
  } catch {
    res.status(404).send({ error: "Blogs doesn't exist!" });
  }
};

// Function to delete a blog post
export const deleteblogs = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404).send({ error: "Post doesn't exist!" });
  }
};

// Function to get a blog post by ID
export const getblogsById = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  res.send(post);
};

// Function to get all blog posts
export const getAllblogs = async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
};
