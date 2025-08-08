//useAxiosService.js
import { useState, useMemo } from 'react';
import AxiosService from '../services/axiosService';
import { API_URLS } from '../utils/apiConstants';

export const useAxiosService = (baseURL = API_URLS.BASE_URL) => {
  const [axiosService] = useState(() => new AxiosService(baseURL));
  
  return useMemo(() => axiosService, [axiosService]);
};