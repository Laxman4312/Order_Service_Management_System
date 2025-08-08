// src/hooks/api-custom-hooks/useUsers.js
import { useCallback } from 'react';
import { useDataFetching } from './useDataFetching';

import orderStatusRepository from '../../api/repositories/orderStatusRepository';
export const useOrderStatus = () => {
  const fetchStatusOrders = useCallback(async (params = {}) => {
    try {
      return orderStatusRepository.getAll(params);
    } catch (err) {
      throw err;
    }
  }, []);

  const createStatusOrder = useCallback(async (data) => {
    try {
      const newOrder = await orderStatusRepository.create(data);
      return newOrder;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateStatusOrder = useCallback(async (params,data) => {
    try {
      const updatedOrder = await orderStatusRepository.update(params,data);
      return updatedOrder;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteStatusOrder = useCallback(async (id) => {
    try {
      return await orderStatusRepository.delete(id);
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
  const { data, isLoading, isError, fetchData } = useDataFetching(fetchStatusOrders);

  return {
    data,
    isLoading,
    isError,
    fetchStatusOrders: fetchData,
    createStatusOrder,
    updateStatusOrder,
    deleteStatusOrder,
   
 
  };
};
