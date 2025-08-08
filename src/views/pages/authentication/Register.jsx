import React from 'react';
import AuthRegister from './auth-form/AuthRegister';
import AuthLayout from './AuthLayout';

const Register = () => {
  return (
    <AuthLayout title="Register" pageTitle="REGISTER" description="Create an account to get started">
      <AuthRegister />
    </AuthLayout>
  );
};

export default Register;
