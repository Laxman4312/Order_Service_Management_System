import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import ErrorFallback from 'views/error/ErrorFallback';

// dashboard routing

const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const Users = Loadable(lazy(() => import('views/pages/master/user-management/users')));
const OrderList = Loadable(lazy(() => import('views/pages/master/order-list/order')));
const ServiceList = Loadable(lazy(() => import('views/pages/master/service-list/service')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <PrivateRoute>
      <MainLayout />
    </PrivateRoute>
  ),
  errorElement: <ErrorFallback />,
  children: [
    {
      path: '/',
      element: <Navigate to="/intro" />,
    },

    {
      path: '/dashboard',
      element: <DashboardDefault />,
    },
    // {
    //   path: 'order-list',
    //   children: [
    //     {
    //       path: '/orders',
    //       element: <OrderList />,
    //     },
    //   ],
    // },
    {
      path: 'orders',
      element: <OrderList />, 
    },
    {
      path: 'services',
      element: <ServiceList />,
    }
  ],
};

export default MainRoutes;
