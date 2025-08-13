import BaseRepository from './baseRepository';
import { API_URLS } from '../../utils/apiConstants';

class ServiceStatusRepository extends BaseRepository {
  constructor() {
    super(API_URLS.ENDPOINTS. SERVICESTATUS);
  }
}
const serviceStatusRepository = new ServiceStatusRepository();

export default serviceStatusRepository;