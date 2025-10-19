import { Loader2, Sparkles } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600 relative`} />
      </div>
      {text && (
        <div className="mt-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" />
          <p className="text-gray-600 font-medium">{text}</p>
        </div>
      )}
    </div>
  );
}