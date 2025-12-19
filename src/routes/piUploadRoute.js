const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Pothole = require('../models/Pothole');
const axios = require('axios'); // reverse geocoding

// Memory storage for Pi upload
const upload = multer({ storage: multer.memoryStorage() });

async function getAddressFromCoords(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'PatchPoint/1.0 Student Project' }
    });

    const data = res.data || {};

    // Prefer display_name when present, else build a small human-readable fallback
    if (data.display_name) return data.display_name;

    const addr = data.address || {};
    const parts = [];
    if (addr.road) parts.push(addr.road);
    if (addr.suburb) parts.push(addr.suburb);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.postcode) parts.push(addr.postcode);

    if (parts.length > 0) return parts.join(', ');

    // Final fallback: coords string
    return `${lat}, ${lon}`;
  } catch (err) {
    console.log('Reverse geocoding failed:', err.message);
    return `${lat}, ${lon}`;
  }
}

// POST /api/potholes/pi-upload
router.post('/pi-upload', upload.single('image'), async (req, res) => {
  try {
    const { lat, lon, depth, timestamp } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });

    // Validate GPS coordinates
    const gpsLat = parseFloat(lat);
    const gpsLon = parseFloat(lon);
    if (!isFinite(gpsLat) || !isFinite(gpsLon)) {
      console.error('Invalid GPS coords received:', lat, lon);
      return res.status(400).json({ success: false, message: 'Invalid GPS coordinates' });
    }

    const address = await getAddressFromCoords(gpsLat, gpsLon);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'patchpoint/pi' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, message: 'Image upload failed', error });
        }

        // Normalize timestamp - store a proper Date object
        let ts = timestamp ? new Date(timestamp) : new Date();
        if (isNaN(ts.getTime())) ts = new Date();

        const pothole = new Pothole({
          imageUrl: result.secure_url,
          gpsLat,
          gpsLon,
          depthCm: depth ? parseFloat(depth) : undefined,
          address: address || null,
          timestamp: ts
        });

        await pothole.save();
        return res.json({ success: true, pothole });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
