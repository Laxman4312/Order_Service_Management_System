import AxiosService from '../services/axiosService';
import { API_URLS } from '../../utils/apiConstants';

class BaseRepository {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.axiosService = new AxiosService(API_URLS.BASE_URL);
  }

  async getAll(params = {}) {
    try {
      return await this.axiosService.get(this.endpoint, params);
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }

  async getById(id, params = {}) {
    try {
      return await this.axiosService.get(`${this.endpoint}/${id}`, params);
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  async create(data, config = {}) {
    try {
      return await this.axiosService.post(this.endpoint, data, config);
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

async update(id, data) {
  try {
    console.log('Updating order with id:', id);
    return await this.axiosService.put(`${this.endpoint}/${id}`, data);
  } catch (error) {
    console.error('Error in update:', error);
    throw error;
  }
}


  // async delete(params = {}) {
  //   try {
  //     return await this.axiosService.delete(`${this.endpoint}`, params);
  //   } catch (error) {
  //     console.error('Error in delete:', error);
  //     throw error;
  //   }
  // }
  async delete(id) {
  try {
    return await this.axiosService.delete(`${this.endpoint}/${id}`);
  } catch (error) {
    console.error('Error in delete:', error);
    throw error;
  }
}

  async restore(url, params = {}) {
    try {
      return await this.axiosService.put(`${this.endpoint}${url}`, params);
    } catch (error) {
      console.error('Error in restore:', error);
      throw error;
    }
  }

  async uploadFile(url, formData, config = {}) {
    try {
      return await this.axiosService.uploadMultipart(
        `${this.endpoint}${url}`,
        formData,
        config,
        'post',
      );
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  }

  async updateWithFile(url, formData, config = {}) {
    try {
      return await this.axiosService.uploadMultipart(
        `${this.endpoint}/${url}`,
        formData,
        config,
        'put',
      );
    } catch (error) {
      console.error('Error in updateWithFile:', error);
      throw error;
    }
  }

  async downloadFile(fileId, filename, params = {}) {
    try {
      return await this.axiosService.downloadFile(`${this.endpoint}/download/${fileId}`, params);
    } catch (error) {
      console.error('Error in downloadFile:', error);
      throw error;
    }
  }

  async exportToExcel(params = {}) {
    try {
      return await this.axiosService.downloadFile(`${this.endpoint}/export/excel`, params);
    } catch (error) {
      console.error('Error in exportToExcel:', error);
      throw error;
    }
  }

  async exportToPDF(params = {}) {
    try {
      return await this.axiosService.downloadFile(`${this.endpoint}/export/pdf`, params);
    } catch (error) {
      console.error('Error in exportToPDF:', error);
      throw error;
    }
  }
}
export default BaseRepository;

// // src/api/repositories/baseRepository.js
// import AxiosService from '../services/axiosService';
// import { API_URLS } from '../../utils/apiConstants';

// class BaseRepository {
//   constructor(endpoint) {
//     this.endpoint = endpoint;
//     this.axiosService = new AxiosService(API_URLS.BASE_URL);
//   }

//   async getAll(params = {}) {
//     return this.axiosService.get(this.endpoint, params);
//   }

//   async getById(id, params = {}) {
//     return this.axiosService.get(`${this.endpoint}/${id}`, params);
//   }

//   async create(data, config = {}) {
//     return this.axiosService.post(this.endpoint, data, config);
//   }

//   async update(data) {
//     return this.axiosService.put(this.endpoint, data);
//   }

//   async delete(id) {
//     return this.axiosService.delete(`${this.endpoint}/${id}`);
//   }
// }

// export default BaseRepository;
