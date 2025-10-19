import { Search, Filter, MapPin, Briefcase } from 'lucide-react';

export default function JobFilters({ filters, onFilterChange, filterOptions }) {
  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary-600" />
              Search Jobs
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title..."
                value={filters.search || ''}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filters.location || 'all'}
                onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                className="input-field pl-12 appearance-none cursor-pointer"
              >
                <option value="all">All Locations</option>
                {filterOptions.locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange-600" />
              Job Type
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filters.jobType || 'all'}
                onChange={(e) => onFilterChange({ ...filters, jobType: e.target.value })}
                className="input-field pl-12 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                {filterOptions.jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}