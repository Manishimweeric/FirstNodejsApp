import express from 'express';
import { createUser, getUsers,login } from '../Controller/userController.js';
import { validateINPUT } from '../Controller/validateiniput.js';

const router = express.Router();

router.post('/usersignup',validateINPUT, createUser);
router.get('/', getUsers);
router.get('/userlogin',validateINPUT, login);

//User route

export default router;
