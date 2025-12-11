const axios = require("axios");
const Pothole = require("../models/Pothole");

exports.createFromPi = async (req, res) => {
  try {
    const { gps_lat, gps_lon, lidar_cm, image, timestamp } = req.body;

    if (!gps_lat || !gps_lon) {
      return res.status(400).json({ success: false, message: "Missing GPS" });
    }

    // ---- FIX TIMESTAMP (Convert to local IST) ----
    const ts = timestamp ? new Date(timestamp) : new Date();
    const localTimestamp = ts.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

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
      gpsLat: gps_lat,
      gpsLon: gps_lon,
      depthCm: lidar_cm,
      address,
      timestamp: localTimestamp,
      imageUrl: image || null
    });

    return res.json({ success: true, pothole });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
