const request = require('supertest');
const expect = require('expect');

const app = require('./server').app;

describe('routes', ()=> {
  describe('pages', () => {
    describe('GET', () => {
      it('/', (done)=>{
        request(app)
          .get('/')
          .expect(200)
          .expect('Hello express')
          .end(done);
      });

      it('/about', (done)=>{
        request(app)
          .get('/about')
          .expect(200)
          .end(done);
      });
    });
  });
  describe('api', () => {
    describe('GET', ()=> {
      it('/api', (done)=>{
        request(app)
          .get('/api')
          .expect(200)
          .expect((res)=>{
            expect(res.body).toInclude({
              api: true,
              author: "Maurizio Brioschi"
            }).toIncludeKey('version');
          })
          .end(done);
      });
    });
  });
});
