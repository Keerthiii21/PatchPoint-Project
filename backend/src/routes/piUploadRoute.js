const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Pothole = require('../models/Pothole');

// Use memory storage so we can stream buffer to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/potholes/pi-upload
router.post('/pi-upload', upload.single('image'), async (req, res) => {
  try {
    const { lat, lon, depth, timestamp } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });

    // Upload image buffer to Cloudinary via upload_stream
    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'patchpoint/pi' }, async (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ success: false, message: 'Image upload failed', error });
      }

      // Create pothole record
      const pothole = new Pothole({
        imageUrl: result.secure_url,
        gpsLat: parseFloat(lat) || 0,
        gpsLon: parseFloat(lon) || 0,
        depthCm: depth ? parseFloat(depth) : undefined,
        timestamp: timestamp ? new Date(parseInt(timestamp)) : new Date()
      });

      await pothole.save();

      return res.json({ success: true, pothole });
    });

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
