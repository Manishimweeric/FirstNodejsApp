import mongoose from 'mongoose';

const BlogsSchema = new mongoose.Schema({
  blogs_id: {
    type: String,
    required: true,
  },
  like: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

const Blogs = mongoose.model('Blogs', BlogsSchema);

export default Blogs;