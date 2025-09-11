import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconUserPlus, IconUserCog, IconArrowBackUpDouble} from '@tabler/icons-react';

import PageView from 'components/Page';
import OrderDialog from './OrderDialog';
import { useOrders } from 'hooks/api-custom-hook/useOrders';
import { usePagination } from 'components/custom-table/usePagination';
import { IconBrandWhatsapp } from '@tabler/icons-react';

import { useRestore } from 'hooks/useRestore';
import { useDebounce } from 'hooks/useDebounce';
import {  OrderImage } from 'config/icons';
import TableButtons from 'components/TableButtons';
import useMultiDialogNavigation from 'hooks/useMultiDialogNavigation';
import OrderViewDialog from './OrderViewDialog';
import useConfirmationStore from 'hooks/useConfirmationStore';

import { triggerIsSavingFlag } from 'store/slices/general';
import useSnackbarStore from 'hooks/useSnackbarStore';
import { isAction } from 'redux';

const OrderManagement = () => {
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
  const { restoreIsDeleted, handleRestoreChange } = useRestore();

  // Custom hooks for functionality
  const { data, isLoading, isError, fetchOrders, deleteOrder, restoreData} = useOrders();

  const { page, rowsPerPage, totalCount, handlePageChange, handleRowsPerPageChange } =
    usePagination({ totalCount: data?.count ?? 0 });

  //const { restoreIsDeleted, handleRestoreChange } = useRestore();

  // Initialize the hook with clearFormData functions for each dialog
  const { getDialogState, handleDialogOpen, handleDialogClose } = useMultiDialogNavigation({
    order_form_dialog: () => setFormData(null),
    order_view_dialog: () => setFormData(null),
  });

  // Get individual dialog states
  const formDialog = getDialogState('order_form_dialog');
  const viewDialog = getDialogState('order_view_dialog');

  // Effects
  useEffect(() => {
    (async () => {
       const params = {
  page: page + 1,
  pageSize: rowsPerPage,
  query: debouncedQuery,
  is_deleted: restoreIsDeleted ? true : false,
};
      await fetchOrders(params);
    })();
  }, [page, rowsPerPage,restoreIsDeleted, isSaving, debouncedQuery, fetchOrders]);

  // Event handlers
  const handleEdit = (item) => {
    setFormData(item);
    handleDialogOpen('order_form_dialog', 'Edit');
    // handleDialogOpen('Edit', 'user_edit_form_dialog');
  };

const handleView = (item) => {
  setFormData(item);
  handleDialogOpen('order_view_dialog', 'Edit');
};


const handleDelete = (data) => {
  openConfirmation({
    title: 'Delete Order',
    description: 'Are you sure you want to delete this Order?',
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Delete',
    onConfirm: async () => {
      try {
        const response = await deleteOrder(data.id);
        snackbarNotification({
          message: response.message || 'Order deleted successfully',
          severity: 'success',
        });
        dispatch(triggerIsSavingFlag(!isSaving));
      } catch (e) {
        snackbarNotification({
          message: e?.response?.data?.error || 'Failed to delete order',
          severity: 'error',
        });
        console.error('Delete error:', e);
      }
    },
  });
};

  const handleRestore = (data) => {
    openConfirmation({
      title: 'Restore This order...',
      description: 'Are you sure you want to Restore this order!',
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


    const handleSendWhatsApp = (item) => {
    if (item.whatsappUrl) {
      window.open(item.whatsappUrl, '_blank');
    } else {
      snackbarNotification({
        message: 'WhatsApp link not available for this service.',
        severity: 'warning',
      });
    }
  };
const tableConfig = {
  buttons:restoreIsDeleted
      ? [
          {
            handleFunction: handleRestore,
            title: 'Restore Item',
            color: 'info',
            name: 'Restore',
          },
        ]
      :
   [
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
    {
      handleFunction: handleSendWhatsApp,
      title: 'Send WhatsApp',
      color: 'success',
      name: 'WhatsApp',
      icon: IconBrandWhatsapp,
    },
  ],
  headings: [
    { id: 'order_no', label: 'Order No' },
    { id: 'customer_name', label: 'Customer Name' },
    { id: 'customer_contact', label: 'Customer Contact' },
    { id: 'customer_address', label: 'Customer Address' },
    { id: 'product', label: 'Product' },
    { id: 'total_amount', label: 'Total Amount', type: 'currency' },
    { id: 'balance_amount', label: 'Balance Amount', type: 'currency' },
    { id: 'shipping_carrier', label: 'Shipping Carrier' },
    { id: 'created_at', label: 'Created At', type: 'datetime' },
    { id: 'updated_at', label: 'Updated At', type: 'datetime' },
    {
      id: 'actions',
      label: 'Actions',
      type: 'button',
      align: 'center',
      disableSorting: true,
      isAction: true,
      render: (row, index) => {
        console.log('Row in actions render:', row);

        const filteredButtons = tableConfig.buttons.filter((btn) => {
          if (btn.name === 'WhatsApp') {
            const hasWhatsapp = Boolean(row.whatsappUrl);
            console.log(`Checking WhatsApp button for row id ${row.id}: ${hasWhatsapp}`);
            return hasWhatsapp;
          }
          return true;
        });

        return <TableButtons buttons={filteredButtons} item={row} index={index} />;
      },
    },
  ],
};

  const pageConfig = {
    isLoading,
    isError,
    pageFavicon:  OrderImage,
    title:  'Orders',
    pageButtons: [
      {
        buttonTitle: 'Add Orders',
        startIcon: <IconUserPlus />,
        buttonName: 'Add',
        handleChange: () => handleDialogOpen('order_form_dialog'),
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
       data: data || [],
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
        <OrderDialog
          isOpen={formDialog.isOpen}
          dialogType={formDialog.dialogType}
          handleCloseModal={() => handleDialogClose('order_form_dialog')}
          isSaving={isSaving}
          formData={formData}
        />
      )}
      {viewDialog.isOpen && (
        < OrderViewDialog
          isOpen={viewDialog.isOpen}
          dialogType={viewDialog.dialogType}
          // handleCloseModal={handleDialogClose}
          handleCloseModal={() => handleDialogClose('order_view_dialog')}
          isSaving={isSaving}
          orderData={formData}
        />
      )}
    </>
  );
};

export default OrderManagement;
