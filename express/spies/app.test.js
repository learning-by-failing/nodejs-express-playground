const expect = require('expect');
const rewire = require('rewire');

var app = rewire('./app');

describe('App', ()=>{
  var db = {
    saveUser: expect.createSpy()
  };
  app.__set__('db', db);

  it('should call the spy correctly', ()=>{
    var spy = expect.createSpy();
    spy();
    expect(spy).toHaveBeenCalled();
  });

  it('It should call saveUser with user object', ()=>{
      let user = {
        name: "Pippo",
        surname: "Baudo"
      }

      app.logUser(user);
      expect(db.saveUser).toHaveBeenCalledWith(user);
  });
});
