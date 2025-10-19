import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};


export const companyAPI = {
  getCompany: (slug) => api.get(`/companies/${slug}`),
  getPreview: (slug) => api.get(`/companies/${slug}/preview`),
  updateCompany: (slug, data) => api.put(`/companies/${slug}`, data),
  updateSections: (slug, sections) => api.put(`/companies/${slug}/sections`, { sections }),
  addSection: (slug, section) => api.post(`/companies/${slug}/sections`, section),
  deleteSection: (slug, sectionId) => api.delete(`/companies/${slug}/sections/${sectionId}`),
  publishCompany: (slug, isPublished) => api.put(`/companies/${slug}/publish`, { isPublished }),
};


export const jobsAPI = {
  getJobs: (companySlug, params) => api.get(`/jobs/${companySlug}`, { params }),
  getFilterOptions: (companySlug) => api.get(`/jobs/${companySlug}/filters/options`),
  createJob: (companySlug, data) => api.post(`/jobs/${companySlug}`, data),
  updateJob: (companySlug, jobId, data) => api.put(`/jobs/${companySlug}/${jobId}`, data),
  deleteJob: (companySlug, jobId) => api.delete(`/jobs/${companySlug}/${jobId}`),
};


export const uploadAPI = {
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/upload/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadBanner: (file) => {
    const formData = new FormData();
    formData.append('banner', file);
    return api.post('/upload/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;