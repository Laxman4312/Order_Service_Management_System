import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconUserPlus, IconUserCog, IconArrowBackUpDouble } from '@tabler/icons-react';

import PageView from 'components/Page';
import UserDialog from './Dialog';
import { useUsers } from 'hooks/api-custom-hook/useUsers';
import { usePagination } from 'components/custom-table/usePagination';

import { useRestore } from 'hooks/useRestore';
import { useDebounce } from 'hooks/useDebounce';
import { UsersIcon } from 'config/icons';
import TableButtons from 'components/TableButtons';
import useMultiDialogNavigation from 'hooks/useMultiDialogNavigation';
import UserViewDialog from './UserViewDialog';
import useConfirmationStore from 'hooks/useConfirmationStore';

import { triggerIsSavingFlag } from 'store/slices/general';
import useSnackbarStore from 'hooks/useSnackbarStore';

const UserManagement = () => {
  // Custom hooks
  const { query, isSaving } = useSelector((state) => state.general);
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const { userData } = useSelector((state) => state.auth);

  // const { dialogType, isOpen } = useSelector((state) => state.dialog);
  const debouncedQuery = useDebounce(query);
  const dispatch = useDispatch();
  const openConfirmation = useConfirmationStore((state) => state.open);
  // State management
  const [formData, setFormData] = React.useState(null);

  // Custom hooks for functionality
  const { data, isLoading, isError, fetchUsers, deleteData, restoreData } = useUsers();

  const { page, rowsPerPage, totalCount, handlePageChange, handleRowsPerPageChange } =
    usePagination({ totalCount: data?.count ?? 0 });

  const { restoreIsDeleted, handleRestoreChange } = useRestore();

  // Initialize the hook with clearFormData functions for each dialog
  const { getDialogState, handleDialogOpen, handleDialogClose } = useMultiDialogNavigation({
    user_form_dialog: () => setFormData(null),
    user_view_dialog: () => setFormData(null),
  });

  // Get individual dialog states
  const formDialog = getDialogState('user_form_dialog');
  const viewDialog = getDialogState('user_view_dialog');

  // Effects
  useEffect(() => {
    (async () => {
      const params = {
        page: page + 1,
        pageSize: rowsPerPage,
        query: debouncedQuery,
        ...(restoreIsDeleted && { is_deleted: true }),
      };
      await fetchUsers(params);
    })();
  }, [page, rowsPerPage, restoreIsDeleted, isSaving, debouncedQuery, fetchUsers]);

  // Event handlers
  const handleEdit = (item) => {
    setFormData(item);
    handleDialogOpen('user_form_dialog', 'Edit');
    // handleDialogOpen('Edit', 'user_edit_form_dialog');
  };

  const handleView = (item) => {
    setFormData(item);
    handleDialogOpen('user_view_dialog', 'Edit');
  };

  const handleDelete = (data) => {
    openConfirmation({
      title: 'Delete User',
      description: 'Are you sure you want to delete this User?',
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
      title: 'Restore This User...',
      description: 'Are you sure you want to Restore this User!',
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
            title: 'Restore Item',
            color: 'info',
            name: 'Restore',
          },
        ]
      : [
          {
            handleFunction: handleView,
            title: 'View Item',
            color: 'info',
            name: 'View',
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
      { id: 'emp_id', label: 'Employee ID' },
      { id: 'name', label: 'Employee Name' },
      { id: 'email', label: 'Email Address' },
      { id: 'contact_number', label: 'Mobile Number' },
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
    pageFavicon: UsersIcon,
    title: restoreIsDeleted ? 'Restore Users' : 'Users',
    pageButtons: [
      {
        buttonTitle: 'Add Users',
        startIcon: <IconUserPlus />,
        buttonName: 'Add',
        handleChange: () => handleDialogOpen('user_form_dialog'),
        // handleChange: () => handleDialogOpen('Add', 'user_add_form_dialog'),
      },
      {
        buttonTitle: restoreIsDeleted ? 'Back' : 'Restore Users',
        buttonName: restoreIsDeleted ? 'Back' : 'Restore',
        startIcon: restoreIsDeleted ? <IconArrowBackUpDouble /> : <IconUserCog />,
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
        <UserDialog
          isOpen={formDialog.isOpen}
          dialogType={formDialog.dialogType}
          handleCloseModal={() => handleDialogClose('user_form_dialog')}
          isSaving={isSaving}
          formData={formData}
        />
      )}
      {viewDialog.isOpen && (
        <UserViewDialog
          isOpen={viewDialog.isOpen}
          dialogType={viewDialog.dialogType}
          // handleCloseModal={handleDialogClose}
          handleCloseModal={() => handleDialogClose('user_view_dialog')}
          isSaving={isSaving}
          userData={formData}
        />
      )}
    </>
  );
};

export default UserManagement;
