const mongoose = require('mongoose');

const PotholeSchema = new mongoose.Schema({
  imageUrl: { type: String },
  gpsLat: { type: Number, required: true },
  gpsLon: { type: Number, required: true },
  depthCm: { type: Number },
  address: { type: String },
  timestamp: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Pothole', PotholeSchema);
