import Comment from '../Models/Comment.js';

export const createComment = async (req, res) => {
  if (!req.body.blogs_id || req.body.comment === undefined || !req.body.user_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const user_id = req.user._id;
  try {
    const comment = new Comment({
      blogs_id: req.body.blogs_id,
      comment: req.body.comment,
      user_id: user_id,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.send(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.send(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
