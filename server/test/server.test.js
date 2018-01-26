const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { User } = require('./../models/user');
const { Todo } = require('./../models/todo');
const {todos, populateTodos, populateUsers, users} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

const invalidID =  new ObjectID();

const nonObjectID =  'kj3k2j32k'



describe('POST /todos' , () => {
    it('should create a new todo', (done) => {
        let text = 'a testing string!';
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text) .toBe(text);
            })
            .end((err , res ) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not create a new todo with invalid body data' , ( done ) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end(( err , res ) => {
                if (err) {
                    return done(err);
                }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not return a todo doc created by another user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should return a 404 if todo is not found', (done) => {
        request(app)
            .get(`/todos/${invalidID}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('should return 404 for non-object ids' , (done) => {
        request(app)
            .get(`/todos/${nonObjectID}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
});

describe('DELETE /todos/:id' , () => {

    it('should remove a todo' , (done) => {
        let hexId = todos[1]._id.toHexString();
        
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err , res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todos) => {
                    expect(null).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it('should not remove a todo if not the right user' , (done) => {
        let hexId = todos[0]._id.toHexString();
        
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err , res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todos) => {
                    expect(todos).toExist();
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${invalidID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/${nonObjectID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos:/id', () => {
    let hexId = todos[1]._id.toHexString();
    it('should update the todo' , (done) => {
        
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ text: 'donezos' , completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
                expect(res.body.todo.text).toBe('donezos');
            })
            .end(done);
    })

    it('should clear completedAt when todo is not completed' , (done) => {
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ text: 'NOT FINISHED YET' , completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
                expect(res.body.todo.text).toBe('NOT FINISHED YET');
            }).end(done);

    });

    it('should not update todo if not the right user' , (done) => {
        
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({ text: 'donezos' , completed: true })
            .expect(404)
            .end(done);
    })
});

describe('GET /users/me', () => {
    it ('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);

            }).end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            }).end(done);
    });
});

describe('POST /users', () => {

    it('should create a user', (done) => {
        let email = 'example@sample.com';
        let password = '123baby';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toExist();
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({ email: 'not right', password: 'totallyInvalid' })
            .expect(400)
            .end(done);
    });

    it('should not create a user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({ email: users[1].email , password: users[1].password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send( {email: users[1].email , password: users[1].password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                
            })
            .end((err , res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send( {email: users[1].email , password: 'invalidPw'})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err , res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toEqual(1);
                    done();
                }).catch((e) => done(e));
                
            });
    });
})

describe('DELETE /users/me/token', () => {
    it ('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err , res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });

    });
});