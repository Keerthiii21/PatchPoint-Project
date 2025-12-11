const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Pothole = require('../models/Pothole');
const axios = require('axios');   // ⭐ Added for reverse geocoding

// Use memory storage so we can stream buffer to Cloudinary via upload_stream
const upload = multer({ storage: multer.memoryStorage() });

// ⭐ Reverse Geocoding Function
async function getAddressFromCoords(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'PatchPoint/1.0' }
    });

    return res.data?.display_name || null;
  } catch (err) {
    console.log("Reverse geocoding failed:", err.message);
    return null;
  }
}

// POST /api/potholes/pi-upload
router.post('/pi-upload', upload.single('image'), async (req, res) => {
  try {
    const { lat, lon, depth, timestamp } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    // ⭐ Step 1: Get address BEFORE saving pothole
    const address = await getAddressFromCoords(lat, lon);

    // Step 2: Upload image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'patchpoint/pi' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, message: 'Image upload failed' });
        }

        // Step 3: Save pothole to DB WITH address
        const pothole = new Pothole({
          imageUrl: result.secure_url,
          gpsLat: parseFloat(lat) || 0,
          gpsLon: parseFloat(lon) || 0,
          depthCm: depth ? parseFloat(depth) : undefined,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
          address: address || "-"   // ⭐ Added here
        });

        await pothole.save();
        return res.json({ success: true, pothole });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
