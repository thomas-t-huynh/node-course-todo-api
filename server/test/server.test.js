const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('./../server');
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
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should return a 404 if todo is not found', (done) => {
        request(app)
            .get(`/todos/${invalidID}`)
            .expect(404)
            .end(done);

    });

    it('should return 404 for non-object ids' , (done) => {
        request(app)
            .get(`/todos/${nonObjectID}`)
            .expect(404)
            .end(done);
    })
});

describe('DELETE /todos/:id' , () => {
    it('should remove a todo' , (done) => {
        let hexId = todos[1]._id.toHexString();
        
        request(app)
            .delete(`/todos/${hexId}`)
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

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${invalidID}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/${nonObjectID}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos:/id', () => {
    let hexId = todos[1]._id.toHexString();
    it('should update the todo' , (done) => {
        
        request(app)
            .patch(`/todos/${hexId}`)
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
            .send({ text: 'NOT FINISHED YET' , completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
                expect(res.body.todo.text).toBe('NOT FINISHED YET');
            }).end(done);

    })
})