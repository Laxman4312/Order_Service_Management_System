import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ErrorFallback from 'views/error/ErrorFallback';

// login option 3 routing
const Login = Loadable(lazy(() => import('views/pages/authentication/Login')));
const ForgotPassword = Loadable(lazy(() => import('views/pages/authentication/ForgotPassword')));
const Reset = Loadable(lazy(() => import('views/pages/authentication/Reset')));

//register
const Register = Loadable(lazy(() => import('views/pages/authentication/Register')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  errorElement: <ErrorFallback />,
  children: [
    {
      path: '/',
      element: <Login />,
      // element: <AuthLogin />,
    },
    {
      path:'/auth/register',
      element: <Register />,
    },
    { path: '/auth/forgot-password', element: <ForgotPassword /> },
    { path: '/auth/reset-password', element: <Reset /> },
  ],
};

export default AuthenticationRoutes;
