import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Tab,
  Tabs,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import PageContainer from 'components/container/PageContainer';
import Form from 'components/form-management';
import { triggerIsSavingFlag } from 'store/slices/general';
import useSnackbarStore from 'hooks/useSnackbarStore';
import { OrderImage1, ServiceImage } from 'config/icons';

// Custom hooks (you'll need to create these based on your API structure)
import { useOrders } from 'hooks/api-custom-hook/useOrders';
import { useServices } from 'hooks/api-custom-hook/useServices';
import { useOrderStatus } from 'hooks/api-custom-hook/useOrderStatus';
import { useServiceStatus } from 'hooks/api-custom-hook/useServiceStatus';

const Dashboard = () => {
  const dispatch = useDispatch();
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const [tabValue, setTabValue] = useState('order');
  const [isSaving, setIsSaving] = useState(false);

  // Custom hooks for API calls
  const { createOrder, getOrdersCount } = useOrders();
  const { createService, getServicesCount } = useServices();
  const { data: orderStatusData, fetchStatusOrders } = useOrderStatus();
  const { data: serviceStatusData, fetchStatusServices } = useServiceStatus();

  // State for counts
  const [orderCount, setOrderCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);

  // Initial form states
  const ORDER_INITIAL_STATE = {
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
    status_id: ''
  };

  const SERVICE_INITIAL_STATE = {
    customer_name: '',
    customer_address: '',
    customer_phone: '',
    product_for_service: '',
    service_details: '',
    estimated_service_cost: '',
    estimated_delivery_date: '',
    comments: '',
    status_id: ''
  };


  const orderFormConfiguration = [
    {
      id: 'customer_name',
      name: 'customer_name',
      label: 'Customer Name',
      type: 'TEXT',
      gridProps: { xs: 12, sm: 6 },
      required: true,
    },
    {
      id: 'customer_contact',
      name: 'customer_contact',
      label: 'Customer Contact',
      type: 'TEXT',
      gridProps: { xs: 12, sm: 6 },
      required: true,
    },
    {
      id: 'customer_address',
      name: 'customer_address',
      label: 'Customer Address',
      type: 'TEXT',
      gridProps: { xs: 12 },
      required: true,
      multiline: true,
      rows: 2,
    },
    {
      id: 'product',
      name: 'product',
      label: 'Product',
      type: 'TEXT',
      gridProps: { xs: 12, sm: 6 },
      required: true,
    },
    {
      id: 'total_amount',
      name: 'total_amount',
      label: 'Total Amount',
      type: 'NUMBER',
      gridProps: { xs: 12, sm: 6 },
      required: true,
      startAdornment: '₹',
    },
    {
      id: 'advance_paid',
      name: 'advance_paid',
      label: 'Advance Paid',
      type: 'NUMBER',
      gridProps: { xs: 12, sm: 6 },
      required: true,
      startAdornment: '₹',
    },
    {
      id: 'advance_mode',
      name: 'advance_mode',
      label: 'Payment Mode',
      type: 'SELECT',
      gridProps: { xs: 12, sm: 6 },
      required: true,
      data: [
        { id: 'cash', status_name: 'Cash' },
        { id: 'upi', status_name: 'UPI' },
      
      ],
      menuItem: { label: 'status_name', value: 'id' },
    },
    {
      id: 'estimated_dispatch_date',
      name: 'estimated_dispatch_date',
      label: 'Estimated Dispatch Date',
      type: 'DATE',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      id: 'revised_dispatch_date',
      name: 'revised_dispatch_date',
      label: 'Revised Dispatch Date',
      type: 'DATE',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      id: 'shipping_carrier',
      name: 'shipping_carrier',
      label: 'Shipping Carrier',
      type: 'TEXT',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      id: 'shipping_lr_tracking',
      name: 'shipping_lr_tracking',
      label: 'Tracking Number',
      type: 'TEXT',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      id: 'status_id',
      name: 'status_id',
      label: 'Order Status',
      type: 'SELECT',
      required: true,
      data: orderStatusData,
      menuItem: { label: 'status_name', value: 'id' },
      gridProps: { xs: 12, sm: 6 },
    },
    {
      id: 'comments',
      name: 'comments',
      label: 'Additional Comments',
      type: 'TEXT',
      gridProps: { xs: 12 },
      multiline: true,
      rows: 3,
    },
  ];

  // Service form configuration
  const serviceFormConfiguration = [
    {
      id: 'customer_name',
      name: 'customer_name',
      label: 'Customer Name',
      type: 'TEXT',
      gridProps: { xs: 12, sm: 6 },
      required: true,
    },
    {
      id: 'customer_phone',
      name: 'customer_phone',
      label: 'Customer Phone',
      type: 'TEXT',
      gridProps: { xs: 12, sm: 6 },
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
      multiline: true,
      rows: 2,
    },
    {
      id: 'product_for_service',
      name: 'product_for_service',
      label: 'Product for Service',
      type: 'TEXT',
      gridProps: { xs: 12, sm: 6 },
      required: true,
    },
    {
      id: 'service_details',
      name: 'service_details',
      label: 'Service Details',
      type: 'TEXT',
      gridProps: { xs: 12, sm: 6 },
      required: true,
      multiline: true,
      rows: 2,
    },
    {
      id: 'estimated_service_cost',
      name: 'estimated_service_cost',
      label: 'Estimated Service Cost',
      type: 'NUMBER',
      gridProps: { xs: 12, sm: 6 },
      required: true,
      startAdornment: '₹',
    },
    {
      id: 'estimated_delivery_date',
      name: 'estimated_delivery_date',
      label: 'Estimated Delivery Date',
      type: 'DATE',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      id: 'status_id',
      name: 'status_id',
      label: 'Service Status',
      type: 'SELECT',
      required: true,
      data: serviceStatusData,
      menuItem: { label: 'status_name', value: 'id' },
      gridProps: { xs: 12, sm: 6 },
    },
    {
      id: 'comments',
      name: 'comments',
      label: 'Additional Comments',
      type: 'TEXT',
      gridProps: { xs: 12 },
      multiline: true,
      rows: 3,
    },
  ];

  // Order validation schema
  const orderValidationSchema = Yup.object().shape({
    customer_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Customer Name should contain only letters and spaces.')
      .required('Customer Name is required.'),
    customer_contact: Yup.string()
      .matches(/^[0-9]{10}$/, 'Customer Contact must be a valid 10-digit number.')
      .required('Customer Contact is required.'),
    customer_address: Yup.string().required('Customer Address is required.'),
    product: Yup.string().required('Product is required.'),
    total_amount: Yup.number()
      .typeError('Total Amount must be a number.')
      .required('Total Amount is required.')
      .min(0, 'Total Amount cannot be negative.'),
    advance_paid: Yup.number()
      .typeError('Advance Paid must be a number.')
      .required('Advance Paid is required.')
      .min(0, 'Advance Paid cannot be negative.'),
    advance_mode: Yup.string().required('Payment Mode is required.'),
    status_id: Yup.string().required('Order Status is required.'),
    estimated_dispatch_date: Yup.date()
      .nullable()
      .typeError('Estimated Dispatch Date must be a valid date.'),
    revised_dispatch_date: Yup.date()
      .nullable()
      .typeError('Revised Dispatch Date must be a valid date.'),
  });

  // Service validation schema
  const serviceValidationSchema = Yup.object().shape({
    customer_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Customer Name should contain only letters and spaces.')
      .required('Customer Name is required.'),
    customer_phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Customer Phone must be a valid 10-digit number.')
      .required('Customer Phone is required.'),
    customer_address: Yup.string().required('Customer Address is required.'),
    product_for_service: Yup.string().required('Product for Service is required.'),
    service_details: Yup.string().required('Service Details is required.'),
    estimated_service_cost: Yup.number()
      .typeError('Estimated Service Cost must be a number.')
      .required('Estimated Service Cost is required.')
      .min(0, 'Estimated Service Cost cannot be negative.'),
    estimated_delivery_date: Yup.date()
      .nullable()
      .typeError('Estimated Delivery Date must be a valid date.'),
    status_id: Yup.string().required('Service Status is required.'),
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle order form submission
  const handleOrderSubmit = async ({ values, resetForm }) => {
    try {
      setIsSaving(true);
      const response = await createOrder(values);
      
      dispatch(triggerIsSavingFlag(!isSaving));
      
      snackbarNotification({
        message: response.message || 'Order created successfully!',
        severity: 'success',
      });

      // Refresh counts after successful creation
      fetchCounts();
      resetForm();
    } catch (err) {
      console.error('Order submit error:', err);
      snackbarNotification({
        message: 'Failed to create order.',
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle service form submission
  const handleServiceSubmit = async ({ values, resetForm }) => {
    try {
      setIsSaving(true);
      const response = await createService(values);
      
      dispatch(triggerIsSavingFlag(!isSaving));
      
      snackbarNotification({
        message: response.message || 'Service created successfully!',
        severity: 'success',
      });

      // Refresh counts after successful creation
      fetchCounts();
      resetForm();
    } catch (err) {
      console.error('Service submit error:', err);
      snackbarNotification({
        message: 'Failed to create service.',
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };


// Fetch counts data
const fetchCounts = async () => {
  try {
    setLoadingCounts(true);

    const [orderCountData, serviceCountData] = await Promise.all([
      getOrdersCount(),
      getServicesCount()
    ]);

    console.log('Order Count Response:', orderCountData);
    console.log('Service Count Response:', serviceCountData);

    setOrderCount(orderCountData?.total || 0);
    setServiceCount(serviceCountData?.total || 0);

  } catch (error) {
    console.error('Failed to fetch counts:', error);
    snackbarNotification({
      message: 'Failed to load dashboard counts.',
      severity: 'error',
    });
  } finally {
    setLoadingCounts(false);
  }
};




  // Fetch status data on component mount and tab change
  useEffect(() => {
    // Fetch counts on mount
    fetchCounts();
    
    if (tabValue === 'order') {
      fetchStatusOrders();
    } else if (tabValue === 'service') {
      fetchStatusServices();
    }
  }, [tabValue, fetchStatusOrders, fetchStatusServices]);

  return (
    <PageContainer title="Dashboard" description="Order & Service Management Dashboard">
      <Box sx={{ width: '100%', pt: 4, px: 2 }}>
        
      
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={6}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                }
              }}
            >
              <CardContent sx={{ width: '100%', p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, opacity: 0.9, mb: 1,color: 'white' }}>
                      Total Orders
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {loadingCounts ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                          {orderCount}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 ,color: 'white' }}>
                      Active entries
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      fontSize: '3rem', 
                      opacity: 0.6,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <img src={OrderImage1} alt="Order Icon" style={{ width: '50px', height: '50px' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={6}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                }
              }}
            >
              <CardContent sx={{ width: '100%', p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, opacity: 0.9, mb: 1 ,color: 'white' }}>
                      Total Services
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {loadingCounts ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                          {serviceCount}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 ,color: 'white' }}>
                      Active entries
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      fontSize: '3rem', 
                      opacity: 0.6,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <img src={ServiceImage} alt="Service Icon" style={{ width: '50px', height: '50px' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Tabs */}
        <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ pb: '16px !important' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Dashboard Tabs"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minWidth: 120,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <Tab 
                label="📦 Order Management" 
                value="order" 
                icon={<Box component="span" sx={{ fontSize: '1.2rem' }}></Box>}
                iconPosition="start"
              />
              <Tab 
                label="🔧 Service Management" 
                value="service"
                icon={<Box component="span" sx={{ fontSize: '1.2rem' }}></Box>}
                iconPosition="start"
              />
            </Tabs>
          </CardContent>
        </Card>

        {/* Order Form Card */}
        {tabValue === 'order' && (
          <Card sx={{ boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box component="span" sx={{ fontSize: '2rem', mr: 2 }}>📦</Box>
                <Box>
                  <Typography variant="h5" component="h2" color="primary" fontWeight="bold">
                    Create New Order
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill in the order details below to create a new order entry
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 3 }} />

              <Form
                initialValues={ORDER_INITIAL_STATE}
                validationSchema={orderValidationSchema}
                onSubmit={handleOrderSubmit}
                formConfig={orderFormConfiguration}
              >
                {(formikProps) => (
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          formikProps.resetForm();
                          formikProps.setValues(ORDER_INITIAL_STATE, false);
                        }}
                        sx={{ minWidth: 100 }}
                      >
                        Clear Form
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={formikProps.isSubmitting || isSaving}
                        sx={{ minWidth: 120 }}
                      >
                        {isSaving ? 'Creating...' : 'Create Order'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Service Form Card */}
        {tabValue === 'service' && (
          <Card sx={{ boxShadow: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box component="span" sx={{ fontSize: '2rem', mr: 2 }}>🔧</Box>
                <Box>
                  <Typography variant="h5" component="h2" color="primary" fontWeight="bold">
                    Create New Service
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill in the service details below to create a new service entry
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 3 }} />

              <Form
                initialValues={SERVICE_INITIAL_STATE}
                validationSchema={serviceValidationSchema}
                onSubmit={handleServiceSubmit}
                formConfig={serviceFormConfiguration}
              >
                {(formikProps) => (
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          formikProps.resetForm();
                          formikProps.setValues(SERVICE_INITIAL_STATE, false);
                        }}
                        sx={{ minWidth: 100 }}
                      >
                        Clear Form
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={formikProps.isSubmitting || isSaving}
                        sx={{ minWidth: 120 }}
                      >
                        {isSaving ? 'Creating...' : 'Create Service'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Form>
            </CardContent>
          </Card>
        )}
      </Box>
    </PageContainer>
  );
};

export default Dashboard;



