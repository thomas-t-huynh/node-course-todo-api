const MongoClient = require('mongodb').MongoClient;

let user = { name: 'tom' , age: 25 };

let { name } = user;

console.log(name);

MongoClient.connect( 'mongodb://localhost:27017/TodoApp' , ( err , db ) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'stuff',
    //     completed: false
    // } , ( err , result ) => {
    //     if (err) {
    //         return console.log('Unable to insert Todos');
    //     }

    //     console.log(JSON.stringify(result.ops , undefined , 2));
    // });

    // db.collection('Users').insertOne({
        
    //     name: 'tom',
    //     age: 25,
    //     location: 'irvine'
    // } , ( err , result ) => {
    //     if (err) {
    //         return console.log('collection not inserted' , err);
    //     };

    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    db.close();
});