import React, { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { Button, DialogActions } from '@mui/material';

import { useDispatch } from 'react-redux';
import { triggerIsSavingFlag } from 'store/slices/general';

import { LocationMetaIcon } from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import { useLocationTypes } from 'hooks/api-custom-hook/useLocationTypes';
import Form from 'components/form-management';

import { useLocationMetaData } from 'hooks/api-custom-hook/useLocationMetaData';
import useSnackbarStore from 'hooks/useSnackbarStore';

const LocationMetaDataDialog = ({
  formData,
  isOpen,
  dialogType,
  handleCloseModal,
  transitions,
  isSaving,
}) => {
  // const { data, isLoading, isError, fetchLocationTypes } = useLocationTypes();

  const { data, fetchLocationTypes } = useLocationTypes();
  const { create, update } = useLocationMetaData();
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const dispatch = useDispatch();

  const prepareFormData = (values) => {
    const locationTypeId =
      typeof values.locationtype === 'object' ? values.locationtype.id : values.locationtype;
    const prepareData = {
      loc_name: String(values.loc_name).trim(),
      loc_description: String(values.loc_description).trim(),
      locationtype: Number(locationTypeId),
    };
    if (dialogType !== 'Add') prepareData.id = formData.id;
    return prepareData;
  };

  const handleFormSubmit = async ({ resetForm, values }) => {
    try {
      const formData = prepareFormData(values);

      const response = dialogType === 'Add' ? await create(formData) : await update(formData);
      dispatch(triggerIsSavingFlag(!isSaving));
      snackbarNotification({
        message: response.message,
        severity: 'success',
      });
      setTimeout(() => {
        handleCloseModal(dialogType, !isOpen);
        resetForm();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };
  const INITIAL_FORM_STATE = {
    loc_name: '',
    loc_description: '',
    locationtype: null,
    test: null,
    testOptions: [],
  };
  //InitialValues
  const getInitialValues = () => {
    if (formData) {
      const formattedData = {
        ...formData,
        is_deleted: Boolean(formData.is_deleted),
      };
      delete formattedData.created_at;
      delete formattedData.updated_at;
      delete formattedData.is_active;
      delete formattedData.metadata;

      return formattedData;
    }
    return INITIAL_FORM_STATE;
  };

  const formConfiguration = useMemo(
    () => [
      {
        id: 'loc_name',
        type: 'TEXT',
        name: 'loc_name',
        label: 'Location Name',
        gridProps: { xs: 6 },
        required: true,
      },

      {
        id: 'locationtype',
        name: 'locationtype',
        type: 'autocomplete',
        fetchFunction: (e) => fetchLocationTypes(e),
        label: 'Location Type',
        getOptionLabel: (item) => item.place_of_location,
        // getOptionLabel: (item) => item.color_code,
        // renderOption: (props, option) => (
        //   <li {...props}>
        //     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        //       <span style={{ color: '#666' }}>{option.id}</span>
        //       <span>/</span>
        //       <span>{option.place_of_location}</span>
        //     </div>
        //   </li>
        // ),
        identifierProp: 'id',
        gridProps: { xs: 6 },
        required: true,
      },

      {
        id: 'loc_description',
        type: 'multiline',
        name: 'loc_description',
        label: 'Location Description',
        rows: 3,
        required: true,
        gridProps: { xs: 12 },
      },
    ],
    [],
  );

  // Memoize the validation schema
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        loc_name: Yup.string().trim().required('Location Name is required'),
        loc_description: Yup.string().trim().required('Location Description is required'),

        locationtype: Yup.mixed()
          .required('Location Type is required')
          // .nullable()
          .test('is-valid-location', 'Location Type is required', (value) => {
            return value !== null && value !== undefined && value !== '';
          }),
      }),
    [],
  );

  const buttonName = dialogType === 'Add' ? 'Add' : 'Save';

  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title={dialogType === 'Add' ? 'Add Location Details' : 'Edit Location Details'}
        subtitle="Location Management"
        transitions={transitions}
        handleClose={handleCloseModal}
        image={LocationMetaIcon}
      >
        <Form
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          formConfig={formConfiguration}
        >
          {(formikProps) => {
            return (
              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={formikProps.isSubmitting}
                >
                  {buttonName}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    formikProps.resetForm('');
                    formikProps.setValues(INITIAL_FORM_STATE, false);
                  }}
                >
                  Clear
                </Button>
              </DialogActions>
            );
          }}
        </Form>
      </FormLayout>
    </ProjectDialog>
  );
};

export default LocationMetaDataDialog;
