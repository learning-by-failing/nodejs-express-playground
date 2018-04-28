const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const app = require('./../server/server').app;
const {Todo} = require('./../server/db/mongoose/models/Todo');
const {User} = require('./../server/db/mongoose/models/User');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => {
    return User.remove({});
  }).then(()=>done());
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

      describe('/api/todo/:id', () => {
        it('should return todo doc', (done) => {
          request(app)
            .get(`/api/todo/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
              expect(res.body.text).toBe(todos[0].text);
            })
            .end(done);
        });
      });

        it('/api/todos/:id should return 404 if todo not found', (done) => {
          var hexId = new ObjectID().toHexString();

          request(app)
            .get(`/api/todo/${hexId}`)
            .expect(404)
            .end(done);
        });

        it('/api/todo/:id should return 404 for non-object ids', (done) => {
          request(app)
            .get('/api/todo/123abc')
            .expect(404)
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
              expect(todos.length).toBe(2);
              done();
            }).catch((e)=>done(e));
          });
      });

      it('/api/user', (done)=>{
        request(app)
          .post('/api/user')
          .send({email: "mauri@ciao.it", password: "123456"})
          .expect(201)
          .expect((res)=>{
            expect(res.body).toInclude({
              email: "mauri@ciao.it",
              password: "123456"
            }).toIncludeKey("tokens");
          }).end((err, res) => {
            if(err){
              return done(err);
            }
            User.findOne({email: "mauri@ciao.it"}).then((user)=>{
              expect(user.password).toBe("123456");
              done();
            }).catch((e)=> done(e));
          });
      });
    });
  });
});
