import React from 'react';
import { useSelector } from 'react-redux';

import PageView from 'components/Page';
import { usePagination } from 'components/custom-table/usePagination';
import { useRestore } from 'hooks/useRestore';
import { useDebounce } from 'hooks/useDebounce';
import { ReceivingAreaIcon } from 'config/icons';
import TableButtons from 'components/TableButtons';

// import LocationTypeDialog from './Dialog';
import useMultiDialogNavigation from 'hooks/useMultiDialogNavigation';

import { useReceivingArea } from 'hooks/api-custom-hook/useReceivingArea';
import { IconPrinter, IconTransferIn } from '@tabler/icons-react';
import ImportReceivingMaterialDialog from './ImportReceivingMaterialDialog';
import PrintQr from './material-print/PrintQr';
import ReceiveMaterialViewDialog from './ReceiveMaterialViewDialog';
const ReceivingArea = () => {
  const { query, isSaving } = useSelector((state) => state.general);
  const debouncedQuery = useDebounce(query);

  // Custom hooks for functionality
  const { data, isLoading, isError, fetch } = useReceivingArea();

  const { page, rowsPerPage, totalCount, handlePageChange, handleRowsPerPageChange } =
    usePagination({ totalCount: data?.count ?? 0 });

  const { restoreIsDeleted, handleRestoreChange } = useRestore();

  // Initialize the hook with persistence enabled
  const { getDialogState, handleDialogOpen, handleDialogClose } = useMultiDialogNavigation(
    {
      receiving_area_form_dialog: () => null,
    },
    // { persistData: true },
  );

  // Get individual dialog states
  const formDialog = getDialogState('receiving_area_form_dialog');
  const viewDialog = getDialogState('receiving_area_view_dialog');
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

      await fetch(params);
    })();
  }, [page, rowsPerPage, restoreIsDeleted, isSaving, debouncedQuery, fetch]);

  const handleView = (item) => {
    handleDialogOpen('receiving_area_view_dialog', 'View', item);
  };

  const handleRestore = () => {};

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
            handleFunction: handleView,
            title: 'View Item',
            color: 'info',
            name: 'View',
          },
          {
            handleFunction: handlePrint,
            title: 'Print QR Code',
            color: 'info',
            name: 'Print',
          },
          // {
          //   handleFunction: handleEdit,
          //   title: 'Edit Item',
          //   color: 'info',
          //   name: 'Edit',
          // },
          // {
          //   handleFunction: handleDelete,
          //   title: 'Delete Item',
          //   color: 'error',
          //   name: 'Delete',
          // },
        ],
    headings: [
      {
        id: 'po_number',
        label: 'PO Number',
        // render: (value) => value || 'N/A',
      },
      {
        id: 'item_code',
        label: 'Item Code',
        // render: (value) => value || 'N/A',
      },
      {
        id: 'particulars',
        label: 'Particulars',
        width: '200px',
        // render: (value) => value || 'N/A',
      },

      {
        id: 'uom',
        label: 'UOM',
        // render: (value) => value || 'N/A',
      },
      {
        id: 'item_total_qty',
        label: 'Total Qty',

        // render: (value) => value || 'N/A',
      },
      {
        id: 'item_open_qty',
        label: 'Open Quantity',
        // render: (value) => value || 'N/A',
      },
      {
        id: 'voucher_type',
        label: 'Voucher Type',
        // render: (value) => value || 'N/A',
      },
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
    pageFavicon: ReceivingAreaIcon,
    title: restoreIsDeleted ? 'Restore Receive Material' : 'Receive Material',
    pageButtons: [
      {
        buttonTitle: 'Import Material',
        startIcon: <IconTransferIn />,
        buttonName: 'Import',
        color: 'info',
        handleChange: () => handleDialogOpen('receiving_area_form_dialog'),
      },
      {
        buttonTitle: 'Print Qr Code ',
        startIcon: <IconPrinter />,
        buttonName: 'Print All',
        handleChange: () => handlePrint(data?.result),
      },
      // {
      //   buttonTitle: restoreIsDeleted ? 'Back' : 'Restore Location',
      //   buttonName: restoreIsDeleted ? 'Back' : 'Restore',
      //   startIcon: restoreIsDeleted ? <IconArrowBackUpDouble /> : <IconMapPinCog />,
      //   handleChange: handleRestoreChange,
      //   sx: { minWidth: 100, width: 100 },
      //   color: restoreIsDeleted ? 'warning' : 'info',
      // },
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
        <ImportReceivingMaterialDialog
          isOpen={formDialog.isOpen}
          handleCloseModal={() => handleDialogClose('receiving_area_form_dialog')}
          isSaving={isSaving}
        />
      )}
      {viewDialog.isOpen && (
        <ReceiveMaterialViewDialog
          isOpen={viewDialog.isOpen}
          dialogType={viewDialog.dialogType}
          handleCloseModal={() => handleDialogClose('receiving_area_view_dialog')}
          isSaving={isSaving}
          materialData={viewDialog.data}
          handlePrint={handlePrint}
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

export default ReceivingArea;
