import express from 'express';
import { toggleLike, getLikes, getLikeById, getlikeForBlog } from '../Controller/likecontrollers.js';
import { authenticateJWT } from '../Controller/authtoken.js';


const router = express.Router();

router.post('/:blogs_id/likes', authenticateJWT,toggleLike);
router.get('/like', getLikes);
router.get('/like/:id', getLikeById);
router.get('/:blogs_id/likes', getlikeForBlog);
export default router; 
