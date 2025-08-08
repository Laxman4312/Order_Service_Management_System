// src/api/repositories/userRepository.js
import BaseRepository from './baseRepository';
import { API_URLS } from '../../utils/apiConstants';

class UserRepository extends BaseRepository {
  constructor() {
    super(API_URLS.ENDPOINTS.USERS);
  }

  async searchUsers(query) {
    return this.getAll({ search: query });
  }
    async REGISTER(data) {
    try {
      return this.axiosService.post(`${this.endpoint}/register`, data);
    } catch (e) {
      throw e;
    }
  }

  async LOGIN(data) {
    try {
      return this.axiosService.post(`${this.endpoint}/login`, data);
    } catch (e) {
      throw e;
    }
  }

  async FORGOT_PASSWORD(data) {
    try {
      return this.axiosService.post(`${this.endpoint}/forgot-password`, data);
    } catch (e) {
      throw e;
    }
  }
  async RESET_PASSWORD(data) {
    try {
      return this.axiosService.post(`${this.endpoint}/reset-password`, data);
    } catch (e) {
      throw e;
    }
  }
}
const userRepository = new UserRepository();
export default userRepository;
