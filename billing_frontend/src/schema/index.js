import * as yup from 'yup';

export const LoginSchema = yup.object().shape({

username: yup.string().required('Userame is required'),
password: yup.string().required('Password is required'),

});

export const CustomerSchema = yup.object().shape({
name: yup.string().required('Name is required')
});

export const InvoiceSchema = yup.object().shape({
customer_code : yup.string().required('Customer is required'),
items: yup.array().of(
yup.object().shape({
description: yup.string().required('Description is required'),
uom_code: yup.string().required('Unit is required'),
qty: yup.number().required('Quantity is required').positive('Quantity must be positive').integer('Quantity must be an integer'),
price: yup.number().required('Rate is required').positive('Rate must be positive'),
discount: yup.number().min(0, 'Discount must be at least 0').max(100, 'Discount cannot be more than 100')
})
)
});