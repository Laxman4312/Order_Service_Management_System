import { Autocomplete, TextField, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { useLocationTypes } from 'hooks/api-custom-hook/useLocationTypes';
import { useEffect, useState } from 'react';

export default function Example() {
  const [value, setValue] = useState(null);
  const { data, fetchLocationTypes } = useLocationTypes();
  const [options, setOptions] = useState([]);

  const [inputValue, setInputValue] = useState('');

  const fetchData = async (fieldValue = '') => {
    const res = await fetchLocationTypes({ query: fieldValue });
    setOptions(res?.result || []);
  };

  useEffect(() => {
    if (value) {
      return fetchData(value.label);
    }
    fetchData();
  }, []);

  const findMatchingOption = (searchValue) => {
    return options.find((item) => item.color_code.toLowerCase() === searchValue.toLowerCase());
  };

  const handleInputSearchChanged = async (event, newInputValue, reason) => {
    setInputValue(newInputValue);

    // Handle backspace/clearing
    if (!newInputValue) {
      setValue(null);
      await fetchData(''); // Fetch all options when input is cleared
      return;
    }

    await fetchData(newInputValue);
    const selectedData = findMatchingOption(newInputValue);

    if (selectedData) {
      setValue({
        id: selectedData.id,
        label: selectedData.color_code,
        desc: selectedData.color_description,
      });
    } else {
      setValue({
        id: 0,
        label: newInputValue,
        desc: '',
      });
    }
  };

  const handleChange = (event, newValue) => {
    if (!newValue) {
      setValue(null);
      setInputValue('');
      fetchData(''); // Fetch all options when value is cleared
      return;
    }

    const selectedData = findMatchingOption(newValue);

    if (selectedData) {
      setValue({
        id: selectedData.id,
        label: selectedData.color_code,
        desc: selectedData.color_description,
      });
      setInputValue(selectedData.color_code);
    } else {
      setValue({
        id: 0,
        label: newValue,
        desc: '',
      });
      setInputValue(newValue);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography>Label name: {value?.label || ''}</Typography>
        <Typography>Description: {value?.desc || ''}</Typography>
        <Typography>
          Type anything to see the value update automatically. You can either select from the
          options or type your own custom text.
        </Typography>
        <Box my={1}>
          <Autocomplete
            freeSolo
            // value={'JSW1118S'}
            value={value?.label || null}
            inputValue={inputValue}
            options={options.map((option) => option.color_code)}
            onInputChange={handleInputSearchChanged}
            onChange={handleChange}
            getOptionLabel={(option) => option || ''}
            filterOptions={(options, { inputValue }) => {
              return options.filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase()),
              );
            }}
            renderInput={(params) => <TextField {...params} label="Example" />}
          />
        </Box>
      </Box>
    </Container>
  );
}
