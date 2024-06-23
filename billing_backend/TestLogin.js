const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];
if(testWhat  == "login") {

var code = 1;
var username = 'Admin';
var password = 'Admin@123';

var user = new entities.User(code, username, password);
var m = new managers.UserManager();
m.validateUser(user)
.then((data) => {
console.log(`Logged in with ${data}`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'login' end here