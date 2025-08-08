import React from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import {
  IconMail,
  IconPhone,
  IconBadge,
  IconUserCheck,
  IconAccessPoint,
} from '@tabler/icons-react';
import { UsersIcon } from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import { LightTooltip } from 'components/Tooltip';
import Chip from 'ui-component/extended/Chip';

const USER_ROLES = [
  { name: 'Admin', key: 'is_admin' },
  { name: 'Receiving', key: 'is_receiving' },
  { name: 'Inspection', key: 'is_inspection' },
  { name: 'Binning', key: 'is_binning' },
  { name: 'Issue', key: 'is_issue' },
  { name: 'Consumption', key: 'is_consumption' },
];

const UserInfo = ({ icon: Icon, label, value, chip }) => (
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
const RoleChip = React.forwardRef(({ chipcolor, label, ...props }, ref) => (
  <div {...props} ref={ref}>
    <Chip label={label} chipcolor={chipcolor} variant="outlined" />
  </div>
));

const RoleChips = ({ userData }) => (
  <Box display="flex" flexWrap="wrap" gap={1}>
    {USER_ROLES.map(({ name, key }) => (
      <LightTooltip
        key={key}
        title={userData[key] ? 'Access' : 'Access Denied'}
        TransitionProps={{ timeout: 350 }}
        placement="top"
      >
        <RoleChip label={name} chipcolor={userData[key] ? 'success' : 'error'} />
      </LightTooltip>
    ))}
  </Box>
);

const UserViewDialog = ({ userData, isOpen, handleCloseModal, transitions }) => {
  if (!isOpen || !userData) return null;

  const userDetails = [
    {
      icon: IconBadge,
      label: 'Employee ID',
      value: userData.emp_id,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconUserCheck,
      label: 'Name',
      value: userData.name,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconMail,
      label: 'Email',
      value: userData.email,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconPhone,
      label: 'Contact Number',
      value: `+91 ${userData.contact_number}`,
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconAccessPoint,
      label: 'Login Access',
      value: userData.login_access,
      chip: true,
      gridProps: { xs: 12, md: 6 },
    },
  ];

  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title="User Details"
        subtitle="User Management"
        transitions={transitions}
        handleClose={handleCloseModal}
        image={UsersIcon}
      >
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {userDetails.map((detail, index) => (
            <Grid key={index} item {...detail.gridProps}>
              <UserInfo {...detail} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Assigned Roles
          </Typography>
          <RoleChips userData={userData} />
        </Box>
      </FormLayout>
    </ProjectDialog>
  );
};

export default UserViewDialog;
