const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

let password ='123abc!';

bcrypt.genSalt(10, (err , salt ) => {
    bcrypt.hash(password , salt , (err , hash ) => {
        console.log(hash);
    });
});

let hashPassword = '$2a$10$hiq5vMOuYvrFH87jris7ieaEt03HuQIv6WUxBqO1wUn3RPAftjZYO';

bcrypt.compare(password , hashPassword, (err , res) => {
    console.log(res);
})

// let data = {
//     id: 10
// }

// let token = jwt.sign(data, '123abc');

// console.log(token);

// let decoded = jwt.verify(token , '123abc');

// console.log('decoded', decoded);

// jwt.verify

// let message = 'I am user number 3';

// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);

// console.log(`Has ${hash}`)

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'saltingTheHash').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'saltingTheHash').toString();

// if (resultHash === token.hash) {
//     console.log('data was not changed');
// } else {
//     console.log('data was changed. dont trust');
// }
