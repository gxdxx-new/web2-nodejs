var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '000000';
const someOtherPlaintextPassword = '111111';
bcrypt.hash(myPlaintextPassword, saltRounds, function(error, hash) {
    console.log(hash);
    bcrypt.compare(myPlaintextPassword, hash, function(error, result) {
        console.log('my password', result);
    })
    bcrypt.compare(someOtherPlaintextPassword, hash, function(error, result) {
        console.log('other password', result);
    })
});