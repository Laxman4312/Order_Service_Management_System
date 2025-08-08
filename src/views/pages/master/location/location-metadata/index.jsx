import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconMapPinPlus, IconMapPinCog, IconArrowBackUpDouble } from '@tabler/icons-react';

import PageView from 'components/Page';
import { usePagination } from 'components/custom-table/usePagination';
import { useRestore } from 'hooks/useRestore';
import { useDebounce } from 'hooks/useDebounce';
import { LocationMetaIcon } from 'config/icons';
import TableButtons from 'components/TableButtons';

import LocationMetaDataDialog from './Dialog';
import useMultiDialogNavigation from 'hooks/useMultiDialogNavigation';

import { useLocationMetaData } from 'hooks/api-custom-hook/useLocationMetaData';
import PrintQr from '../locationQRCodePrint/PrintQr';
import useConfirmationStore from 'hooks/useConfirmationStore';
import { triggerIsSavingFlag } from 'store/slices/general';
import useSnackbarStore from 'hooks/useSnackbarStore';

const LocationMetaData = () => {
  const { query, isSaving } = useSelector((state) => state.general);
  const debouncedQuery = useDebounce(query);
  const openConfirmation = useConfirmationStore((state) => state.open);
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const dispatch = useDispatch();

  // Custom hooks for functionality
  const { data, isLoading, isError, fetchLocationMetaData, deleteData, restoreData } =
    useLocationMetaData();

  const { page, rowsPerPage, totalCount, handlePageChange, handleRowsPerPageChange } =
    usePagination({ totalCount: data?.count ?? 0 });

  const { restoreIsDeleted, handleRestoreChange } = useRestore();

  // Initialize the hook with persistence enabled
  const { getDialogState, handleDialogOpen, handleDialogClose } = useMultiDialogNavigation(
    {
      location_metadata_form_dialog: () => null,
    },
    // { persistData: true },
  );

  // Get individual dialog states
  const formDialog = getDialogState('location_metadata_form_dialog');
  const printDialog = getDialogState('print_dialog');

  // Effects
  React.useEffect(() => {
    (async () => {
      const params = {
        page: page + 1,
        pageSize: rowsPerPage,
        query: debouncedQuery,
        ...(restoreIsDeleted && { is_deleted: true }),
      };

      const res = await fetchLocationMetaData(params);
    })();
  }, [page, rowsPerPage, restoreIsDeleted, isSaving, debouncedQuery, fetchLocationMetaData]);

  // Event handlers
  const handleEdit = (item) => {
    handleDialogOpen('location_metadata_form_dialog', 'Edit', item);
  };

  const handleView = (item) => {
    handleDialogOpen('location_type_view_dialog', 'View', item);
  };

  const handleDelete = (data) => {
    openConfirmation({
      title: 'Delete Location Details...',
      description: 'Are you sure you want to delete this Location ?',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      variant: 'contained',
      color: 'info',
      type: 'delete',
      onConfirm: async () => {
        try {
          const response = await deleteData({ id: data.id });
          snackbarNotification({
            message: response.message,
            severity: 'success',
          });
          dispatch(triggerIsSavingFlag(!isSaving));
        } catch (e) {}
      },
    });
  };
  const handleRestore = (data) => {
    openConfirmation({
      title: 'Restore This Location Details...',
      description: 'Are you sure you want to Restore this Location !',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Restore',
      variant: 'contained',
      color: 'info',
      type: 'restore',
      onConfirm: async () => {
        try {
          const response = await restoreData({ id: data.id });

          snackbarNotification({
            message: response.message,
            severity: 'success',
          });
          dispatch(triggerIsSavingFlag(!isSaving));
        } catch (e) {}
      },
    });
  };

  const handlePrint = (data) => {
    handleDialogOpen('print_dialog', 'view', data);
  };

  // Configuration objects
  const tableConfig = {
    buttons: restoreIsDeleted
      ? [
          {
            handleFunction: handleRestore,
            title: 'Restore Item',
            color: 'info',
            name: 'Restore',
          },
        ]
      : [
          {
            handleFunction: handlePrint,
            title: 'Print QR Code',
            color: 'info',
            name: 'Print',
          },
          {
            handleFunction: handleEdit,
            title: 'Edit Item',
            color: 'info',
            name: 'Edit',
          },
          {
            handleFunction: handleDelete,
            title: 'Delete Item',
            color: 'error',
            name: 'Delete',
          },
        ],
    headings: [
      { id: 'loc_name', label: 'Location Name' },
      { id: 'loc_code', label: 'Location Code' },
      { id: 'place_of_location', label: 'Location Type' },
      {
        id: 'loc_description',
        label: 'Location Description',
        // render: (value) => value || 'N/A',
      },
      { id: 'created_at', label: 'Created Date', type: 'date' },
      { id: 'updated_at', label: 'Updated Date', type: 'date' },
      {
        id: 'actions',
        label: 'Actions',
        type: 'button',
        align: 'center',
        disableSorting: true,
        render: (row, index) => (
          <TableButtons buttons={tableConfig.buttons} id={row.id} item={row} index={index} />
        ),
      },
    ],
  };

  const pageConfig = {
    isLoading,
    isError,
    pageFavicon: LocationMetaIcon,
    title: restoreIsDeleted ? 'Restore Location Details' : 'Location Details',
    pageButtons: [
      {
        buttonTitle: 'Add Location',
        startIcon: <IconMapPinPlus />,
        buttonName: 'Add',
        handleChange: () => handleDialogOpen('location_metadata_form_dialog'),
      },
      {
        buttonTitle: restoreIsDeleted ? 'Back' : 'Restore Location',
        buttonName: restoreIsDeleted ? 'Back' : 'Restore',
        startIcon: restoreIsDeleted ? <IconArrowBackUpDouble /> : <IconMapPinCog />,
        handleChange: handleRestoreChange,
        sx: { minWidth: 100, width: 100 },
        color: restoreIsDeleted ? 'warning' : 'info',
      },
    ],
    tableData: {
      query,
      headings: tableConfig.headings,
      data: data?.result || [],
      paginationProps: {
        page,
        totalCount: totalCount || 0,
        rowsPerPage,
        onPageChange: handlePageChange,
        onRowsPerPageChange: handleRowsPerPageChange,
      },
    },
  };

  return (
    <>
      <PageView page={pageConfig} />
      {formDialog.isOpen && (
        <LocationMetaDataDialog
          isOpen={formDialog.isOpen}
          dialogType={formDialog.dialogType}
          handleCloseModal={() => handleDialogClose('location_metadata_form_dialog')}
          isSaving={isSaving}
          formData={formDialog.data}
        />
      )}
      {printDialog.isOpen && (
        <PrintQr
          open={printDialog.isOpen}
          data={printDialog.data}
          handleCloseModal={() => handleDialogClose('print_dialog')}
        />
      )}
    </>
  );
};

export default LocationMetaData;
