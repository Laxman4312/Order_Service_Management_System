import React from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import {
  IconHash,
  IconPhone,
  IconReceipt,
 IconCalendar,
    IconUser,
    IconMapPin,
    IconPackage,
    IconCurrencyRupee,
    IconWallet,
    IconTruck,
    IconTruckDelivery,
  IconShoppingCartCode,
    IconBarcode,  
    IconMessageCircle,  
    IconClock,
  IconCheck,
} from '@tabler/icons-react';
import { OrderImage} from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
//import { LightTooltip } from 'components/Tooltip';
import Chip from 'ui-component/extended/Chip';



const OrderInfo = ({ icon: Icon, label, value, chip }) => (
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
        value
      )}
    </Typography>
  </Box>
);

// Forward ref and props correctly
// const RoleChip = React.forwardRef(({ chipcolor, label, ...props }, ref) => (
//   <div {...props} ref={ref}>
//     <Chip label={label} chipcolor={chipcolor} variant="outlined" />
//   </div>
// ));

// const RoleChips = ({ userData }) => (
//   <Box display="flex" flexWrap="wrap" gap={1}>
//     {USER_ROLES.map(({ name, key }) => (
//       <LightTooltip
//         key={key}
//         title={userData[key] ? 'Access' : 'Access Denied'}
//         TransitionProps={{ timeout: 350 }}
//         placement="top"
//       >
//         <RoleChip label={name} chipcolor={userData[key] ? 'success' : 'error'} />
//       </LightTooltip>
//     ))}
//   </Box>
// );

const OrderViewDialog = ({ orderData, isOpen, handleCloseModal, transitions }) => {
  if (!isOpen || !orderData) return null;

const orderDetails = [
  {
    icon: IconHash,           // some icon for ID
    label: 'Order ID',
    value: orderData.id,
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconReceipt,        // for order number
    label: 'Order Number',
    value: orderData.order_no,
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconCalendar,       // for date
    label: 'Order Date',
    value: orderData.order_date,
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconUser,
    label: 'Customer Name',
    value: orderData.customer_name,
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconPhone,
    label: 'Customer Contact',
    value: orderData.customer_contact,
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconMapPin,
    label: 'Customer Address',
    value: orderData.customer_address,
    gridProps: { xs: 12, md: 12 }, // full width for address
  },
  {
    icon: IconPackage,
    label: 'Product',
    value: orderData.product,
    gridProps: { xs: 12, md: 12 }, // full width, likely multiline
  },
  {
    icon: IconCurrencyRupee,
    label: 'Total Amount',
    value: orderData.total_amount,
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconCurrencyRupee,
    label: 'Advance Paid',
    value: orderData.advance_paid ?? '0.00',
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconWallet,
    label: 'Advance Payment Mode',
    value: orderData.advance_mode ?? 'N/A',
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconCurrencyRupee,
    label: 'Balance Amount',
    value: orderData.balance_amount ?? '0.00',
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconTruck,
    label: 'Estimated Dispatch Date',
    value: orderData.estimated_dispatch_date ?? 'N/A',
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconTruckDelivery,
    label: 'Revised Dispatch Date',
    value: orderData.revised_dispatch_date ?? 'N/A',
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconShoppingCartCode,
    label: 'Shipping Carrier',
    value: orderData.shipping_carrier ?? 'N/A',
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconBarcode,
    label: 'Shipping LR Tracking',
    value: orderData.shipping_lr_tracking ?? 'N/A',
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconMessageCircle,
    label: 'Comments',
    value: orderData.comments ?? 'No comments',
    gridProps: { xs: 12, md: 12 },
  },
  {
    icon: IconCheck,
    label: 'Status ID',
    value: orderData.status_id,
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconClock,
    label: 'Created At',
    value: orderData.created_at,
    gridProps: { xs: 12, md: 6 },
  },
  {
    icon: IconClock,
    label: 'Updated At',
    value: orderData.updated_at,
    gridProps: { xs: 12, md: 6 },
  },
];


  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title="Order Details"
        subtitle="Order Management"
        transitions={transitions}
        handleClose={handleCloseModal}
        image={OrderImage}
      >
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {orderDetails.map((detail, index) => (
            <Grid key={index} item {...detail.gridProps}>
              <OrderInfo {...detail} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

      </FormLayout>
    </ProjectDialog>
  );
};

export default OrderViewDialog;
