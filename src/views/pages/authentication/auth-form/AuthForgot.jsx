import React from 'react';
import { Box, Button, IconButton, Typography, Zoom } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import { IconHash, IconRefresh } from '@tabler/icons-react';
import * as Yup from 'yup';
import Form from 'components/form-management';

import { LightTooltip } from 'components/Tooltip';
import { useUsers } from 'hooks/api-custom-hook/useUsers';
import { setEncryptedCookie } from 'utils/cookie-utils';
import useSnackbarStore from 'hooks/useSnackbarStore';

const AuthForgot = () => {
  const { FORGOT_PASSWORD } = useUsers();
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const navigate = useNavigate();

  //Form-Config
  const forgotPasswordFormConfig = [
    {
      id: 'identifier',
      type: 'text',
      name: 'identifier',
      startAdornment: <IconHash />,
      label: 'Employee ID / Email Address',
      gridProps: { xs: 12 },
    },
    {
      id: 'contact_number',
      type: 'number',
      name: 'contact_number',
      startAdornment: '+91',
      label: 'Employee Contact Number',
      gridProps: { xs: 12 },
    },
  ];

  //Validation
  const forgotPasswordValidationSchema = Yup.object().shape({
    identifier: Yup.string()
      .matches(/^[^\s]+$/, ' This field must not contain any spaces')
      .max(60, 'Enter a valid Email Address')
      .required('Employee Id / Email address required'),
    contact_number: Yup.string()
      .min(10, 'Enter a valid Mobile Number')
      .max(10, 'Enter a valid Mobile Number')
      .required('Contact Number required'),
  });

  //Initial Values
  const initialvalues = {
    identifier: '',
    contact_number: '',
  };

  //Form Submit
  const onSubmit = async ({ resetForm, values }) => {
    try {
      const formData = {
        identifier: values.identifier,
        contact_number: String(values.contact_number),
      };
      const response = await FORGOT_PASSWORD(formData);

      const currentDate = new Date();
      const expireTime = 5;
      const expiry = new Date(currentDate.getTime() + expireTime * 60 * 1000);
      const resetToken = response?.result?.resetToken ?? '';
      setEncryptedCookie('reset_token', resetToken, expiry);

      snackbarNotification({
        message: 'User Found Successfully',
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/auth/reset-password', {
          state: {
            expireTime: expireTime,
          },
        });
        resetForm();
      }, 1200);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form
        initialValues={initialvalues}
        validationSchema={forgotPasswordValidationSchema}
        onSubmit={onSubmit}
        formConfig={forgotPasswordFormConfig}
      >
        {({ isSubmitting, resetForm }) => (
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography
                component={Link}
                to="/"
                fontWeight="500"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  cursor: 'pointer',
                }}
              >
                Back To Login
              </Typography>
              <LightTooltip
                title="Reset Form"
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 350 }}
              >
                <IconButton color="error" size="small" onClick={resetForm}>
                  <IconRefresh />
                </IconButton>
              </LightTooltip>
            </Box>
            <Box>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </Form>
    </>
  );
};

export default AuthForgot;
