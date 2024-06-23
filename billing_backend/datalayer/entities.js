class User {

constructor(code, username, password) {
this.code = code;
this.username = username;
this.password = password;
}

getCode() {
return this.code;
}

getUserName() {
return this.username;
}

getPassword() {
return this.password;
}

}

class UnitOfMeasurement {

constructor(code, name) {
this.code = code;
this.name = name;
}

getCode() {
return this.code;
}

getName() {
return this.name
}

}

class Customer {

constructor(code, name) {
this.code = code;
this.name = name;
}

getCode() {
return this.code;
}

getName() {
return this.name;
}

}

class Invoice {

constructor(code, customer_code, total_items, remarks, total_amt, discount_amt, net_amt, invoice_date, items) {
this.code = code;
this.customer_code = customer_code;
this.total_items = total_items;
this.remarks = remarks;
this.total_amt = total_amt;
this.discount_amt = discount_amt;
this.net_amt = net_amt;
this.invoice_date = invoice_date;
this.items = items;
}

getCode() {
return this.code;
}

getCustomerCode() {
return this.customer_code;
}

getTotalItems() {
return this.total_items;
}

getRemarks() {
return this.remarks;
}

getTotalAmt() {
return this.total_amt;
}

getDiscountAmt() {
return this.discount_amt;
}

getNetAmt() {
return this.net_amt;
}

getInvoiceDate() {
return this.invoice_date;
}

getItems() {
return this.items;
}

}

class InvoiceItem {

constructor(code, description, price, qty, total_amt, discount, uom_code, invoice_number) {
this.code = code;
this.description = description;
this.price = price;
this.qty = qty;
this.total_amt = total_amt;
this.discount = discount;
this.uom_code = uom_code;
this.invoice_number = invoice_number;
}

getCode() {
return this.code;
}

getDescription() {
return this.description;
}

getPrice() {
return this.price;
}

getQty() {
return this.qty;
}

getTotalAmt() {
return this.total_amt;
}

getDiscount() {
return this.discount;
}

getUOMCode() {
return this.uom_code;
}

getInvoiceNumber() {
return this.invoice_number;
}

}


module.exports = { User, UnitOfMeasurement, Customer, Invoice, InvoiceItem };