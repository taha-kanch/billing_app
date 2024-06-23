const connector = require('./connector');
const entities = require('./entities');
const jwt = require('jsonwebtoken');

class UserManager {

constructor() {}

async add(user) {
if(!user.username || user.username.length == 0) {
throw 'Username is required';
}

if(!user.username.length > 150) {
throw 'Username cannot exceed 150 character';
}

if(!user.password || user.password.length == 0) {
throw 'Password is required';
}

if(!user.password.length > 150) {
throw 'Password cannot exceed 150 character';
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select username from at_user where lower(username)=lower('${user.username}')`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${user.username} already exists`;
}
await connection.execute(`Insert into at_user (username) values('${user.username}')`);
await connection.commit();

resultSet = await connection.execute(`select code from at_user where lower(username) = lower('${user.username}')`);
user.code = resultSet.rows[0][0];
await connection.close();

}

async validateUser(user) {
if(!user.username) {
throw 'Username is required';
}

if(user.username <= 0) {
throw `Invalid username ${user.username}`;
}

if(!user.password) {
throw 'Password is required';
}

if(user.password <= 0) {
throw `Invalid password ${user.password}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select * from at_user where username='${user.username}' and password='${user.password}'`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Incorrect username or password`;
}

const token = await jwt.sign({ username: user.username}, '1234567890', { expiresIn: '1h' });

await connection.close();
return { "username": user.username, "token": token };

}

}

// uom class start 
class UnitOfMeasurementManager {

constructor() {}

async add(unitOfMeasurement) {
if(!unitOfMeasurement.name || unitOfMeasurement.name.length == 0) {
throw 'Name is required';
}

if(!unitOfMeasurement.name.length > 5) {
throw 'Name cannot exceed 5 character';
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select name from at_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${unitOfMeasurement.name} already exists`;
}
await connection.execute(`Insert into at_uom (name) values('${unitOfMeasurement.name}')`);
await connection.commit();

resultSet = await connection.execute(`select code from at_uom where lower(name) = lower('${unitOfMeasurement.name}')`);
unitOfMeasurement.code = resultSet.rows[0][0];
await connection.close();

} // add end

async remove(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select code from at_uom where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

await connection.execute(`delete from at_uom where code=${code}`);
await connection.commit();

await connection.close();

} // remove end

async update(unitOfMeasurement) {

if(!unitOfMeasurement.code) {
throw 'Code is required';
}

if(unitOfMeasurement.code <= 0) {
throw '!Invalid Code';
}

if(!unitOfMeasurement.name) {
throw 'Name is required';
}

if(!unitOfMeasurement.name.length > 5) {
throw 'Name cannot exceed 5 character';
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select code from at_uom where code=${unitOfMeasurement.code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${unitOfMeasurememt.code}`;
}

resultSet = await connection.execute(`select code from at_uom where lower(name)=lower('${unitOfMeasurement.name}') and code<> ${unitOfMeasurement.code}`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${unitOfMeasurement.name} exists`;
}
await connection.execute(`update at_uom set name='${unitOfMeasurement.name}' where code=${unitOfMeasurement.code}`);
await connection.commit();

await connection.close();

} // update end

async getAll() {

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute("select * from at_uom order by code desc");
let unitOfMeasurements = [];
let unitOfMeasurement;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];
unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(row[0]), row[1]?.trim());
unitOfMeasurements.push(unitOfMeasurement);
i++;
}

resultSet = await connection.execute(`select count(*) as total_records from at_uom`);
const total_records = resultSet.rows[0][0];

await connection.close();
return { "data": unitOfMeasurements, "total_records": total_records };

} // getAll end

async getByCode(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select * from at_uom where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

let row = resultSet.rows[0];
let unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(row[0]), row[1]?.trim());

await connection.close();
return unitOfMeasurement;

} // getByCode end

