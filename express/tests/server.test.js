const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
const {SHA256} = require('crypto-js');
var bcrypt = require('bcryptjs');

const app = require('../server/server').app;
const {Todo} = require('../server/db/mongoose/models/Todo');
const {User} = require('../server/db/mongoose/models/User');
const {todos,users,populateTodos,populateUsers} = require('./seeds/seeds');


beforeEach(populateUsers);
beforeEach(populateTodos);

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

        it('/api/user/me with valid token', (done) => {
          User.findById(users[0]._id).then((user)=>{
            request(app)
              .get('/api/user/me')
              .set('x-auth', user.tokens[0].token)
              .expect(200)
              .end(done);
          }).catch((e)=> done(e));;
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
            .send({email: "mauri@myemail.com" , password: "password!"})
            .expect(201)
            .expect((res)=>{
              expect(res.body).toInclude({
                email: "mauri@myemail.com"
              });
              expect(res.header).toIncludeKey('x-auth').toNotBe(null);
            }).end((err, res) => {
              if(err){
                return done(err);
              }
              User.findOne({email: "mauri@myemail.com"}).then((user)=>{
                bcrypt.compare("password!", user.password, (err, res) => {
                  expect(res).toBe(true);
                });
                done();
              }).catch((e)=> done(e));
            });
      });

      it('/api/user/login with correct values', (done)=>{
          request(app)
            .post('/api/user/login')
            .send({email: users[0].email , password: users[0].password})
            .expect(200)
            .expect((res)=>{
              expect(res.body).toInclude({
                email: users[0].email,
                _id: users[0]._id
              });
              expect(res.header).toIncludeKey("x-auth").toNotBe(null);
            }).end((err, res)=>{
              if(err){
                return done(err);
              }
              done();
            });
      });

      it('/api/user/login with wrong values', (done)=>{
        request(app)
          .post('/api/user/login')
          .send({email: 'aaaa@aaa.it' , password:'1234556'})
          .expect(400)
          .end((err, res)=>{
            if(err){
              return done(err);
            }
            done();
          });
      });
    });
    describe('DELETE', ()=>{
      it('/api/user/token with valid token', (done)=>{
        User.findById(users[0]._id).then((user)=>{
          request(app)
          .delete('/api/user/token')
          .set('x-auth', user.tokens[0].token)
          .expect(200)
          .end(done);
        }).catch((e)=>done(e));
      });
      it('/api/user/token with invalid token', (done)=>{
        request(app)
        .delete('/api/user/token')
        .expect(401)
        .end(done);
      });
    });
  });
});
