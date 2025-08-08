import { Button, Typography, IconButton, Zoom, Divider, Box } from '@mui/material';

import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { rehydrateAuth } from 'store/slices/auth';
import Form from 'components/form-management';
import { LightTooltip } from 'components/Tooltip';
import { IconHash, IconKey, IconRefresh } from '@tabler/icons-react';
import * as Yup from 'yup';
import { useUser} from 'hooks/api-custom-hook/useUser';

import { setEncryptedCookie } from 'utils/cookie-utils';
import TokenService from 'api/services/tokenService';
import useSnackbarStore from 'hooks/useSnackbarStore';

const AuthLogin = () => {
  const dispatch = useDispatch();
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const navigate = useNavigate();
  const { AUTH_LOGIN } = useUser();

  //Initial Values
  const initialvalues = {
    email: '',
    password: '',
  };

  const loginFormConfig = [
    {
      id: 'email',
      type: 'text',
      name: 'email',
      startAdornment: <IconHash />,
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

  //Validation
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should contain minimum 8 characters')
      .max(50)
      .required('Password is required'),
  });

  //Form Submit
 const onSubmit = async (values) => {
  try {
    const response = await AUTH_LOGIN(values.values);

    // Destructure the correct fields from the API response
    const { message, token, user } = response;

    setEncryptedCookie('userData', user);
    setEncryptedCookie('isAuthenticated', true);
    TokenService.setToken(token);

    snackbarNotification({
      message: message || 'Login successful',
      severity: 'success',
    });

    dispatch(rehydrateAuth());
    navigate('/dashboard', { replace: true });
  } catch (error) {
    console.error('Login error:', error);

    snackbarNotification({
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please try again.',
      severity: 'error',
    });
  }
};

  return (
    <Form
      initialValues={initialvalues}
      validationSchema={loginValidationSchema}
      onSubmit={onSubmit}
      formConfig={loginFormConfig}
    >
      {({ isSubmitting, resetForm }) => (
        <Box display="flex" flexDirection="column" gap={2}>
          <Divider sx={{ mx: 8 }} />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography
              component={Link}
              to="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                cursor: 'pointer',
              }}
            >
              Forgot Password ?
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
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting}
            type="submit"
          >
            Login
          </Button>
        </Box>
      )}
    </Form>
  );
};

export default AuthLogin;
