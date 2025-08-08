// src/hooks/api-custom-hooks/useUsers.js
import { useCallback } from 'react';
import { useDataFetching } from './useDataFetching';

import orderRepository from '../../api/repositories/orderRepository';
export const useOrders = () => {
  const fetchOrders = useCallback(async (params = {}) => {
    try {
      return orderRepository.getAll(params);
    } catch (err) {
      throw err;
    }
  }, []);

  const createOrder = useCallback(async (data) => {
    try {
      const newOrder = await orderRepository.create(data);
      return newOrder;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateOrder = useCallback(async (params,data) => {
    try {
      const updatedOrder = await orderRepository.update(params,data);
      return updatedOrder;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteOrder = useCallback(async (id) => {
    try {
      return await orderRepository.delete(id);
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
  const { data, isLoading, isError, fetchData } = useDataFetching(fetchOrders);

  return {
    data,
    isLoading,
    isError,
    fetchOrders: fetchData,
    createOrder,
    updateOrder,
    deleteOrder,
   
 
  };
};
