import {
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import PropTypes from 'prop-types';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

const SelectField = (props) => {
  const { field, formikProps } = props;
  const { handleBlur, handleChange, touched, errors, values } = formikProps;
  // const dispatch = useDispatch();
  // const { token } = useSelector((state) => state.auth);
  // const { [field.stateValue]: value } = useSelector((state) => state[field.stateName]);

  // useEffect(() => {
  //   dispatch(field.fetchData(token));
  // }, [dispatch]);
  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel error={Boolean(touched[field.name] && errors[field.name])} id={field.id} required>
        {field.label}
      </InputLabel>
      <Select
        labelId={field.id}
        id={field.id}
        name={field.name}
        value={values[field.name]}
        onBlur={handleBlur}
        fullWidth
        disabled={field.disabled ?? false}
        error={Boolean(touched[field.name] && errors[field.name])}
        startAdornment={
          field.startAdornment && (
            <InputAdornment
              position="start"
              sx={{ color: Boolean(touched[field.name] && errors[field.name]) ? 'red' : 'none' }}
            >
              {field.startAdornment}
            </InputAdornment>
          )
        }
        onChange={handleChange}
      >
        {field.data &&
          field.data.map((item, i) => (
            <MenuItem value={item[field.menuItem?.value]} key={i}>
              {item[field.menuItem?.label]}
            </MenuItem>
          ))}
      </Select>
      {touched[field.name] && errors[field.name] && (
        <FormHelperText error id="final_product">
          {errors[field.name]}
        </FormHelperText>
      )}
    </FormControl>
  );
};
SelectField.propTypes = {
  field: PropTypes.object,
  formikProps: PropTypes.object,
};

export default SelectField;
