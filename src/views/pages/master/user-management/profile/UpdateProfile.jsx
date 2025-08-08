import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import FormLayout from 'components/form-layout/FormLayout';
import Form from 'components/form-management';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { triggerIsSavingFlag, triggerTransitionsFlag } from 'redux/slices/general';
import { showSnackbar } from 'redux/slices/snackbar';
import { editUser, resetUserFormData } from 'redux/slices/user';
import Cookies from 'js-cookie';
import { encryptData } from 'utils/auth-utils';
import { refreshAuthState } from 'redux/slices/auth';
import { MAX_FILE_SIZE } from 'components/MiniComponents';

const UpdateProfile = ({ isOpen, dialogType, handleCloseModal }) => {
  const dispatch = useDispatch();
  //Fetching states from Redux Store!
  const { userId, profilePictureLink, empNo, usrName, emailUsr, usrNumb, empDesig, is_admin } = useSelector((state) => state.user);
  //Initial Values
  const initialValues = {
    userId,
    profilePictureLink,
    empNo,
    usrName,
    emailUsr,
    usrNumb,
    empDesig,
    is_admin
  };

  //Form Config
  const formConfig = [
    {
      id: 'profilePictureLink',
      name: 'profilePictureLink',
      type: 'image',
      accept: 'image/*',
      gridSizeXS: 12
    },
    {
      id: 'usrName',
      type: 'text',
      name: 'usrName',
      label: 'Full Name',
      gridSizeXS: 12
    },
    {
      id: 'emailUsr',
      type: 'email',
      name: 'emailUsr',
      label: 'Email Address',
      gridSizeXS: 12,
      gridSizeMD: 6
    },
    {
      id: 'usrNumb',
      type: 'number',
      name: 'usrNumb',
      label: 'Contact Number',
      gridSizeXS: 12,
      gridSizeMD: 6
    }
  ];

  //Form Headers
  const headers = {
    'Content-Type': 'multipart/form-data'
  };

  //On submit
  const updateProfile = async (details) => {
    try {
      let formData = {
        id: details.userId,
        profilePictureLink: details.profilePictureLink,
        empNo: details.empNo,
        usrName: details.usrName,
        usrNumb: details.usrNumb,
        emailUsr: details.emailUsr,
        empDesig: details.empDesig,
        is_admin: details.is_admin
      };
      const response = await dispatch(editUser({ formData, headers })).unwrap();
      if (response.status === 1) {
        Cookies.remove('userData', { path: '/' });
        dispatch(showSnackbar({ message: 'Profile updated Successfully', severity: 'success' }));
        const userData = response.body.user;
        const encryptedUserData = encryptData(userData);
        try {
          const expires = new Date(Date.now() + 3 * 60 * 60 * 1000);
          Cookies.set('userData', encryptedUserData, { expires });
        } catch (error) {
          console.error('Error setting cookies:', error);
          throw error;
        }
        dispatch(refreshAuthState());
        setTimeout(() => {
          handleCloseModal(dialogType, !isOpen);
        }, 1000);
      } else {
        dispatch(showSnackbar({ message: response.message, severity: 'info' }));
        dispatch(triggerIsSavingFlag(!isSaving));
      }
    } catch (err) {
      console.error(err);
      if (err.request.status === 400) {
        dispatch(
          showSnackbar({
            message: 'User already exists, Please try again!',
            severity: 'error'
          })
        );
      } else {
        dispatch(showSnackbar({ message: err.request.message, severity: 'error' }));
      }
    }
  };

  const handleClose = () => {
    dispatch(resetUserFormData());
    handleCloseModal();
  };

  useEffect(() => {
    dispatch(triggerTransitionsFlag());
    return () => {
      dispatch(triggerTransitionsFlag());
    };
  }, [dispatch]);

  //Validation Schema
  const validationSchema = Yup.object().shape({
    profilePictureLink: Yup.mixed()
      .nullable()
      .test('fileSize', 'File size must be 500KB or less', (value) => {
        if (value instanceof File) {
          return value.size <= MAX_FILE_SIZE;
        }
        return true; // Pass validation for non-File values (like strings)
      }),
    usrName: Yup.string().matches(/^[A-Za-z\s]+$/, ' Name must contain only alphabets and spaces').required('Full Name is required.'),
    emailUsr: Yup.string().email('Must be a valid email.').required('Email Address is required.'),
    usrNumb: Yup.string().required('Contact Number is required.').min(10, 'Enter a valid number').max(10, 'Enter a valid number')
  });
  return (
    <Dialog open={isOpen} maxWidth="sm" fullWidth>
      <FormLayout isOpen={isOpen} title="Update Profile" subtitle="Profile" handleClose={handleClose}>
        <DialogContent sx={{ p: 1, m: 0 }}>
          <Form initialValues={initialValues} validationSchema={validationSchema} onSubmit={updateProfile} formConfig={formConfig}>
            {({ isSubmitting, resetForm }) => (
              <DialogActions>
                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                  Update Profile
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    dispatch(resetUserFormData());
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

UpdateProfile.propTypes = {
  isOpen: PropTypes.bool,
  dialogType: PropTypes.string,
  handleCloseModal: PropTypes.func
};

export default UpdateProfile;
