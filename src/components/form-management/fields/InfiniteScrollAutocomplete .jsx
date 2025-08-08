import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress, Typography, Box } from '@mui/material';
import { debounce, uniqBy } from 'lodash';
import { scrollBarStyling } from 'components/MiniComponents';

export const useInfiniteScrollAutocomplete = ({
  fetchFunction,
  initialPage = 1,
  pageSize = 50,
  initialSearch = '',
  initialSelectedItem = null,
  identifierProp = 'id',
  debounceTime = 500,
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [touched, setTouched] = useState(false);

  // Add loading lock ref to prevent duplicate API calls
  const isLoadingRef = useRef(false);

  const addUniqueOptions = useCallback(
    (currentOptions, newOptions) => {
      const combinedOptions = [...currentOptions, ...newOptions];
      return uniqBy(combinedOptions, identifierProp);
    },
    [identifierProp],
  );

  const fetchData = useCallback(
    async (search = '', currentPage = initialPage, additionalParams = {}) => {
      // Check if already loading
      if (isLoadingRef.current) {
        return;
      }

      try {
        isLoadingRef.current = true;
        setLoading(true);
        let params = { query: search, page: currentPage, pageSize, ...additionalParams };
        const result = await fetchFunction(params);

        let newData = [];
        if (result.result && typeof result.result === 'object' && !Array.isArray(result.result)) {
          newData = [result.result];
        } else {
          newData = result.result || result.data || result || [];
        }

        if (additionalParams[identifierProp]) {
          if (newData.length > 0) {
            const foundItem = newData[0];
            setSelectedItem(foundItem);
            setOptions((prev) => addUniqueOptions(prev, [foundItem]));
          }
        } else {
          setOptions(
            currentPage === initialPage ? newData : (prev) => addUniqueOptions(prev, newData),
          );
          setHasMore(newData.length === pageSize);
        }
      } catch (error) {
        console.error('Fetch data error:', error);
        setError(error);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [pageSize, initialPage, identifierProp, addUniqueOptions],
  );

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, debounceTime),
    [fetchData, debounceTime],
  );

  const handleSearch = useCallback(
    (search) => {
      setSearchTerm(search);
      setPage(initialPage);
      debouncedFetchData(search, initialPage);
    },
    [initialPage, debouncedFetchData],
  );

  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingRef.current) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(searchTerm, nextPage);
    }
  }, [hasMore, page, searchTerm, fetchData]);

  const handleItemSelect = useCallback(
    (item) => {
      setSelectedItem(item);
      setTouched(true);
      if (!item) {
        setPage(initialPage);
        setSearchTerm('');
        fetchData('', initialPage);
      }
    },
    [initialPage, fetchData],
  );

  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setOptions([]);
    fetchData('', initialPage);
  }, [initialPage, fetchData]);

  const getIdentifierValue = (item, identifierProp) => {
    return typeof item === 'object' ? item[identifierProp] : item;
  };

  useEffect(() => {
    const initializeData = async () => {
      if (initialSelectedItem) {
        const identifierValue = getIdentifierValue(initialSelectedItem, identifierProp);
        const params = { [identifierProp]: identifierValue };
        await fetchData('', initialPage, params);
      }

      if (isInitialLoad) {
        await fetchData('', initialPage);
        setIsInitialLoad(false);
      }
    };

    initializeData();

    return () => {
      debouncedFetchData.cancel();
    };
  }, [initialSelectedItem, fetchData, initialPage, identifierProp, isInitialLoad]);

  return {
    options,
    loading,
    error,
    hasMore,
    searchTerm,
    selectedItem,
    touched,
    handleSearch,
    loadMore,
    handleItemSelect,
    setTouched,
    resetSearch,
  };
};

export const InfiniteScrollAutocomplete = ({ field, formikProps, ...props }) => {
  const {
    fetchFunction,
    required = false,
    getOptionLabel = (option) => option?.name || '',
    renderOption,
    identifierProp = 'id',
    debounceTime = 500,
    label = 'Search',
  } = field;

  const { touched, values, handleBlur, setFieldValue, setFieldTouched } = formikProps;

  const {
    options,
    loading,
    error,
    handleSearch,
    loadMore,
    selectedItem,
    handleItemSelect,
    setTouched: setLocalTouched,
    resetSearch,
  } = useInfiniteScrollAutocomplete({
    fetchFunction,
    initialSelectedItem: values[field.name] || '',
    identifierProp,
    debounceTime,
  });

  useEffect(() => {
    if (!values[field.name]) {
      handleItemSelect(null);
    }
  }, [values[field.name], handleItemSelect]);

  const handleInputBlur = (event) => {
    handleBlur(event);
    setFieldTouched(field.name, true);
    setLocalTouched(true);
    if (!selectedItem) {
      resetSearch();
    }
  };

  // Add scroll threshold ref
  const scrollThresholdRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = useCallback(
    (event) => {
      const listboxNode = event.currentTarget;
      const scrollPosition = listboxNode.scrollTop + listboxNode.clientHeight;
      const scrollThreshold = listboxNode.scrollHeight - 20;

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new threshold
      if (scrollThresholdRef.current !== scrollThreshold) {
        scrollThresholdRef.current = scrollThreshold;
      }

      // Add small delay before triggering loadMore
      if (scrollPosition >= scrollThresholdRef.current) {
        scrollTimeoutRef.current = setTimeout(() => {
          loadMore();
        }, 100);
      }
    },
    [loadMore],
  );

  if (error) {
    return (
      <Box sx={{ color: 'red', p: 2 }}>
        <Typography variant="body1">Error loading data: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Autocomplete
      fullWidth
      options={options}
      value={selectedItem}
      isOptionEqualToValue={(option, value) => option?.[identifierProp] === value?.[identifierProp]}
      loading={loading}
      onInputChange={(_, value, reason) => {
        if (reason === 'input') {
          handleSearch(value);
        }
      }}
      onChange={(_, value) => {
        handleItemSelect(value);
        setFieldValue(field.name, value ?? '');
        setFieldTouched(field.name, true);
      }}
      onClose={() => {
        if (!selectedItem) {
          resetSearch();
        }
      }}
      getOptionLabel={(option) => {
        if (!option) return '';
        return getOptionLabel(option) || option[identifierProp] || '';
      }}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          onBlur={handleInputBlur}
          error={Boolean(touched[field.name] && !selectedItem && required)}
        />
      )}
      ListboxProps={{
        onScroll: handleScroll,
        sx: {
          ...scrollBarStyling,
        },
      }}
      {...props}
    />
  );
};

export default memo(InfiniteScrollAutocomplete);
