import { create } from 'zustand';
import { companyAPI } from '../services/api';

const useCompanyStore = create((set, get) => ({
  company: null,
  loading: false,
  error: null,

  fetchCompany: async (slug) => {
    set({ loading: true, error: null });
    try {
      const response = await companyAPI.getCompany(slug);
      set({ company: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch company';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  fetchPreview: async (slug) => {
    set({ loading: true, error: null });
    try {
      const response = await companyAPI.getPreview(slug);
      set({ company: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch preview';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  updateCompany: async (slug, data) => {
    set({ loading: true, error: null });
    try {
      const response = await companyAPI.updateCompany(slug, data);
      set({ company: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update company';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  updateSections: async (slug, sections) => {
    try {
      const response = await companyAPI.updateSections(slug, sections);
      set({ company: response.data.data });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update sections';
      return { success: false, error: errorMessage };
    }
  },

  publishCompany: async (slug, isPublished) => {
    try {
      const response = await companyAPI.publishCompany(slug, isPublished);
      set({ company: response.data.data });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to publish';
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCompanyStore;