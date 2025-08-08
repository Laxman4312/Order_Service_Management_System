import BaseRepository from './baseRepository';
import { API_URLS } from '../../utils/apiConstants';

class OrderStatusRepository extends BaseRepository {
  constructor() {
    super(API_URLS.ENDPOINTS.ORDERSTATUS);
  }
}
const orderStatusRepository = new OrderStatusRepository();

export default orderStatusRepository;