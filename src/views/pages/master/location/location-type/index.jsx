import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconMapPinPlus, IconMapPinCog, IconArrowBackUpDouble } from '@tabler/icons-react';

import PageView from 'components/Page';
import { usePagination } from 'components/custom-table/usePagination';
import { useRestore } from 'hooks/useRestore';
import { useDebounce } from 'hooks/useDebounce';
import { LocationTypeIcon } from 'config/icons';
import TableButtons from 'components/TableButtons';
import { useLocationTypes } from 'hooks/api-custom-hook/useLocationTypes';
import LocationTypeDialog from './Dialog';
import useMultiDialogNavigation from 'hooks/useMultiDialogNavigation';
import LocationTypeViewDialog from './LocationTypeViewDialog';
import useConfirmationStore from 'hooks/useConfirmationStore';

import { triggerIsSavingFlag } from 'store/slices/general';
import useSnackbarStore from 'hooks/useSnackbarStore';

const LocationType = () => {
  const { query, isSaving } = useSelector((state) => state.general);
  const debouncedQuery = useDebounce(query);
  const dispatch = useDispatch();
  const openConfirmation = useConfirmationStore((state) => state.open);
  const snackbarNotification = useSnackbarStore((state) => state.open);

  // Custom hooks for functionality
  const { data, isLoading, isError, fetchLocationTypes, deleteData, restoreData } =
    useLocationTypes();

  const { page, rowsPerPage, totalCount, handlePageChange, handleRowsPerPageChange } =
    usePagination({ totalCount: data?.count ?? 0 });

  const { restoreIsDeleted, handleRestoreChange } = useRestore();

  // Initialize the hook with persistence enabled
  const { getDialogState, handleDialogOpen, handleDialogClose } = useMultiDialogNavigation(
    {
      location_type_form_dialog: () => null,
      location_type_view_dialog: () => null,
    },
    // { persistData: true },
  );

  // Get individual dialog states
  const formDialog = getDialogState('location_type_form_dialog');
  const viewDialog = getDialogState('location_type_view_dialog');

  // Effects
  React.useEffect(() => {
    const params = {
      page: page + 1,
      pageSize: rowsPerPage,
      query: debouncedQuery,
      ...(restoreIsDeleted && { is_deleted: true }),
    };

    fetchLocationTypes(params);
  }, [page, rowsPerPage, restoreIsDeleted, isSaving, debouncedQuery, fetchLocationTypes]);

  // Event handlers
  const handleEdit = (item) => {
    handleDialogOpen('location_type_form_dialog', 'Edit', item);
  };

  const handleDelete = (data) => {
    openConfirmation({
      title: 'Delete Location Type...',
      description: 'Are you sure you want to delete this Location Type!',
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
      title: 'Restore This Location Type...',
      description: 'Are you sure you want to Restore this Location Type!',
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

  // Configuration objects
  const tableConfig = {
    buttons: restoreIsDeleted
      ? [
          {
            handleFunction: handleRestore,
            title: 'Restore Location Type',
            color: 'info',
            name: 'Restore',
          },
        ]
      : [
          // {
          //   handleFunction: handleView,
          //   title: 'View Location & Print QR Code',
          //   color: 'info',
          //   name: 'View',
          // },
          {
            handleFunction: handleEdit,
            title: 'Edit Location Type',
            color: 'info',
            name: 'Edit',
          },
          {
            handleFunction: handleDelete,
            title: 'Delete Location Type',
            color: 'error',
            name: 'Delete',
          },
        ],
    headings: [
      { id: 'place_of_location', label: 'Location Type' },
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
    pageFavicon: LocationTypeIcon,
    title: restoreIsDeleted ? 'Restore Location Types' : 'Location Types',
    pageButtons: [
      {
        buttonTitle: 'Add Location Types',
        startIcon: <IconMapPinPlus />,
        buttonName: 'Add',
        handleChange: () => handleDialogOpen('location_type_form_dialog'),
      },

      {
        buttonTitle: restoreIsDeleted ? 'Back' : 'Restore Location Type',
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
        <LocationTypeDialog
          isOpen={formDialog.isOpen}
          dialogType={formDialog.dialogType}
          handleCloseModal={() => handleDialogClose('location_type_form_dialog')}
          isSaving={isSaving}
          formData={formDialog.data}
        />
      )}
      {viewDialog.isOpen && (
        <LocationTypeViewDialog
          isOpen={viewDialog.isOpen}
          dialogType={viewDialog.dialogType}
          handleCloseModal={() => handleDialogClose('location_type_view_dialog')}
          isSaving={isSaving}
          locationTypeData={viewDialog.data}
        />
      )}
    </>
  );
};

export default LocationType;
