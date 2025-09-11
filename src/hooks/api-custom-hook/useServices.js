// src/hooks/api-custom-hooks/useUsers.js
import { useCallback } from 'react';
import { useDataFetching } from './useDataFetching';

import serviceRepository from '../../api/repositories/serviceRepository';
export const useServices = () => {
  const fetchServices = useCallback(async (params = {}) => {
    try {
      return serviceRepository.getAll(params);
    } catch (err) {
      throw err;
    }
  }, []);

  const createService = useCallback(async (data) => {
    try {
      const newOrder = await serviceRepository.create(data);
      return newOrder;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateService = useCallback(async (params,data) => {
    try {
      const updatedOrder = await serviceRepository.update(params,data);
      return updatedOrder;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteService = useCallback(async (id) => {
    try {
      return await serviceRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }, []);

  const restoreData = useCallback(async (params) => {
    try {
      const response = await serviceRepository.restore(`/restore`, params);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);
  
  // const getServicesCount = useCallback(async (params) => {
  //   try {
  //     const response = await serviceRepository.count(`/count`, params);
  //     return response;
  //   } catch (err) {
  //     throw err;
  //   }
  // }, []);
  const getServicesCount = useCallback(async (params) => {
    try {
      const response = await serviceRepository.count('/count', params); // path is now handled correctly
      return response;
    } catch (err) {
      throw err;
    }
  }, []);
  
  const { data, isLoading, isError, fetchData } = useDataFetching(fetchServices);

  return {
    data,
    isLoading,
    isError,
    fetchServices: fetchData,
    createService,
    updateService,
    deleteService,
    restoreData,
    getServicesCount
   
 
  };
};
