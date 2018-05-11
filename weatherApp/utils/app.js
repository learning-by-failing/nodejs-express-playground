const yargs = require('yargs');

const geocode = require('./geocode/geocode.js');
const forecast = require('./forecast/forecast.js');

const argv = yargs.options({
  a: {
      demand: true,
      alias: 'address',
      describe: 'address to fetch weather for',
      string: true
    }
})
.help()
.argv;


geocode.getAddress(argv.a).then((response)=>{
  let firstAddress = response.data.results[0];
  console.log(`Formatted address: ${firstAddress.formatted_address}`);
  console.log(`Latitude: ${firstAddress.geometry.location.lat}`);
  console.log(`Longitude: ${firstAddress.geometry.location.lng}`);
  return forecast.getForecast(
    '8e260840b0d0e1d672be6c75edd0f8aa',
    firstAddress.geometry.location.lat,
    firstAddress.geometry.location.lng);
}).then((responseForecast)=>{
  let currentlyWeather = JSON.stringify(responseForecast.data.currently, undefined, 2);
  console.log(`Weather: ${currentlyWeather}`);
}).catch((error)=>{
  console.log(error);
});
