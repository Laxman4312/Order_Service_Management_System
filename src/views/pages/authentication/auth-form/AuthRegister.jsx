import { Button, Typography, IconButton, Zoom, Divider, Box } from '@mui/material';


import { Link, useNavigate } from 'react-router-dom';

import Form from 'components/form-management';
import { LightTooltip } from 'components/Tooltip';
import { IconKey, IconMail, IconRefresh } from '@tabler/icons-react';
import * as Yup from 'yup';
import { useUser } from 'hooks/api-custom-hook/useUser';
import useSnackbarStore from 'hooks/useSnackbarStore';

const AuthRegister = () => {
  const snackbarNotification = useSnackbarStore((state) => state.open);
  const navigate = useNavigate();
  const { AUTH_REGISTER } = useUser(); 

  const initialValues = {
    email: '',
    password: '',
  };

  const registerFormConfig = [

    {
      id: 'email',
      type: 'email',
      name: 'email',
      startAdornment: <IconMail />,
      label: 'Email Address',
      gridProps: { xs: 12 },
    },
    {
      id: 'password',
      type: 'password',
      name: 'password',
      startAdornment: <IconKey />,
      label: 'Password',
      gridProps: { xs: 12 },
    },
  ];

  const registerValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should contain minimum 8 characters')
      .max(50)
      .required('Password is required'),
  });

  const onSubmit = async (values) => {
    try {
      const response = await AUTH_REGISTER(values.values);
      snackbarNotification({
        message: response.message || 'Registration successful!',
        severity: 'success',
      });

      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      snackbarNotification({
        message: error?.response?.data?.message || 'Something went wrong',
        severity: 'error',
      });
    }
  };

  return (
    <Form
      initialValues={initialValues}
      validationSchema={registerValidationSchema}
      onSubmit={onSubmit}
      formConfig={registerFormConfig}
    >
      {({ isSubmitting, resetForm }) => (
        <Box display="flex" flexDirection="column" gap={2}>
          <Divider sx={{ mx: 8 }} />
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
              Already have an account? Login
            </Typography>
            <LightTooltip title="Reset Form" TransitionComponent={Zoom} TransitionProps={{ timeout: 350 }}>
              <IconButton color="error" size="small" onClick={resetForm}>
                <IconRefresh />
              </IconButton>
            </LightTooltip>
          </Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting}
            type="submit"
          >
            Register
          </Button>
        </Box>
      )}
    </Form>
  );
};

export default AuthRegister;
