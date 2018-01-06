let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();

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

app.listen(3000, () => {
    console.log('started on port 3000');
})


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


