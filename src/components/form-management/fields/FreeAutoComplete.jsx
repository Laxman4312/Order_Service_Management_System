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
  debounceTime = 500,
  freeSolo = false,
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [touched, setTouched] = useState(false);
  const [inputValue, setInputValue] = useState(
    freeSolo && typeof initialSelectedItem === 'string' ? initialSelectedItem : '',
  );

  // Add loading lock ref to prevent duplicate API calls
  const isLoadingRef = useRef(false);

  const addUniqueOptions = useCallback((currentOptions, newOptions) => {
    const combinedOptions = [...currentOptions, ...newOptions];
    return uniqBy(combinedOptions, (item) =>
      typeof item === 'object' ? JSON.stringify(item) : item,
    );
  }, []);

  const fetchData = useCallback(
    async (search = '', currentPage = initialPage) => {
      if (isLoadingRef.current) return;

      try {
        isLoadingRef.current = true;
        setLoading(true);
        let params = { query: search, page: currentPage, pageSize };
        const result = await fetchFunction(params);

        let newData = [];
        if (result.result && typeof result.result === 'object' && !Array.isArray(result.result)) {
          newData = [result.result];
        } else {
          newData = result.result || result.data || result || [];
        }

        setOptions(
          currentPage === initialPage ? newData : (prev) => addUniqueOptions(prev, newData),
        );
        setHasMore(newData.length === pageSize);
      } catch (error) {
        console.error('Fetch data error:', error);
        setError(error);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [pageSize, initialPage, addUniqueOptions],
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
      if (freeSolo && typeof item === 'string') {
        setInputValue(item);
      }
      if (!item) {
        setPage(initialPage);
        setSearchTerm('');
        fetchData('', initialPage);
      }
    },
    [initialPage, fetchData, freeSolo],
  );

  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setOptions([]);
    fetchData('', initialPage);
  }, [initialPage, fetchData]);

  useEffect(() => {
    const initializeData = async () => {
      if (initialSelectedItem) {
        if (freeSolo && typeof initialSelectedItem === 'string') {
          setInputValue(initialSelectedItem);
          setSelectedItem(initialSelectedItem);
        } else {
          await fetchData('', initialPage);
          setSelectedItem(initialSelectedItem);
        }
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
  }, [initialSelectedItem, fetchData, initialPage, isInitialLoad, freeSolo]);

  return {
    options,
    loading,
    error,
    hasMore,
    searchTerm,
    selectedItem,
    touched,
    inputValue,
    setInputValue,
    handleSearch,
    loadMore,
    handleItemSelect,
    setTouched,
    resetSearch,
  };
};

export const FreeInfiniteScrollAutocomplete = ({ field, formikProps, ...props }) => {
  const {
    fetchFunction,
    required = false,
    getOptionLabel = (option) => option?.name || '',
    renderOption,
    debounceTime = 500,
    label = 'Search',
    freeSolo = false,
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
    inputValue,
    setInputValue,
  } = useInfiniteScrollAutocomplete({
    fetchFunction,
    initialSelectedItem: values[field.name] || '',
    debounceTime,
    freeSolo,
  });

  useEffect(() => {
    if (!values[field.name]) {
      handleItemSelect(null);
    }
  }, [values[field.name], handleItemSelect]);

  useEffect(() => {
    setFieldValue(field.extraProps, options);
  }, [options]);

  const handleInputBlur = (event) => {
    handleBlur(event);
    setFieldTouched(field.name, true);
    setLocalTouched(true);

    if (freeSolo) {
      setFieldValue(field.name, inputValue);
    } else if (!selectedItem) {
      resetSearch();
    }
  };

  const handleInputChange = (event, value, reason) => {
    setInputValue(value);
    if (reason === 'input') {
      handleSearch(value);
      if (freeSolo) {
        handleItemSelect(value);
        setFieldValue(field.name, value);
      }
    }
  };

  const handleChange = (event, value, reason) => {
    if (freeSolo && typeof value === 'string') {
      handleItemSelect(value);
      setFieldValue(field.name, value);
      setInputValue(value);
    } else {
      handleItemSelect(value);
      setFieldValue(field.name, value ?? '');
    }
    setFieldTouched(field.name, true);
  };

  const scrollThresholdRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = useCallback(
    (event) => {
      const listboxNode = event.currentTarget;
      const scrollPosition = listboxNode.scrollTop + listboxNode.clientHeight;
      const scrollThreshold = listboxNode.scrollHeight - 20;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (scrollThresholdRef.current !== scrollThreshold) {
        scrollThresholdRef.current = scrollThreshold;
      }

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
      freeSolo={freeSolo}
      options={options}
      value={selectedItem}
      inputValue={inputValue}
      loading={loading}
      onInputChange={handleInputChange}
      onChange={handleChange}
      onClose={() => {
        if (!selectedItem && !freeSolo) {
          resetSearch();
        }
      }}
      getOptionLabel={(option) => {
        if (!option) return '';
        if (typeof option === 'string') return option;
        return getOptionLabel(option) || '';
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

export default memo(FreeInfiniteScrollAutocomplete);
