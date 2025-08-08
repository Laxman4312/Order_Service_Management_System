import React, { useState, useCallback, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Stack,
  MenuItem,
  Select,
  FormControl,
  Card,
  InputLabel,
  IconButton,
  TextField,
  Dialog,
  RadioGroup,
  FormControlLabel,
  Radio,
  ListSubheader,
  Zoom,
} from '@mui/material';
import { IconX, IconTrash } from '@tabler/icons-react';
import { Image } from './MiniComponents';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FiltersIcon } from 'config/icons';
import AutoComplete from './AutoComplete';
import axiosInstance from 'api/services/axiosInstance';
import { dateUtils } from 'utils/dateUtils';
import { LightTooltip } from './Tooltip';

const FilterDialog = ({
  open,
  handleClose,
  onChange,
  filterConfig = [],
  filters = {},
  title = 'Filters',
  onReset,
  clearSpecificFilter,
}) => {
  // Use name as the unique identifier when IDs are identical
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [filterValues, setFilterValues] = useState(filters);
  const [dateErrors, setDateErrors] = useState({});

  // Initialize active filters based on existing filter values
  useEffect(() => {
    const initActiveFilters = new Set();

    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      const filter = filterConfig.find((f) => f.id === key);
      if (filter) {
        initActiveFilters.add(getFilterIdentifier(filter));
      } else {
        const dateRangeFilter = filterConfig.find(
          (f) => f.type === 'date_range' && (f.start === key || f.end === key),
        );
        if (dateRangeFilter) {
          initActiveFilters.add(getFilterIdentifier(dateRangeFilter));
        }
      }
    });

    setActiveFilters(initActiveFilters);
    setFilterValues({ ...filters });
  }, [filters, filterConfig]);

  const getFilterIdentifier = useCallback(
    (filter) => {
      const duplicateIds = filterConfig.filter((f) => f.id === filter.id);
      return duplicateIds.length > 1 ? filter.name : filter.id;
    },
    [filterConfig],
  );

  const validateDateRange = useCallback((filter, startDate, endDate) => {
    const endField = filter.end;

    if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
      setDateErrors((prev) => ({
        ...prev,
        [endField]: 'End date cannot be before start date',
      }));
      return false;
    }

    setDateErrors((prev) => ({
      ...prev,
      [endField]: '',
    }));
    return true;
  }, []);

  const handleApplyFilter = useCallback(() => {
    let isValid = true;

    activeFilters.forEach((filterIdentifier) => {
      const config = filterConfig.find((f) => getFilterIdentifier(f) === filterIdentifier);
      if (config?.type === 'date_range') {
        const startDate = filterValues[config.start];
        const endDate = filterValues[config.end];
        if (!validateDateRange(config, startDate, endDate)) {
          isValid = false;
        }
      }
    });

    if (!isValid) return;

    // Create an object to track which filters are active
    const activeFilterFields = {};

    // First, mark all active filters
    activeFilters.forEach((filterIdentifier) => {
      const config = filterConfig.find((f) => getFilterIdentifier(f) === filterIdentifier);
      if (!config) return;

      if (config.type === 'date_range') {
        activeFilterFields[config.start] = true;
        activeFilterFields[config.end] = true;
      } else {
        activeFilterFields[config.id] = true;
      }
    });

    // Apply only active filters, and clear inactive ones
    filterConfig.forEach((config) => {
      if (config.type === 'date_range') {
        // For date range filters
        const startFieldActive = activeFilterFields[config.start];
        const endFieldActive = activeFilterFields[config.end];

        onChange(
          config.start,
          startFieldActive && filterValues[config.start]
            ? dateUtils.toISODate(filterValues[config.start])
            : '',
        );
        onChange(
          config.end,
          endFieldActive && filterValues[config.end]
            ? dateUtils.toISODate(filterValues[config.end])
            : '',
        );
      } else {
        // For all other filter types
        const isActive = activeFilterFields[config.id];

        if (isActive) {
          if (config.type === 'date') {
            onChange(
              config.id,
              filterValues[config.id] ? dateUtils.toISODate(filterValues[config.id]) : '',
            );
          } else {
            onChange(config.id, filterValues[config.id] || '');
          }
        } else {
          // Clear inactive filters
          onChange(config.id, '');
        }
      }
    });

    handleClose();
  }, [
    activeFilters,
    filterConfig,
    filterValues,
    handleClose,
    onChange,
    validateDateRange,
    getFilterIdentifier,
  ]);

  const handleFilterSelect = useCallback(
    (option) => {
      const filterIdentifier = getFilterIdentifier(option);

      // Check if the filter already has a value
      const hasValue = (() => {
        if (option.type === 'date_range') {
          return (
            (filterValues[option.start] !== undefined &&
              filterValues[option.start] !== null &&
              filterValues[option.start] !== '') ||
            (filterValues[option.end] !== undefined &&
              filterValues[option.end] !== null &&
              filterValues[option.end] !== '')
          );
        } else {
          return (
            filterValues[option.id] !== undefined &&
            filterValues[option.id] !== null &&
            filterValues[option.id] !== ''
          );
        }
      })();

      setActiveFilters((prevFilters) => {
        const newFilters = new Set(prevFilters);

        // Handle mutually exclusive filters
        if (option.type === 'date' || option.type === 'date_range') {
          const oppositeType = option.type === 'date' ? 'date_range' : 'date';
          const oppositeFilter = filterConfig.find(
            (f) => f.id === option.id && f.type === oppositeType,
          );

          if (oppositeFilter) {
            const oppositeIdentifier = getFilterIdentifier(oppositeFilter);
            newFilters.delete(oppositeIdentifier);
            setFilterValues((prev) => {
              const newValues = { ...prev };
              if (oppositeType === 'date_range') {
                delete newValues[oppositeFilter.start];
                delete newValues[oppositeFilter.end];
              } else {
                delete newValues[oppositeIdentifier];
              }
              return newValues;
            });
          }
        }

        // If already active and has a value, clear the specific filter in parent state
        if (newFilters.has(filterIdentifier) && hasValue) {
          // Clear the value in the parent component using clearSpecificFilter
          if (clearSpecificFilter) {
            clearSpecificFilter(option);
          }

          // Also clear the value in local state
          setFilterValues((prev) => {
            const newValues = { ...prev };
            if (option.type === 'date_range') {
              newValues[option.start] = null;
              newValues[option.end] = null;

              // Remove from dateErrors if exists
              if (dateErrors[option.start]) {
                setDateErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors[option.start];
                  return newErrors;
                });
              }
              if (dateErrors[option.end]) {
                setDateErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors[option.end];
                  return newErrors;
                });
              }
            } else {
              newValues[option.id] = '';
            }
            return newValues;
          });
          return newFilters; // Keep the filter active
        }

        // Toggle current filter normally if it doesn't have a value or isn't active
        if (newFilters.has(filterIdentifier)) {
          newFilters.delete(filterIdentifier);
          // Clear the filter value when deselecting but DON'T notify parent yet
          setFilterValues((prev) => {
            const newValues = { ...prev };
            if (option.type === 'date_range') {
              delete newValues[option.start];
              delete newValues[option.end];

              // Remove from dateErrors if exists
              if (dateErrors[option.start]) {
                setDateErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors[option.start];
                  return newErrors;
                });
              }
              if (dateErrors[option.end]) {
                setDateErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors[option.end];
                  return newErrors;
                });
              }
            } else {
              delete newValues[option.id];
            }
            return newValues;
          });
        } else {
          newFilters.add(filterIdentifier);
        }
        return newFilters;
      });
    },
    [filterConfig, getFilterIdentifier, dateErrors, filterValues, clearSpecificFilter],
  );

  const handleInputChange = useCallback(
    (field, value) => {
      setFilterValues((prev) => {
        const newValues = { ...prev };
        newValues[field] = value;

        // Check if this field is part of a date range
        const dateRangeFilter = filterConfig.find(
          (f) => f.type === 'date_range' && (f.start === field || f.end === field),
        );

        if (dateRangeFilter) {
          const startDate =
            field === dateRangeFilter.start ? value : newValues[dateRangeFilter.start];
          const endDate = field === dateRangeFilter.end ? value : newValues[dateRangeFilter.end];
          validateDateRange(dateRangeFilter, startDate, endDate);
        }

        return newValues;
      });
    },
    [validateDateRange, filterConfig],
  );

  const handleReset = useCallback(() => {
    setFilterValues({});
    setActiveFilters(new Set());
    setDateErrors({});

    if (onReset) {
      onReset();
    } else {
      // Only notify parent component when Apply is clicked or dialog is closed
    }
  }, [onReset]);

  const getActiveFilterCount = Object.values(filterValues).filter(
    (value) => value !== '' && value !== undefined && value !== null,
  ).length;

  const hasActiveFilters = getActiveFilterCount > 0;

  const renderFilterInput = useCallback(
    (config) => {
      if (!config) return null;

      const { id, type, label, options, inputProps = {}, endpoint } = config;

      switch (type) {
        case 'text':
          return (
            <TextField
              label={label}
              fullWidth
              size="small"
              value={filterValues[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              {...inputProps}
            />
          );

        case 'autocomplete':
          const currentValue = filterValues[id];
          const fetch = (params = {}) => axiosInstance.get(endpoint, params);

          return (
            <AutoComplete
              fetchFunction={(p) => fetch(p)}
              options={options ?? null}
              value={currentValue}
              onChange={(e) => handleInputChange(id, e ?? null)}
              label={label}
              getOptionLabel={config.getOptionLabel}
              identifierProp={config.identifierProp || 'id'}
              size="small"
              {...inputProps}
            />
          );

        case 'select':
          return (
            <FormControl fullWidth size="small">
              <InputLabel>{label}</InputLabel>
              <Select
                value={filterValues[id] || ''}
                onChange={(e) => handleInputChange(id, e.target.value)}
                label={label}
                {...inputProps}
              >
                {options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );

        case 'grouped_select':
          return (
            <FormControl fullWidth size="small">
              <InputLabel>{label}</InputLabel>
              <Select
                value={filterValues[id] || ''}
                onChange={(e) => handleInputChange(id, e.target.value)}
                label={label}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 230,
                      overflowY: 'auto',
                    },
                  },
                }}
                {...inputProps}
              >
                {/* <MenuItem value="">
                  <em>None</em>
                </MenuItem> */}
                {options?.map((group) => [
                  <ListSubheader
                    key={`group-${group.label}`}
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                      backgroundColor: 'background.paper',
                      lineHeight: '30px',
                      ...(config.subheaderStyle || {}),
                    }}
                  >
                    {group.label}
                  </ListSubheader>,
                  group.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  )),
                ])}
              </Select>
            </FormControl>
          );

        case 'date':
          return (
            <DatePicker
              label={label}
              value={filterValues[id] ? dayjs(filterValues[id]) : null}
              onChange={(newValue) => handleInputChange(id, newValue)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  placeholder: 'DD/MM/YYYY',
                  ...inputProps,
                },
              }}
            />
          );

        case 'date_range':
          const startField = config.start;
          const endField = config.end;
          const startError = dateErrors[startField];
          const endError = dateErrors[endField];

          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={filterValues[startField] ? dayjs(filterValues[startField]) : null}
                onChange={(newValue) => handleInputChange(startField, newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    placeholder: 'DD/MM/YYYY',
                    error: !!startError,
                    helperText: startError,
                    ...inputProps,
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={filterValues[endField] ? dayjs(filterValues[endField]) : null}
                onChange={(newValue) => handleInputChange(endField, newValue)}
                minDate={filterValues[startField] ? dayjs(filterValues[startField]) : undefined}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    placeholder: 'DD/MM/YYYY',
                    error: !!endError,
                    helperText: endError,
                    ...inputProps,
                  },
                }}
              />
            </Box>
          );

        case 'radio':
          return (
            <FormControl fullWidth>
              <Box
                display="flex"
                gap={3}
                alignItems="center"
                sx={{
                  border: '0.8px solid rgba(0, 0, 0, 0.2)',
                  borderRadius: '0.7rem',
                  p: 1,
                  backgroundColor: '#F8FAFC',
                  width: 'fit-content',
                }}
              >
                <RadioGroup
                  row={config.direction !== 'column'}
                  name={label}
                  value={filterValues[id] || ''}
                  onChange={(e) => handleInputChange(id, e.target.value)}
                >
                  {options?.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio color="secondary" disabled={option.disabled} />}
                      label={option.label}
                      disabled={option.disabled}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </FormControl>
          );

        default:
          return null;
      }
    },
    [filterValues, dateErrors, handleInputChange],
  );

  // Modified to ensure filter changes only happen on Apply
  const onDialogClose = useCallback(() => {
    // Reset to original filters state when dialog is closed without applying
    setFilterValues(filters);

    // Recalculate active filters based on original filters
    const initActiveFilters = new Set();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      const filter = filterConfig.find((f) => f.id === key);
      if (filter) {
        initActiveFilters.add(getFilterIdentifier(filter));
      } else {
        const dateRangeFilter = filterConfig.find(
          (f) => f.type === 'date_range' && (f.start === key || f.end === key),
        );
        if (dateRangeFilter) {
          initActiveFilters.add(getFilterIdentifier(dateRangeFilter));
        }
      }
    });
    setActiveFilters(initActiveFilters);

    handleClose();
  }, [filters, filterConfig, handleClose, getFilterIdentifier]);

  return (
    <Dialog open={open} onClose={onDialogClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Typography sx={{ p: 0, fontSize: '1.125rem' }}>{title}</Typography>
        <Stack direction="row" spacing={1}>
          <LightTooltip
            title="Clear Filter"
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 350 }}
          >
            <IconButton color="error" size="small" onClick={handleReset}>
              <IconTrash size={18} />
            </IconButton>
          </LightTooltip>
          <IconButton size="small" onClick={onDialogClose}>
            <IconX size={18} />
          </IconButton>
        </Stack>
      </Box>

      <Box
        sx={{
          pt: 2,
          px: 3,
          pb: 3,
          overflowY: 'auto',
          flex: 1,
        }}
      >
        <Card sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', p: 0.6 }}>
          {filterConfig.map((option, i) => (
            <Button
              key={i}
              variant={activeFilters.has(getFilterIdentifier(option)) ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleFilterSelect(option)}
            >
              {option.label}
            </Button>
          ))}
        </Card>

        <Box sx={{ mt: 2 }}>
          {activeFilters.size > 0 ? (
            <Stack spacing={2}>
              {Array.from(activeFilters).map((filterIdentifier) => (
                <Box key={filterIdentifier}>
                  {renderFilterInput(
                    filterConfig.find((f) => getFilterIdentifier(f) === filterIdentifier),
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Image image={FiltersIcon} alt="Filters Icon" width={50} />
              <Stack spacing={0.5} textAlign="center">
                <Typography variant="h6">Filter Selection</Typography>
                <Typography variant="body2" color="text.secondary">
                  Please select your desired filters. Multiple filters can be applied from this
                  filter dialog.
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>

        {activeFilters.size > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {hasActiveFilters && (
              <Button
                variant="contained"
                size="small"
                onClick={handleApplyFilter}
                disabled={Object.values(dateErrors).some((error) => !!error)}
              >
                Apply
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default React.memo(FilterDialog);

// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   Button,
//   Box,
//   Typography,
//   Stack,
//   MenuItem,
//   Select,
//   FormControl,
//   Card,
//   InputLabel,
//   IconButton,
//   TextField,
//   Dialog,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   ListSubheader,
//   Zoom,
// } from '@mui/material';
// import { IconX, IconTrash } from '@tabler/icons-react';
// import { Image } from './MiniComponents';
// import { DatePicker } from '@mui/x-date-pickers';
// import dayjs from 'dayjs';
// import { FiltersIcon } from 'config/icons';
// import AutoComplete from './AutoComplete';
// import axiosInstance from 'api/services/axiosInstance';
// import { dateUtils } from 'utils/dateUtils';
// import { LightTooltip } from './Tooltip';

// const FilterDialog = ({
//   open,
//   handleClose,
//   onChange,
//   filterConfig = [],
//   filters = {},
//   title = 'Filters',
//   onReset,
//   clearSpecificFilter,
// }) => {
//   // Use name as the unique identifier when IDs are identical
//   const [activeFilters, setActiveFilters] = useState(new Set());
//   const [filterValues, setFilterValues] = useState(filters);
//   const [dateErrors, setDateErrors] = useState({});

//   // Initialize active filters based on existing filter values
//   useEffect(() => {
//     const initActiveFilters = new Set();

//     Object.entries(filters).forEach(([key, value]) => {
//       if (value === null || value === undefined || value === '') {
//         return;
//       }

//       const filter = filterConfig.find((f) => f.id === key);
//       if (filter) {
//         initActiveFilters.add(getFilterIdentifier(filter));
//       } else {
//         const dateRangeFilter = filterConfig.find(
//           (f) => f.type === 'date_range' && (f.start === key || f.end === key),
//         );
//         if (dateRangeFilter) {
//           initActiveFilters.add(getFilterIdentifier(dateRangeFilter));
//         }
//       }
//     });

//     setActiveFilters(initActiveFilters);
//     setFilterValues({ ...filters });
//   }, [filters, filterConfig]);

//   const getFilterIdentifier = useCallback(
//     (filter) => {
//       const duplicateIds = filterConfig.filter((f) => f.id === filter.id);
//       return duplicateIds.length > 1 ? filter.name : filter.id;
//     },
//     [filterConfig],
//   );

//   const validateDateRange = useCallback((filter, startDate, endDate) => {
//     const endField = filter.end;

//     if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
//       setDateErrors((prev) => ({
//         ...prev,
//         [endField]: 'End date cannot be before start date',
//       }));
//       return false;
//     }

//     setDateErrors((prev) => ({
//       ...prev,
//       [endField]: '',
//     }));
//     return true;
//   }, []);

//   const handleApplyFilter = useCallback(() => {
//     let isValid = true;

//     activeFilters.forEach((filterIdentifier) => {
//       const config = filterConfig.find((f) => getFilterIdentifier(f) === filterIdentifier);
//       if (config?.type === 'date_range') {
//         const startDate = filterValues[config.start];
//         const endDate = filterValues[config.end];
//         if (!validateDateRange(config, startDate, endDate)) {
//           isValid = false;
//         }
//       }
//     });

//     if (!isValid) return;

//     // Create an object to track which filters are active
//     const activeFilterFields = {};

//     // First, mark all active filters
//     activeFilters.forEach((filterIdentifier) => {
//       const config = filterConfig.find((f) => getFilterIdentifier(f) === filterIdentifier);
//       if (!config) return;

//       if (config.type === 'date_range') {
//         activeFilterFields[config.start] = true;
//         activeFilterFields[config.end] = true;
//       } else {
//         activeFilterFields[config.id] = true;
//       }
//     });

//     // Apply only active filters, and clear inactive ones
//     filterConfig.forEach((config) => {
//       if (config.type === 'date_range') {
//         // For date range filters
//         const startFieldActive = activeFilterFields[config.start];
//         const endFieldActive = activeFilterFields[config.end];

//         onChange(
//           config.start,
//           startFieldActive && filterValues[config.start]
//             ? dateUtils.toISODate(filterValues[config.start])
//             : '',
//         );
//         onChange(
//           config.end,
//           endFieldActive && filterValues[config.end]
//             ? dateUtils.toISODate(filterValues[config.end])
//             : '',
//         );
//       } else {
//         // For all other filter types
//         const isActive = activeFilterFields[config.id];

//         if (isActive) {
//           if (config.type === 'date') {
//             onChange(
//               config.id,
//               filterValues[config.id] ? dateUtils.toISODate(filterValues[config.id]) : '',
//             );
//           } else {
//             onChange(config.id, filterValues[config.id] || '');
//           }
//         } else {
//           // Clear inactive filters
//           onChange(config.id, '');
//         }
//       }
//     });

//     handleClose();
//   }, [
//     activeFilters,
//     filterConfig,
//     filterValues,
//     handleClose,
//     onChange,
//     validateDateRange,
//     getFilterIdentifier,
//   ]);

//   const handleFilterSelect = useCallback(
//     (option) => {
//       const filterIdentifier = getFilterIdentifier(option);

//       // Check if the filter already has a value
//       const hasValue = (() => {
//         if (option.type === 'date_range') {
//           return (
//             (filterValues[option.start] !== undefined &&
//               filterValues[option.start] !== null &&
//               filterValues[option.start] !== '') ||
//             (filterValues[option.end] !== undefined &&
//               filterValues[option.end] !== null &&
//               filterValues[option.end] !== '')
//           );
//         } else {
//           return (
//             filterValues[option.id] !== undefined &&
//             filterValues[option.id] !== null &&
//             filterValues[option.id] !== ''
//           );
//         }
//       })();

//       setActiveFilters((prevFilters) => {
//         const newFilters = new Set(prevFilters);

//         // Handle mutually exclusive filters
//         if (option.type === 'date' || option.type === 'date_range') {
//           const oppositeType = option.type === 'date' ? 'date_range' : 'date';
//           const oppositeFilter = filterConfig.find(
//             (f) => f.id === option.id && f.type === oppositeType,
//           );

//           if (oppositeFilter) {
//             const oppositeIdentifier = getFilterIdentifier(oppositeFilter);
//             newFilters.delete(oppositeIdentifier);
//             setFilterValues((prev) => {
//               const newValues = { ...prev };
//               if (oppositeType === 'date_range') {
//                 delete newValues[oppositeFilter.start];
//                 delete newValues[oppositeFilter.end];
//               } else {
//                 delete newValues[oppositeIdentifier];
//               }
//               return newValues;
//             });
//           }
//         }

//         // If already active and has a value, clear the specific filter in parent state
//         if (newFilters.has(filterIdentifier) && hasValue) {
//           // Clear the value in the parent component using clearSpecificFilter
//           if (clearSpecificFilter) {
//             clearSpecificFilter(option);
//           }

//           // Also clear the value in local state
//           setFilterValues((prev) => {
//             const newValues = { ...prev };
//             if (option.type === 'date_range') {
//               newValues[option.start] = null;
//               newValues[option.end] = null;

//               // Remove from dateErrors if exists
//               if (dateErrors[option.start]) {
//                 setDateErrors((prev) => {
//                   const newErrors = { ...prev };
//                   delete newErrors[option.start];
//                   return newErrors;
//                 });
//               }
//               if (dateErrors[option.end]) {
//                 setDateErrors((prev) => {
//                   const newErrors = { ...prev };
//                   delete newErrors[option.end];
//                   return newErrors;
//                 });
//               }
//             } else {
//               newValues[option.id] = '';
//             }
//             return newValues;
//           });
//           return newFilters; // Keep the filter active
//         }

//         // Toggle current filter normally if it doesn't have a value or isn't active
//         if (newFilters.has(filterIdentifier)) {
//           newFilters.delete(filterIdentifier);
//           // Clear the filter value when deselecting but DON'T notify parent yet
//           setFilterValues((prev) => {
//             const newValues = { ...prev };
//             if (option.type === 'date_range') {
//               delete newValues[option.start];
//               delete newValues[option.end];

//               // Remove from dateErrors if exists
//               if (dateErrors[option.start]) {
//                 setDateErrors((prev) => {
//                   const newErrors = { ...prev };
//                   delete newErrors[option.start];
//                   return newErrors;
//                 });
//               }
//               if (dateErrors[option.end]) {
//                 setDateErrors((prev) => {
//                   const newErrors = { ...prev };
//                   delete newErrors[option.end];
//                   return newErrors;
//                 });
//               }
//             } else {
//               delete newValues[option.id];
//             }
//             return newValues;
//           });
//         } else {
//           newFilters.add(filterIdentifier);
//         }
//         return newFilters;
//       });
//     },
//     [filterConfig, getFilterIdentifier, dateErrors, filterValues, clearSpecificFilter],
//   );

//   const handleInputChange = useCallback(
//     (field, value) => {
//       setFilterValues((prev) => {
//         const newValues = { ...prev };
//         newValues[field] = value;

//         // Check if this field is part of a date range
//         const dateRangeFilter = filterConfig.find(
//           (f) => f.type === 'date_range' && (f.start === field || f.end === field),
//         );

//         if (dateRangeFilter) {
//           const startDate =
//             field === dateRangeFilter.start ? value : newValues[dateRangeFilter.start];
//           const endDate = field === dateRangeFilter.end ? value : newValues[dateRangeFilter.end];
//           validateDateRange(dateRangeFilter, startDate, endDate);
//         }

//         return newValues;
//       });
//     },
//     [validateDateRange, filterConfig],
//   );

//   const handleReset = useCallback(() => {
//     setFilterValues({});
//     setActiveFilters(new Set());
//     setDateErrors({});

//     if (onReset) {
//       onReset();
//     } else {
//       // Only notify parent component when Apply is clicked or dialog is closed
//     }
//   }, [onReset]);

//   const getActiveFilterCount = Object.values(filterValues).filter(
//     (value) => value !== '' && value !== undefined && value !== null,
//   ).length;

//   const hasActiveFilters = getActiveFilterCount > 0;

//   const renderFilterInput = useCallback(
//     (config) => {
//       if (!config) return null;

//       const { id, type, label, options, inputProps = {}, endpoint } = config;

//       switch (type) {
//         case 'text':
//           return (
//             <TextField
//               label={label}
//               fullWidth
//               size="small"
//               value={filterValues[id] || ''}
//               onChange={(e) => handleInputChange(id, e.target.value)}
//               {...inputProps}
//             />
//           );

//         case 'autocomplete':
//           const currentValue = filterValues[id];
//           const fetch = (params = {}) => axiosInstance.get(endpoint, params);

//           return (
//             <AutoComplete
//               fetchFunction={(p) => fetch(p)}
//               options={options ?? null}
//               value={currentValue}
//               onChange={(e) => handleInputChange(id, e ?? null)}
//               label={label}
//               getOptionLabel={config.getOptionLabel}
//               identifierProp={config.identifierProp || 'id'}
//               size="small"
//               {...inputProps}
//             />
//           );

//         case 'select':
//           return (
//             <FormControl fullWidth size="small">
//               <InputLabel>{label}</InputLabel>
//               <Select
//                 value={filterValues[id] || ''}
//                 onChange={(e) => handleInputChange(id, e.target.value)}
//                 label={label}
//                 {...inputProps}
//               >
//                 {options?.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           );

//         case 'grouped_select':
//           return (
//             <FormControl fullWidth size="small">
//               <InputLabel>{label}</InputLabel>
//               <Select
//                 value={filterValues[id] || ''}
//                 onChange={(e) => handleInputChange(id, e.target.value)}
//                 label={label}
//                 MenuProps={{
//                   PaperProps: {
//                     style: {
//                       maxHeight: 230,
//                       overflowY: 'auto',
//                     },
//                   },
//                 }}
//                 {...inputProps}
//               >
//                 {/* <MenuItem value="">
//                   <em>None</em>
//                 </MenuItem> */}
//                 {options?.map((group) => [
//                   <ListSubheader
//                     key={`group-${group.label}`}
//                     sx={{
//                       fontWeight: 600,
//                       color: 'primary.main',
//                       backgroundColor: 'background.paper',
//                       lineHeight: '30px',
//                       ...(config.subheaderStyle || {}),
//                     }}
//                   >
//                     {group.label}
//                   </ListSubheader>,
//                   group.options.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   )),
//                 ])}
//               </Select>
//             </FormControl>
//           );

//         case 'date':
//           return (
//             <DatePicker
//               label={label}
//               value={filterValues[id] ? dayjs(filterValues[id]) : null}
//               onChange={(newValue) => handleInputChange(id, newValue)}
//               slotProps={{
//                 textField: {
//                   size: 'small',
//                   fullWidth: true,
//                   ...inputProps,
//                 },
//               }}
//             />
//           );

//         case 'date_range':
//           const startField = config.start;
//           const endField = config.end;
//           const startError = dateErrors[startField];
//           const endError = dateErrors[endField];

//           return (
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <DatePicker
//                 label="Start Date"
//                 value={filterValues[startField] ? dayjs(filterValues[startField]) : null}
//                 onChange={(newValue) => handleInputChange(startField, newValue)}
//                 slotProps={{
//                   textField: {
//                     size: 'small',
//                     fullWidth: true,
//                     error: !!startError,
//                     helperText: startError,
//                     ...inputProps,
//                   },
//                 }}
//               />
//               <DatePicker
//                 label="End Date"
//                 value={filterValues[endField] ? dayjs(filterValues[endField]) : null}
//                 onChange={(newValue) => handleInputChange(endField, newValue)}
//                 minDate={filterValues[startField] ? dayjs(filterValues[startField]) : undefined}
//                 slotProps={{
//                   textField: {
//                     size: 'small',
//                     fullWidth: true,
//                     error: !!endError,
//                     helperText: endError,
//                     ...inputProps,
//                   },
//                 }}
//               />
//             </Box>
//           );

//         case 'radio':
//           return (
//             <FormControl fullWidth>
//               <Box
//                 display="flex"
//                 gap={3}
//                 alignItems="center"
//                 sx={{
//                   border: '0.8px solid rgba(0, 0, 0, 0.2)',
//                   borderRadius: '0.7rem',
//                   p: 1,
//                   backgroundColor: '#F8FAFC',
//                   width: 'fit-content',
//                 }}
//               >
//                 <RadioGroup
//                   row={config.direction !== 'column'}
//                   name={label}
//                   value={filterValues[id] || ''}
//                   onChange={(e) => handleInputChange(id, e.target.value)}
//                 >
//                   {options?.map((option) => (
//                     <FormControlLabel
//                       key={option.value}
//                       value={option.value}
//                       control={<Radio color="secondary" disabled={option.disabled} />}
//                       label={option.label}
//                       disabled={option.disabled}
//                     />
//                   ))}
//                 </RadioGroup>
//               </Box>
//             </FormControl>
//           );

//         default:
//           return null;
//       }
//     },
//     [filterValues, dateErrors, handleInputChange],
//   );

//   // Modified to ensure filter changes only happen on Apply
//   const onDialogClose = useCallback(() => {
//     // Reset to original filters state when dialog is closed without applying
//     setFilterValues(filters);

//     // Recalculate active filters based on original filters
//     const initActiveFilters = new Set();
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value === null || value === undefined || value === '') {
//         return;
//       }

//       const filter = filterConfig.find((f) => f.id === key);
//       if (filter) {
//         initActiveFilters.add(getFilterIdentifier(filter));
//       } else {
//         const dateRangeFilter = filterConfig.find(
//           (f) => f.type === 'date_range' && (f.start === key || f.end === key),
//         );
//         if (dateRangeFilter) {
//           initActiveFilters.add(getFilterIdentifier(dateRangeFilter));
//         }
//       }
//     });
//     setActiveFilters(initActiveFilters);

//     handleClose();
//   }, [filters, filterConfig, handleClose, getFilterIdentifier]);

//   return (
//     <Dialog open={open} onClose={onDialogClose} maxWidth="sm" fullWidth>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           borderBottom: '1px solid',
//           borderColor: 'divider',
//           px: 3,
//           py: 2,
//           position: 'sticky',
//           top: 0,
//           zIndex: 1,
//           bgcolor: 'background.paper',
//         }}
//       >
//         <Typography sx={{ p: 0, fontSize: '1.125rem' }}>{title}</Typography>
//         <Stack direction="row" spacing={1}>
//           <LightTooltip
//             title="Clear Filter"
//             TransitionComponent={Zoom}
//             TransitionProps={{ timeout: 350 }}
//           >
//             <IconButton color="error" size="small" onClick={handleReset}>
//               <IconTrash size={18} />
//             </IconButton>
//           </LightTooltip>
//           <IconButton size="small" onClick={onDialogClose}>
//             <IconX size={18} />
//           </IconButton>
//         </Stack>
//       </Box>

//       <Box
//         sx={{
//           pt: 2,
//           px: 3,
//           pb: 3,
//           overflowY: 'auto',
//           flex: 1,
//         }}
//       >
//         <Card sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', p: 0.6 }}>
//           {filterConfig.map((option, i) => (
//             <Button
//               key={i}
//               variant={activeFilters.has(getFilterIdentifier(option)) ? 'contained' : 'outlined'}
//               size="small"
//               onClick={() => handleFilterSelect(option)}
//             >
//               {option.label}
//             </Button>
//           ))}
//         </Card>

//         <Box sx={{ mt: 2 }}>
//           {activeFilters.size > 0 ? (
//             <Stack spacing={2}>
//               {Array.from(activeFilters).map((filterIdentifier) => (
//                 <Box key={filterIdentifier}>
//                   {renderFilterInput(
//                     filterConfig.find((f) => getFilterIdentifier(f) === filterIdentifier),
//                   )}
//                 </Box>
//               ))}
//             </Stack>
//           ) : (
//             <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
//               <Image image={FiltersIcon} alt="Filters Icon" width={50} />
//               <Stack spacing={0.5} textAlign="center">
//                 <Typography variant="h6">Filter Selection</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Please select your desired filters. Multiple filters can be applied from this
//                   filter dialog.
//                 </Typography>
//               </Stack>
//             </Box>
//           )}
//         </Box>

//         {activeFilters.size > 0 && (
//           <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//             {hasActiveFilters && (
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={handleApplyFilter}
//                 disabled={Object.values(dateErrors).some((error) => !!error)}
//               >
//                 Apply
//               </Button>
//             )}
//           </Box>
//         )}
//       </Box>
//     </Dialog>
//   );
// };

// export default React.memo(FilterDialog);
