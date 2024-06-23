import React from 'react';
import { 
FormControl, Input, InputAdornment, Box, Typography, styled, Paper, 
TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, 
SpeedDial, SpeedDialAction, SpeedDialIcon, IconButton, Button, TextField, Grid, Select, MenuItem,
Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormLabel
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { 
Search as SearchIcon, Save as SaveIcon, Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import { Formik, Form as FormikForm, FieldArray } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux';
import { InvoiceSchema } from '../schema';
import { buildQueryString } from '../utils';

const columns = [
{ id: 'sno', label: 'S.No' },
{ id: 'bill_num', label: 'Bill No' },
{ id: 'customer_name', label: 'Customer Name' },
{ id: 'amount', label: 'Net Amount' },
{ id: 'remarks', label: 'Remarks' },
{ id: 'action', label: '' }
];

const PageBox = styled('div')(({ theme }) => ({

'.header-wrap': {
display: 'flex',
justifyContent: 'space-between',
alignItem: 'center',
marginBottom: '15px',
'& .MuiFormControl-root': {
width: '300px',
'& .MuiInputBase-root': {
'borderRadius': '10px',
'textTransform': 'capitalize',
}
},
'& .heading': {
fontSize: '24px',
fontWeight: 500
}
},
'& .record_not_found': {
'minHeight': '200px',
'display': 'flex',
'alignItems': 'center',
'justifyContent': 'center',
'fontWeight': '700',
'fontSize': '30px',
'borderRadius': '5px'
},
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
backgroundColor: '#1976d2',
color: theme.palette.common.white,
textTransform: 'uppercase'
},
[`&.${tableCellClasses.body}`]: {
fontSize: 14,
},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
'&:nth-of-type(odd)': {
backgroundColor: theme.palette.action.hover,
},
// hide last border
'&:last-child td, &:last-child th': {
border: 0,
},
}));

const getCustomers = () => {

let dataToSend = {};
const result = buildQueryString(dataToSend );
const token = localStorage.getItem('token');

return new Promise((resolve, reject) => {
fetch(`/getCustomers${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`, {
method: 'GET',
headers: {
'Content-Type': 'application//json',
'Authorization': token
}
}).then(res => {
if(!res.ok) {
throw Error('Unable to fetch customers, please try after sometime');
}
return res.json();
})
.then(customers => resolve(customers))
.catch(err => reject(err.message))
});

}

const getUnitOfMeasurements = () => {

let dataToSend = {};
const result = buildQueryString(dataToSend );
const token = localStorage.getItem('token');

return new Promise((resolve, reject) => {
fetch(`/getUnitOfMeasurements${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`, {
method: 'GET',
headers: {
'Content-Type': 'application//json',
'Authorization': token
}
}).then(res => {
if(!res.ok) {
throw Error('Unable to fetch unit of measurements, please try after sometime');
}
return res.json();
})
.then(units => resolve(units))
.catch(err => reject(err.message))
});

}

const getInvoices = (filters) => {

let dataToSend = {
page: filters.page + 1,
limit: filters.limit,
search: filters.search
}
const result = buildQueryString(dataToSend );
const token = localStorage.getItem('token');

return new Promise((resolve, reject) => {
fetch(`/getInvoices${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`, {
method: 'GET',
headers: {
'Content-Type': 'application//json',
'Authorization': token
}
}).then(res => {
if(!res.ok) {
throw Error(res.statusText);
}
return res.json();
})
.then(invoices => resolve(invoices))
.catch(err => reject(err.message))
});

}

const addInvoice = (invoice) => {
const token = localStorage.getItem('token');

return new Promise((resolve, reject) => {
fetch('/addInvoice', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': token
},
body: invoice
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const updateInvoice = (invoice) => {
const token = localStorage.getItem('token');

return new Promise((resolve, reject) => {
fetch('/updateInvoice', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': token
},
body: invoice
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const removeInvoice = (id) => {
const token = localStorage.getItem('token');
let dataToSend = {
code: id
}
const result = buildQueryString(dataToSend );

return new Promise((resolve, reject) => {
fetch(`/removeInvoice${Object.entries(dataToSend).length == 0 ? '' : '?'+result }`, {
method: 'GET',
headers: {
'Authorization': token
}
})
.then(res => {
if(!res.ok) {
throw Error('Unable to delete invoice, please try after sometime');
}
return res.json();
})
.then(data => resolve(data))
.catch(err => reject(err.message))
});

}

const BillPage = (props) => {

const [invoice, setInvoice] = React.useState(null);
const [openAddInvoiceDialog, setOpenAddInvoiceDialog] = React.useState(false);
const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });
const [filters, setFilters] = React.useState({
search: '',
page: 0,
limit: 5
});
const [deleteInvoiceId, setDeleteInvoiceId] = React.useState(null);
const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

React.useEffect(() => {
getInvoices(filters).then(
(data) => {
props.dispatch({
type: 'GET_INVOICES',
payload: data.data
});

}, 
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[filters]);

React.useEffect(() => {

getCustomers().then(
(data) => {
props.dispatch({
type: 'GET_CUSTOMERS',
payload: data.data
});
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[]);

React.useEffect(() => {

getUnitOfMeasurements().then(
(data) => {
props.dispatch({
type: 'GET_UNIT_OF_MEASUREMENTS',
payload: data.data
});
},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message:err });
}
);

},[]);


const handleChangePage = (event, newPage) => {
setFilters({...filters, page: newPage});
};

const handleChangeRowsPerPage = (event) => {
setFilters({...filters, page:0, limit: event.target.value});
};

const onSearch = (evt) => {
const searchVal = evt.target.value;
setFilters({
...filters,
page: 0,
search: searchVal
});
}

const onSuccess = (msg, values, isNew) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'success', message: msg });
setOpenAddInvoiceDialog(false);

if(isNew) {
props.dispatch({
type: 'ADD_INVOICE',
payload: values
});
}
else {
props.dispatch({
type: 'UPDATE_INVOICE',
payload: values
});
}

}

const onError = (msg) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: msg });
}

const handleDeleteInvoice = (id) => {
setDeleteInvoiceId(id);
setOpenDeleteDialog(true);
}

const onDelete = () => {
removeInvoice(deleteInvoiceId).then(
(data) => {

if(data.success) {
setOpenAlertBox(true);
setAlertBoxProps({ type:'success', message: 'Delete Removed' });
setOpenDeleteDialog(false);

setFilters({
...filters,
page: 0
});

props.dispatch({
type: 'DELETE_INVOICE',
payload: {code: deleteInvoiceId}
});

}
else {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: data.error });
}

},
(err) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: err });
}
);
}

