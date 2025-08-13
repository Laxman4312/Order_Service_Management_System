// src/hooks/api-custom-hooks/useUsers.js
import { useCallback } from 'react';
import { useDataFetching } from './useDataFetching';

import serviceStatusRepository from '../../api/repositories/serviceStatusRepository';
export const useServiceStatus = () => {
  const fetchStatusServices = useCallback(async (params = {}) => {
    try {
      return serviceStatusRepository.getAll(params);
    } catch (err) {
      throw err;
    }
  }, []);

  const createStatusService = useCallback(async (data) => {
    try {
      const newOrder = await serviceStatusRepository.create(data);
      return newOrder;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateStatusService = useCallback(async (params,data) => {
    try {
      const updatedOrder = await serviceStatusRepository.update(params,data);
      return updatedOrder;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteStatusService = useCallback(async (id) => {
    try {
      return await serviceStatusRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }, []);

//   const restoreData = useCallback(async (params) => {
//     try {
//       const response = await binningRepository.restore(`/restore`, params);
//       return response;
//     } catch (err) {
//       throw err;
//     }
//   }, []);
  const { data, isLoading, isError, fetchData } = useDataFetching(fetchStatusServices);

  return {
    data,
    isLoading,
    isError,
    fetchStatusServices: fetchData,
    createStatusService,
    updateStatusService,
    deleteStatusService,
   
 
  };
};
