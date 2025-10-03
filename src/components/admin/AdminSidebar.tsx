// Admin Sidebar Navigation
// Shows all 6 main modules + dashboard

import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Monitor,
  Clock,
  Users,
  CreditCard,
  UserCheck,
  DollarSign,
  BarChart3,
  LogOut,
  Home,
  Database
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types/admin.types';

interface NavItem {
  icon: typeof Calendar;
  label: string;
  path: string;
  allowedRoles: UserRole[];
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Tableau de Bord',
    path: '/admin',
    allowedRoles: ['manager', 'staff', 'accountant']
  },
  {
    icon: Calendar,
    label: 'Réservations',
    path: '/admin/bookings',
    allowedRoles: ['manager', 'staff']
  },
  {
    icon: Monitor,
    label: 'Statut des Salles',
    path: '/admin/room-status',
    allowedRoles: ['manager', 'staff', 'accountant']
  },
  {
    icon: Clock,
    label: 'Horaires de Travail',
    path: '/admin/working-hours',
    allowedRoles: ['manager']
  },
  {
    icon: Users,
    label: 'Étudiants',
    path: '/admin/students',
    allowedRoles: ['manager', 'staff']
  },
  {
    icon: CreditCard,
    label: 'Paiements Étudiants',
    path: '/admin/student-payments',
    allowedRoles: ['manager', 'staff', 'accountant']
  },
  {
    icon: Database,
    label: 'Aperçu des Données',
    path: '/admin/data-preview',
    allowedRoles: ['manager', 'staff', 'accountant']
  },
  {
    icon: UserCheck,
    label: 'Enseignants',
    path: '/admin/teachers',
    allowedRoles: ['manager', 'staff']
  },
  {
    icon: DollarSign,
    label: 'Paiements Enseignants',
    path: '/admin/teacher-payments',
    allowedRoles: ['manager', 'accountant']
  },
  {
    icon: BarChart3,
    label: 'Rapports Financiers',
    path: '/admin/reports',
    allowedRoles: ['manager', 'accountant']
  }
];

export function AdminSidebar() {
  const { user, role, logout } = useAuth();

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(item =>
    role && item.allowedRoles.includes(role)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-900">SmartHub</h1>
        <p className="text-sm text-gray-600 mt-1">Gestion Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3 px-4">
          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-600">{user?.email}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
            {role === 'manager' && 'Gestionnaire'}
            {role === 'staff' && 'Personnel'}
            {role === 'accountant' && 'Comptable'}
          </span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
