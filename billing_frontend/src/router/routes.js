import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from '../App';
import SignInPage from '../pages/SignInPage';
import CustomerPage from '../pages/CustomerPage';
import BillPage from '../pages/BillPage';
import PrivateRoute from './PrivateRoute';

let routes = [
{
path: '/',
element: <SignInPage/>
},
{
path: '/login',
element: <SignInPage/>
},
{
path: '/dashboard',
element: ( <PrivateRoute> <App/>  </PrivateRoute>),
children: [
{
path: '/dashboard',
element: ( <PrivateRoute> <CustomerPage/> </PrivateRoute>) 
},
{
path: '/dashboard/customers',
element: ( <PrivateRoute> <CustomerPage/> </PrivateRoute>)
},
{
path: '/dashboard/bills',
element: ( <PrivateRoute> <BillPage/> </PrivateRoute>)
}
]
}
];

const router = createBrowserRouter(routes);

export default router;