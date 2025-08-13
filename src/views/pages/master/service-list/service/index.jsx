
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconUserPlus, IconBrandWhatsapp } from '@tabler/icons-react';

import PageView from 'components/Page';
import ServiceDialog from './ServiceDialog';
import ServiceViewDialog from './ServiceViewDialog';
import TableButtons from 'components/TableButtons';

import { useServices } from 'hooks/api-custom-hook/useServices';
import { usePagination } from 'components/custom-table/usePagination';
import { useDebounce } from 'hooks/useDebounce';
import useConfirmationStore from 'hooks/useConfirmationStore';
import useSnackbarStore from 'hooks/useSnackbarStore';
import useMultiDialogNavigation from 'hooks/useMultiDialogNavigation';

import { triggerIsSavingFlag } from 'store/slices/general';
import { OrderImage } from 'config/icons';

const ServiceManagement = () => {
  const dispatch = useDispatch();

  const { query, isSaving } = useSelector((state) => state.general);
  const { userData } = useSelector((state) => state.auth);

  const snackbarNotification = useSnackbarStore((state) => state.open);
  const openConfirmation = useConfirmationStore((state) => state.open);

  const debouncedQuery = useDebounce(query);

  const [formData, setFormData] = useState(null);

  const { data, isLoading, isError, fetchServices, deleteService } = useServices();

  const { page, rowsPerPage, totalCount, handlePageChange, handleRowsPerPageChange } =
    usePagination({ totalCount: data?.count ?? 0 });

  const { getDialogState, handleDialogOpen, handleDialogClose } = useMultiDialogNavigation({
    service_form_dialog: () => setFormData(null),
    service_view_dialog: () => setFormData(null),
  });

  const formDialog = getDialogState('service_form_dialog');
  const viewDialog = getDialogState('service_view_dialog');

  // Fetch services on mount & dependency change
  useEffect(() => {
    const params = {
      page: page + 1,
      pageSize: rowsPerPage,
      query: debouncedQuery,
    };
    fetchServices(params);
  }, [page, rowsPerPage, isSaving, debouncedQuery, fetchServices]);

  // Action Handlers
  const handleEdit = (item) => {
    setFormData(item);
    handleDialogOpen('service_form_dialog', 'Edit');
  };

  const handleView = (item) => {
    setFormData(item);
    handleDialogOpen('service_view_dialog', 'Edit');
  };

  const handleDelete = (item) => {
    openConfirmation({
      title: 'Delete Service',
      description: 'Are you sure you want to delete this Service?',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      onConfirm: async () => {
        try {
          const response = await deleteService(item.id);
          snackbarNotification({
            message: response.message || 'Service deleted successfully',
            severity: 'success',
          });
          dispatch(triggerIsSavingFlag(!isSaving));
        } catch (e) {
          snackbarNotification({
            message: e?.response?.data?.error || 'Failed to delete Service',
            severity: 'error',
          });
          console.error('Delete error:', e);
        }
      },
    });
  };

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

  // Table Button Config
  const tableButtons = [
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
      icon: IconBrandWhatsapp, // Only reference the component, let TableButtons render it
    },
  ];

  const tableHeadings = [
    { id: 'jobcard_no', label: 'Job Card No' },
    { id: 'customer_name', label: 'Customer Name' },
    { id: 'customer_phone', label: 'Customer Contact' },
    { id: 'customer_address', label: 'Customer Address' },
    { id: 'product_for_service', label: 'Product' },
    { id: 'estimated_service_cost', label: 'Total Amount', type: 'currency' },
    { id: 'estimated_delivery_date', label: 'Estimated Delivery Date', type: 'date' },
    { id: 'created_at', label: 'Created At', type: 'datetime' },
    { id: 'updated_at', label: 'Updated At', type: 'datetime' },
    {
      id: 'actions',
      label: 'Actions',
      type: 'button',
      align: 'center',
      disableSorting: true,
      render: (row, index) => {
       // console.log('Row in actions render:', row);
        const filteredButtons = tableButtons.filter((btn) => {
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
  ];

  const pageConfig = {
    isLoading,
    isError,
    title: 'Services',
    pageFavicon: OrderImage,
    pageButtons: [
      {
        buttonTitle: 'Add Services',
        startIcon: <IconUserPlus />,
        buttonName: 'Add',
        handleChange: () => handleDialogOpen('service_form_dialog'),
      },
    ],
    tableData: {
      query,
      headings: tableHeadings,
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
        <ServiceDialog
          isOpen={formDialog.isOpen}
          dialogType={formDialog.dialogType}
          handleCloseModal={() => handleDialogClose('service_form_dialog')}
          isSaving={isSaving}
          formData={formData}
        />
      )}

      {viewDialog.isOpen && (
        <ServiceViewDialog
          isOpen={viewDialog.isOpen}
          dialogType={viewDialog.dialogType}
          handleCloseModal={() => handleDialogClose('service_view_dialog')}
          isSaving={isSaving}
          serviceData={formData}
        />
      )}
    </>
  );
};

export default ServiceManagement;

