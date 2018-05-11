const axios = require('axios');

var getForecast = (apiKey, latitude, longitude) => {
  let uri = `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}`;
  return axios.get(uri);
};

module.exports = {
  getForecast
}
