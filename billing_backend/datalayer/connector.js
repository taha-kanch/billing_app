const oracle = require('oracledb');

async function getConnection() {

let connection = null;
try {
connection = await oracle.getConnection({
"user": "hr",
"password": "hr",
"connectionString": "localhost:1521/xepdb1"
});
}
catch(err) {
console.log('Some error', err);
}
return connection;
}

module.exports = {getConnection}