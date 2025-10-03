// Admin Layout Component
// Provides sidebar + main content area structure

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home, Database } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar with Navigation Buttons */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Accueil Admin</span>
            </Link>
            <Link
              to="/admin/data-preview"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Database className="w-4 h-4" />
              <span>Aperçu des Données</span>
            </Link>
          </div>
        </div>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
