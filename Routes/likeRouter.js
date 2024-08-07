import express from 'express';
import { toggleLike, getLikes, getLikeById } from '../Controller/likecontrollers.js';
import { authenticateJWT } from '../Controller/authtoken.js';


const router = express.Router();

router.post('/', authenticateJWT,toggleLike);
router.get('/', getLikes);
router.get('/:id', getLikeById);

export default router; 
