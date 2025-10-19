import {  Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-auto relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Careers Page Builder</span>
          </div>
          
         
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
            <span>Created by Athrva Naik</span>
            
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto rounded-full mb-6"></div>
          
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Careers Page Builder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}