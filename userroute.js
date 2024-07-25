import User from './Models/User.js';
import express from 'express';
const users= express.Router();

 // to insert a new user
 router.post("/user", async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password : req.body.password,
    })
    await user.save()
    res.send(user)
})

export default users;