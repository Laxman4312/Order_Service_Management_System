import CheckBox from './Checkbox';
import ColorField from './ColorField';
import DatePickerField from './DatePicker';
import FileUpload from './FileUpload';
import InfiniteScrollAutocomplete from './InfiniteScrollAutocomplete ';
import SelectField from './SelectField';
import CustomTextField from './TextField';
import CustomFreeAutoComplete from './FreeAutoComplete';

export const FIELDS = {
  TEXT: CustomTextField,
  CHECKBOX: CheckBox,
  DATEPICKER: DatePickerField,
  COLOR: ColorField,
  FILE: FileUpload,
  SELECT: SelectField,
  AUTOCOMPLETE: InfiniteScrollAutocomplete,
  FREESOLOAUTOCOMPLETE: CustomFreeAutoComplete,
};
