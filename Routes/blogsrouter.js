import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import Post from '../Models/blogs.js';
import { authenticateJWT } from '../Controller/authtoken.js';
import { 
    createBlogs, 
    updateblogs, 
    deleteblogs, 
    getblogsById, 
    getAllblogs 
  } from '../controller/blogscontroller.js';
  

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
  }
});
const upload = multer({ storage: storage });

router.post('/',authenticateJWT,upload.single('image'), createBlogs);
router.put('/:id',authenticateJWT, updateblogs);
router.delete('/:id',authenticateJWT, deleteblogs);
router.get('/:id', getblogsById);

router.get('', getAllblogs);


export default router;
