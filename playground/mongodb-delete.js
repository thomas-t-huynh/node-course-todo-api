const  {MongoClient , ObjectID } = require('mongodb');


MongoClient.connect( 'mongodb://localhost:27017/TodoApp' , ( err , db ) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // delete many

        // db.collection('Users').deleteMany({ name: 'tom' }).then((result) => {
        //     console.log(result);
        // })

    // delete one

            db.collection('Users').findOneAndDelete({ _id: new ObjectID ("5a47f9bca05e7c117c91b269") }).then((result) => {
                console.log(result);
            })

    // find one and delete 
            
            // db.collection('Todos').findOneAndDelete({ completed: false  }).then((result) => {
            //     console.log(result);
            // })
            
  
    // db.close();
});