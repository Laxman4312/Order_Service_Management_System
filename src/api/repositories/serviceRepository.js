import BaseRepository from './baseRepository';
import { API_URLS } from '../../utils/apiConstants';

class ServiceRepository extends BaseRepository {
  constructor() {
    super(API_URLS.ENDPOINTS.SERVICES);
  }
}
const serviceRepository = new ServiceRepository();

export default serviceRepository