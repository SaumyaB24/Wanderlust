// utils/geocode.js

const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "opencage",
  apiKey: process.env.OPENCAGE_API_KEY, // make sure this is set in .env
});

const geocodeAddress = async (address) => {
  try {
    const res = await geocoder.geocode(address);
    if (res && res.length > 0) {
      return {
        lat: res[0].latitude,
        lon: res[0].longitude,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("❌ Geocoding error:", err);
    return null;
  }
};

module.exports = geocodeAddress;
