import React from 'react';
import * as Yup from 'yup';
import { Button, DialogActions } from '@mui/material';

import { useDispatch } from 'react-redux';
import { triggerIsSavingFlag } from 'store/slices/general';
import { useUsers } from 'hooks/api-custom-hook/useUsers';
import { UsersIcon } from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import Form from 'components/form-management';
import useSnackbarStore from 'hooks/useSnackbarStore';

const UserDialog = ({ formData, isOpen, dialogType, handleCloseModal, transitions, isSaving }) => {
  const { createUser, updateUser } = useUsers();
  const dispatch = useDispatch();
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const INITIAL_FORM_STATE = {
    dialogType: dialogType,
    emp_id: '',
    name: '',
    email: '',
    contact_number: '',
    password: '',
    is_receiving: false,
    is_admin: false,
    is_consumption: false,
    is_issue: false,
    is_binning: false,
    is_inspection: false,
    login_access: true,
    is_deleted: false,
  };

  const formConfiguration = [
    {
      id: 'emp_id',
      name: 'emp_id',
      label: 'Employee ID',
      type: 'TEXT',
      gridProps: { xs: 6 },
      disabled: dialogType === 'Edit',
      required: true,
    },
    {
      id: 'name',
      name: 'name',
      label: 'Employee Name',
      type: 'TEXT',
      gridProps: { xs: 6 },
      required: true,
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'EMAIL',
      gridProps: { xs: 6 },
      required: true,
    },
    {
      id: 'contact_number',
      name: 'contact_number',
      label: 'Employee Contact Number',
      startAdornment: '+91',
      type: 'NUMBER',
      gridProps: { xs: 6 },
      required: true,
    },
    {
      id: 'password',
      name: 'password',
      label: 'Password',
      type: 'PASSWORD',
      gridProps: { xs: 6 },
      visibility: dialogType !== 'Edit',
      required: true,
    },
    {
      id: 'is_admin',
      name: 'is_admin',
      label: 'Admin Access',
      type: 'CHECKBOX',
      infoMessage: 'Users with Admin privileges will be granted access to all the Masters Modules.',
      gridProps: { xs: 12, lg: 10 },
    },
    {
      id: 'is_receiving',
      name: 'is_receiving',
      label: 'Receiving Access',
      type: 'CHECKBOX',
      infoMessage: 'User will be granted the access to Receiving Module',
      gridProps: { xs: 12, md: 6, lg: 5 },
    },
    {
      id: 'is_inspection',
      name: 'is_inspection',
      label: 'Inspection Access',
      type: 'CHECKBOX',
      infoMessage: 'User will be granted the access to Inspection Module',
      gridProps: { xs: 12, md: 6, lg: 5 },
    },
    {
      id: 'is_binning',
      name: 'is_binning',
      label: 'Binning Access',
      type: 'CHECKBOX',
      infoMessage: 'User will be granted the access to Binning Module',
      gridProps: { xs: 12, md: 6, lg: 5 },
    },
    {
      id: 'is_consumption',
      name: 'is_consumption',
      label: 'Consumption Access',
      type: 'CHECKBOX',
      infoMessage: 'User will be granted the access to Consumption Module',
      gridProps: { xs: 12, md: 6, lg: 5 },
    },
    {
      id: 'is_issue',
      name: 'is_issue',
      label: 'Issuing Access',
      type: 'CHECKBOX',
      infoMessage: 'User will be granted the access to Issuing Module',
      gridProps: { xs: 12, md: 6, lg: 5 },
    },
    {
      id: 'login_access',
      name: 'login_access',
      label: 'Login Access',
      type: 'CHECKBOX',
      infoMessage: 'The user will be granted access to log into the portal.',
      gridProps: { xs: 12, md: 6, lg: 5 },
    },
  ];

  const validationSchema = Yup.object().shape({
    emp_id: Yup.string().required('Employee ID required.'),
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Name Field should contain only Alphabets and spaces.')
      .required('Employee Name required.'),
    email: Yup.string().email('Must be a valid email.').required('Email Address is required.'),
    contact_number: Yup.string()
      .min(10, 'Enter a valid number')
      .max(10, 'Enter a valid number')
      .required('Employee Contact Number required.'),
    password: Yup.string().when('dialogType', {
      is: 'Add',
      then: () =>
        Yup.string()
          .required('Password is required')
          .min(8, 'Password is too short - should be 8 characters minimum.')
          .max(32, 'Password is too long - should be less then 32 characters.')
          .matches(/[a-zA-Z]/, 'Password Must Be Alphanumeric.'),
    }),
  });

  const getInitialValues = () => {
    if (formData) {
      const formattedUser = {
        ...formData,
        is_deleted: Boolean(formData.is_deleted),
      };
      delete formattedUser.created_at;
      delete formattedUser.updated_at;
      return formattedUser;
    }
    return INITIAL_FORM_STATE;
  };

  const prepareFormData = (values) => {
    const formData = { ...values };
    delete formData.created_at;
    delete formData.updated_at;
    delete formData.profile_photo;
    delete formData.is_deleted;
    delete formData.dialogType;

    return {
      ...formData,
      emp_id: String(formData.emp_id).trim(),

      name: String(formData.name).trim(),
      email: String(formData.email).trim(),
      contact_number: String(formData.contact_number),
      ...(formData.password ? { password: formData.password } : {}),
      is_receiving: Boolean(formData.is_receiving),
      is_admin: Boolean(formData.is_admin),
      is_consumption: Boolean(formData.is_consumption),
      is_issue: Boolean(formData.is_issue),
      is_binning: Boolean(formData.is_binning),
      is_inspection: Boolean(formData.is_inspection),
      login_access: Boolean(formData.login_access),
    };
  };

  const handleFormSubmit = async ({ values, resetForm }) => {
    try {
      const formData = prepareFormData(values);
      const response =
        dialogType === 'Add'
          ? await createUser(formData)
          : await updateUser({ ...formData, id: formData.id });

      dispatch(triggerIsSavingFlag(!isSaving));
      snackbarNotification({
        message: response.message,
        severity: 'success',
      });
      setTimeout(() => {
        handleCloseModal(dialogType, !isOpen);
        resetForm();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title={dialogType === 'Add' ? 'Add User' : 'Edit User Details'}
        subtitle="User Management"
        transitions={transitions}
        handleClose={handleCloseModal}
        image={UsersIcon}
      >
        <Form
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          formConfig={formConfiguration}
        >
          {(formikProps) => {
            return (
              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={formikProps.isSubmitting}
                >
                  {dialogType === 'Add' ? 'Add' : 'Save'}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    formikProps.resetForm('');
                    formikProps.setValues(INITIAL_FORM_STATE, false);
                  }}
                >
                  Clear
                </Button>
              </DialogActions>
            );
          }}
        </Form>
      </FormLayout>
    </ProjectDialog>
  );
};

export default UserDialog;
