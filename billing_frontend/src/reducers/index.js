export default function debtorsReducer(
state={
auth: {},
customers: { data: [], total_records: 0 },
unitOfMeasurements: { data: [], total_records: 0 },
invoices: { data: [], total_records: 0 }
},
action
) {

if(action.type == 'LOGIN_SUCCESS') {
localStorage.setItem('token', action.payload.token);
state = { ...state, auth: action.payload };
}

if(action.type == 'GET_UNIT_OF_MEASUREMENTS') {
state= { ...state, unitOfMeasurements: action.payload};
}

if(action.type == 'GET_CUSTOMERS') {
state= { ...state, customers: action.payload};
}

if(action.type == 'ADD_CUSTOMER') {
const customersData = state.customers.data;
let total_records = state.customers.total_records + 1;
customersData.unshift(action.payload);
state = {...state, customers: { "data": customersData, "total_records": total_records }};
}

if(action.type == 'DELETE_CUSTOMER') {
const afterRemovingCustomer  = state.customers.data.filter(customer => customer.code != action.payload.code);
state = { ...state, customers: { "data": afterRemovingCustomer, "total_records": state.customers.total_records - 1 } };
}

if(action.type == 'UPDATE_CUSTOMER') {
const idx = state.customers.data.findIndex(customer => customer.code == action.payload.code);
if(idx != -1)  state.customers.data[idx] = action.payload;
}

if(action.type == 'GET_INVOICES') {
state= { ...state, invoices: action.payload};
}

if(action.type == 'ADD_INVOICE') {
const invoicesData = state.invoices.data;
let total_records = state.invoices.total_records + 1;
invoicesData.unshift(action.payload);
state = {...state, invoices: { "data": invoicesData, "total_records": total_records }};
}

if(action.type == 'DELETE_INVOICE') {
const afterRemovingInvoice  = state.invoices.data.filter(invoice => invoice.code != action.payload.code);
state = { ...state, invoices: { "data": afterRemovingInvoice, "total_records": state.invoices.total_records - 1 } };
}

if(action.type == 'UPDATE_INVOICE') {
const idx = state.invoices.data.findIndex(invoice => invoice.code == action.payload.code);
if(idx != -1)  state.invoices.data[idx] = action.payload;
}

return state;

}