import Likes from '../Models/Likes.js';

export const toggleLike = async (req, res) => {
  const user_id = req.user._id;
  if (!req.body.blogs_id || req.body.like === undefined || !user_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingLike = await Likes.findOne({ blogs_id: req.body.blogs_id, user_id: user_id });

    if (existingLike) {
      await Likes.deleteOne({ _id: existingLike._id });
      res.send({ message: 'Like removed', like: existingLike });
    } else {
      const newLike = new Likes({
        blogs_id: req.body.blogs_id,
        like: req.body.like,
        user_id: user_id,
      });

      await newLike.save();
      res.send({ message: 'Like added', like: newLike });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).send({ error: 'Error toggling like' });
  }
};

export const getLikes = async (req, res) => {
  try {
    const likes = await Likes.find();
    res.send(likes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLikeById = async (req, res) => {
  try {
    const like = await Likes.findOne({ _id: req.params.id });

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    res.send(like);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
