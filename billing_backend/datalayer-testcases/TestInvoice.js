const entities  = require('datalayer/entities');
const managers = require('datalayer/managers');

if(process.argv.length == 2) {
console.log('you need to pass operation and data');
return;
}
var testWhat = process.argv[2];
if(testWhat  == "add") {

var code = 0;
var customer_code = 1;
var total_items = 2;
var discount_amt = 20;
var total_amt = 180;
var net_amt = 200;
var remarks = 'Test';

var items = [];
var item;
item = new entities.InvoiceItem(0, 'Chips', 20, 10, 180, 20, 1, code);
items.push(item);

var invoice = new entities.Invoice(0,customer_code,total_items,remarks,total_amt,discount_amt,net_amt, null, items);
var m = new managers.InvoiceManager();
m.add(invoice)
.then(() => {
console.log(`Invoice created with code ${invoice.code}`);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'add' end here

if(testWhat  == "getAll") {

const filters = {
start_date: '',
end_date: '',
page: 1,
limit: 5
}
var m = new managers.InvoiceManager();

m.getAll(filters)
.then((invoices) => {
if(invoices.data.length == 0) {
console.log("No record found");
return;
}
var i = 0;
while(i < invoices.data.length) {
console.log(invoices.data[i]);
i++;
}
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getAll' end here

if(testWhat  == "getByCode") {

if(process.argv.length < 4) {
console.log('Data to remove is missing');
return;
}

var code = process.argv[3];
var m = new managers.InvoiceManager();

m.getByCode(code)
.then((invoice) => {
console.log(invoice);
})
.catch((err) => {
console.log(err);
})

} // testWhat === 'getByCode' end here
