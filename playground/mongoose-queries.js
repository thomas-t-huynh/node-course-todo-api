const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5a5027bfd297041435333b68';

if (!ObjectID.isValid(id)) {
    console.log('ID is invalid');
}
// let id = '5a504731ec377ca83dc73257';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     completed: false
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findById(
//     id
// ).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('The todo' , todo);
// }).catch((e) => {
//     console.log(e);
// });

User.findById(
    id
).then((user) => {
    console.log('Found user' , user);
}).catch((e) => {
    console.log(e);
})