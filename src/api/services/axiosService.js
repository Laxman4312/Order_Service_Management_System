// src/services/axiosService.js
import axios from 'axios';
import ErrorHandler from './errorHandler';
import TokenService from './tokenService';

class AxiosService {
  constructor(baseURL) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 100000,
    });

    this.initInterceptors();
  }

  initInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = TokenService.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        ErrorHandler.handleError(error);
        return Promise.reject(error);
      },
    );
  }

  async request({ method = 'get', url, data = null, params = {}, config = {} }) {
    try {
      const requestConfig = {
        method,
        url,
        ...(data && { data }),
        ...(Object.keys(params).length > 0 && { params }),
        ...config,
      };

      const response = await this.instance(requestConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadMultipart(url, formData, config = {}, method = 'post') {
    const multipartConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    };

    return this.request({
      method,
      url,
      data: formData,
      config: multipartConfig,
    });
  }

  async downloadFile(url, params = {}, config = {}) {
    const downloadConfig = {
      responseType: 'blob',
      ...config,
    };
    const response = await this.instance.get(url, {
      ...downloadConfig,
      params,
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = 'downloaded-file';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return response;
  }

  get(url, params = {}, config = {}) {
    return this.request({ method: 'get', url, params, config });
  }

  post(url, data = {}, config = {}) {
    return this.request({ method: 'post', url, data, config });
  }

  put(url, data = {}, config = {}) {
    return this.request({ method: 'put', url, data, config });
  }

  delete(url, params = {}, config = {}) {
    return this.request({ method: 'delete', url, params, config });
  }
}

export default AxiosService;

// // src/api/services/axiosService.js
// import axios from 'axios';
// import ErrorHandler from './errorHandler';
// import TokenService from './tokenService';

// class AxiosService {
//   constructor(baseURL) {
//     this.instance = axios.create({
//       baseURL,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       timeout: 100000,
//     });

//     this.initInterceptors();
//   }

//   initInterceptors() {
//     this.instance.interceptors.request.use(
//       (config) => {
//         const token = TokenService.getToken();

//         if (token) {
//           config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error),
//     );

//     this.instance.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         ErrorHandler.handleError(error);
//         return Promise.reject(error);
//       },
//     );
//   }

//   async request({ method = 'get', url, data = null, params = {}, config = {} }) {
//     try {
//       const requestConfig = {
//         method,
//         url,
//         ...(data && { data }),
//         ...(Object.keys(params).length > 0 && { params }),
//         ...config,
//       };

//       const response = await this.instance(requestConfig);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async uploadMultipart(url, formData, config = {}, method = 'post') {
//     const multipartConfig = {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       ...config,
//     };

//     return this.request({
//       method,
//       url,
//       data: formData,
//       config: multipartConfig,
//     });
//   }

//   async downloadFile(url, params = {}, config = {}) {
//     const downloadConfig = {
//       responseType: 'blob',
//       ...config,
//     };
//     const response = await this.instance.get(url, {
//       ...downloadConfig,
//       params,
//     });

//     const contentDisposition = response.headers['content-disposition'];
//     let filename = 'downloaded-file';
//     if (contentDisposition) {
//       const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
//       if (filenameMatch && filenameMatch[1]) {
//         filename = filenameMatch[1].replace(/['"]/g, '');
//       }
//     }

//     const blob = new Blob([response.data]);
//     const downloadUrl = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = downloadUrl;
//     link.setAttribute('download', filename);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(downloadUrl);

//     return response;
//   }

//   get(url, params = {}, config = {}) {
//     return this.request({ method: 'get', url, params, config });
//   }

//   post(url, data = {}, config = {}) {
//     return this.request({ method: 'post', url, data, config });
//   }

//   put(url, data = {}, config = {}) {
//     return this.request({ method: 'put', url, data, config });
//   }

//   delete(url, params = {}, config = {}) {
//     return this.request({ method: 'delete', url, params, config });
//   }
// }
