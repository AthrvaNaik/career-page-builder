import { MapPin, Briefcase, Clock, ArrowRight, TrendingUp } from 'lucide-react';

export default function JobCard({ job }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Posted today';
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="group relative">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
      
      <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Job Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
              {job.jobTitle}
            </h3>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span className="font-medium">{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span className="font-medium">{job.jobType}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="font-medium">{formatDate(job.postedDate)}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 line-clamp-2 mb-4 leading-relaxed">
              {job.description.substring(0, 150)}...
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200">
                <TrendingUp className="w-3 h-3" />
                {job.department}
              </span>
              {job.experienceLevel && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200">
                  {job.experienceLevel}
                </span>
              )}
            </div>
          </div>

          {/* Apply Button */}
          <button className="shrink-0 group/btn relative px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Apply
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
}