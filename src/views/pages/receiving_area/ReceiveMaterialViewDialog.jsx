// ReceiveMaterialViewDialog.jsx
import React, { useState, useEffect } from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { IconBadge, IconCalendarMonth, IconPrinter } from '@tabler/icons-react';
import { ReceivingAreaIcon } from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import AnimatedButton from 'components/AnimatedButton';
import TableButtons from 'components/TableButtons';
import useMultiDialogNavigation from 'hooks/useMultiDialogNavigation';
import { FormatDateTime } from 'components/MiniComponents';
import EnhancedTable from 'components/custom-table/EnhancedTable';

const ReceiveMaterialInfo = ({ icon: Icon, label, value }) => (
  <Box display="flex" alignItems="center">
    {/* <Icon style={{ marginRight: 10 }} /> */}
    <Typography variant="subtitle1">
      <strong>{label}:</strong> {value}
    </Typography>
  </Box>
);

const ReceiveMaterialViewDialog = ({
  materialData,
  isOpen,
  handleCloseModal,
  handlePrint,
  transitions,
}) => {
  // Add effect to close dialog if materialData is null
  useEffect(() => {
    if (!materialData && isOpen) {
      handleCloseModal();
    }
  }, [materialData, isOpen, handleCloseModal]);

  // Return null if no data
  if (!materialData) {
    return null;
  }

  const openQty = parseFloat(materialData.item_total_qty) - parseFloat(materialData.available_qty);

  const materialDetails = [
    {
      label: 'Po Number',
      value: materialData.po_number || 'N/A',
      gridProps: { xs: 12, md: 6 },
    },
    {
      label: 'Item Code',
      value: materialData.item_code || 'N/A',
      gridProps: { xs: 12, md: 6 },
    },
    {
      label: 'Particulars',
      value: materialData.particulars || 'N/A',
      gridProps: { xs: 12, md: 6 },
    },
    {
      label: 'UOM',
      value: materialData.uom || 'N/A',
      gridProps: { xs: 12, md: 6 },
    },
    {
      label: 'Voucher Type',
      value: materialData.voucher_type || 'N/A',
      gridProps: { xs: 12, md: 6 },
    },

    {
      label: 'Total Quantity',
      value: materialData.item_total_qty || 'N/A',
      gridProps: { xs: 12, md: 6 },
    },
    {
      label: 'Total Received Quantity',
      value: materialData.available_qty,
      gridProps: { xs: 12, md: 6 },
    },
    {
      label: 'Open Quantity',
      value: materialData.item_open_qty,
      gridProps: { xs: 12, md: 6 },
    },
  ];

  // const metaData =
  //   materialData?.logs?.map((value) => ({
  //     place_of_location: value.place_of_location,
  //     ...value,
  //   })) || [];

  const headings = [
    {
      id: 'voucher_number',
      label: 'Voucher Number',
    },
    {
      id: 'voucher_date',
      label: 'Voucher Date',
      type: 'date',
    },
    {
      id: 'item_inward_qty',
      label: 'Inward Quantity',
    },
    {
      id: 'vendor_name',
      label: 'Vendor Name',
    },
    {
      id: 'created_at',
      label: 'Created At',
      type: 'date',
    },
    {
      id: 'updated_at',
      label: 'Updated At',
      type: 'date',
    },

    // {
    //   id: 'actions',
    //   label: 'Actions',
    //   align: 'center',
    //   render: (row, index) => (
    //     <TableButtons
    //       buttons={[
    //         {
    //           handleFunction: () => handlePrint(row),
    //           title: 'Print Locations',
    //           color: 'info',
    //           name: 'Print',
    //         },
    //       ]}
    //       id={row.id}
    //       item={row}
    //       index={index}
    //     />
    //   ),
    // },
  ];

  return (
    <>
      <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
        <FormLayout
          isOpen={isOpen}
          title="Receive Material Details"
          subtitle="Receiving Area"
          transitions={transitions}
          handleClose={handleCloseModal}
          image={ReceivingAreaIcon}
        >
          <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1}>
            <AnimatedButton
              title="Print Item Code"
              buttonName="Print Item Code"
              startIcon={<IconPrinter />}
              handleChange={() => handlePrint(materialData)}
              transitions={true}
            />
          </Box>

          <Grid container spacing={3} my={1}>
            {materialDetails.map((detail, index) => (
              <Grid key={index} item {...detail.gridProps}>
                <ReceiveMaterialInfo {...detail} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" width="100%" my={2}>
                <Divider sx={{ width: '100%' }}>
                  <Typography variant="h4" textAlign="center">
                    Item Received Logs
                  </Typography>
                </Divider>
              </Box>
            </Grid>
          </Grid>

          <EnhancedTable
            titleOnlyMessage="Locations"
            headings={headings}
            tableData={materialData?.logs || []}
            loading={false}
            hideFilterToggleButton={true}
            hideMasterSearch={true}
          />
        </FormLayout>
      </ProjectDialog>
    </>
  );
};

export default ReceiveMaterialViewDialog;
