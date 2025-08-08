import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
//Modules
import authReducer from './slices/auth';

//Components
import dialogReducer from './slices/dialog';
import generalReducer from './slices/general';
import snackbarReducer from './slices/snackbar';

// import confirmationReducer from './slices/confirmation';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  //Components
  dialog: dialogReducer,
  general: generalReducer,
  snackbar: snackbarReducer,
  // confirmation: confirmationReducer,
  //Modules
  auth: authReducer,
  // dashboard: dashboardReducer,
});

export default reducer;
