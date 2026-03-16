import apiInstance from './index';

export const getAllUsers = (params) => apiInstance.get('/users', { params });

export const getUsers = (id) => apiInstance.get(`/users/${id}`);


export const createUser = (data) => apiInstance.post('/users', data);

export const updateUser = (id, data) => apiInstance.put(`/users/${id}`, data);

export const deleteUser = (id) => apiInstance.delete(`/users/${id}`);