import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js'; 
// import user from './userroute.js'; 

mongoose
        .connect("mongodb://localhost:27017/Nodejs_db")
        .then(()=>{
    
    const app = express()
    app.use(express.json());
    app.use("/",routes)
    // app.use("/",user)
    
    app.listen(3000, () => {
        console.log("Server has started 3000!")
    })
})