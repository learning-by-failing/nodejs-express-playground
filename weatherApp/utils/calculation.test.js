const calculation = require('./calculation.js');
const expect = require('expect');

it('should add two numbers', ()=>{
    let res = calculation.somma(2, 6);
    expect(res).toBe(8).toBeA('number');
});
