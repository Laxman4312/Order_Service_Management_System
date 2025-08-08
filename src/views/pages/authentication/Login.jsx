import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AuthLogin from './auth-form/AuthLogin';
import AuthLayout from './AuthLayout';
import { logout } from 'store/slices/auth';

const Login = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(logout());
    }
  }, [dispatch, location.pathname]);

  return (
    <AuthLayout title="Login" pageTitle="LOGIN" description="Order Service Management System">
      <AuthLogin />
    </AuthLayout>
  );
};

export default Login;
