import mongoose from 'mongoose';

const LikesSchema = new mongoose.Schema({
  blogs_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blogs',
    required: true,
  },
  like: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
const likes = mongoose.model('Likes', LikesSchema);

export default likes;