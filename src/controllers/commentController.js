const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const { potholeId, text } = req.body;
    if (!potholeId || !text) return res.status(400).json({ message: 'Missing fields' });

    const comment = await Comment.create({ potholeId, text, userId: req.user.id });
    res.json({ comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listComments = async (req, res) => {
  try {
    const { potholeId } = req.params;
    const comments = await Comment.find({ potholeId }).sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