return (
<PageBox>

{
openAddInvoiceDialog && <CreateOrEditInvoice
isOpen={openAddInvoiceDialog}
onClose={() => setOpenAddInvoiceDialog(false)}
onSuccess={onSuccess}
onError={onError}
invoice={invoice}
customers={props.customers.data}
unitOfMeasurements={props.unitOfMeasurements.data}
/>
}

{
openDeleteDialog && <ConfirmDelete
isOpen={openDeleteDialog}
onClose={() => setOpenDeleteDialog(false)}
onDelete={onDelete}
/>
}

<AlertMessage
isOpen={openAlertBox}
onClose={() => setOpenAlertBox(false)}
alertProps={alertBoxProps}
/>

<Box className='header-wrap'>

<Typography component='div' className='heading'>
BILLS
</Typography>

<Box>
<FormControl variant="standard">
<Input
id="search-box"
placeholder="Search Invoices"
onInput={onSearch}
startAdornment={
<InputAdornment position="start">
<SearchIcon />
</InputAdornment>
}
/>
</FormControl>
</Box>

</Box>

<Paper sx={{ width: '100%', overflow: 'hidden' }}>
<TableContainer sx={{ maxHeight: 440 }}>
<Table stickyHeader aria-label="sticky table">
<TableHead>
<StyledTableRow>
{columns.map((column) => (
<StyledTableCell
key={column.id}
align={column.align}
style={{ minWidth: column.minWidth }}
>
{column.label}
</StyledTableCell>
))}
</StyledTableRow>
</TableHead>
<TableBody>
{
props.invoices.data.length > 0 ? (
props.invoices.data.map((row,idx) => (
<StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
<StyledTableCell> {idx+1} </StyledTableCell>
<StyledTableCell> {row.code} </StyledTableCell>
<StyledTableCell> {row.customer_name} </StyledTableCell>
<StyledTableCell> &#8377;{row.net_amt.toFixed(2)} </StyledTableCell>
<StyledTableCell> {row.remarks || 'N/A'} </StyledTableCell>
<StyledTableCell>
<IconButton 
onClick={() => {
setOpenAddInvoiceDialog(true);
setInvoice(row);
}}
><EditIcon/></IconButton>
<IconButton onClick={() => handleDeleteInvoice(row.code)}><DeleteIcon/></IconButton>
</StyledTableCell>
</StyledTableRow>
))
) : (
<StyledTableRow>
<StyledTableCell colSpan={6}>
<div className='record_not_found'>No Invoice Found</div>
</StyledTableCell>
</StyledTableRow>
)
}
</TableBody>
</Table>
</TableContainer>
{
props.invoices.total_records > 0 && ( <TablePagination
rowsPerPageOptions={[5, 10, 15]}
component="div"
count={props.invoices.total_records}
rowsPerPage={filters.limit}
page={filters.page}
onPageChange={handleChangePage}
onRowsPerPageChange={handleChangeRowsPerPage}
/>
)}
</Paper>

<Box sx={{ height: 0, transform: 'translateZ(0px)', flexGrow: 1 }}>
<SpeedDial
ariaLabel="SpeedDial basic example"
sx={{ position: 'absolute', bottom: 40, right: 10 }}
icon={<SpeedDialIcon openIcon={<AddIcon />} />}
onClick={() => {
setOpenAddInvoiceDialog(true)
setInvoice(null);
}}
>
</SpeedDial>
</Box>

</PageBox>
);

}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
'& .MuiDialogContent-root': {
padding: theme.spacing(2),
'& .MuiFormControl-root': {
width: '100%',
padding: '5px',
margin: '1px'
},
},
'& .MuiDialogActions-root': {
padding: theme.spacing(1),
'& .delete-btn': {
backgroundColor: 'red',
color: '#fff'
}
},
'& .MuiSelect-select': {
'padding': '10px',
'backgroundColor': '#F8F8F8',
},
}));

