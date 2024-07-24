import mongoose from 'mongoose';

const BlogsSchema = new mongoose.Schema({
  Tittle: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
    unique: true,
  },
  Date: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String
  }
});

const Blogs = mongoose.model('Blogs', BlogsSchema);

export default Blogs;
