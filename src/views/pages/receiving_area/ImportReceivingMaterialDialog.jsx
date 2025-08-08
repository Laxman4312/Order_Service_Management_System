import React, { useState } from 'react';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  DialogActions,
  Grid,
  Paper,
  TableContainer,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { triggerIsSavingFlag } from 'store/slices/general';
import { ReceivingAreaIcon, BrandLogo } from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import { Image, ReusableText } from 'components/MiniComponents';
import EnhancedTable from 'components/custom-table/EnhancedTable';
import { Stack } from '@mui/system';
import { useReceivingArea } from 'hooks/api-custom-hook/useReceivingArea';
import Form from 'components/form-management';
import useSnackbarStore from 'hooks/useSnackbarStore';

const ImportReceivingMaterialDialog = ({ isOpen, handleCloseModal, isSaving }) => {
  const [isFormActive, setIsFormActive] = useState(true);
  const [formResults, setFormResults] = useState(false);
  const [importResponse, setImportResponse] = useState(null);
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const headings = [
    {
      id: 'itemCode',
      label: 'Item Code',
      // render: (value) => value || 'N/A',
    },
    {
      id: 'reason',
      label: 'Alert',
      // render: (value) => value || 'N/A',
    },
  ];

  //Result Component
  const ImportedResult = ({ importedResponse }) => {
    return (
      <Grid
        container
        rowSpacing={2}
        columnSpacing={1.75}
        justifyContent="center"
        alignItems="center"
      >
        {' '}
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Paper variant="outlined" sx={{ p: 1 }}>
              <Typography variant="h5" align="center">
                Import Results
              </Typography>
              <ReusableText
                heading="Total Received Material Processed"
                value={importedResponse?.totalProcessed ?? 'NA'}
              />
              <ReusableText
                heading="Successful Import Count"
                value={importedResponse?.successCount ?? 'NA'}
              />

              <ReusableText
                color="error"
                heading="Error Count"
                value={importedResponse?.failureCount ?? 'NA'}
              />
            </Paper>
          </Stack>
        </Grid>
        {importedResponse?.failedRecords && importedResponse?.failedRecords.length > 0 && (
          <Grid item xs={12}>
            <Alert severity="warning">
              We would like to inform you that the following Material were not imported.
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            {/* <Box sx={{ height: 200 }}> */}
            {importedResponse?.failedRecords && importedResponse?.failedRecords.length > 0 ? (
              <EnhancedTable
                titleOnlyMessage="Locations"
                headings={headings}
                tableData={importedResponse?.failedRecords || []}
                loading={false}
                hideFilterToggleButton={true}
                hideMasterSearch={true}
              />
            ) : (
              <Box
                display="flex"
                gap={2}
                alignItems="center"
                justifyContent="center"
                flexWrap="wrap"
                sx={{
                  px: 1,
                }}
              >
                <Image image={BrandLogo} width={70} />
                <Typography variant="h6" align="center">
                  Material Received Successfully.
                </Typography>
              </Box>
            )}
            {/* </Box> */}
          </TableContainer>
        </Grid>
      </Grid>
    );
  };

  const dispatch = useDispatch();

  const { create } = useReceivingArea();
  const handleFormSubmit = async ({ values }) => {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('excel', values.excel); // Assuming values.excel is a File object
      formData.append('created_by', '1');

      const response = await create(formData);
      setImportResponse(response.result);
      setIsFormActive(false);
      setFormResults(true);
      snackbarNotification({
        message: response.message,
        severity: 'success',
      });
      dispatch(triggerIsSavingFlag(!isSaving));
      // Handle success...
    } catch (err) {
      console.error('Error details:', err.response?.data || err);
      // Handle error...
    }
  };

  const INITIAL_FORM_STATE = {
    excel: '',
  };
  //Form config
  const formConfiguration = [
    {
      id: 'excel',
      type: 'file',
      name: 'excel',
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // accept: '.xls, .xlsx, .csv',
      label: 'Location Name',
      gridProps: { xs: 6 },
      required: true,
    },
  ];

  const validationSchema = Yup.object({
    excel: Yup.mixed().required('Excel sheet is required.'),
  });
  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title="Import Materials"
        subtitle="Receiving Area"
        transitions={true}
        handleClose={handleCloseModal}
        image={ReceivingAreaIcon}
      >
        {isFormActive && (
          <Form
            initialValues={INITIAL_FORM_STATE}
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
                    Import
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => formikProps.resetForm('')}
                  >
                    Clear
                  </Button>
                </DialogActions>
              );
            }}
          </Form>
        )}
        {formResults && (
          <Grid item xs={12}>
            <ImportedResult importedResponse={importResponse} />
          </Grid>
        )}
      </FormLayout>
    </ProjectDialog>
  );
};

export default ImportReceivingMaterialDialog;
