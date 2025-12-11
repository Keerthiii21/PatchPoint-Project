const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Pothole = require('../models/Pothole');
const axios = require('axios'); // ⭐ Needed for reverse geocoding

// Memory storage for Pi upload
const upload = multer({ storage: multer.memoryStorage() });

// ⭐ Reverse geocoding function
async function getAddressFromCoords(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await axios.get(url, {
      headers: { "User-Agent": "PatchPoint/1.0 (student project)" }
    });

    return res.data?.display_name || null;
  } catch (err) {
    console.log("Reverse geocoding failed:", err.message);
    return null;
  }
}

// -------------------------------------------------------------
// POST /api/potholes/pi-upload   <-- Pi sends: image + lat + lon + depth + timestamp
// -------------------------------------------------------------
router.post('/pi-upload', upload.single('image'), async (req, res) => {
  try {
    const { lat, lon, depth, timestamp } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    // ⭐ Get address from GPS
    const address = await getAddressFromCoords(lat, lon);

    // Upload image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'patchpoint/pi' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error
          });
        }

        // ⭐ Create pothole document
        const pothole = new Pothole({
          imageUrl: result.secure_url,
          gpsLat: parseFloat(lat) || 0,
          gpsLon: parseFloat(lon) || 0,
          depthCm: depth ? parseFloat(depth) : undefined,
          address: address || "-",  // ⭐ SAVE ADDRESS
          timestamp: timestamp ? new Date(timestamp) : new Date()
        });

        await pothole.save();

        return res.json({ success: true, pothole });
      }
    );

    // Pipe buffer → Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
