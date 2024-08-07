import express from 'express';
import { createComment, getComments, getCommentById } from '../Controller/commentController.js';

import { authenticateJWT } from '../Controller/authtoken.js';

const router = express.Router();

router.post('/', authenticateJWT, createComment);
router.get('/', getComments);
router.get('/:id', getCommentById);

export default router;
