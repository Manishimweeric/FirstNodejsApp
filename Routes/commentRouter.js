import express from 'express';
import { createComment, getComments, getCommentById, getCommentsForBlog} from '../Controller/commentController.js';

import { authenticateJWT } from '../Controller/authtoken.js';

const router = express.Router();

router.post('/:blogs_id/comments', authenticateJWT, createComment);
router.get('/comments', getComments); 
router.get('/comments/:id', getCommentById); 
router.get('/:blogs_id/comments', getCommentsForBlog);

export default router;
