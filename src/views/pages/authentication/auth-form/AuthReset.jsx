import React, { useEffect } from 'react';
import { Box, Button, IconButton, Typography, Zoom } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Form from 'components/form-management';
import * as Yup from 'yup';
import { motion, useAnimation } from 'framer-motion';
import { IconRefresh } from '@tabler/icons-react';
import { LightTooltip } from 'components/Tooltip';
import { getCookieState, removeCookie } from 'utils/cookie-utils';
import { useUsers } from 'hooks/api-custom-hook/useUsers';

import useCountdownTimer from 'hooks/useCountdownTimer';
import useSnackbarStore from 'hooks/useSnackbarStore';

const AuthReset = () => {
  const { RESET_PASSWORD } = useUsers();
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const navigate = useNavigate();
  const controls = useAnimation();
  const location = useLocation();

  // Get expire time from location state or default to 1 minute
  const expireTime = location.state?.expireTime ?? 1;

  const { timeLeft, formattedTime, startTimer, clearTimer } = useCountdownTimer(
    expireTime,
    'reset_password',
  );

  // Check token and start timer on mount
  useEffect(() => {
    const resetToken = getCookieState('reset_token');

    if (!resetToken) {
      clearTimer(); // Clear any existing timer data

      snackbarNotification({
        message: 'Reset Token has expired',
        severity: 'error',
      });
      navigate('/auth/forgot-password', { replace: true });
      return;
    }

    // If there's no creation time stored yet, this is the first load
    const existingTimer = localStorage.getItem('reset_password_creation_time');
    if (!existingTimer) {
      // Store the creation time when the token is first created
      localStorage.setItem('reset_password_creation_time', Date.now().toString());
    }

    startTimer();

    // Cleanup on unmount
    return () => {
      // if (!resetToken) {
      //   clearTimer();
      // }
      clearTimer();
    };
  }, []);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0) {
      clearTimer();
      removeCookie('reset_token');

      snackbarNotification({
        message: 'Session expired',
        severity: 'error',
      });
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [timeLeft]);

  // Animation effect for timer
  useEffect(() => {
    if (timeLeft > 0) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.4 },
      });
    }
  }, [timeLeft]);

  // Form submission handler
  const onSubmit = async ({ resetForm, values }) => {
    const resetToken = getCookieState('reset_token');

    if (!resetToken) {
      clearTimer();
      snackbarNotification({
        message: 'Session Expired',
        severity: 'error',
      });

      navigate('/auth/forgot-password', { replace: true });
      resetForm();
      return;
    }

    try {
      const formData = {
        token: resetToken,
        password: values.new_password,
      };

      const response = await RESET_PASSWORD(formData);

      snackbarNotification({
        message: response.message,
        severity: 'success',
      });
      setTimeout(() => {
        clearTimer(); // Clean up timer data
        removeCookie('reset_token');
        navigate('/', { replace: true });
        resetForm();
      }, 1200);
    } catch (error) {
      console.error(error);
    }
  };

  // Initial form values
  const initialvalues = {
    new_password: '',
    confirm_password: '',
    submit: null,
  };

  // Form field configuration
  const loginFormConfig = [
    {
      id: 'new_password',
      type: 'password',
      name: 'new_password',
      label: 'New Password',
      gridProps: { xs: 12 },
    },
    {
      id: 'confirm_password',
      type: 'password',
      name: 'confirm_password',
      label: 'Confirm Password',
      gridProps: { xs: 12 },
    },
  ];

  // Form validation schema
  const resetValidationSchema = Yup.object().shape({
    new_password: Yup.string()
      .required('Password is required')
      .min(8, 'Password is too short - should be 8 characters minimum.')
      .matches(/[a-zA-Z]/, 'Password Must Be Alphanumeric.'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('new_password'), null], 'Password must match')
      .required('Re-enter your New password'),
  });

  return (
    <Form
      initialValues={initialvalues}
      validationSchema={resetValidationSchema}
      onSubmit={onSubmit}
      formConfig={loginFormConfig}
    >
      {({ isSubmitting, resetForm }) => (
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Typography color={'error'} align="right" variant="subtitle1">
            <motion.div animate={controls} style={{ display: 'inline-block' }}>
              {formattedTime}
            </motion.div>
          </Typography>
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
              disabled={isSubmitting || !getCookieState('reset_token')}
              type="submit"
            >
              Reset Password
            </Button>
          </Box>
        </Box>
      )}
    </Form>
  );
};

export default AuthReset;
