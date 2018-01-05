const {MongoClient , ObjectID } = require('mongodb');



MongoClient.connect( 'mongodb://localhost:27017/TodoApp' , ( err , db ) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

      //fineOneAndUpdate

      // db.collection('Todos').findOneAndUpdate(
      //    {_id: new ObjectID("5a4d8924bf09277fe264e6e0")} 
      //    , { $set: { completed: true }}
      //   , {
      //     returnOriginal: false
      //   }).then ((results) => {
      //     console.log(results);
      //   });

      db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5a4f4bb4bf09277fe2653f5c")
      } , {
        $set: { name: 'pauleen' } , 
        $inc: { age: 1 }
      }, { returnOriginal: false }).then((results) => {
        console.log(results);
      })

    // db.close();
});