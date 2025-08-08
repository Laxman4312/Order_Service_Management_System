import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Skeleton,
  Box,
  IconButton,
  Select,
  MenuItem,
  Popover,
  InputAdornment,
  OutlinedInput,
  Alert,
  Typography,
  SvgIcon,
  Grow,
  Tooltip,
  Divider,
  TextField,
  Pagination,
} from '@mui/material';
import './CustomScrollbar.css';
import {
  Clear as ClearIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  InfoOutlined,
  ViewColumn as ViewColumnIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FileDownloadOutlined as DownloadIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

import { styled, useMediaQuery } from '@mui/system';

import NoRecords from 'components/NoRecords';
import { formatDateOnly, FormatDateTime } from 'components/MiniComponents';
import LoadingBox from 'components/LoadingComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery } from 'store/slices/general';
import CardTable from './CardTable';

// Filter Button CSS
// const FilterIconButton = styled(IconButton)(({ theme, active }) => ({
//   // color: '#f5eded',
//   position: 'absolute',
//   right: 20,
//   top: '50%',
//   transform: 'translateY(-50%)',
//   transition: 'opacity 0.3s, color 0.3s',
//   zIndex: 10,
//   fontSize: 12,
//   opacity: 0,
//   '&:hover, &:focus ': {
//     opacity: 1,
//   },
// }));

const FilterIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 20,
  top: '50%',
  transform: 'translateY(-50%)',
  transition: 'opacity 0.3s, color 0.3s',
  zIndex: 10,
  fontSize: 12,
  opacity: 0,
  '&:hover, &:focus': {
    opacity: 1,
  },
  '&.active': {
    opacity: 1,
  },
}));

// TableBody TableCells CSS here
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  height: '39px',
  //   fontWeight: '400',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  display: 'table-cell',
  verticalAlign: 'inherit',
  borderBottom: '1px solid rgba(251, 251, 251, 1)',
  padding: '0px 5px',
  //   borderBottomColor: '#e4e4e4',
  position: 'relative',
  '&:hover': {
    '& .MuiIconButton-root': {
      opacity: 1,
    },
  },
}));

// // Draggable TableCells Create Here
// const DraggableTableCell = styled(TableCell)(({ isDragging }) => ({
//   cursor: isDragging ? 'grabbing' : 'grab',
//   userSelect: 'none',
// }));

const DraggableTableCell = styled(TableCell)(() => ({
  cursor: 'grab',
  userSelect: 'none',
  fontSize: '0.80rem !important',
  padding: '4px 8px !important',
  height: '40px',
  '&.dragging': {
    cursor: 'grabbing',
  },
}));

// Update the component property definition if it exists
DraggableTableCell.propTypes = {
  align: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};
// const DraggableTableCell = styled(TableCell)(({ isDragging, theme }) => ({
//   cursor: isDragging ? 'grabbing' : 'grab',
//   userSelect: 'none',
//   fontSize: '0.80rem !important', // Make the heading font size smaller
//   padding: '4px 8px !important', // Reduce padding to make it more compact
//   height: '40px', // Reduce height of the header
// }));

