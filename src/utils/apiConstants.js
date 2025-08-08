// src/utils/apiConstants.js
export const API_URLS = {
  // BASE_URL:
  // process.env.REACT_APP_API_BASE_URL || 'https://orson-holding-api.s3.ajinkyatechnologies.in/api',
  // BASE_URL: 'https://tamra.api.s3.ajinkyatechnologies.in/api',
  // BASE_URL: 'http://127.0.0.1:8080/api',
  BASE_URL:'http://127.0.1:5000/api/',
  //  'https://orson-holding-api.s3.ajinkyatechnologies.in/api',
  // BASE_URL: 'https://jsw-paintwarehouse-api.ajinkyatechnologies.com/api',
  ENDPOINTS: {
    USERS: '/auth',
    ORDERS: '/orders',
    ORDERSTATUS:'/statuses/orders',
    // LOCATION_TYPE: '/material-code',
    // LOCATION_TYPE: '/location-type',
    // LOCATION_META_DATA: '/location-metadata',
    // MATERIAL_RECEIVING: '/material-received',
    // BINNING: '/binning',
  },
};

export const REQUEST_METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
};
