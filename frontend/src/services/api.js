import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let authToken = null;

export function setToken(token) {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      setToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function getMonitoring(id) {
  const response = await api.get(`/api/monitoring/${id}`);
  return response.data;
}

export async function getAllMonitoring(params = {}) {
  const response = await api.get('/api/monitoring', { params });
  return response.data;
}

export async function createMonitoring(data) {
  const response = await api.post('/api/monitoring', data);
  return response.data;
}

export async function updateMonitoring(id, data) {
  const response = await api.put(`/api/monitoring/${id}`, data);
  return response.data;
}

export async function deleteMonitoring(id) {
  await api.delete(`/api/monitoring/${id}`);
}

export async function getMonitoringStats() {
  const response = await api.get('/api/monitoring/stats');
  return response.data;
}

export async function generateWordDocument(id) {
  const response = await api.get(`/api/documents/word/${id}`, {
    responseType: 'blob'
  });
  return response.data;
}

export async function generateExcelDocument(params = {}) {
  const response = await api.get('/api/documents/excel', {
    params,
    responseType: 'blob'
  });
  return response.data;
}

export async function generateExcelById(id) {
  const response = await api.get(`/api/documents/excel/${id}`, {
    responseType: 'blob'
  });
  return response.data;
}

export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default api;