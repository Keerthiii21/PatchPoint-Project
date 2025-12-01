const Pothole = require('../models/Pothole');

exports.createPothole = async (req, res) => {
  try {
    const { gpsLat, gpsLon, depthCm, address, timestamp, imageUrl } = req.body;
    if (gpsLat == null || gpsLon == null) return res.status(400).json({ message: 'Missing coordinates' });

    const pothole = await Pothole.create({
      gpsLat,
      gpsLon,
      depthCm,
      address,
      timestamp: timestamp || Date.now(),
      imageUrl,
      createdBy: req.user ? req.user.id : undefined
    });
    res.json({ pothole });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listPotholes = async (req, res) => {
  try {
    const potholes = await Pothole.find().sort({ timestamp: -1 }).populate('createdBy', 'name email');
    res.json({ potholes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createFromPi = async (req, res) => {
  try {
    const { pothole_id, gps_lat, gps_lon, lidar_cm, image, timestamp } = req.body;
    const payload = {
      gpsLat: gps_lat,
      gpsLon: gps_lon,
      depthCm: lidar_cm,
      timestamp: timestamp || Date.now(),
    };
    if (image) payload.imageUrl = image;
    if (pothole_id) payload._id = pothole_id;

    const pothole = await Pothole.create(payload);
    res.json({ pothole });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPothole = async (req, res) => {
  try {
    const pothole = await Pothole.findById(req.params.id).populate('createdBy', 'name email');
    if (!pothole) return res.status(404).json({ message: 'Not found' });
    res.json({ pothole });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
