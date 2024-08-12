import express from 'express';
import mongoose from 'mongoose';
import blogRouter from './Routes/blogsrouter.js';
import userRouter from './Routes/userRouter.js';
import likeRouter from './Routes/likeRouter.js';
import commentRouter from './Routes/commentRouter.js';
import passport from 'passport';
import protectedRoutes from './Routes/protected.js';
import passportConfig from './passport.js'; 
   
    
    const app = express()
    app.use(express.json());

    passportConfig(passport);
    app.use(passport.initialize());


    app.use("/blogs",blogRouter);
    app.use('/user', userRouter);
    app.use('/blogs', likeRouter);
    app.use('/blogs', commentRouter);
    app.use('/protected', protectedRoutes);

const start = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/Nodejs_db');
      app.listen(3000, () => console.log('Server running on port 3000'));
    } catch (err) {
      console.error(err);
    }
  };


  start();