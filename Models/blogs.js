import mongoose from 'mongoose';

const BlogsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
    unique: true,
  },
  Discription: {
    type: String,
    required: true,
    unique: true,
  },
  Date: {
    type: Date,
    default :Date.now,
  },
  public_id: {
    type: String,
  },
  image: {
    type: String,
  }
});

const Blogs = mongoose.model('Blogs', BlogsSchema);

export default Blogs;
