const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Pothole = require('../models/Pothole');
const fetch = require('node-fetch'); // required for reverse geocoding

// Memory storage for Cloudinary upload
const upload = multer({ storage: multer.memoryStorage() });

/* ----------------------------------------
   REVERSE GEOCODING FUNCTION (NEW)
-----------------------------------------*/
async function getAddress(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    const response = await fetch(url, {
      headers: { "User-Agent": "PatchPoint-App" }
    });

    const data = await response.json();
    return data.display_name || "Unknown Address";
  } catch (err) {
    console.error("Reverse geocoding error:", err);
    return "Unknown Address";
  }
}

/* ----------------------------------------
   PI UPLOAD ROUTE
-----------------------------------------*/
router.post('/pi-upload', upload.single('image'), async (req, res) => {
  try {
    const { lat, lon, depth, timestamp } = req.body;

    if (!req.file)
      return res.status(400).json({ success: false, message: 'No image uploaded' });

    const gpsLat = parseFloat(lat) || 0;
    const gpsLon = parseFloat(lon) || 0;
    const depthCm = depth ? parseFloat(depth) : 0;

    /* ----------------------------------------
       1️⃣ GET ADDRESS FROM GPS COORDINATES
    -----------------------------------------*/
    const address = await getAddress(gpsLat, gpsLon);

    /* ----------------------------------------
       2️⃣ Upload to Cloudinary (same as before)
    -----------------------------------------*/
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'patchpoint/pi' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, message: 'Image upload failed', error });
        }

        /* ----------------------------------------
           3️⃣ Save pothole entry with address + time
        -----------------------------------------*/
        const pothole = new Pothole({
          imageUrl: result.secure_url,
          gpsLat,
          gpsLon,
          depthCm,
          address, // ⭐ NEW FIELD
          timestamp: timestamp ? new Date(timestamp) : new Date()
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
