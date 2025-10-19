import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Briefcase, AlertCircle, CheckCircle2, Mail, Lock, Building2, ArrowRight, Sparkles, Zap, Shield, Rocket } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      const user = useAuthStore.getState().user;
      navigate(`/${user.companySlug}/edit`);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzM5ODFmNiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-md w-full animate-fadeIn">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl blur-lg opacity-50 animate-pulse-soft"></div>
            <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl mb-4 shadow-2xl">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold mb-2">
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Start Your Journey
            </span>
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Rocket className="w-4 h-4 text-primary-500" />
            Create your company's careers page in minutes
          </p>
        </div>

        {/* Register Card */}
        <div className="glass-card animate-slideIn">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-slideIn">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                {/* <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="Tech Innovators Inc."
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                This will be used to create your unique careers page URL
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                {/* <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                {/* <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Must be at least 6 characters long
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 space-y-3 animate-slideIn">
          <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Customize your careers page with your brand</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-primary-500 shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Manage job postings easily</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Mobile-friendly and SEO optimized</span>
          </div>
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}