// Loader Part here
const TableRowsLoader = ({ title, rowsNum, headCells }) => (
  <>
    {[...Array(rowsNum)].map((_, index) => (
      <TableRow key={index}>
        {headCells.map((_, cellIndex) => (
          <TableCell key={cellIndex} component="th" scope="row">
            <Skeleton animation="pulse" variant="text" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

// Update the PropTypes to include the new render function
const columnPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  align: PropTypes.string,
  type: PropTypes.string,
  disableSorting: PropTypes.bool,
  render: PropTypes.func,
});

// Main EnhancedTable Start Here
const EnhancedTable = ({
  headings,
  tableData = [],
  loading = true,
  title,
  titleOnlyMessage,
  handleTableDownload,
  tableDownloadTooltipName = 'Download',
  paginationProps,
  hideMasterSearch = false,
  hideFilterToggleButton = false,
  tableDraggable = true,
}) => {
  const data = Array.isArray(tableData) ? tableData : [tableData];
  const {
    totalCount = 0,
    rowsPerPage = 20,
    page = 0,
    onPageChange = () => {},
    onRowsPerPageChange = () => {},
  } = paginationProps || {};
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const [columns, setColumns] = useState(headings);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const tableRef = useRef(null);
  const [filters, setFilters] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  const [dateFilters, setDateFilters] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(headings.map((h) => h.id));
  const [columnMenuAnchorEl, setColumnMenuAnchorEl] = useState(null);
  const [loadingLoader, setLoadingLoader] = useState(loading);
  const { query, transitions } = useSelector((state) => state.general);
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  // const ResponsiveTable = !downMD ? CardTable : EnhancedTable;

  const dispatch = useDispatch();
  const [columnWidths, setColumnWidths] = useState(() => {
    const initialWidths = {};
    headings.forEach((heading) => {
      if (heading.width) {
        initialWidths[heading.id] = heading.width;
      }
    });
    return initialWidths;
  });
  const handleTextChange = (event) => {
    dispatch(setQuery(event?.target?.value || ''));
  };

  useEffect(() => {
    setLoadingLoader(loading);
  }, [loading]);

  useEffect(() => {
    setColumns(headings);
    setVisibleColumns((prevVisible) => {
      const newHeadingIds = headings.map((h) => h.id);
      return [...new Set([...prevVisible, ...newHeadingIds])];
    });
  }, [headings]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterButtonClick = (event, column) => {
    setActiveFilterColumn(column);
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setActiveFilterColumn(null);
  };

  const handleFilterChange = (columnId, value) => {
    setFilters((prev) => ({ ...prev, [columnId]: value }));
  };

  const handleSearchChange = (columnId, value) => {
    const column = columns.find((col) => col.id === columnId);
    const isNumberColumn = column?.type === 'number';

    if (isNumberColumn && !/^\d*$/.test(value)) {
      return;
    }

    setSearchTerms((prev) => ({ ...prev, [columnId]: value }));
  };

  const handleCellClick = (heading) => {
    setActiveCell(heading.id);
  };

  const handleDateFilterChange = (columnId, value) => {
    setDateFilters((prev) => ({ ...prev, [columnId]: value }));
  };

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter((row) => {
      return columns.every((column) => {
        const value = row[column.id];
        const filterValue = filters[column.id];
        const searchValue = searchTerms[column.id];
        const dateFilterValue = dateFilters[column.id];

        if (column.type === 'date' && dateFilterValue) {
          const rowDate = new Date(value);
          const filterDate = new Date(dateFilterValue);
          return rowDate.toDateString() === filterDate.toDateString();
        }

        if (filterValue && value !== filterValue) {
          return false;
        }

        if (searchValue) {
          if (column.type === 'number') {
            const numValue = parseFloat(value);
            const numSearchValue = parseFloat(searchValue);
            return !isNaN(numValue) && !isNaN(numSearchValue) && numValue === numSearchValue;
          } else {
            return String(value).toLowerCase().includes(searchValue.toLowerCase());
          }
        }

        return true;
      });
    });

    if (orderBy) {
      result.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
          return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, columns, filters, searchTerms, dateFilters, order, orderBy]);

  // Modify the table body rendering to use render function if provided
  const renderCellContent = (heading, row, index) => {
    // If a custom render function is provided, use it
    if (heading.render && typeof heading.render === 'function') {
      return heading.render(row, index);
    }
    // if (heading.render && typeof heading.render === 'function') {
    //   return heading.render(row[heading.id], row);
    // }

    // Fallback to existing type-based rendering
    switch (heading.type) {
      case 'date':
        return FormatDateTime(row[heading.id]);
      case 'dateOnly':
        return formatDateOnly(row[heading.id]);
      case 'boolean':
        return row[heading.id] ? 'Yes' : 'No';
      default:
        return row[heading.id] ?? 'NA';
    }
  };

  const handleMouseDown = (e, colIndex) => {
    e.preventDefault();
    document.body.style.cursor = 'ew-resize';
    const startX = e.clientX;
    const table = tableRef.current;
    const headerCells = table.querySelectorAll('th');
    const startWidths = Array.from(headerCells).map((cell) => cell.offsetWidth);
    const heading = visibleHeadings[colIndex];
    const minWidth = heading.width ? parseInt(heading.width, 10) : 100; // Use heading width as minimum if provided

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const newWidths = [...startWidths];
      newWidths[colIndex] = Math.max(startWidths[colIndex] + deltaX, minWidth);

      setColumnWidths(
        newWidths.reduce((acc, width, index) => {
          if (visibleHeadings[index]) {
            acc[visibleHeadings[index].id] = `${width}px`;
          }
          return acc;
        }, {}),
      );
    };

    const handleMouseUp = () => {
      document.body.style.cursor = 'default';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDragStart = (e, column) => {
    setDraggedColumn(column);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e, targetColumn) => {
      e.preventDefault();
      if (!draggedColumn || draggedColumn.id === targetColumn.id) return;

      const draggedIndex = columns.findIndex((col) => col.id === draggedColumn.id);
      const targetIndex = columns.findIndex((col) => col.id === targetColumn.id);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newColumns = [...columns];
        newColumns.splice(draggedIndex, 1);
        newColumns.splice(targetIndex, 0, draggedColumn);
        setColumns(newColumns);
      }

      setDraggedColumn(null);
    },
    [columns, draggedColumn],
  );

  const handleColumnVisibilityChange = (columnId) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId],
    );
  };

  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchorEl(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchorEl(null);
  };

  const visibleHeadings = columns.filter((column) => visibleColumns.includes(column.id));

  //pagination Component
  const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
    const handlePageChange = (newPage) => (event) => {
      setLoadingLoader(true);
      onPageChange(event, newPage);
    };

    const totalPages = Math.ceil(count / rowsPerPage);

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton onClick={handlePageChange(0)} disabled={page === 0} aria-label="first page">
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={handlePageChange(page - 1)}
          disabled={page === 0}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        Page {page + 1} of {totalPages}
        <IconButton
          onClick={handlePageChange(page + 1)}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handlePageChange(Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          <LastPageIcon />
        </IconButton>
      </Box>
    );
  };
  // pagination proptype
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  // filter component
  const getFilterComponent = (column) => {
    const commonProps = {
      size: 'small',
      sx: {
        // backgroundColor: '#fff',
        fontSize: '0.8rem',
        padding: '4px 8px',
        borderRadius: '4px',
        width: '100%',
        height: '30px',
      },
    };

    switch (column.type) {
      case 'date':
        return (
          <OutlinedInput
            type="date"
            placeholder={`Filter ${column.label}`}
            value={dateFilters[column.id] || ''}
            onChange={(e) => handleDateFilterChange(column.id, e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="primary" fontSize="small">
                  <SearchIcon fontSize="small" />
                </SvgIcon>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleDateFilterChange(column.id, '')}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            }
            {...commonProps}
          />
        );
      case 'number':
        return (
          <OutlinedInput
            type="number"
            placeholder={`Filter ${column.label}`}
            value={filters[column.id] || ''}
            onChange={(e) => handleFilterChange(column.id, e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="primary" fontSize="small">
                  <SearchIcon fontSize="small" />
                </SvgIcon>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleFilterChange(column.id, '')}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            }
            {...commonProps}
            sx={{ ...commonProps.sx, width: '180px' }}
          />
        );
      case 'boolean':
        return (
          <Select
            value={filters[column.id] || ''}
            onChange={(e) => handleFilterChange(column.id, e.target.value)}
            displayEmpty
            {...commonProps}
            sx={{ ...commonProps.sx, width: '180px' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        );
      default:
        return (
          <OutlinedInput
            type="text"
            placeholder={`Search ${column.label}`}
            value={searchTerms[column.id] || ''}
            onChange={(e) => handleSearchChange(column.id, e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="primary" fontSize="small">
                  <SearchIcon fontSize="small" />
                </SvgIcon>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleSearchChange(column.id, '')}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            }
            {...commonProps}
            sx={{ ...commonProps.sx, width: '180px' }}
          />
        );
    }
  };

  // Resizahandle Component
  const ResizableHandle = ({ onMouseDown }) => (
    <div
      style={{
        width: '20px',
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        cursor: 'ew-resize',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}
      onMouseDown={onMouseDown}
    >
      <div
        style={{
          width: '2px',
          height: '40%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 6,
        }}
      />
    </div>
  );

  const [showSearch, setShowSearch] = useState(true);
  const inputRef = useRef(null);
  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (!showSearch) {
      // Delay the focus until the TextField is visible
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };
  const rowBackgroundColor = (index) => {
    return index % 2 !== 0 ? '#f2f2f2' : '#ffffff'; // Change colors as needed
  };
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handlePageChange = (event, newPage) => {
    onPageChange(event, newPage - 1);
  };

  const renderTableHeader = () => (
    <TableHead>
      <TableRow>
        {visibleHeadings.map((heading, i) => (
          <DraggableTableCell
            key={heading.id}
            align={heading.align}
            sx={{
              width: columnWidths[heading.id] || 'auto',
              minWidth: heading.width || '100px', // Use heading width as minWidth if provided
              position: 'sticky',
              top: 0,
              zIndex: 1,
              fontSize: 13,
            }}
            draggable={tableDraggable}
            onDragStart={(e) => handleDragStart(e, heading)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, heading)}
            className={`
              ${draggedColumn && draggedColumn.id === heading.id ? 'dragging' : ''}
              ${activeCell === heading.id ? 'active' : ''}
            `.trim()}
          >
            {!heading.disableSorting ? (
              <>
                <TableSortLabel
                  active={orderBy === heading.id}
                  direction={orderBy === heading.id ? order : 'asc'}
                  onClick={() => handleRequestSort(heading.id)}
                >
                  {heading.label}
                </TableSortLabel>
                <FilterIconButton
                  size="small"
                  onClick={(e) => handleFilterButtonClick(e, heading)}
                  className={`filter-button ${activeCell === heading.id ? 'active' : ''}`}
                >
                  <FilterListIcon />
                </FilterIconButton>
                <ResizableHandle onMouseDown={(e) => handleMouseDown(e, i)} />
              </>
            ) : (
              <>
                <Typography>{heading.label}</Typography>
                <ResizableHandle onMouseDown={(e) => handleMouseDown(e, i)} />
              </>
            )}
          </DraggableTableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  //main table component render part
  return (
    <Box
      component={Paper}
      sx={{
        width: '100%',
        borderRadius: '10px',
        border: '1px solid #e4e4e4',
        overflow: 'hidden',
      }}
    >
      {!hideMasterSearch ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '3px 7px' }}>
            <Tooltip title="Master Search" arrow placement="top">
              <IconButton
                onClick={handleToggleSearch}
                size="small"
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    // color: "red",
                    transform: 'scale(1.2)',
                  },
                }}
              >
                <SearchIcon color="primary" fontSize="small" />
              </IconButton>
            </Tooltip>
            {showSearch && (
              <TextField
                inputRef={inputRef}
                variant="standard"
                type="text"
                placeholder={`${title} Master Search`}
                value={query}
                onChange={handleTextChange}
                autoComplete="off"
                size="small"
                sx={{
                  backgroundColor: '#fff',
                  // fontSize: "0.8rem",
                  borderRadius: '4px',
                  width: '100%',
                  // height: "30px",
                  '& .MuiInputBase-root': {
                    padding: '0px',
                  },

                  '& .MuiInputBase-input': {
                    fontSize: '0.850rem', // Target the input element for font size
                  },
                }}
                InputProps={{
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <IconButton edge="start" size="small">
                  //       <SearchIcon color="primary" fontSize="small" />
                  //     </IconButton>
                  //   </InputAdornment>
                  // ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleTextChange}
                        // onClick={
                        //   () => handleTextChange(null)
                        //   // if (query) {
                        //   //   handleTextChange(null);
                        //   //   setLoadingLoader(true);
                        //   // }
                        // }
                        sx={{
                          color: 'inherit', // Default color
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            color: 'red',
                            transform: 'rotate(180deg) scale(1.2)',
                          },
                        }}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Box>
          {(!hideFilterToggleButton || handleTableDownload) && (
            <Box sx={{ padding: '3px 7px' }}>
              {handleTableDownload && (
                <Tooltip title={tableDownloadTooltipName} arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={handleTableDownload}
                    sx={{
                      // color: "inherit", // Default color
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        color: '#068fff', // Change to desired color on hover
                        transform: 'scale(1.2)',
                      },
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
              {!hideFilterToggleButton && (
                <Tooltip title="Hide / Show Column" arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={handleColumnMenuOpen}
                    sx={{
                      // color: "inherit", // Default color
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        color: '#068fff', // Change to desired color on hover
                        transform: 'scale(1.2)',
                      },
                    }}
                  >
                    <ViewColumnIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>
      ) : (
        <>
          {(!hideFilterToggleButton || handleTableDownload) && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '3px 7px' }}>
              {handleTableDownload && (
                <Tooltip title={tableDownloadTooltipName} arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={handleTableDownload}
                    sx={{
                      // color: "inherit", // Default color
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        color: '#068fff', // Change to desired color on hover
                        transform: 'scale(1.2)',
                      },
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
              {!hideFilterToggleButton && (
                <Tooltip title="Hide / Show Column" arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={handleColumnMenuOpen}
                    sx={{
                      // color: "inherit", // Default color
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        color: '#068fff', // Change to desired color on hover
                        transform: 'scale(1.2)',
                      },
                    }}
                  >
                    <ViewColumnIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </>
      )}

      {downMD && <Divider />}
      <TableContainer
        elevation={1}
        className="custom-scrollbar"
        sx={{
          maxHeight: '58vh',
          overflow: 'auto',
        }}
        // sx={{
        //   maxHeight: '58vh',
        //   overflow: 'auto',
        //   // Scrollbar styles
        //   '&::-webkit-scrollbar': {
        //     width: '4px',
        //     height: '4px',
        //   },
        //   '&::-webkit-scrollbar-track': {
        //     background: '#f1f1f1',
        //   },
        //   '&::-webkit-scrollbar-thumb': {
        //     backgroundColor: '#ccc9ce',
        //     borderRadius: '23px',
        //   },
        //   '&::-webkit-scrollbar-thumb:hover': {
        //     backgroundColor: '#888',
        //     borderRadius: '24px',
        //   },
        // }}
      >
        <Table
          ref={tableRef}
          stickyHeader
          aria-label="sticky table"
          sx={{
            borderCollapse: 'separate',
            borderSpacing: '0px',
            minWidth: '100%',
            tableLayout: 'fixed',
          }}
        >
          {!downMD && renderTableHeader()}

          <TableBody>
            {loadingLoader ? (
              // <TableRowsLoader title={title} rowsNum={20} headCells={visibleHeadings} />
              <TableRow>
                <TableCell colSpan={visibleHeadings.length}>
                  <Box justifyContent="center" alignItems="center" textAlign="center">
                    {/* <NoRecords {...(titleOnlyMessage ? { titleOnlyMessage } : { title })} /> */}
                    <LoadingBox message={`${title} are loading.`} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filteredAndSortedData.length > 0 ? (
                  <>
                    {downMD ? (
                      <TableRow>
                        {/* <Divider /> */}
                        <TableCell colSpan={visibleHeadings.length}>
                          <CardTable
                            data={filteredAndSortedData}
                            headings={visibleHeadings}
                            paginationProps={paginationProps}
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedData.map((row, index) => (
                        <TableRow
                          size="small"
                          key={index}
                          sx={{
                            '&:nth-of-type(even)': {
                              backgroundColor: '#F4F6F7',
                            },
                            '&:nth-of-type(odd)': {
                              backgroundColor: '#FFFFFF',
                            },
                            '&:hover': {
                              backgroundColor: '#edeeee',
                            },
                          }}
                        >
                          {visibleHeadings.map((heading) => (
                            <StyledTableCell
                              key={heading.id}
                              align={heading.align}
                              sx={{
                                fontSize: '0.800rem !important',
                              }}
                            >
                              {renderCellContent(heading, row, index)}
                            </StyledTableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={visibleHeadings.length}>
                      {downMD && <Divider />}
                      <Box justifyContent="center" alignItems="center" textAlign="center">
                        <NoRecords {...(titleOnlyMessage ? { titleOnlyMessage } : { title })} />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {paginationProps && (
        <>
          {downMD ? (
            <>
              <Divider />
              <Box sx={{ my: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pagination
                  page={page + 1}
                  count={totalPages}
                  size="small"
                  siblingCount={0}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                  color="primary"
                  // sx={{
                  //   '& .Mui-selected': {
                  //     backgroundColor: 'primary.main',
                  //     color: 'white',
                  //     '&:hover': {
                  //       backgroundColor: 'primary.dark',
                  //     },
                  //   },
                  // }}
                />
              </Box>
            </>
          ) : (
            <TablePagination
              size="small"
              rowsPerPageOptions={[20, 50, 100, 200]}
              // rowsPerPageOptions={[20, 50, 100, { label: 'All', value: totalCount }]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
              ActionsComponent={TablePaginationActions}
              labelRowsPerPage="Rows Per Page"
              shape="rounded"
              sx={{
                borderTop: '1px solid #e4e4e4',
                alignItems: 'center',
                '& .MuiTablePagination-select': {
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '0px',
                },
                '& .MuiSelect-root': {
                  display: 'flex',
                  alignItems: 'center',
                  paddingRight: '24px',
                },
                '& .MuiSelect-icon': {
                  marginLeft: '8px',
                },
                '& .MuiTablePagination-input': {
                  height: '30px',
                  width: '80px',
                  border: '0.5px solid #a4a8ad',
                  borderRadius: '4px',
                  padding: '0 8px',
                },
              }}
            />
          )}
        </>
      )}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8f8f8',
            width: '280px',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            gap: 2,
          },
        }}
        TransitionComponent={Grow}
        TransitionProps={{ timeout: 300 }}
      >
        {activeFilterColumn && <Box>{getFilterComponent(activeFilterColumn)}</Box>}

        <Alert
          severity="info"
          icon={<InfoOutlined fontSize="small" />}
          sx={{
            '& .MuiAlert-icon': {
              fontSize: '5px',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontSize: '11px' }}>
            This Filters current page data. Use master search for Complete results.
          </Typography>
        </Alert>
      </Popover>

      <Popover
        open={Boolean(columnMenuAnchorEl)}
        anchorEl={columnMenuAnchorEl}
        onClose={handleColumnMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box p={1}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" gutterBottom>
              Toggle Columns
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              minWidth: '200px',
              maxWidth: '240px',
              maxHeight: '210px',
              overflow: 'auto',
              m: '5px 0px',
            }}
            className="custom-scrollbar"
          >
            {columns.map((column) => (
              <Tooltip
                key={column.id}
                title={visibleColumns.includes(column.id) ? 'Hide column' : 'Show column'}
                placement="left"
                arrow
              >
                <MenuItem
                  onClick={() => handleColumnVisibilityChange(column.id)}
                  sx={{
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  {visibleColumns.includes(column.id) ? (
                    <VisibilityIcon sx={{ fontSize: '1.2rem', color: '#6c737f' }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: '1.2rem', color: 'red' }} />
                  )}
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      fontSize: '0.800rem!important',
                      fontWeight: 450,
                      marginLeft: 1.5,
                      textDecoration: visibleColumns.includes(column.id) ? 'none' : 'line-through',
                      color: visibleColumns.includes(column.id) ? 'none' : 'red',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {column.label}
                  </Typography>
                </MenuItem>
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

// table component proptype define
EnhancedTable.propTypes = {
  headings: PropTypes.arrayOf(columnPropType).isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  hideFilterToggleButton: PropTypes.bool,
  hideMasterSearch: PropTypes.bool,
  title: PropTypes.string,
  query: PropTypes.string,
  // handleTextChange: PropTypes.func,
  totalCount: PropTypes.number,

  paginationProps: PropTypes.shape({
    rowsPerPage: PropTypes.number,
    page: PropTypes.number,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
  }),
};

export default React.memo(EnhancedTable);
