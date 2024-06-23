import { Navigate } from 'react-router-dom'
import Utils from '../utils';

function PrivateRoute ({ children }) {
const token = localStorage.getItem('token');
return token ? children : <Navigate to={'/login'} />
}

export default PrivateRoute;
