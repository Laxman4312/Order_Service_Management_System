import React from 'react';

// components
import AuthForgot from './auth-form/AuthForgot';
import AuthLayout from './AuthLayout';

const ForgotPassword = () => {
  return (
    <AuthLayout
      title="Forgot Password"
      description="Forgot Password Page"
      pageSubtext="Forgot Password"
    >
      <AuthForgot />
    </AuthLayout>
  );
};

export default ForgotPassword;