const itemColumns = [
{ id: 'sno', label: 'S.No' },
{ id: 'description', label: 'Description' },
{ id: 'uom_code', label: 'Unit' },
{ id: 'price', label: 'Rate' },
{ id: 'qty', label: 'Qty' },
{ id: 'discount', label: 'Discount' },
{ id: 'total_amt', label: 'Amount' },
{ id: 'action', label: '' }
];

const CreateOrEditInvoice = ({ isOpen, onClose, customers, unitOfMeasurements, invoice, onSuccess, onError }) => {

const isEdit = Boolean(invoice);
const handleSubmit = (values, actions) => {

values.total_items = values.items.length;

if(isEdit) {
updateInvoice(JSON.stringify(values)).then(
(data) => {
if(data.success) {
onSuccess('Invoice Updated', data.data);
}
else {
onError(data.error);
}
},
(err) => {
console.log(err)
}
)
}
else {
addInvoice(JSON.stringify(values)).then(
(data) => {
if(data.success) {
onSuccess('Invoice Added', data.data, true);
}
else {
onError(data.error);
}
},
(err) => {
onError(err);
}
)
}

}

const setItemTotalAmount = (price, qty, discount, idx, setFieldValue) => {
if(isNaN(price) || isNaN(qty) || isNaN(discount)) {
setFieldValue(`items.${idx}.total_amt`, 0);
return;
}
setFieldValue(`items.${idx}.total_amt`, ((price*qty) - discount));
}

const calculateNetAmount = (items, setFieldValue) => {

const total_amt = items.reduce((accum, item) =>  accum + (item.qty * item.price), 0);
const discount_amt = items.reduce((accum, item) =>  accum + Number(item.discount), 0);
const net_amt = total_amt - discount_amt;
setFieldValue('total_amt', total_amt);
setFieldValue('discount_amt', discount_amt);
setFieldValue('net_amt', net_amt);
}

return (
<React.Fragment>

<BootstrapDialog
maxWidth
onClose={onClose}
open={isOpen}
>
<DialogTitle sx={{ m: 0, p: 2 }}>
{isEdit ? 'View' : 'Add New'} Bill
</DialogTitle>
<IconButton
aria-label="close"
onClick={onClose}
sx={{
position: 'absolute',
right: 8,
top: 8,
color: (theme) => theme.palette.grey[500],
}}
>
<CloseIcon />
</IconButton>
<DialogContent dividers>

<Formik
initialValues={{
code: invoice?.code || 0,
customer_code: invoice?.customer_code || '',
items: invoice?.items || [],
remarks: invoice?.remarks || '',
total_amt: invoice?.total_amt || 0,
discount_amt: invoice?.discount_amt || 0,
net_amt: invoice?.net_amt || 0
}}
onSubmit={handleSubmit}
validationSchema={InvoiceSchema}
>
{({ isSubmitting, resetForm, values, handleChange, setFieldValue, errors, touched }) => (

<FormikForm>

<FormControl fullWidth>
<Select
sx={{ width: '100%' }}
displayEmpty
onChange={handleChange}
value={values.customer_code}
id='customer_code'
name='customer_code'
disabled={isEdit}
renderValue={
values.customer_code !== ''
? undefined
: () => <span style={{ color: '#ababab' }}>Select Customer</span>
}
>
{
customers?.map((option, index) => (
<MenuItem value={option.code}>{option.name}</MenuItem>
))
}
</Select>
{Boolean(touched.customer_code && errors.customer_code) ? (
<Typography variant="caption" color="error" style={{ textAlign: 'left' }}>
{errors.customer_code}
</Typography>
) : (
''
)}
</FormControl>

<TableContainer sx={{ maxHeight: 440 }}>
<Table stickyHeader aria-label="sticky table">
<TableHead>
<StyledTableRow>
{itemColumns.map((column) => (
<StyledTableCell
key={column.id}
align={column.align}
style={{ minWidth: column.minWidth }}
>
{column.label}
</StyledTableCell>
))}
</StyledTableRow>
</TableHead>
<TableBody>

<FieldArray name='items'>
{({ push, remove }) => (
<>
{
values.items.map((item, idx) => (
<StyledTableRow>
<StyledTableCell>{idx+1}</StyledTableCell>
<StyledTableCell>
<FormControl fullWidth>
<TextField
id={`items.${idx}.description`}
name={`items.${idx}.description`}
label="Description"
type="text"
value={`${values.items[idx]['description']}`}
onChange={handleChange}
variant="standard"
error={Boolean(touched.items?.[idx]?.['description'] && errors.items?.[idx]?.['description'])}
helperText={touched.items?.[idx]?.['description'] && errors.items?.[idx]?.['description']}
disabled={isEdit}
/>
</FormControl>
</StyledTableCell>

<StyledTableCell>
<FormControl fullWidth>
<Select
sx={{ width: '150px' }}
displayEmpty
onChange={handleChange}
id={`items.${idx}.uom_code`}
name={`items.${idx}.uom_code`}
value={`${values.items[idx]['uom_code']}`}
disabled={isEdit}
renderValue={
values.items[idx]['uom_code'] !== ''
? undefined
: () => <span style={{ color: '#ababab' }}>Select Unit</span>
}
>
{
unitOfMeasurements?.map((option, index) => (
<MenuItem value={option.code}>{option.name}</MenuItem>
))
}
</Select>
{Boolean(touched.items?.[idx]?.['uom_code'] && errors.items?.[idx]?.['uom_code']) ? (
<Typography variant="caption" color="error" style={{ textAlign: 'left' }}>
{errors.items?.[idx]?.['uom_code']}
</Typography>
) : (
''
)}
</FormControl>
</StyledTableCell>

<StyledTableCell>
<FormControl fullWidth>
<TextField
id={`items.${idx}.price`}
name={`items.${idx}.price`}
label="Rate"
type="number"
value={values.items[idx]['price']}
onChange={(evt) => {
handleChange(evt);
setItemTotalAmount(evt.target.value, values.items[idx]['qty'], values.items[idx]['discount'], idx, setFieldValue);
values.items[idx].price = evt.target.value;
calculateNetAmount(values.items, setFieldValue);
}}
variant="standard"
error={Boolean(touched.items?.[idx]?.['price'] && errors.items?.[idx]?.['price'])}
helperText={touched.items?.[idx]?.['price'] && errors.items?.[idx]?.['price']}
disabled={isEdit}
/>
</FormControl>
</StyledTableCell>

<StyledTableCell>
<FormControl fullWidth>
<TextField
id={`items.${idx}.qty`}
name={`items.${idx}.qty`}
label="Qty"
type="number"
value={`${values.items[idx]['qty']}`}
onChange={(evt) => {
handleChange(evt);
setItemTotalAmount(values.items[idx]['price'], evt.target.value, values.items[idx]['discount'], idx, setFieldValue);
values.items[idx].qty = evt.target.value;
calculateNetAmount(values.items, setFieldValue);
}}
variant="standard"
error={Boolean(touched.items?.[idx]?.['qty'] && errors.items?.[idx]?.['qty'])}
helperText={touched.items?.[idx]?.['price'] && errors.items?.[idx]?.['qty']}
disabled={isEdit}
/>
</FormControl>
</StyledTableCell>

<StyledTableCell>
<FormControl fullWidth>
<TextField
id={`items.${idx}.discount`}
name={`items.${idx}.discount`}
label="Discount"
type="number"
value={`${values.items[idx]['discount']}`}
onChange={(evt) => {
handleChange(evt);
setItemTotalAmount(values.items[idx]['price'], values.items[idx]['qty'], evt.target.value, idx, setFieldValue);
values.items[idx].discount = evt.target.value;
calculateNetAmount(values.items, setFieldValue);
}}
variant="standard"
error={Boolean(touched.items?.[idx]?.['discount'] && errors.items?.[idx]?.['discount'])}
helperText={touched.items?.[idx]?.['discount'] && errors.items?.[idx]?.['discount']}
disabled={isEdit}
/>
</FormControl>
</StyledTableCell>

<StyledTableCell>
<FormControl fullWidth>
<TextField
id={`items.${idx}.total_amt`}
name={`items.${idx}.total_amt`}
label="Amount"
type="text"
value={`${values.items[idx]['total_amt']}`}
onChange={handleChange}
variant="standard"
disabled
/>
</FormControl>
</StyledTableCell>

<StyledTableCell>
{
!isEdit && (
<IconButton onClick={() => remove(idx)}>
<DeleteIcon />
</IconButton>
) 
}
</StyledTableCell>

</StyledTableRow>
))}

{
!isEdit && (
<StyledTableRow>
<StyledTableCell colSpan='8' align='center'>
<IconButton 
onClick={() => push({
description: '',
qty: 0,
price: 0,
uom_code: '',
discount: 0,
total_amt: 0,
})}><AddIcon/></IconButton>
</StyledTableCell>
</StyledTableRow>
)}
</>
)}
</FieldArray>
{
values.items.length > 0 && (
<TableRow>

<TableCell colSpan={'4'} >
<FormControl fullWidth>
<TextField
id={`remarks`}
name={`remarks`}
label="Remarks"
type="text"
onChange={handleChange}
value={values.remarks}
variant="standard"
disabled={isEdit}
/>
</FormControl>
</TableCell>

<TableCell colSpan={'4'}>
<Grid container>
<Grid item xs={12}>
<FormControl fullWidth>
<TextField
id={`total_amt`}
name={`total_amt`}
label="Total Amount"
type="text"
value={values.total_amt}
variant="standard"
disabled
/>
</FormControl>
</Grid>

<Grid item xs={12}>
<FormControl fullWidth>
<TextField
id={`discount_amt`}
name={`discount_amt`}
label="Discount"
type="text"
value={values.discount_amt}
variant="standard"
disabled
/>
</FormControl>
</Grid>

<Grid item xs={12}>
<FormControl fullWidth>
<TextField
id={`net_amt`}
name={`net_amt`}
label="Net Amount"
type="text"
value={values.net_amt}
variant="standard"
disabled
/>
</FormControl>
</Grid>
</Grid>
</TableCell>
</TableRow>
)}

</TableBody>
</Table>
</TableContainer>

{
!isEdit && (
<DialogActions>
<Button type='submit' autoFocus variant='contained'>Add</Button>
</DialogActions>
)}

</FormikForm>

)}
</Formik>

</DialogContent>
</BootstrapDialog>

</React.Fragment>
)

}

