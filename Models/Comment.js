import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  blogs_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blogs',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const comment = mongoose.model('comment', commentSchema);

export default comment;