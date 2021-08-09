const NodeGeocoder = require('node-geocoder');

const options = {
  provider: process.env.GEO_CODE_PROVIDER,

  // Optional depending on the providers
  httpAdapter: 'http',
  apiKey: process.env.GEO_API_KEY,
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
