
import React, { useEffect, useState } from 'react';

import * as Yup from 'yup';
import { Button, DialogActions } from '@mui/material';
import { useDispatch } from 'react-redux';

import { triggerIsSavingFlag } from 'store/slices/general';
import { useServices } from 'hooks/api-custom-hook/useServices';
import { useServiceStatus } from 'hooks/api-custom-hook/useServiceStatus';
import { ServiceImage } from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import Form from 'components/form-management';
import useSnackbarStore from 'hooks/useSnackbarStore';

const ServiceDialog = ({ formData, isOpen, dialogType, handleCloseModal, transitions, isSaving }) => {
  const dispatch = useDispatch();
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const { createService, updateService } = useServices();
  const { data: statusData, fetchStatusServices } = useServiceStatus();

  const [whatsappData, setWhatsappData] = useState(null);

  const INITIAL_FORM_STATE = {
    id: '',
    jobcard_no: '',
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    product_for_service: '',
    estimated_service_cost: '',
    estimated_delivery_date: '',
    comments: '',
    status_id: '',
  };

  // Form fields configuration
  const formConfiguration = [
    {
      id: 'customer_name',
      name: 'customer_name',
      label: 'Customer Name',
      type: 'TEXT',
      gridProps: { xs: 6 },
      required: true,
    },
    {
      id: 'customer_phone',
      name: 'customer_phone',
      label: 'Customer Phone',
      type: 'TEXT',
      gridProps: { xs: 6 },
      required: true,
      startAdornment: '+91',
    },
    {
      id: 'customer_address',
      name: 'customer_address',
      label: 'Customer Address',
      type: 'TEXT',
      gridProps: { xs: 12 },
      required: true,
    },
    {
      id: 'product_for_service',
      name: 'product_for_service',
      label: 'Product for Service',
      type: 'TEXT',
      gridProps: { xs: 6 },
      required: true,
    },
        {
      id: 'status_id',
      name: 'status_id',
      label: 'Service Status',
      type: 'SELECT',
      required: true,
      data: statusData,
      menuItem: { label: 'status_name', value: 'id' },
      gridProps: { xs: 6 },
    },
    {
      id: 'estimated_service_cost',
      name: 'estimated_service_cost',
      label: 'Estimated Service Cost (₹)',
      type: 'NUMBER',
      gridProps: { xs: 6 },
      required: true,
    },
    {
      id: 'estimated_delivery_date',
      name: 'estimated_delivery_date',
      label: 'Estimated Delivery Date',
      type: 'DATE',
      gridProps: { xs: 6 },
    },

    {
      id: 'comments',
      name: 'comments',
      label: 'Additional Comments',
      type: 'TEXT',
      gridProps: { xs: 12 },
    },
  ];

  // Validation schema
  const validationSchema = Yup.object().shape({
    customer_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Customer Name should contain only letters and spaces.')
      .required('Customer Name is required.'),

    customer_phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Customer Phone must be a valid 10-digit number.')
      .required('Customer Phone is required.'),

    customer_address: Yup.string().required('Customer Address is required.'),

    product_for_service: Yup.string().required('Product for Service is required.'),

    estimated_service_cost: Yup.number()
      .typeError('Estimated Service Cost must be a number.')
      .required('Estimated Service Cost is required.')
      .min(0, 'Estimated Service Cost cannot be negative.'),

    estimated_delivery_date: Yup.date()
      .nullable()
      .typeError('Estimated Delivery Date must be a valid date.'),

    status_id: Yup.string().required('Service Status is required.'),

    comments: Yup.string().notRequired(),
  });

  // Get initial form values either from formData or default state
  const getInitialValues = () => {
    if (formData) {
      const cleanData = { ...formData };
      delete cleanData.created_at;
      delete cleanData.updated_at;
      delete cleanData.status_name;
      return cleanData;
    }
    return INITIAL_FORM_STATE;
  };

  // Prepare data before submission by removing unwanted fields
  const prepareFormData = (values) => {
    const data = { ...values };
    delete data.dialogType;
    delete data.created_at;
    delete data.updated_at;
    return data;
  };

  // Handle form submission
  const handleFormSubmit = async ({ values, resetForm }) => {
    try {
      const formattedData = prepareFormData(values);
      console.log('Submitting form data:', formattedData);

      const response =
        dialogType === 'Add'
          ? await createService(formattedData)
          : await updateService(formData?.id, formattedData);

      dispatch(triggerIsSavingFlag(!isSaving));

      snackbarNotification({
        message: response.message,
        severity: 'success',
      });

      // Show WhatsApp button if new service and WhatsApp URL returned
      if (dialogType === 'Add' && response.whatsappUrl) {
        setWhatsappData({
          url: response.whatsappUrl,
          message: response.whatsappMessage,
        });
      } else {
        // Clear WhatsApp data if editing or no URL returned
        setWhatsappData(null);
      }

      // Close dialog and reset form after short delay, only on edit or add completion
      setTimeout(() => {
        handleCloseModal();
        resetForm();
      }, 1000);
    } catch (err) {
      console.error('Form submit error:', err);
      snackbarNotification({
        message: 'Failed to save service.',
        severity: 'error',
      });
    }
  };

  // Fetch status options on mount
  useEffect(() => {
    fetchStatusServices();
  }, [fetchStatusServices]);

  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title={dialogType === 'Add' ? 'Add Services' : 'Edit Service Details'}
        subtitle="Service Management"
        transitions={transitions}
        handleClose={handleCloseModal}
        image={ServiceImage}
      >
        <Form
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          formConfig={formConfiguration}
        >
          {(formikProps) => (
            <>
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
                    formikProps.resetForm();
                    formikProps.setValues(INITIAL_FORM_STATE, false);
                    setWhatsappData(null);
                  }}
                >
                  Clear
                </Button>
              </DialogActions>

              {whatsappData && (
                <DialogActions sx={{ justifyContent: 'flex-start', mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => window.open(whatsappData.url, '_blank')}
                  >
                    Send WhatsApp Message
                  </Button>
                </DialogActions>
              )}
            </>
          )}
        </Form>
      </FormLayout>
    </ProjectDialog>
  );
};

export default ServiceDialog;
