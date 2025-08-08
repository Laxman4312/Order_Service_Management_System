import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Button, DialogActions, Divider, Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { triggerIsSavingFlag } from 'store/slices/general';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import Form from 'components/form-management';
import { BinningAreaIcon } from 'config/icons';
import { useLocationMetaData } from 'hooks/api-custom-hook/useLocationMetaData';
import { useBinning } from 'hooks/api-custom-hook/useBinning';
import { Box } from '@mui/system';
import EnhancedTable from 'components/custom-table/EnhancedTable';
import TableButtons from 'components/TableButtons';
import useSnackbarStore from 'hooks/useSnackbarStore';
import useConfirmationStore from 'hooks/useConfirmationStore';

const BinningDialog = ({
  formData,
  isOpen,
  dialogType,
  handleCloseModal,
  transitions,
  isSaving,
}) => {
  const { fetchLocationMetaData } = useLocationMetaData();
  const { assignBin, updateBin, fetchBinning, deleteData } = useBinning();
  const snackbarNotification = useSnackbarStore((state) => state.open);
  const openConfirmation = useConfirmationStore((state) => state.open);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const dispatch = useDispatch();

  const [newFormData, setNewFormData] = useState(formData);
  const [isEditMode, setIsEditMode] = useState(false);

  const calculateAvailableQuantity = useCallback(() => {
    const inwardQty = parseFloat(newFormData?.item_inward_qty || 0);
    const totalBinnedQty = (newFormData?.binning_details || []).reduce(
      (sum, bin) => sum + parseFloat(bin.quantity || 0),
      0,
    );
    const totalIssuedQty = (newFormData?.binning_details || []).reduce(
      (sum, bin) => sum + parseFloat(bin.issued_qty || 0),
      0,
    );
    return inwardQty - totalBinnedQty;
  }, [newFormData]);

  useEffect(() => {
    const available = calculateAvailableQuantity();
    setAvailableQuantity(available);
  }, [newFormData, calculateAvailableQuantity]);

  const getCurrentBin = useCallback(
    (locCode) => {
      if (typeof locCode === 'object') {
        locCode = locCode.loc_code;
      }
      return newFormData?.binning_details?.find((bin) => bin.loc_code === locCode);
    },
    [newFormData],
  );

  const reFetchData = async () => {
    try {
      const params = { id: formData.id };
      const resp = await fetchBinning(params);
      setNewFormData(resp?.result || {});
    } catch (error) {
      console.error('Error fetching binning data:', error);
      snackbarNotification({
        message: 'Error fetching binning data',
        severity: 'error',
      });
    }
  };

  const buttonName = () => {
    if (isEditMode) return 'Save';
    return dialogType === 'Add' ? 'Add' : 'Save';
  };

  useEffect(() => {
    if (!newFormData && isOpen) {
      handleCloseModal();
    }
  }, [newFormData, isOpen, handleCloseModal]);

  if (!newFormData) {
    return null;
  }

  const prepareFormData = (values) => {
    const loc_code =
      typeof values.loc_code === 'object' ? values.loc_code.loc_code : values.loc_code;

    const prepareData =
      buttonName() === 'Add'
        ? {
            material_id: Number(formData.id),
            loc_code: String(loc_code).trim(),
            quantity: Number(values.quantity),
          }
        : {
            id: Number(values.id),
            loc_code: String(loc_code).trim(),
            quantity: Number(values.quantity),
          };

    return prepareData;
  };

  const INITIAL_FORM_STATE = {
    id: null,
    quantity: '',
    loc_code: '',
  };

  const validationSchema = Yup.object().shape({
    quantity: Yup.number()
      .required('Quantity is required')
      .positive('Quantity must be positive')
      .test('within-limit', 'Quantity exceeds available inward quantity', function (value) {
        if (!value) return true;

        const currentBin = getCurrentBin(this.parent.loc_code);
        if (!currentBin) {
          // For new bins, check against total available quantity
          return value <= availableQuantity;
        }

        // For existing bins, add current bin's quantity to available
        const adjustedAvailable = availableQuantity + parseFloat(currentBin.quantity);
        return value <= adjustedAvailable;
      })
      .test('check-issued', 'Cannot modify quantity below issued quantity', function (value) {
        if (buttonName() !== 'Save') return true;

        const currentBin = getCurrentBin(this.parent.loc_code);
        if (!currentBin) return true;

        const issuedQty = parseFloat(currentBin.issued_qty || 0);
        return value >= issuedQty;
      })
      .test('check-inward-limit', 'Quantity exceeds inward quantity limit', function (value) {
        if (!value) return true;

        const currentBin = getCurrentBin(this.parent.loc_code);
        const inwardQty = parseFloat(newFormData?.item_inward_qty || 0);
        const currentQty = currentBin ? parseFloat(currentBin.quantity || 0) : 0;

        const totalOtherBinned = (newFormData?.binning_details || [])
          .filter((bin) => bin.loc_code !== (currentBin?.loc_code || ''))
          .reduce((sum, bin) => sum + parseFloat(bin.quantity || 0), 0);

        return value - currentQty + totalOtherBinned <= inwardQty;
      }),
    loc_code: Yup.mixed()
      .required('Location Code is required')
      .test('is-valid-location', 'Location Code is required', (value) => {
        return value !== null && value !== undefined && value !== '';
      }),
  });

  const handleFormSubmit = async ({ resetForm, values }) => {
    try {
      // Additional validation for updates
      if (buttonName() === 'Save') {
        const currentBin = getCurrentBin(values.loc_code);
        if (currentBin) {
          const issuedQty = parseFloat(currentBin.issued_qty || 0);
          const newQty = parseFloat(values.quantity);

          if (newQty < issuedQty) {
            snackbarNotification({
              message: `Cannot reduce quantity below issued quantity (${issuedQty})`,
              severity: 'error',
            });
            return;
          }

          // Check remaining inward quantity
          const otherBinsQty = (newFormData?.binning_details || [])
            .filter((bin) => bin.id !== currentBin.id)
            .reduce((sum, bin) => sum + parseFloat(bin.quantity || 0), 0);

          const totalNewQty = otherBinsQty + newQty;
          if (totalNewQty > parseFloat(newFormData.item_inward_qty)) {
            snackbarNotification({
              message: 'Total binned quantity cannot exceed inward quantity',
              severity: 'error',
            });
            return;
          }
        }
      }

      const formData = prepareFormData(values);
      const response =
        buttonName() === 'Add' ? await assignBin(formData) : await updateBin(formData);

      dispatch(triggerIsSavingFlag(!isSaving));

      snackbarNotification({
        message: response.message,
        severity: isEditMode ? 'info' : 'success',
      });

      await reFetchData();
      resetForm();
      setIsEditMode(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      snackbarNotification({
        message: err.message || 'Error processing request',
        severity: 'error',
      });
    }
  };

  const formConfiguration = [
    {
      id: 'loc_code',
      name: 'loc_code',
      type: 'autocomplete',
      fetchFunction: (e) => fetchLocationMetaData(e),
      label: 'Location Code',
      renderOption: (props, option) => (
        <li {...props} key={option.loc_code}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#666' }}>
              {option.loc_code} / {option.loc_name}
            </span>
          </div>
        </li>
      ),
      identifierProp: 'loc_code',
      gridProps: { sm: 6, xs: 12 },
      required: true,
    },

    {
      id: 'quantity',
      type: 'number',
      name: 'quantity',
      label: 'Quantity',
      gridProps: { sm: 6, xs: 12 },
      required: true,
    },
  ];

  const InfoRow = ({ label, value }) => (
    <Grid item xs={12} md={4}>
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle1">
          <strong>{label}:</strong> {value}
        </Typography>
      </Box>
    </Grid>
  );

  const topComp = (formProps) => {
    const handleEdit = (item) => {
      // if (parseFloat(item.issued_qty) > 0) {
      //   snackbarNotification({
      //     message: 'Cannot edit bin location with issued quantity',
      //     severity: 'warning',
      //   });
      //   return;
      // }

      formProps.setValues({
        id: item.id,
        quantity: item.quantity,
        loc_code: item.loc_code,
      });
      setIsEditMode(true);
    };

    const handleDelete = (data) => {
      openConfirmation({
        title: 'Delete Bin Details',
        description: 'Are you sure you want to delete this Bin Details?',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        variant: 'contained',
        color: 'info',
        type: 'delete',
        onConfirm: async () => {
          try {
            if (parseFloat(data.issued_qty) > 0) {
              snackbarNotification({
                message: 'Cannot delete bin location with issued quantity',
                severity: 'warning',
              });
              return;
            }

            const response = await deleteData({ id: data.id });
            snackbarNotification({
              message: response.message,
              severity: 'success',
            });
            await reFetchData();
            dispatch(triggerIsSavingFlag(!isSaving));
          } catch (error) {
            console.error('Error deleting bin:', error);
            snackbarNotification({
              message: 'Error deleting bin details',
              severity: 'error',
            });
          }
        },
      });
    };

    const headings = [
      {
        id: 'loc_code',
        label: 'Location Code',
      },
      {
        id: 'quantity',
        label: 'Binned Quantity',
      },
      {
        id: 'issued_qty',
        label: 'Issued Quantity',
      },
      {
        id: 'created_at',
        label: 'Created Date',
        type: 'date',
      },
      {
        id: 'updated_at',
        label: 'Updated Date',
        type: 'date',
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'center',
        type: 'button',
        disableSorting: true,
        render: (row, index) => (
          <TableButtons
            buttons={[
              {
                handleFunction: handleEdit,
                title: 'Edit Bin',
                color: 'info',
                name: 'Edit',
              },
              {
                handleFunction: handleDelete,
                title: 'Delete Bin',
                color: 'error',
                name: 'Delete',
              },
            ]}
            item={row}
            index={index}
          />
        ),
      },
    ];

    return (
      <Grid container spacing={1.5}>
        <InfoRow label="PO Number" value={newFormData?.po_number} />
        <InfoRow label="Voucher Number" value={newFormData?.voucher_number} />
        <InfoRow label="Voucher Type" value={newFormData?.voucher_type} />
        <InfoRow label="Item Code" value={newFormData?.item_code} />
        <InfoRow label="Particulars" value={newFormData?.particulars} />
        <InfoRow label="Total Quantity" value={newFormData?.item_total_qty || 0} />
        <InfoRow label="Inward Quantity" value={newFormData?.item_inward_qty} />
        <InfoRow label="Binned Quantity" value={newFormData?.bin_qty || 0} />
        <InfoRow label="Available Quantity" value={availableQuantity || 0} />

        <Grid item xs={12} md={12}>
          <EnhancedTable
            titleOnlyMessage="Locations"
            headings={headings}
            tableData={newFormData?.binning_details || []}
            loading={false}
            hideFilterToggleButton={true}
            hideMasterSearch={true}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Divider>
            <strong>{buttonName() === 'Add' ? 'Assign New Bin' : 'Change Binned Details'}</strong>
          </Divider>
        </Grid>
      </Grid>
    );
  };

  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title={dialogType === 'Add' ? 'Assign Bin' : 'Updated Bin Location'}
        subtitle="Binning Area"
        transitions={transitions}
        handleClose={handleCloseModal}
        image={BinningAreaIcon}
      >
        <Form
          initialValues={INITIAL_FORM_STATE}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          formConfig={formConfiguration}
          topComponents={(e) => topComp(e)}
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
                  {buttonName()}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    formikProps.resetForm('');
                    formikProps.setValues(INITIAL_FORM_STATE, false);
                    setIsEditMode(false);
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

export default BinningDialog;
