const express = require('express')
const reverseGeocode = require('../utils/reverseGeocode')

const router = express.Router()

// GET /api/geocode/reverse?lat=..&lon=..
// Returns a small address object derived from OSM Nominatim reverse geocoding.
router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query
  if (!lat || !lon) return res.status(400).json({ message: 'lat and lon are required' })

  const address = await reverseGeocode(lat, lon)
  return res.json({ address })
})

module.exports = router
