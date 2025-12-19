const axios = require("axios");
const Pothole = require("../models/Pothole");

exports.createFromPi = async (req, res) => {
  try {
    const { gps_lat, gps_lon, lidar_cm, image, timestamp } = req.body;

    const gpsLat = Number(gps_lat);
    const gpsLon = Number(gps_lon);
    if (!isFinite(gpsLat) || !isFinite(gpsLon)) {
      return res.status(400).json({ success: false, message: "Missing or invalid GPS" });
    }

    // ---- TIMESTAMP: parse and store a Date object (keep DB as UTC-based Date) ----
    let ts = timestamp ? new Date(timestamp) : new Date();
    if (isNaN(ts.getTime())) ts = new Date();

    // ---- REVERSE GEOCODING ----
    const geoURL = `https://nominatim.openstreetmap.org/reverse?lat=${gps_lat}&lon=${gps_lon}&format=json`;

    let address = null;
    try {
      const geo = await axios.get(geoURL, {
        headers: { "User-Agent": "PatchPoint/1.0" }
      });
      address = geo.data?.display_name || null;
    } catch (e) {
      console.log("Reverse geocoding failed:", e.message);
    }

    // ---- SAVE TO DATABASE ----
    const pothole = await Pothole.create({
      gpsLat: gpsLat,
      gpsLon: gpsLon,
      depthCm: lidar_cm !== undefined ? Number(lidar_cm) : undefined,
      address: address || null,
      timestamp: ts,
      imageUrl: image || null
    });

    return res.json({ success: true, pothole });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create pothole via UI (authenticated)
exports.createPothole = async (req, res) => {
  try {
    const { gpsLat, gpsLon, depthCm, address, imageUrl } = req.body;
    if (gpsLat === undefined || gpsLon === undefined) {
      return res.status(400).json({ success: false, message: "Missing GPS coordinates" });
    }

    const pothole = await Pothole.create({
      gpsLat: Number(gpsLat),
      gpsLon: Number(gpsLon),
      depthCm: depthCm !== undefined ? Number(depthCm) : undefined,
      address: address || null,
      imageUrl: imageUrl || null,
      createdBy: req.user ? req.user.id : undefined
    });

    return res.json({ success: true, pothole });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// List potholes
exports.listPotholes = async (req, res) => {
  try {
    let potholes = await Pothole.find().sort({ timestamp: -1 });

    // Sanitize legacy placeholder values (e.g., '-' saved previously) so UI shows an empty value
    potholes = potholes.map(ph => {
      const obj = ph.toObject ? ph.toObject() : ph;
      if (obj.address === '-') obj.address = null;
      return obj;
    });

    return res.json({ success: true, potholes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single pothole
exports.getPothole = async (req, res) => {
  try {
    const { id } = req.params;
    const pothole = await Pothole.findById(id);
    if (!pothole) return res.status(404).json({ success: false, message: "Pothole not found" });
    return res.json({ success: true, pothole });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};