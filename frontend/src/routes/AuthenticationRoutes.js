import { lazy } from 'react';

// project imports
import Loadable from 'ui-components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/auth/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/auth/Register3')));
const Verify = Loadable(lazy(() => import('views/auth/Verify')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: 'login',
            element: <AuthLogin3 />
        },
        {
            path: 'register',
            element: <AuthRegister3 />
        },
        {
            path: 'verify',
            element: <Verify />
        }
    ]
};

export default AuthenticationRoutes;
