// // src/hooks/api-custom-hooks/useUsers.js
// import { useCallback } from 'react';
// import { useDataFetching } from './useDataFetching';

// import userRepository from '../../api/repositories/userRepository';
// export const useUser = () => {
//   const AUTH_LOGIN = useCallback(async (data) => {
//     try {
//       const response = await userRepository.LOGIN(data);
//       return response;
//     } catch (err) {
//       throw err;
//     }
//   }, []);
//     const AUTH_REGISTER = useCallback(async (data) => {
//     try {
//       const response = await userRepository.REGISTER(data);
//       return response;
//     } catch (err) {
//       throw err;
//     }
//     },[]);

// //   const FORGOT_PASSWORD = useCallback(async (data) => {
// //     try {
// //       const response = await userRepository.FORGOT_PASSWORD(data);
// //       return response;
// //     } catch (err) {
// //       throw err;
// //     }
// //   }, []);
// //   const RESET_PASSWORD = useCallback(async (data) => {
// //     try {
// //       const response = await userRepository.RESET_PASSWORD(data);
// //       return response;
// //     } catch (err) {
// //       throw err;
// //     }
// //   }, []);

// //   const fetchUsers = useCallback(async (params = {}) => {
// //     try {
// //       return userRepository.getAll(params);
// //     } catch (err) {
// //       throw err;
// //     }
// //   }, []);

// //   const createUser = useCallback(async (productData) => {
// //     try {
// //       const newUser = await userRepository.create(productData);
// //       return newUser;
// //     } catch (err) {
// //       throw err;
// //     }
// //   }, []);

// //   const updateUser = useCallback(async (productData) => {
// //     try {
// //       const updatedUser = await userRepository.update(productData);
// //       return updatedUser;
// //     } catch (err) {
// //       throw err;
// //     }
// //   }, []);

// //   const deleteData = useCallback(async (params) => {
// //     try {
// //       return await userRepository.delete(params);
// //     } catch (err) {
// //       throw err;
// //     }
// //   }, []);

// //   const restoreData = useCallback(async (params) => {
// //     try {
// //       const response = await userRepository.restore(`/restore`, params);
// //       return response;
// //     } catch (err) {
// //       throw err;
// //     }
// //   }, []);

//   const { data, isLoading, isError, fetchData, refetch, reset } = useDataFetching(fetchUsers);

//   return {
//     data,
//     isLoading,
//     isError,
//     fetchUsers: fetchData,
//     refetchUsers: refetch,
//     resetUsers: reset,
//     createUser,
//     updateUser,
//     deleteData,
//     restoreData,
//     AUTH_LOGIN,
//     AUTH_REGISTER,
//     FORGOT_PASSWORD,
//     RESET_PASSWORD,
//     // getProductsByCategory
//   };
// };
// src/hooks/api-custom-hook/useUsers.js

import { useCallback } from 'react';
import userRepository from '../../api/repositories/userRepository';

export const useUser = () => {
  const AUTH_LOGIN = useCallback(async (data) => {
    try {
      const response = await userRepository.LOGIN(data);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  const AUTH_REGISTER = useCallback(async (data) => {
    try {
      const response = await userRepository.REGISTER(data);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    AUTH_LOGIN,
    AUTH_REGISTER,
  };
};
