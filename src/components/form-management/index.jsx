import { Formik } from 'formik';
import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { memo, useCallback, useMemo } from 'react';
import { FIELDS } from './fields';

const Form = ({
  initialValues,
  validationSchema,
  onSubmit,
  formConfig,
  children,
  topComponents,
  bottomComponents,
}) => {
  // Memoize the field type check function
  const getFieldComponent = useMemo(() => {
    const fieldTypes = {
      text: FIELDS.TEXT,
      email: FIELDS.TEXT,
      number: FIELDS.TEXT,
      password: FIELDS.TEXT,
      multiline: FIELDS.TEXT,
      select: FIELDS.SELECT,
      date: FIELDS.DATEPICKER,
      color: FIELDS.COLOR,
      checkbox: FIELDS.CHECKBOX,
      autocomplete: FIELDS.AUTOCOMPLETE,
      file: FIELDS.FILE,
      freesolo: FIELDS.FREESOLOAUTOCOMPLETE,
    };

    return (type) => fieldTypes[type.toLowerCase()] || null;
  }, []);

  // Memoize renderField to prevent recreation on each render
  const renderField = useCallback(
    (field, formikProps) => {
      if (field.visibility === false) {
        return null;
      }

      const type = field.type.toLowerCase();
      const FieldComponent = getFieldComponent(type);

      if (!FieldComponent) {
        return (
          <Typography variant="caption" color="black">
            Fix JSON Object, <span style={{ color: 'red' }}>type Error</span>
          </Typography>
        );
      }

      return <FieldComponent field={field} formikProps={formikProps} />;
    },
    [getFieldComponent],
  );

  // Memoize the form submit handler
  const handleSubmit = useCallback(
    async (values, { resetForm }) => {
      await onSubmit({ values, resetForm });
    },
    [onSubmit],
  );

  // Memoize the form configuration
  const memoizedFormConfig = useMemo(() => formConfig, [formConfig]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {(formikProps) => (
        <form noValidate onSubmit={formikProps.handleSubmit}>
          <Grid
            container
            columnSpacing={2}
            rowSpacing={1.75}
            alignItems="center"
            justifyContent="center"
          >
            {topComponents && (
              <Grid item xs={12}>
                {topComponents(formikProps)}
              </Grid>
            )}
            {memoizedFormConfig.map((field) => (
              <Grid
                item
                key={field.id}
                xs={field.gridProps?.xs ?? 12}
                sm={field.gridProps?.sm}
                md={field.gridProps?.md}
                lg={field.gridProps?.lg}
              >
                <Box
                  sx={{
                    display: field.visibility === false ? 'none' : 'block',
                  }}
                >
                  {renderField(field, formikProps)}
                  {field.type.toLowerCase() !== 'checkbox' && (
                    <FormHelperText
                      error
                      sx={{
                        minHeight: '20px',
                        textAlign: 'center',
                      }}
                    >
                      {(formikProps.touched[field.name] && formikProps.errors[field.name]) || ' '}
                    </FormHelperText>
                  )}
                </Box>
              </Grid>
            ))}
            {bottomComponents && (
              <Grid item xs={12}>
                {bottomComponents}
              </Grid>
            )}
            <Grid item xs={12}>
              {children(formikProps)}
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

Form.propTypes = {
  initialValues: PropTypes.object,
  validationSchema: PropTypes.object,
  onSubmit: PropTypes.func,
  formConfig: PropTypes.array,
  children: PropTypes.func.isRequired,
};

export default Form;
