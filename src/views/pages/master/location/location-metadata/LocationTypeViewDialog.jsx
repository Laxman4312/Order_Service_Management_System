// LocationTypeViewDialog.jsx
import React, { useState, useEffect } from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { IconBadge, IconCalendarMonth, IconPrinter } from '@tabler/icons-react';
import { LocationTypeIcon } from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import AnimatedButton from 'components/AnimatedButton';
import TableButtons from 'components/TableButtons';
import useMultiDialogNavigation from 'hooks/useMultiDialogNavigation';
import PrintQr from '../locationQRCodePrint/PrintQr';
import { FormatDateTime } from 'components/MiniComponents';
import EnhancedTable from 'components/custom-table/EnhancedTable';

const LocationTypeInfo = ({ icon: Icon, label, value }) => (
  <Box display="flex" alignItems="center">
    <Icon style={{ marginRight: 10 }} />
    <Typography variant="subtitle1">
      <strong>{label}:</strong> {value}
    </Typography>
  </Box>
);

const LocationTypeViewDialog = ({ locationTypeData, isOpen, handleCloseModal, transitions }) => {
  const [printData, setPrintData] = useState(null);
  const { getDialogState, handleDialogOpen, handleDialogClose } = useMultiDialogNavigation({
    print_dialog: () => setPrintData(null),
  });
  // Add effect to close dialog if locationTypeData is null
  useEffect(() => {
    if (!locationTypeData && isOpen) {
      handleCloseModal();
    }
  }, [locationTypeData, isOpen, handleCloseModal]);

  // Return null if no data
  if (!locationTypeData) {
    return null;
  }

  const printDialog = getDialogState('print_dialog');

  const locationTypeDetails = [
    {
      icon: IconBadge,
      label: 'Location Type',
      value: locationTypeData.place_of_location || 'N/A',
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconCalendarMonth,
      label: 'Created Date',
      value: locationTypeData?.created_at ? FormatDateTime(locationTypeData.created_at) : 'N/A',
      gridProps: { xs: 12, md: 6 },
    },
    {
      icon: IconCalendarMonth,
      label: 'Updated Date',
      value: locationTypeData?.updated_at ? FormatDateTime(locationTypeData.updated_at) : 'N/A',
      gridProps: { xs: 12, md: 6 },
    },
  ];

  const metaData =
    locationTypeData?.metadata?.map((value) => ({
      place_of_location: locationTypeData.place_of_location,
      ...value,
    })) || [];

  const handlePrint = (data) => {
    setPrintData(data);
    handleDialogOpen('print_dialog', 'view', data);
  };

  const headings = [
    {
      id: 'loc_name',
      label: 'Location Name',
    },
    {
      id: 'loc_code',
      label: 'Location Code',
    },
    {
      id: 'loc_description',
      label: 'Location Description',
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row, index) => (
        <TableButtons
          buttons={[
            {
              handleFunction: () => handlePrint(row),
              title: 'Print Locations',
              color: 'info',
              name: 'Print',
            },
          ]}
          id={row.id}
          item={row}
          index={index}
        />
      ),
    },
  ];

  return (
    <>
      <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
        <FormLayout
          isOpen={isOpen}
          title="Location Type Details"
          subtitle="Location Management"
          transitions={transitions}
          handleClose={handleCloseModal}
          image={LocationTypeIcon}
        >
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {locationTypeDetails.map((detail, index) => (
              <Grid key={index} item {...detail.gridProps}>
                <LocationTypeInfo {...detail} />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h4">Location Names</Typography>
            {metaData?.length > 0 && (
              <AnimatedButton
                title="Print All"
                buttonName="Print All"
                startIcon={<IconPrinter />}
                handleChange={() => handlePrint(metaData)}
                transitions={true}
              />
            )}
          </Box>

          <EnhancedTable
            titleOnlyMessage="Locations"
            headings={headings}
            tableData={metaData}
            loading={false}
            hideFilterToggleButton={true}
            hideMasterSearch={true}
          />
        </FormLayout>
      </ProjectDialog>

      {printDialog.isOpen && (
        <PrintQr
          open={printDialog.isOpen}
          data={printData}
          handleCloseModal={() => handleDialogClose('print_dialog')}
        />
      )}
    </>
  );
};

export default LocationTypeViewDialog;
