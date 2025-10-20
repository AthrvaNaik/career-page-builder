import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCompanyStore from '../store/companyStore';
import { uploadAPI, jobsAPI } from '../services/api';
import SectionEditor from '../components/SectionEditor';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Eye, Save, Upload, Link as LinkIcon, Globe, 
  Palette, Plus, CheckCircle, Briefcase, Pencil, 
  Trash2, ToggleLeft, ToggleRight, X
} from 'lucide-react';

export default function Dashboard() {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const { company, loading, fetchPreview, updateCompany, updateSections, publishCompany } = useCompanyStore();
  
  const [activeTab, setActiveTab] = useState('branding');
  const [brandingData, setBrandingData] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    logo: '',
    bannerImage: '',
    cultureVideo: '',
  });
  const [sections, setSections] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    jobTitle: '',
    location: '',
    jobType: 'Full-time',
    department: '',
    description: '',
    requirements: '',
    experienceLevel: 'Mid Level',
  });

  useEffect(() => {
    if (slug) {
      fetchPreview(slug);
      loadJobs();
    }
  }, [slug]);

  useEffect(() => {
    if (company) {
      setBrandingData(company.branding);
      setSections(company.sections || []);
    }
  }, [company]);

  const loadJobs = async () => {
    try {
      const response = await jobsAPI.getJobs(slug);
      setJobs(response.data.data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const handleFileUpload = async (file, type) => {
    setUploading(true);
    try {
      let response;
      if (type === 'logo') {
        response = await uploadAPI.uploadLogo(file);
      } else if (type === 'banner') {
        response = await uploadAPI.uploadBanner(file);
      }
      
      const url = response.data.data.url;
      setBrandingData({ ...brandingData, [type]: url });
      setSaveMessage('✓ File uploaded! Click "Save Changes" to apply.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBranding = async () => {
    const result = await updateCompany(slug, { branding: brandingData });
    if (result.success) {
      setSaveMessage('✓ Branding saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleSaveSections = async () => {
    const result = await updateSections(slug, sections);
    if (result.success) {
      setSaveMessage('✓ Sections saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleSectionUpdate = (updatedSection) => {
    setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
  };

  const handleSectionDelete = (sectionId) => {
    if (window.confirm('Delete this section?')) {
      setSections(sections.filter(s => s.id !== sectionId));
    }
  };

  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      type: 'custom',
      title: 'New Section',
      content: 'Add your content here...',
      order: sections.length + 1,
      isVisible: true,
    };
    setSections([...sections, newSection]);
  };

  const handlePublish = async () => {
    const newStatus = !company?.isPublished;
    const result = await publishCompany(slug, newStatus);
    if (result.success) {
      setSaveMessage(`✓ Page ${newStatus ? 'published' : 'unpublished'} successfully!`);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Job Management Functions
  const openJobModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        jobTitle: job.jobTitle,
        location: job.location,
        jobType: job.jobType,
        department: job.department,
        description: job.description,
        requirements: job.requirements,
        experienceLevel: job.experienceLevel || 'Mid Level',
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        jobTitle: '',
        location: '',
        jobType: 'Full-time',
        department: '',
        description: '',
        requirements: '',
        experienceLevel: 'Mid Level',
      });
    }
    setShowJobModal(true);
  };

  const closeJobModal = () => {
    setShowJobModal(false);
    setEditingJob(null);
    setJobFormData({
      jobTitle: '',
      location: '',
      jobType: 'Full-time',
      department: '',
      description: '',
      requirements: '',
      experienceLevel: 'Mid Level',
    });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await jobsAPI.updateJob(slug, editingJob._id, jobFormData);
        setSaveMessage('✓ Job updated successfully!');
      } else {
        await jobsAPI.createJob(slug, jobFormData);
        setSaveMessage('✓ Job created successfully!');
      }
      closeJobModal();
      loadJobs();
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to save job'));
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.deleteJob(slug, jobId);
        setSaveMessage('✓ Job deleted successfully!');
        loadJobs();
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (error) {
        alert('Error deleting job');
      }
    }
  };

  // const handleToggleJob = async (jobId) => {
  //   try {
  //     await jobsAPI.toggleJob(slug, jobId);
  //     setSaveMessage('✓ Job status updated!');
  //     loadJobs();
  //     setTimeout(() => setSaveMessage(''), 3000);
  //   } catch (error) {
  //     alert('Error toggling job status');
  //   }
  // };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {company?.companyName}
              </h1>
              <p className="text-gray-600 mt-1">Manage your careers page</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/${slug}/careers`}
                target="_blank"
                className="btn-secondary flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
              <button
                onClick={handlePublish}
                className={`btn-primary flex items-center gap-2 ${
                  company?.isPublished ? 'bg-gradient-to-r from-green-600 to-emerald-600' : ''
                }`}
              >
                <Globe className="w-4 h-4" />
                {company?.isPublished ? 'Published ✓' : 'Publish'}
              </button>
            </div>
          </div>

          {saveMessage && (
            <div className="mt-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl text-green-800 text-sm flex items-center gap-2 animate-slideIn">
              <CheckCircle className="w-5 h-5" />
              {saveMessage}
            </div>
          )}

          {company?.isPublished && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Public Careers Page:</span>
              </div>
              <a
                href={`/${slug}/careers`}
                target="_blank"
                className="text-blue-600 hover:text-blue-700 font-medium break-all hover:underline"
              >
                {window.location.origin}/{slug}/careers
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('branding')}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all ${
                activeTab === 'branding'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Palette className="w-4 h-4 inline mr-2" />
              Branding
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all ${
                activeTab === 'sections'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sections
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all ${
                activeTab === 'jobs'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Jobs ({jobs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Brand Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandingData.primaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                      className="h-12 w-24 rounded-xl border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandingData.primaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                      className="input-field flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                      className="h-12 w-24 rounded-xl border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                      className="input-field flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Logo</h2>
              {brandingData.logo && (
                <img src={brandingData.logo} alt="Logo" className="h-20 mb-4 object-contain" />
              )}
              <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Banner Image</h2>
              {brandingData.bannerImage && (
                <img src={brandingData.bannerImage} alt="Banner" className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Banner'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'banner')}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div> */}

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Culture Video</h2>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (YouTube, Vimeo, etc.)
              </label>
              <input
                type="url"
                value={brandingData.cultureVideo}
                onChange={(e) => setBrandingData({ ...brandingData, cultureVideo: e.target.value })}
                className="input-field"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <button onClick={handleSaveBranding} className="btn-primary">
              <Save className="w-4 h-4 inline mr-2" />
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Content Sections</h2>
              <button onClick={handleAddSection} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Section
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600">No sections yet. Add your first section!</p>
              </div>
            ) : (
              sections.map((section) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  onUpdate={handleSectionUpdate}
                  onDelete={handleSectionDelete}
                />
              ))
            )}

            <button onClick={handleSaveSections} className="btn-primary">
              <Save className="w-4 h-4 inline mr-2" />
              Save All Sections
            </button>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
              <button onClick={() => openJobModal()} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Job
              </button>
            </div>

            {jobs.length === 0 ? (
              <div className="card text-center py-16">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">No jobs posted yet</p>
                <p className="text-gray-500 mb-6">Create your first job posting to start attracting candidates</p>
                <button onClick={() => openJobModal()} className="btn-primary">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job._id} className="card hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{job.jobTitle}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                          <span>📍 {job.location}</span>
                          <span>💼 {job.jobType}</span>
                          <span>🏢 {job.department}</span>
                        </div>
                        <p className="text-gray-700 line-clamp-2">{job.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <button
                          onClick={() => handleToggleJob(job._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={job.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {job.isActive ? (
                            <ToggleRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                          )}
                        </button> */}
                        <button
                          onClick={() => openJobModal(job)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingJob ? 'Edit Job' : 'Create New Job'}
              </h3>
              <button
                onClick={closeJobModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJobSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={jobFormData.jobTitle}
                  onChange={(e) => setJobFormData({ ...jobFormData, jobTitle: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    className="input-field"
                    placeholder="e.g. San Francisco, CA"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    value={jobFormData.jobType}
                    onChange={(e) => setJobFormData({ ...jobFormData, jobType: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={jobFormData.department}
                    onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Engineering"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={jobFormData.experienceLevel}
                    onChange={(e) => setJobFormData({ ...jobFormData, experienceLevel: e.target.value })}
                    className="input-field"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead">Lead</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  rows={5}
                  className="input-field"
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requirements *
                </label>
                <textarea
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                  rows={5}
                  className="input-field"
                  placeholder="List the required skills, qualifications, and experience..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  <Save className="w-4 h-4 inline mr-2" />
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
                <button
                  type="button"
                  onClick={closeJobModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}