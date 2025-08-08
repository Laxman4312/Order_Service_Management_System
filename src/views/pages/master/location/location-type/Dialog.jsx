import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { Button, DialogActions } from '@mui/material';
import { useDispatch } from 'react-redux';
import { triggerIsSavingFlag } from 'store/slices/general';
import { LocationTypeIcon } from 'config/icons';
import FormLayout from 'components/form-layout/FormLayout';
import ProjectDialog from 'components/ProjectDialog';
import { useLocationTypes } from 'hooks/api-custom-hook/useLocationTypes';
import Form from 'components/form-management';
import useSnackbarStore from 'hooks/useSnackbarStore';

const INITIAL_FORM_STATE = {
  place_of_location: '',
};

const LocationTypeDialog = ({
  formData,
  isOpen,
  dialogType,
  handleCloseModal,
  transitions,
  isSaving,
}) => {
  const { createLocationTypes, updateLocationTypes } = useLocationTypes();
  const snackbarNotification = useSnackbarStore((state) => state.open);

  const dispatch = useDispatch();
  // Memoize the form configuration
  const formConfiguration = useMemo(
    () => [
      {
        id: 'place_of_location',
        name: 'place_of_location',
        label: 'Location Type',
        type: 'TEXT',
        gridProps: { xs: 6 },
        required: true,
      },
    ],
    [],
  );

  // Memoize the validation schema
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        place_of_location: Yup.string().required('Location Type required.'),
      }),
    [],
  );

  const getInitialValues = () => {
    if (formData) {
      const formattedUser = {
        ...formData,
        is_deleted: Boolean(formData.is_deleted),
      };
      delete formattedUser.created_at;
      delete formattedUser.updated_at;
      delete formattedUser.is_active;
      delete formattedUser.metadata;
      return formattedUser;
    }
    return INITIAL_FORM_STATE;
  };

  const handleFormSubmit = async ({ values, resetForm }) => {
    try {
      // const formData = prepareFormData(values);
      const response =
        dialogType === 'Add'
          ? await createLocationTypes({ place_of_location: values.place_of_location })
          : await updateLocationTypes({
              place_of_location: values.place_of_location,
              id: formData.id,
            });

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

  return (
    <ProjectDialog open={isOpen} maxWidth="md" handleClose={handleCloseModal}>
      <FormLayout
        isOpen={isOpen}
        title={dialogType === 'Add' ? 'Add Location Type' : 'Edit Location Type'}
        subtitle="Location Management"
        transitions={transitions}
        handleClose={handleCloseModal}
        image={LocationTypeIcon}
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
                  {dialogType === 'Add' ? 'Add' : 'Save'}
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

export default LocationTypeDialog;
