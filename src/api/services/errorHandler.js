// src/services/errorHandler.js
import TokenService from './tokenService';

class ErrorHandler {
  static customNotification = null;

  static setNotificationHandler(handler) {
    this.customNotification = handler;
  }

  static handleError(error, specificNotification = null) {
    const errorMessage = this.getErrorMessage(error);

    const notifyError = specificNotification || this.customNotification;
    if (notifyError) {
      notifyError({
        message: errorMessage,
        severity: 'error',
      });
    }

    this.handleSpecificErrors(error);
    return errorMessage;
  }

  static getErrorMessage(error) {
    console.log('error', error);

    if (!error.response) {
      return 'Network Error: Unable to reach the server.';
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data?.message || 'Bad Request: Invalid data provided.';
      case 401:
        return data?.message || 'Unauthorized: Please log in again.';
      case 403:
        return data?.message || 'Forbidden: You do not have permission.';
      case 404:
        return data?.message || 'Not Found: The requested resource does not exist.';
      case 422:
        return this.getValidationErrorMessage(data);
      case 500:
        return 'Server Error: Something went wrong on our end.';
      default:
        return data?.message || 'An unexpected error occurred.';
    }
  }

  static getValidationErrorMessage(data) {
    if (data?.errors) {
      return Object.values(data.errors).flat().join(', ');
    }
    return 'Validation Error: Please check your input.';
  }

  static handleSpecificErrors(error) {
    if (error.response?.status === 401) {
      TokenService.removeToken();
      window.location.href = '/login';
    }
  }
}

export default ErrorHandler;

// // src/api/services/errorHandler.js
// import { toast } from 'react-toastify';
// import TokenService from './tokenService';

// class ErrorHandler {
//   static handleError(error) {
//     const errorMessage = this.getErrorMessage(error);
//     toast.error(errorMessage);
//     this.handleSpecificErrors(error);
//   }

//   static getErrorMessage(error) {
//     if (!error.response) {
//       return 'Network Error: Unable to reach the server.';
//     }

//     const { status, data } = error.response;

//     switch (status) {
//       case 400:
//         return data?.message || 'Bad Request: Invalid data provided.';
//       case 401:
//         return data?.message || 'Unauthorized: Please log in again.';
//       case 403:
//         return data?.message || 'Forbidden: You do not have permission.';
//       case 404:
//         return data?.message || 'Not Found: The requested resource does not exist.';
//       case 422:
//         return this.getValidationErrorMessage(data);
//       case 500:
//         return 'Server Error: Something went wrong on our end.';
//       default:
//         return data?.message || 'An unexpected error occurred.';
//     }
//   }

//   static getValidationErrorMessage(data) {
//     if (data?.errors) {
//       return Object.values(data.errors).flat().join(', ');
//     }
//     return 'Validation Error: Please check your input.';
//   }

//   static handleSpecificErrors(error) {
//     if (error.response?.status === 401) {
//       TokenService.removeToken();
//       window.location.href = '/login';
//     }
//   }
// }

// export default ErrorHandler;
