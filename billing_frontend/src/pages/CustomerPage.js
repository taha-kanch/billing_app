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
import { Formik, Form as FormikForm } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux';
import { CustomerSchema } from '../schema';
import { buildQueryString } from '../utils';

const columns = [
{ id: 'sno', label: 'S.No' },
{ id: 'code', label: 'Code' },
{ id: 'name', label: 'Name' },
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

const getCustomers = (filters) => {

let dataToSend = {
page: filters.page + 1,
limit: filters.limit,
search: filters.search
}
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
throw Error(res.statusText);
}
return res.json();
})
.then(customers => resolve(customers))
.catch(err => reject(err.message))
});

}

const addCustomer = (customer) => {
const token = localStorage.getItem('token');

return new Promise((resolve, reject) => {
fetch('/addCustomer', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': token
},
body: customer
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const updateCustomer = (customer) => {
const token = localStorage.getItem('token');

return new Promise((resolve, reject) => {
fetch('/updateCustomer', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': token
},
body: customer
})
.then(res => res.json())
.then(data => resolve(data))
.catch(err => reject(err))
});

}

const removeCustomer = (id) => {
const token = localStorage.getItem('token');

return new Promise((resolve, reject) => {
fetch(`/removeCustomer?code=${id}`, {
method: 'GET',
headers: {
'Authorization': token
}
})
.then(res => {
if(!res.ok) {
throw Error('Unable to delete customer, please try after sometime');
}
return res.json();
})
.then(data => resolve(data))
.catch(err => reject(err.message))
});

}

const CustomerPage = (props) => {

const [customer, setCustomer] = React.useState(null);
const [openAddCustomerDialog, setOpenAddCustomerDialog] = React.useState(false);
const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });
const [filters, setFilters] = React.useState({
search: '',
page: 0,
limit: 5
});
const [deleteCustomerId, setDeleteCustomerId] = React.useState(null);
const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

React.useEffect(() => {
getCustomers(filters).then(
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

},[filters]);

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
setOpenAddCustomerDialog(false);

if(isNew) {
props.dispatch({
type: 'ADD_CUSTOMER',
payload: values
});
}
else {
props.dispatch({
type: 'UPDATE_CUSTOMER',
payload: values
});
}

}

const onError = (msg) => {
setOpenAlertBox(true);
setAlertBoxProps({ type:'error', message: msg });
}

const handleDeleteCustomer = (id) => {
setDeleteCustomerId(id);
setOpenDeleteDialog(true);
}

const onDelete = () => {
removeCustomer(deleteCustomerId).then(
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
type: 'DELETE_CUSTOMER',
payload: {code: deleteCustomerId}
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
openAddCustomerDialog && <CreateOrEditCustomer
isOpen={openAddCustomerDialog}
onClose={() => setOpenAddCustomerDialog(false)}
onSuccess={onSuccess}
onError={onError}
customer={customer}
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
CUSTOMERS
</Typography>

<Box>
<FormControl variant="standard">
<Input
id="search-box"
placeholder="Search Customers"
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
props.customers.data.length > 0 ? (
props.customers.data.map((row,idx) => (
<StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
<StyledTableCell> {idx+1} </StyledTableCell>
<StyledTableCell> {row.code} </StyledTableCell>
<StyledTableCell> {row.name} </StyledTableCell>
<StyledTableCell>
<IconButton 
onClick={() => {
setOpenAddCustomerDialog(true);
setCustomer(row);
}}
><EditIcon/></IconButton>
<IconButton onClick={() => handleDeleteCustomer(row.code)}><DeleteIcon/></IconButton>
</StyledTableCell>
</StyledTableRow>
))
) : (
<StyledTableRow>
<StyledTableCell colSpan={4}>
<div className='record_not_found'>No Customer Found</div>
</StyledTableCell>
</StyledTableRow>
)
}
</TableBody>
</Table>
</TableContainer>
{
props.customers.total_records > 0 && ( <TablePagination
rowsPerPageOptions={[5, 10, 15]}
component="div"
count={props.customers.total_records}
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
setOpenAddCustomerDialog(true)
setCustomer(null);
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

const CreateOrEditCustomer = ({ isOpen, onClose, customer, onSuccess, onError }) => {

const isEdit = Boolean(customer);
const handleSubmit = (values, actions) => {

if(isEdit) {
updateCustomer(JSON.stringify(values)).then(
(data) => {
if(data.success) {
onSuccess('Customer Updated', data.data);
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
addCustomer(JSON.stringify(values)).then(
(data) => {
if(data.success) {
onSuccess('Customer Added', data.data, true);
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

return (
<React.Fragment>

<BootstrapDialog
onClose={onClose}
open={isOpen}
>
<DialogTitle sx={{ m: 0, p: 2 }}>
{isEdit ? 'Edit' : 'Add New'} Customer
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
code: customer?.code || 0,
name: customer?.name || ''
}}
onSubmit={handleSubmit}
validationSchema={CustomerSchema}
>
{({ isSubmitting, resetForm, values, handleChange, setFieldValue, errors, touched }) => (

<FormikForm>

<FormControl fullWidth>
<TextField
id="name"
name="name"
label="Name"
type="text"
value={values.name}
onChange={handleChange}
variant="standard"
error={Boolean(touched.name && errors.name)}
helperText={touched.name && errors.name}
/>
</FormControl>

<DialogActions>
<Button type='submit' autoFocus variant='contained'>
{ isEdit ? 'Update' : 'Add' }
</Button>
</DialogActions>

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
Delete Customer
</DialogTitle>
<DialogContent>
<DialogContentText>
<Typography variant='strong' fontWeight='600' color='red'>Are you sure you want to delete this customer ?</Typography>
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
customers: state.customers,
}
}


export default connect(mapStateToProps)(CustomerPage);