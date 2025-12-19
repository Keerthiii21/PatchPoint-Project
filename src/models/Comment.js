const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  potholeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pothole', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
