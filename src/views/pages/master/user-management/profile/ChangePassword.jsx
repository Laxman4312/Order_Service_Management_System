import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { CHANGE_PASSWORD } from 'api/config';
import FormLayout from 'components/form-layout/FormLayout';
import Form from 'components/form-management';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from 'redux/slices/snackbar';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const ChangePassword = ({ isOpen, handleCloseModal }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  //Initial Values
  const initialValues = {
    userId: userData?._id ?? '',
    usrPwd: '',
    newPassword: '',
    confirmPassword: ''
  };

  //Form Config
  const formConfig = [
    {
      id: 'usrPwd',
      type: 'password',
      name: 'usrPwd',
      label: 'Current Password',
      gridSizeXS: 12
    },
    {
      id: 'newPassword',
      type: 'password',
      name: 'newPassword',
      label: 'New Password',
      gridSizeXS: 12
    },
    {
      id: 'confirmPassword',
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm Password',
      gridSizeXS: 12
    }
  ];

  //On submit
  const changePassword = async (details) => {
    try {
      let formData = {
        id: details.userId,
        usrPwd: details.usrPwd,
        newPassword: details.newPassword
      };
      const response = await CHANGE_PASSWORD({ formData });
      if (response.status === 1) {
        dispatch(showSnackbar({ message: 'Password updated Successfully', severity: 'success' }));
        setTimeout(() => {
          handleCloseModal(!isOpen);
        }, 1000);
      } else {
        dispatch(showSnackbar({ message: response.message, severity: 'info' }));
      }
    } catch (err) {
      console.error(err);
      dispatch(showSnackbar({ message: err.request.message, severity: 'error' }));
    }
  };

  const handleClose = () => {
    handleCloseModal(!isOpen);
  };

  //Validation Schema
  const validationSchema = Yup.object().shape({
    usrPwd: Yup.string().required('Enter your Current Password'),
    newPassword: Yup.string()
      .required('Password is required')
      .min(8, 'Password is too short - should be 8 characters minimum.')
      .matches(/[a-zA-Z]/, 'Password Must Be Alphanumeric.'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Password must match')
      .required('Re-enter your New password')
  });
  return (
    <Dialog open={isOpen} maxWidth="sm" fullWidth>
      <FormLayout isOpen={isOpen} title="Change Password" subtitle="Profile" handleClose={handleClose}>
        <DialogContent sx={{ p: 1, m: 0 }}>
          <Form initialValues={initialValues} validationSchema={validationSchema} onSubmit={changePassword} formConfig={formConfig}>
            {({ isSubmitting, resetForm }) => (
              <DialogActions>
                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    resetForm();
                  }}
                >
                  Clear
                </Button>
              </DialogActions>
            )}
          </Form>
        </DialogContent>
      </FormLayout>
    </Dialog>
  );
};

ChangePassword.propTypes = {
  isOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func
};

export default ChangePassword;
