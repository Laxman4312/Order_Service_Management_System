import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for handling filters in data tables and components
 * @param {Array} initialConfig - Array of filter configuration objects
 * @returns {Object} Filter state and handlers
 */
const useFilters = (initialConfig = []) => {
  // Generate initial filter state based on config
  const generateInitialState = useCallback(() => {
    const state = {};
    initialConfig.forEach((filter) => {
      if (filter.type === 'date_range') {
        state[filter.start] = '';
        state[filter.end] = '';
      } else if (filter.type === 'radio' && filter.defaultValue) {
        // For radio buttons, we can set a default value if provided
        state[filter.id] = filter.defaultValue;
      } else if (filter.type === 'grouped_select' && filter.defaultValue) {
        // For grouped select, set default value if provided
        state[filter.id] = filter.defaultValue;
      } else {
        state[filter.id] = '';
      }
    });
    return state;
  }, [initialConfig]);

  const [filters, setFilters] = useState(generateInitialState());

  // Format filters to ensure autocomplete values are correctly structured
  const formattedFilters = useMemo(() => {
    const formatted = { ...filters };
    initialConfig.forEach((filter) => {
      if (filter.type === 'autocomplete') {
        const value = formatted[filter.id];
        if (!value || value === '') {
          formatted[filter.id] = null;
        }
      }
    });
    return formatted;
  }, [filters, initialConfig]);

  const handleFilterChange = useCallback((filterId, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  }, []);

  // Clear a specific filter
  // const clearSpecificFilter = useCallback((filterConfig) => {
  //   setFilters((prev) => {
  //     const newFilters = { ...prev };

  //     if (filterConfig.type === 'date_range') {
  //       // For date range filters, clear both start and end dates
  //       delete newFilters[filterConfig.start];
  //       delete newFilters[filterConfig.end];
  //     } else {
  //       // For regular filters, clear the single field
  //       delete newFilters[filterConfig.id];
  //     }

  //     return newFilters;
  //   });
  // }, []);
  const clearSpecificFilter = useCallback((filterConfig) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      if (filterConfig.type === 'date_range') {
        // For date range filters, clear both start and end dates
        delete newFilters[filterConfig.start];
        delete newFilters[filterConfig.end];
      } else if (
        filterConfig.type === 'grouped_select' &&
        filterConfig.defaultValue !== undefined
      ) {
        // For grouped select filters with defaultValue, reset to the default value instead of removing
        newFilters[filterConfig.id] = filterConfig.defaultValue;
      } else {
        // For regular filters, clear the single field
        delete newFilters[filterConfig.id];
      }

      return newFilters;
    });
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(generateInitialState());
  }, [generateInitialState]);

  // Transform filter values into API request params
  const getParams = useCallback(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      // Skip empty values
      if (value === undefined || value === '' || value === null) {
        return;
      }

      // Find the filter configuration for this key
      const filter = initialConfig.find(
        (f) => f.id === key || (f.type === 'date_range' && (f.start === key || f.end === key)),
      );

      // Handle autocomplete fields
      if (filter?.type === 'autocomplete') {
        if (typeof value === 'object' && value !== null) {
          const identifierProp = filter.identifierProp || 'id';
          params[key] = value[identifierProp] || value.value || value.id || '';
        } else {
          params[key] = value;
        }
      } else {
        params[key] = value;
      }
    });
    return params;
  }, [filters, initialConfig]);

  // Count active filters - treating date ranges as a single filter
  const getActiveFilterCount = useCallback(() => {
    // Create a map to track active filters by their configuration
    const activeFilters = new Set();

    // Process each filter configuration
    initialConfig.forEach((filterConfig) => {
      if (filterConfig.type === 'date_range') {
        // For date range, check if either start or end date is set
        const startValue = filters[filterConfig.start];
        const endValue = filters[filterConfig.end];

        if ((startValue && startValue !== '') || (endValue && endValue !== '')) {
          // Count the entire date range as one active filter
          activeFilters.add(filterConfig.id);
        }
      } else {
        // For regular filters
        const value = filters[filterConfig.id];

        // Skip counting radio buttons with default values as "active" filters
        if (
          (filterConfig.type === 'radio' || filterConfig.type === 'grouped_select') &&
          value === filterConfig.defaultValue &&
          filterConfig.excludeDefaultFromCount
        ) {
          return;
        }

        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'object') {
            // For object type values like autocomplete
            if (Object.keys(value).length > 0) {
              activeFilters.add(filterConfig.id);
            }
          } else {
            activeFilters.add(filterConfig.id);
          }
        }
      }
    });

    return activeFilters.size;
  }, [filters, initialConfig]);

  return {
    filters,
    formattedFilters,
    filterConfig: initialConfig,
    handleFilterChange,
    handleFilterReset,
    clearSpecificFilter,
    getParams,
    activeFilterCount: getActiveFilterCount(),
    getActiveFilterCount,
    hasActiveFilters: getActiveFilterCount() > 0,
  };
};

export default useFilters;
