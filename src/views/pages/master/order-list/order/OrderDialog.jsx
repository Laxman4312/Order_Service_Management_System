import React, { useEffect, useState } from 'react';

import * as Yup from 'yup';
import { Button, DialogActions } from '@mui/material';
import { useDispatch } from 'react-redux';

import { triggerIsSavingFlag } from 'store/slices/general';
import { useOrders } from 'hooks/api-custom-hook/useOrders';
import { useOrderStatus } from 'hooks/api-custom-hook/useOrderStatus';
import {  OrderImage } from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import Form from 'components/form-management';
import useSnackbarStore from 'hooks/useSnackbarStore';

const OrderDialog = ({ formData, isOpen, dialogType, handleCloseModal, transitions, isSaving }) => {
  const { createOrder, updateOrder } = useOrders();
  const { data, isLoading, isError, fetchStatusOrders } = useOrderStatus();
  console.log(data);
  const dispatch = useDispatch();
  const snackbarNotification = useSnackbarStore((state) => state.open);
  const [whatsappData, setWhatsappData] = useState(null);

  const INITIAL_FORM_STATE = {
    dialogType: dialogType,
    customer_name: '',
    customer_contact: '',
    customer_address: '',
    product: '',
    total_amount: '',
    advance_paid: '',
    advance_mode: '',
    estimated_dispatch_date: '',
    revised_dispatch_date: '',
    shipping_carrier: '',
    shipping_lr_tracking: '',
    comments: '',
    status_id: '',
  };

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
      id: 'customer_contact',
      name: 'customer_contact',
      label: 'Customer Contact',
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
      id: 'product',
      name: 'product',
      label: 'Product Details',
      type: 'TEXT',
      gridProps: { xs: 12 },
      required: true,
    },
    {
      id: 'total_amount',
      name: 'total_amount',
      label: 'Total Amount (₹)',
      type: 'NUMBER',
      gridProps: { xs: 6 },
      required: true,
    },
    {
      id: 'advance_paid',
      name: 'advance_paid',
      label: 'Advance Paid (₹)',
      type: 'NUMBER',
      gridProps: { xs: 6 },
    },
    {
      id: 'advance_mode',
      name: 'advance_mode',
      label: 'Advance Payment Mode',
      type: 'SELECT',
      menuItem: {
        label: 'label',
        value: 'value',
      },
      data: [
        { label: 'UPI', value: 'upi' },
        { label: 'Cash', value: 'cash' },
      ],
      gridProps: { xs: 6 },
    },
    {
      id: 'estimated_dispatch_date',
      name: 'estimated_dispatch_date',
      label: 'Estimated Dispatch Date',
      type: 'DATE',
      gridProps: { xs: 6 },
    },
    {
      id: 'revised_dispatch_date',
      name: 'revised_dispatch_date',
      label: 'Revised Dispatch Date',
      type: 'DATE',
      gridProps: { xs: 6 },
    },
    {
      id: 'shipping_carrier',
      name: 'shipping_carrier',
      label: 'Shipping Carrier',
      type: 'TEXT',
      gridProps: { xs: 6 },
    },
    {
      id: 'shipping_lr_tracking',
      name: 'shipping_lr_tracking',
      label: 'Shipping LR/Tracking Number',
      type: 'TEXT',
      gridProps: { xs: 6 },
    },
    //  {
    //   id: 'status_id',
    //   name: 'status_id',
    //   label: 'Order Status',
    //   type: 'SELECT',
    //   required: true,
    //   options: [
    //     { label: 'Pending', value: 1 },
    //     { label: 'Processing', value: 2 },
    //     { label: 'Shipped', value: 3 },
    //     { label: 'Delivered', value: 4 },
    //     { label: 'Cancelled', value: 5 },
    //   ],
    //   gridProps: { xs: 6 },
    // },
    {
      id: 'status_id',
      name: 'status_id',
      label: 'Order Status',
      type: 'SELECT',
      required: true,
      data: data,
      menuItem: { label: 'status_name', value: 'id' },
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

  const validationSchema = Yup.object().shape({
    customer_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Customer Name should contain only letters and spaces.')
      .required('Customer Name is required.'),
    customer_contact: Yup.string()
      .matches(/^[0-9]{10}$/, 'Customer Contact must be a valid 10-digit number.')
      .required('Customer Contact is required.'),
    customer_address: Yup.string().required('Customer Address is required.'),
    product: Yup.string().required('Product Details are required.'),
    total_amount: Yup.number()
      .typeError('Total Amount must be a number.')
      .required('Total Amount is required.')
      .min(0, 'Amount cannot be negative.'),
    advance_paid: Yup.number()
      .typeError('Advance Paid must be a number.')
      .min(0, 'Amount cannot be negative.')
      .notRequired(),
    advance_mode: Yup.string().when('advance_paid', {
      is: (val) => !!val && val > 0,
      then: () =>
        Yup.string()
          .oneOf(['upi', 'cash'], 'Invalid payment mode.')
          .required('Advance Payment Mode is required when Advance Paid is entered.'),
      otherwise: () => Yup.string().notRequired(),
    }),

    estimated_dispatch_date: Yup.date()
      .typeError('Estimated Dispatch Date must be a valid date.')
      .nullable()
      .notRequired(),
    revised_dispatch_date: Yup.date()
      .typeError('Revised Dispatch Date must be a valid date.')
      .nullable()
      .notRequired(),
    shipping_carrier: Yup.string().notRequired(),
    shipping_lr_tracking: Yup.string().notRequired(),
    comments: Yup.string().notRequired(),
    status_id: Yup.number()
      .typeError('Order Status is required.')
      .required('Order Status is required.'),
  });

  const getInitialValues = () => {
    if (formData) {
      const cleanData = { ...formData };
      delete cleanData.created_at;
      delete cleanData.updated_at;
      delete  cleanData.status_name;
      return cleanData;
    }
    return INITIAL_FORM_STATE;
  };
  console.log('values is', INITIAL_FORM_STATE);

  const prepareFormData = (values) => {
    const data = { ...values };
    delete data.dialogType;
    delete data.created_at;
    delete data.updated_at;
    return data;
  };

  const handleFormSubmit = async ({ values, resetForm }) => {
    try {
      const formattedData = prepareFormData(values);
      console.log('SUBMITTING FORM', formattedData);

      const response =
        dialogType === 'Add'
          ? await createOrder(formattedData)
          : await await updateOrder(formData?.id, formattedData);

      dispatch(triggerIsSavingFlag(!isSaving));

      snackbarNotification({
        message: response.message,
        severity: 'success',
      });

      if (dialogType === 'Add' && response.whatsappUrl) {
        // Store WhatsApp data for button rendering
        setWhatsappData({
          url: response.whatsappUrl,
          message: response.whatsappMessage,
        });
      }

      setTimeout(() => {
        if (dialogType !== 'Add') {
          handleCloseModal(dialogType, !isOpen);
          resetForm();
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      snackbarNotification({
        message: 'Failed to save order.',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    const params = {};
    fetchStatusOrders({ params });
  }, []);

  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title={dialogType === 'Add' ? 'Add Order' : 'Edit Order Details'}
        subtitle="Order Management"
        transitions={transitions}
        handleClose={handleCloseModal}
        image={ OrderImage}
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

export default OrderDialog;
