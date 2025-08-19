import React from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import {
  IconHash,
  IconPhone,
  IconUser,
  IconMapPin,
  IconPackage,
  IconCurrencyRupee,
  IconMessageCircle,
  IconCalendar,
  IconClock,
  IconCheck,
} from '@tabler/icons-react';

import ProjectDialog from 'components/ProjectDialog';
import FormLayout from 'components/form-layout/FormLayout';
import Chip from 'ui-component/extended/Chip';
import { ServiceImage } from 'config/icons';

const ServiceInfo = ({ icon: Icon, label, value, chip }) => (
  <Box display="flex" alignItems="center">
    <Icon style={{ marginRight: 10 }} />
    <Typography variant="subtitle1">
      <strong>{label}:</strong>{' '}
      {chip ? (
        <Chip
          label={value ? 'Enabled' : 'Disabled'}
          chipcolor={value ? 'success' : 'error'}
          sx={{ ml: 1 }}
        />
      ) : (
        value ?? 'N/A'
      )}
    </Typography>
  </Box>
);

const ServiceViewDialog = ({ isOpen, serviceData, handleCloseModal, transitions }) => {
  if (!isOpen || !serviceData) return null;

  const serviceDetails = [
    {
      icon: IconHash,
      label: 'Service ID',
      value: serviceData.id,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconUser,
      label: 'Customer Name',
      value: serviceData.customer_name,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconPhone,
      label: 'Customer Phone',
      value: serviceData.customer_phone,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconPackage,
      label: 'Product for Service',
      value: serviceData.product_for_service,
      gridProps: { xs: 12, md: 6},
    },
    {
      icon: IconMapPin,
      label: 'Customer Address',
      value: serviceData.customer_address,
      gridProps: { xs: 12, md: 12 },
    },
    
    {
      icon: IconCurrencyRupee,
      label: 'Estimated Service Cost',
      value: `₹ ${serviceData.estimated_service_cost}`,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconCalendar,
      label: 'Estimated Delivery Date',
      value: serviceData.estimated_delivery_date,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconCheck,
      label: 'Service Status',
      value: serviceData.status_name ?? serviceData.status_id,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconMessageCircle,
      label: 'Comments',
      value: serviceData.comments || 'No comments',
      gridProps: { xs: 12 },
    },
    {
      icon: IconClock,
      label: 'Created At',
      value: serviceData.created_at,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconClock,
      label: 'Updated At',
      value: serviceData.updated_at,
      gridProps: { xs: 12, md: 6 },
    },
  ];

  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title="Service Details"
        subtitle="Service Management"
        transitions={transitions}
        handleClose={handleCloseModal}
        image={ServiceImage}
      >
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {serviceDetails.map((detail, index) => (
            <Grid key={index} item {...detail.gridProps}>
              <ServiceInfo {...detail} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />
      </FormLayout>
    </ProjectDialog>
  );
};

export default ServiceViewDialog;
