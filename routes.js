import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import Post from './Models/blogs.js';

import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Adjust path as necessary
const router= express.Router();
const app = express();
/// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage}).single('image');
  

    router.post('/blogs/:id/image', upload, async (req, res) => {
        if (req.file === undefined) {
          return res.status(400).json({ err: 'Please select an image' });
        }
      
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Posts"
          });
      
          const post = await Post.findById(req.params.id);
          
          if (!post) {
            return res.status(404).json({ message: 'Post not found' });
          }
      
          post.image = result.secure_url;
          post.public_id = result.public_id;
          await post.save();
      
          await fs.unlink(req.file.path);
      
          return res.status(200).json({
            message: 'Image uploaded successfully',
            id: post._id,
            image: post.image
          });
        }        catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
      });

 // to insert a new post
 router.post("/blogs", async (req, res) => {
    const post = new Post({
        title: req.body.title,
        publisher: req.body.publisher,
        Discription : req.body.Discription,
    })
    await post.save()
    res.send(post)
})
/////update
router.patch("/blogs/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })

        if (req.body.title) {
            post.title = req.body.title
        }
        if (req.body.publisher) {
            post.publisher = req.body.publisher
        }
        if (req.body.Discription) {
            post.Discription = req.body.Discription
        }
        await post.save()
        res.send(post)
    } catch {
        res.status(404)
        res.send({ error: "Blogs doesn't exist!" })
    }
})

////delete
router.delete("/blogs/:id", async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Post doesn't exist!" })
    }
})

/////////////Searching 
router.get("/blogs/:id", async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id })
    res.send(post)
})
//////get alll brogs
router.get("/blogs", async (req, res) => {
    const posts = await Post.find()
    res.send(posts)
})
export default router;
