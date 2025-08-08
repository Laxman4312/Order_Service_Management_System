import React from 'react';
import { useSelector } from 'react-redux';
import PageView from 'components/Page';
import { usePagination } from 'components/custom-table/usePagination';
import { useRestore } from 'hooks/useRestore';
import { useDebounce } from 'hooks/useDebounce';
import { BinningAreaIcon } from 'config/icons';
import TableButtons from 'components/TableButtons';
// import LocationTypeDialog from './Dialog';
import useMultiDialogNavigation from 'hooks/useMultiDialogNavigation';
import { useBinning } from 'hooks/api-custom-hook/useBinning';
import { useTab } from 'hooks/useTab';
import BinningDialog from './Dialog';

const ReceivingArea = () => {
  const { query, isSaving } = useSelector((state) => state.general);
  const debouncedQuery = useDebounce(query);

  // Custom hooks for functionality
  const { data, isLoading, isError, fetchBinning } = useBinning();
  const { tabValue, handleTabChange } = useTab(0);

  const { page, rowsPerPage, totalCount, handlePageChange, handleRowsPerPageChange } =
    usePagination({ totalCount: data?.count ?? 0 });

  const { restoreIsDeleted } = useRestore();

  // Initialize the hook with persistence enabled
  const { getDialogState, handleDialogOpen, handleDialogClose } = useMultiDialogNavigation(
    {
      binning_area_form_dialog: () => null,
    },
    // { persistData: true },
  );

  // Get individual dialog states
  const formDialog = getDialogState('binning_area_form_dialog');

  // Effects
  React.useEffect(() => {
    const params = {
      page: page + 1,
      pageSize: rowsPerPage,
      query: debouncedQuery,
      is_binned: tabValue,
      ...(restoreIsDeleted && { is_deleted: true }),
    };

    fetchBinning(params);
  }, [page, rowsPerPage, restoreIsDeleted, isSaving, debouncedQuery, fetchBinning, tabValue]);

  // Event handlers
  const handleEdit = (item) => {
    handleDialogOpen('binning_area_form_dialog', 'Edit', item);
  };

  const handleView = (item) => {
    handleDialogOpen('binning_area_form_dialog', 'Add', item);
  };

  const handleAdd = (data) => {
    handleDialogOpen('binning_area_form_dialog', 'Add', data);
  };

  // Configuration objects
  const tableConfig = {
    buttonData: {
      VIEW: {
        handleFunction: handleView,
        title: 'View Item',
        color: 'info',
        name: 'View',
      },
      ASSIGN_BIN: {
        handleFunction: handleAdd,
        title: 'Assign Bin',
        color: 'info',
        name: 'Add',
      },
      EDIT_BIN: {
        handleFunction: handleEdit,
        title: 'Edit Bin Details',
        color: 'info',
        name: 'Edit',
      },
    },
    getRowButtons: (row) => {
      if (tabValue !== 0) {
        return [tableConfig.buttonData.VIEW];
      }

      return [
        {
          ...tableConfig.buttonData.ASSIGN_BIN,
          handleFunction: () => handleAdd(row),
        },
      ];
    },

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
        id: 'voucher_number',
        label: 'Voucher Number',
        // render: (value) => value || 'N/A',
      },
      {
        id: 'voucher_type',
        label: 'Voucher Type',
        // render: (value) => value || 'N/A',
      },

      {
        id: 'particulars',
        label: 'Particulars',
        width: 150,
        // render: (value) => value || 'N/A',
      },

      {
        id: 'uom',
        label: 'UOM',
        // render: (value) => value || 'N/A',
      },
      {
        id: 'item_total_qty',
        label: 'Item Total Qty',

        // render: (value) => value || 'N/A',
      },
      {
        id: 'item_inward_qty',
        label: 'Inward Qty',

        // render: (value) => value || 'N/A',
      },
      {
        id: 'bin_qty',
        label: 'Binned Quantity',
        render: (value) => (value?.bin_qty ? value.bin_qty : '0.00'),
      },

      {
        id: 'actions',
        label: 'Actions',

        align: 'center',
        type: 'button',
        disableSorting: true,
        render: (row, index) => (
          <TableButtons
            buttons={tableConfig.getRowButtons(row)}
            id={row.id}
            item={row}
            index={index}
          />
        ),
      },
    ],
  };

  const pageConfig = {
    isLoading,
    isError,
    pageFavicon: BinningAreaIcon,
    title: 'Bin Material',
    pageTabs: {
      tabValue,
      handleTabChange,
      tabList: [
        { value: 0, label: 'Pending For Binning' },
        { value: 1, label: 'Binned Materials' },
      ],
    },
    pageButtons: [
      // {
      //   buttonTitle: 'Import Material',
      //   startIcon: <IconTransferIn />,
      //   buttonName: 'Import',
      //   handleChange: () => handleDialogOpen('binning_area_form_dialog'),
      // },
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
        <BinningDialog
          isOpen={formDialog.isOpen}
          dialogType={formDialog.dialogType}
          handleCloseModal={() => handleDialogClose('binning_area_form_dialog')}
          isSaving={isSaving}
          formData={formDialog.data}
        />
      )}
      {/* {printDialog.isOpen && (
        <PrintQr
          open={printDialog.isOpen}
          data={printDialog.data}
          handleCloseModal={() => handleDialogClose('print_dialog')}
        />
      )}  */}
    </>
  );
};

export default ReceivingArea;
