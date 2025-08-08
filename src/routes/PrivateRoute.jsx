import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookieState } from 'utils/cookie-utils';

const PrivateRoute = ({ children }) => {
  // const authFlag = Cookies.get('isAuthenticated')
  //   ? decryptData(Cookies.get('isAuthenticated'))
  //   : false;

  const authFlag = getCookieState('isAuthenticated');

  const isAuthenticated = authFlag === true;

  return isAuthenticated ? children : <Navigate to="/" replace />;
  // return children;
};

export default PrivateRoute;