async getByName(name) {

if(!name) {
throw 'Name is required';
}

if(name.length == 0 || name.length > 5) {
throw `Invalid name ${name}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select * from at_uom where lower(name)=lower('${name}')`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid name ${name}`;
}

let row = resultSet.rows[0];
let unitOfMeasurement = new entities.UnitOfMeasurement(parseInt(row[0]), row[1]?.trim());

await connection.close();
return unitOfMeasurement;

} // getByName end

} 
// uom class end

// customer class start
class CustomerManager {

constructor() {}

async add(customer) {

//basic validation start
if(!customer.name || customer.name.length == 0) {
throw 'Name is required';
}
if(customer.name.length >  150) {
throw `Name cannot exceed 150 characters`;
}
//basic validation end

var connection = await connector.getConnection();

let resultSet = await connection.execute(`select name from at_customer where lower(name)=lower('${customer.name}')`);

if(resultSet.rows.length > 0) {
await connection.close();
throw `${customer.name} already exists`;
}
await connection.execute(`insert into at_customer (name) values ('${customer.name}')`);
await connection.commit();

resultSet = await connection.execute(`select code from at_customer where lower(name) = lower('${customer.name}')`);
customer.code = resultSet.rows[0][0];

await connection.close();

} // add end

async getAll(filters={ search: '', page: 0, limit: 0 }) {

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet;
if(!filters.page && !filters.limit) {
resultSet = await connection.execute(`select * from at_customer where lower(name) like lower('${filters.search ?? ""}%') order by code desc`);
}
else {
const offset = (filters.page - 1) * filters.limit;
resultSet = await connection.execute(`select * from at_customer where lower(name) like lower('${filters.search ?? ""}%') order by code desc offset ${offset} rows fetch next ${filters.limit} rows only`);
}

let customers = [];
let customer;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];
customer = new entities.Customer(parseInt(row[0]), row[1]?.trim());
customers.push(customer);
i++;
}

resultSet = await connection.execute(`select count(*) as total_records from at_customer where lower(name) like lower('${filters.search ?? ""}%')`);
const total_records = resultSet.rows[0][0];

await connection.close();
return { "data": customers, "total_records": total_records };

} // getAll end

async getByCode(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select * from at_customer where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

let row = resultSet.rows[0];
let customer = new entities.Customer(parseInt(row[0]), row[1]?.trim());

await connection.close();
return customer;

} // getByCode end

async update(customer) {
//basic validation start
if(!customer.code) {
throw 'Code is required';
}
if(customer.code <= 0) {
throw '!Invalid Code';
}
if(!customer.name || customer.name.length == 0) {
throw 'Name is required';
}
if(customer.name.length >  150) {
throw `Name cannot exceed 150 characters`;
}
//basic validation end

var connection = await connector.getConnection();

let resultSet = await connection.execute(`select * from at_customer where code=${customer.code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${unitOfMeasurememt.code}`;
}

resultSet = await connection.execute(`select code from at_customer where lower(name)=lower('${customer.name}') and code<> ${customer.code}`);
if(resultSet.rows.length > 0) {
await connection.close();
throw `${customer.name} exists`;
}

await connection.execute(`update at_customer set name='${customer.name}' where code = ${customer.code}`);
await connection.commit();

await connection.close();

} // update end

async remove(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select code from at_customer where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}

await connection.execute(`delete from at_customer where code=${code}`);
await connection.commit();

await connection.close();

} // remove end 

}
// customer class end

class InvoiceManager {

async add(invoice) {

// basic validation start
if(!invoice.customer_code) {
throw 'Customer code is required';
}
if(invoice.customer_code <= 0) {
throw '!Invalid Customer code';
}
if(invoice.remarks && invoice.remarks.length > 150) {
throw 'Remark cannot exceed 150 character';
}
if(!invoice.total_items) {
throw 'Total items is required';
}
if(invoice.total_items < 0) {
throw 'Total items cannot be nagative';
}
if(!invoice.total_amt) {
throw 'Total amount is required';
}
if(!invoice.total_amt < 0) {
throw 'Total amount cannot be nagative';
}
if(!invoice.items || invoice.items.length == 0) {
throw 'Items is required';
}
if(!Array.isArray(invoice.items)) {
throw '!Invalid items';
}
// basic validation end


// items basic validation start
var item;
var i = 0;
while(i < invoice.items.length) {
item = invoice.items[i];
if(!item.description) {
throw 'Description is required';
}
if(item.description.length > 100) {
throw 'Description cannot exceed 100 character';
}
if(!item.price) {
throw 'Price is required';
}
if(item.price < 0) {
throw 'Price cannot be nagative';
}
if(!item.qty) {
throw 'Quantity is required';
}
if(item.qty < 0) {
throw 'Quantity cannot be nagative';
}
if(!item.total_amt) {
throw 'Total amount is required';
}
if(item.total_amt < 0) {
throw 'Total amount cannot be nagative';
}
if(!item.uom_code) {
throw 'Unit of measurement is required';
}
if(item.uom_code <= 0) {
throw '!Invalid Unit of measurement';
}
i++;
} // loop end
// items basic validation end

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect to database';
}

//Insert invoice start

await connection.execute(`Insert into at_invoice (customer_code, total_items, remarks, total_amt, discount_amt, net_amt, invoice_date) values(${invoice.customer_code}, ${invoice.total_items}, '${invoice.remarks}', ${invoice.total_amt}, ${invoice.discount_amt}, ${invoice.net_amt}, TRUNC(SYSDATE))`);
await connection.commit();
let resultSet = await connection.execute(`select max(code) as invoice_number from at_invoice`);
invoice.code = resultSet.rows[0][0];
resultSet = await connection.execute(`select name from at_customer where code=${invoice.customer_code}`);
invoice.customer_name =  resultSet.rows[0][0].trim();

if(!invoice.code || invoice.code < 0) {
throw `Invoice code is required`;
}

//Insert invoice end

//Insert invoice_items start
i = 0;
while(i < invoice.items.length) {
item = invoice.items[i];

await connection.execute(`Insert into at_invoice_items (description, price, qty, total_amt, discount, uom_code, invoice_number) values('${item.description}', ${item.price}, ${item.qty}, ${item.total_amt}, ${item.discount}, ${item.uom_code}, ${invoice.code})`);
await connection.commit();
resultSet = await connection.execute(`select max(code) as invoice_item_code from at_invoice_items`);
item.code = resultSet.rows[0][0];

i++;
} //loop end 
//Insert invoice_items end

await connection.close();

} // add end

async getAll(filters = { start_date: '', end_date: '', page: 0, limit: 0 }) {
// filters validation start
if(filters.start_date && new Date(filters.start_date) == 'Invalid Date') {
throw 'Invalid Start Date';
}
if(filters.end_date && new Date(filters.end_date) == 'Invalid Date') {
throw 'Invalid End Date';
}
// filters validation end

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let queryStr = null;
if(filters.start_date && filters.end_date) {
queryStr = `select ati.code as invoice_number, customer_code, total_items, remarks, total_amt, discount_amt, net_amt, invoice_date, atc.name as customer_name from at_invoice ati left join at_customer atc on ati.customer_code = atc.code where invoice_date >= TO_DATE('${filters.start_date}', 'YYYY-MM-DD') AND invoice_date <= TO_DATE('${filters.end_date}', 'YYYY-MM-DD') order by invoice_number desc`;
}
else {
queryStr = `select ati.code as invoice_number, customer_code, total_items, remarks, total_amt, discount_amt, net_amt, invoice_date, atc.name as customer_name from at_invoice ati left join at_customer atc on ati.customer_code = atc.code order by invoice_number desc`;
}

if(filters.page && filters.limit) {
const offset = (filters.page - 1) * filters.limit;
queryStr = queryStr + ` offset ${offset} rows fetch next ${filters.limit} rows only`;
}
let resultSet = await connection.execute(queryStr);
let invoices = [];
let invoice;
let row;
let i=0;
while(i < resultSet.rows.length) {
row = resultSet.rows[i];

let itemResultSet = await connection.execute(`select atit.code as invoice_item_code, description, price, qty, total_amt, discount, uom_code, atu.name as uom_name from at_invoice_items atit left join at_uom atu on atit.uom_code = atu.code where invoice_number=${parseInt(row[0])}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Item unavailable`;
}

let items = [];
let item;
let itemRow;
let e = 0;
while(e < itemResultSet.rows.length) {
itemRow = itemResultSet.rows[e];
item = new entities.InvoiceItem(parseInt(itemRow[0]),itemRow[1].trim(),itemRow[2],itemRow[3],itemRow[4],itemRow[5],itemRow[6],parseInt(row[0]));
item.uom_name = itemRow[7]?.trim();
items.push(item);
e++;
}

invoice = new entities.Invoice(parseInt(row[0]),parseInt(row[1]),row[2],row[3]?.trim(),row[4],row[5],row[6], row[7], items);
invoice.customer_name = row[8].trim();
invoices.push(invoice);
i++;
}

if(filters.start_date && filters.end_date) {
queryStr = `select count(*) as total_records from at_invoice where invoice_date >= TO_DATE('${filters.start_date}', 'YYYY-MM-DD') AND invoice_date <= TO_DATE('${filters.end_date}', 'YYYY-MM-DD')`;
}
else {
queryStr = `select count(*) as total_records from at_invoice`;
}
resultSet = await connection.execute(queryStr);
const total_records = resultSet.rows[0][0];

await connection.close();
return { "data": invoices, "total_records": total_records };

} // getAll end

async getByCode(code) {

} // getByCode end

async remove(code) {

if(!code) {
throw 'Code is required';
}

if(code <= 0) {
throw `Invalid code ${code}`;
}

var connection = await connector.getConnection();
if(connection == null) {
throw 'Unable to connect with database';
}

let resultSet = await connection.execute(`select code from at_invoice where code=${code}`);
if(resultSet.rows.length == 0) {
await connection.close();
throw `Invalid code ${code}`;
}
await connection.execute(`delete from at_invoice_items where invoice_number=${code}`);
await connection.execute(`delete from at_invoice where code=${code}`);
await connection.commit();

await connection.close();

} // remove end 


}
// invoice class end

module.exports = { UserManager, UnitOfMeasurementManager, CustomerManager, InvoiceManager };