require('./config/config');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');
let { authenticate } = require('./middleware/authenticate');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

let app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos' , (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req , res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    } , (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', ( req , res ) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if (todo) {
            res.status(200).send({todo});
        } else {
            res.status(404).send();
        }
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', ( req , res ) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send({todo});

    }).catch((e) => {
        res.status(400).send();
    });

});

app.patch('/todos/:id', (req , res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text' , 'completed']);

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});

    }).catch((e) => {
        res.status(400).send();
    }); 
    
});

app.post('/users', (req, res) => {
    
    
    let body = _.pick(req.body, [ "email" , "password" ]);
    
    let user = new User (body);


    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });

});


app.get('/users/me', authenticate , (req , res) => {

    res.send(req.user);

});

app.post('/users/login', (req , res) => {

    let body = _.pick(req.body, [ "email" , "password" ]);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token ) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    })

});

app.listen(port, () => {
    console.log(`started on ${port}`);
});



// let newTodo = new Todo({
//     text: 'Cook Ramen'
// });

// let newTwodo = new Todo({
//         text: 'Go to work!'
// });

// let newUser = new User({
//     email: 'soaptubby@yahoo.com'
// })

// newTwodo.save().then(( doc ) => {
//     console.log('Saved!' , doc);

// } , (e) => {
//     console.log('no working');
// })

// newUser.save().then(( doc ) => {
//     console.log('Saved!' , doc);

// } , (e) => {
//     console.log('no working');
// })
// newTodo.save().then(( doc ) => {
//     console.log('Saved todo' , doc);
// } , (e) => {
//     console.log('Unable to save todo')
// })

module.exports = {app};