const ConfirmDelete = ({ isOpen, onClose, onDelete }) => {

return (
<React.Fragment>

<BootstrapDialog
onClose={onClose}
open={isOpen}
>
<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
Delete Invoice
</DialogTitle>
<DialogContent>
<DialogContentText>
<Typography variant='strong' fontWeight='600' color='red'>Are you sure you want to delete this invoice ?</Typography>
</DialogContentText>
</DialogContent>
<DialogActions>
<Button type='button' onClick={onClose}> Cancel </Button>
<Button type='button' variant='contained' className='delete-btn' onClick={onDelete} > Delete </Button>
</DialogActions>
</BootstrapDialog>

</React.Fragment>
)

}

const AlertMessage = ({ isOpen, onClose, alertProps }) => {

return (
<Snackbar
open={isOpen}
autoHideDuration={3000} 
onClose={onClose} 
anchorOrigin={{
"vertical": "bottom",
"horizontal":"center"
}}
>
<Alert
onClose={onClose}
severity={alertProps.type}
variant="filled"
sx={{ width: '100%' }}
>
{alertProps.message}
</Alert>
</Snackbar>
)

}

const mapStateToProps = (state) => {
return {
invoices: state.invoices,
customers: state.customers,
unitOfMeasurements: state.unitOfMeasurements
}
}


export default connect(mapStateToProps)(BillPage);