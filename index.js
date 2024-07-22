import express from 'express';
import mongoose from 'mongoose'; // Import the User model

const app = express();
app.use(express.json()); // For parsing application/json

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/Nodejs_db';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const usertb={
    name:String,
    email: String,
    password: String,
}

app.post('/users', async (req, res) => {
        const data = new User({
          name:req.body.name,
          email:req.body.email,
          password:req.body.password
     }); 
     
     const val=await data.save();
     res.json(val);
    })

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
