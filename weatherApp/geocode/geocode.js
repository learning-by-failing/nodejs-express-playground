const axios = require('axios');

var geocodeAddress = (address) =>  {
  let encodedAddress = encodeURI(address);
  let uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
  return axios.get(uri);
}

module.exports = {
  getAddress: geocodeAddress
}
