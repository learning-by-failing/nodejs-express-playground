const request = require('supertest');
const app = require('./server').app;

it('route(/) return Hello express', (done)=>{
  request(app)
    .get('/')
    .expect('Hello express')
    .end(done);
});
