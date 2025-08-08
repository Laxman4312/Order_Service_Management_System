import { TextField, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';

const MultilineField = (props) => {
  const { field, handleBlur, handleChange, touched, errors, values } = props;
  return (
    <TextField
      id={field.id}
      name={field.name}
      value={values[field.name]}
      onBlur={handleBlur}
      onChange={handleChange}
      disabled={field.disabled ?? false}
      fullWidth
      type="text"
      error={Boolean(touched[field.name] && errors[field.name])}
      helperText={touched[field.name] && errors[field.name]}
      multiline
      InputProps={{
        startAdornment: field.startAdornment && (
          <InputAdornment
            position="start"
            sx={{ color: Boolean(touched[field.name] && errors[field.name]) ? 'red' : 'none' }}
          >
            {field.startAdornment}
          </InputAdornment>
        ),
      }}
      rows={field.rows}
      label={field.label}
    />
  );
};

MultilineField.propTypes = {
  field: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object,
  errors: PropTypes.object,
};

export default MultilineField;
