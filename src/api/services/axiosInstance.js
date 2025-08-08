import AxiosService from './axiosService';
import { API_URLS } from '../../utils/apiConstants';

// Initialize AxiosService with the store
const axiosInstance = new AxiosService(API_URLS.BASE_URL);

export default axiosInstance;
