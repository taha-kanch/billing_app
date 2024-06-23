import React from 'react';
import { FormControl, Container, Grid, Box, TextField, Button, Typography } from '@mui/material';
import { Formik, Form as FormikForm } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux';
import { LoginSchema } from '../schema';
import { useNavigate } from 'react-router-dom';

const login = (user) => {
return new Promise((resolve, reject) => {
fetch('/login', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: user
})
.then(res => {
if(!res.ok) {
throw Error('Unable to login, please try after some time');
}
return res.json();
})
.then(data => resolve(data))
.catch(err => reject(err.message))
});
}

const LoginPage = (props) => {

const navigate = useNavigate();
const [openAlertBox, setOpenAlertBox] = React.useState(false);
const [alertBoxProps, setAlertBoxProps] = React.useState({ type:'error', message:'' });

const handleSubmit = (values, actions) => {

login(JSON.stringify(values)).then(
(data) => {
setOpenAlertBox(true);
if(data.success) {
props.dispatch({
type: 'LOGIN_SUCCESS',
payload: data.data
});
setAlertBoxProps({ type:'success', message: 'Login Successfully' });
navigate('/dashboard/customers');
} else {
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
<Container maxWidth="lg">

<AlertMessage
isOpen={openAlertBox}
onClose={() => setOpenAlertBox(false)}
alertProps={alertBoxProps}
/>

<Grid container spacing={2} alignItems="center" style={{ height: '100vh' }}>
<Grid item xs={12} md={6}>
<Box
component="img"
sx={{
width: '100%',
height: '100%',
objectFit: 'cover',
}}
alt="Login Image"
src="https://via.placeholder.com/600x800" // Replace with your image URL
/>
</Grid>
<Grid item xs={12} md={6}>
<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
<Typography variant="h4" gutterBottom>
Login
</Typography>
<Formik
initialValues={{
username: '',
password: ''
}}
onSubmit={handleSubmit}
validationSchema={LoginSchema}
>
{({ isSubmitting, resetForm, values, handleChange, setFieldValue, errors, touched }) => (

<FormikForm>

<FormControl fullWidth>
<TextField
id="username"
name="username"
label="Username"
type="text"
value={values.username}
onChange={handleChange}
variant="outlined"
error={Boolean(touched.username && errors.username)}
helperText={touched.username && errors.username}
margin="normal"
/>
</FormControl>

<FormControl fullWidth>
<TextField
id="password"
name="password"
label="Password"
type="password"
value={values.password}
onChange={handleChange}
variant="outlined"
error={Boolean(touched.password && errors.password)}
helperText={touched.password && errors.password}
margin="normal"
/>
</FormControl>

<Button
type="submit"
fullWidth
variant="contained"
color="primary"
sx={{ mt: 3, mb: 2 }}
>
Sign In
</Button>

</FormikForm>

)}
</Formik>
</Box>
</Grid>
</Grid>
</Container>
);
};

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

}
}

export default connect(mapStateToProps)(LoginPage);
