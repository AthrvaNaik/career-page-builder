import { create } from 'zustand';
import { jobsAPI } from '../services/api';

const useJobsStore = create((set) => ({
  jobs: [],
  filterOptions: { locations: [], jobTypes: [], departments: [] },
  loading: false,
  error: null,

  fetchJobs: async (companySlug, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await jobsAPI.getJobs(companySlug, filters);
      set({ jobs: response.data.data, loading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch jobs';
      set({ loading: false, error: errorMessage, jobs: [] });
      return { success: false, error: errorMessage };
    }
  },

  fetchFilterOptions: async (companySlug) => {
    try {
      const response = await jobsAPI.getFilterOptions(companySlug);
      set({ filterOptions: response.data.data });
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useJobsStore;