import BaseRepository from './baseRepository';
import { API_URLS } from '../../utils/apiConstants';

class OrderRepository extends BaseRepository {
  constructor() {
    super(API_URLS.ENDPOINTS.ORDERS);
  }
}
const orderRepository = new OrderRepository();

export default orderRepository;