import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCompanyStore from '../store/companyStore';
import useJobsStore from '../store/jobsStore';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import { Briefcase, Users, Target, Award, TrendingUp, Sparkles } from 'lucide-react';

export default function CareersPage() {
  const { slug } = useParams();
  const { company, loading: companyLoading, fetchCompany } = useCompanyStore();
  const { jobs, filterOptions, loading: jobsLoading, fetchJobs, fetchFilterOptions } = useJobsStore();
  
  const [filters, setFilters] = useState({
    search: '',
    location: 'all',
    jobType: 'all',
  });

  useEffect(() => {
    if (slug) {
      fetchCompany(slug);
      fetchFilterOptions(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.location !== 'all') params.location = filters.location;
      if (filters.jobType !== 'all') params.jobType = filters.jobType;
      
      fetchJobs(slug, params);
    }
  }, [slug, filters]);

  if (companyLoading) {
    return <LoadingSpinner text="Loading careers page..." />;
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <Briefcase className="w-12 h-12 text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">This careers page doesn't exist or isn't published yet.</p>
        </div>
      </div>
    );
  }

  const branding = company.branding || {};
  const sections = (company.sections || []).filter(s => s.isVisible).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner */}
      <div className="relative overflow-hidden">
        {/* Banner Background */}
        {branding.bannerImage ? (
          <div className="relative h-96 md:h-[500px]">
            <img 
              src={branding.bannerImage} 
              alt={company.companyName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
          </div>
        ) : (
          <div 
            className="relative h-96 md:h-[500px]"
            style={{ 
              background: `linear-gradient(135deg, ${branding.primaryColor || '#3B82F6'} 0%, ${branding.secondaryColor || '#1E40AF'} 100%)`
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-5xl mx-auto px-4 text-center">
            {branding.logo && (
              <div className="mb-8 inline-block animate-fadeIn">
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50"></div>
                  <img 
                    src={branding.logo} 
                    alt={company.companyName}
                    className="relative h-32 px-8 py-6 bg-white rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            )}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl animate-slideIn">
              {company.companyName}
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto drop-shadow-lg mb-8 animate-fadeIn">
              Join our team and build something amazing together
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 animate-fadeIn">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{jobs.length}+ Positions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Growing Team</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Great Culture</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {sections.length > 0 && (
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {sections.map((section, index) => (
              <div key={section.id} className={`mb-20 ${index % 2 === 0 ? 'animate-slideIn' : 'animate-fadeIn'}`}>
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${branding.primaryColor || '#3B82F6'}, ${branding.secondaryColor || '#1E40AF'})`
                      }}
                    >
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h2 
                      className="text-4xl font-bold"
                      style={{ color: branding.secondaryColor || '#1E40AF' }}
                    >
                      {section.title}
                    </h2>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Culture Video */}
      {branding.cultureVideo && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-4">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-gray-700">Watch Our Story</span>
              </div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: branding.secondaryColor || '#1E40AF' }}
              >
                Life at {company.companyName}
              </h2>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl animate-slideIn">
              <iframe
                src={branding.cultureVideo.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Jobs Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 opacity-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-4">
              <Briefcase className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-gray-700">We're Hiring!</span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: branding.secondaryColor || '#1E40AF' }}
            >
              Open Positions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore opportunities to join our team and make an impact
            </p>
          </div>

          {/* Filters */}
          <JobFilters 
            filters={filters} 
            onFilterChange={setFilters} 
            filterOptions={filterOptions}
          />

          {/* Jobs List */}
          {jobsLoading ? (
            <LoadingSpinner text="Loading jobs..." />
          ) : jobs.length === 0 ? (
            <div className="glass-card text-center py-20 animate-fadeIn">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
              <p className="text-gray-600 text-lg">
                {filters.search || filters.location !== 'all' || filters.jobType !== 'all'
                  ? 'Try adjusting your filters to see more positions'
                  : 'Check back soon for new opportunities!'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <div 
                  key={job._id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {jobs.length > 0 && (
            <div className="mt-12 text-center animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-gray-700 font-semibold">
                  Showing <span className="text-primary-600">{jobs.length}</span>{' '}
                  {jobs.length === 1 ? 'position' : 'positions'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}