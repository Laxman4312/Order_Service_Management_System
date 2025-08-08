import React from 'react';
import { Typography } from '@mui/material';
// components
import AuthReset from './auth-form/AuthReset';
import AuthLayout from './AuthLayout';

const Reset = () => {
  return (
    <AuthLayout
      title="Reset Password"
      description="this is Reset Password page"
      pageSubtext="Reset Password"
    >
      <AuthReset />
    </AuthLayout>
  );
};

export default Reset;
