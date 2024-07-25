import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    blogs_id: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  });

const comment = mongoose.model('comment', BlogsSchema);

export default comment;