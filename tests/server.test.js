const request = require('supertest');
const expect = require('expect');

const app = require('./../server/server').app;
const {Todo} = require('./../server/db/mongoose/models/Todo');

beforeEach((done) => {
  Todo.remove({}).then(()=>done());
});

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

    describe('POST', () => {
      it('/api/todo', (done)=>{
        request(app)
          .post('/api/todo')
          .send({"text":"one todo"})
          .expect(201)
          .expect((res)=>{
            expect(res.body).toInclude({
              text: "one todo",
              completed: false,
              completedAt: null
            });
          }).end((err, res) => {
            if(err){
              return done(err);
            }
            Todo.findOne({_id: res.body._id}).then((todo)=>{
              expect(todo.text).toBe("one todo");
              expect(todo.completed).toBe(false);
              expect(todo.completedAt).toBe(null);
              done();
            }).catch((e)=> done(e));
          });
      });
      it('/api/todo with invalid data', (done) => {
        request(app)
          .post('/api/todo')
          .send({})
          .expect(400)
          .end((err, res) => {
            if(err) {
              return done(err);
            }
            Todo.find({}).then((todos)=>{
              expect(todos.length).toBe(0);
              done();
            }).catch((e)=>done(e));
          });
      });
    });
  });
});
