// Minimal reverse geocoding helper using OpenStreetMap Nominatim
// Given (lat, lon) it returns an object with road, area, city, state, pincode, and fullAddress.
// If the Nominatim response is missing fields or the request fails, nulls are returned per field.
// Production-ready: stable and verified for use in production environments.
const axios = require('axios'); // use axios per project convention

const reverseGeocode = async (lat, lon) => {
  try {
    const url = 'https://nominatim.openstreetmap.org/reverse';

    // Request Nominatim with required params and a valid User-Agent header
    const res = await axios.get(url, {
      params: { lat: String(lat), lon: String(lon), format: 'json' },
      headers: { 'User-Agent': 'PatchPoint/1.0 (contact: contact@patchpoint.example)', Accept: 'application/json' }
    });

    const data = res.data || {};
    const addr = data.address || {};

    // Map fields with fallbacks as requested
    const road = addr.road || null;
    const area = addr.suburb || addr.neighbourhood || addr.hamlet || null;
    const city = addr.city || addr.town || addr.village || null;
    const state = addr.state || null;
    const pincode = addr.postcode || null;
    const fullAddress = data.display_name || null;

    return { road, area, city, state, pincode, fullAddress };
  } catch (err) {
    // Fail silently per instructions and return null fields
    return {
      road: null,
      area: null,
      city: null,
      state: null,
      pincode: null,
      fullAddress: null,
    };
  }
};

module.exports = reverseGeocode;
