import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';

const DatePickerField = ({ field, formikProps }) => {
  const { setFieldValue, values, touched, errors } = formikProps;
  // Check if the value exists and is valid before converting to dayjs
  const dateValue = values[field.name] ? dayjs(values[field.name]) : null;

  // Only show error if field is touched and has an error
  const showError = touched[field.name] && errors[field.name];

  return (
    <Stack spacing={1}>
      <DatePicker
        label={field.label}
        value={dateValue}
        name={field.name}
        id={field.id}
        onChange={(newValue) => {
          // Handle both valid date selection and clearing the field
          setFieldValue(field.name, newValue ? newValue.toDate() : null);
        }}
        slotProps={{
          textField: {
            error: Boolean(showError),
            helperText: showError ? errors[field.name] : '',
            required: field.required,
          },
        }}
      />
    </Stack>
  );
};

DatePickerField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
  }),
  formikProps: PropTypes.object,
};

export default DatePickerField;
