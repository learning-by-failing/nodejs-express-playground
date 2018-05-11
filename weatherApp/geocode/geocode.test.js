const expect = require('expect');
const geocode = require('./geocode.js');
it('geocodeAddress works', ()=>{
  let result = geocode.getAddress('20060 italy');
  expect(result).toBeA('object');
});
