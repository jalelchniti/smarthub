// Admin Dashboard - Main Overview Page
// Shows key metrics and quick access to all modules

import { useAdminData } from '../../utils/adminDataStorage';
import { Calendar, Users, UserCheck, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { data, loading } = useAdminData();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const todayBookings = data.bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0];
    return b.date === today && b.status !== 'cancelled';
  }).length;

  const activeStudents = data.students.filter(s => s.status === 'active').length;
  const activeTeachers = data.teachers.filter(t => t.status === 'active').length;

  const thisMonthPayments = data.student_payments.filter(p => {
    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    return p.payment_date.startsWith(thisMonth) && p.status === 'paid';
  });

  const monthlyRevenue = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de SmartHub - {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Réservations Aujourd'hui"
          value={todayBookings}
          icon={Calendar}
          color="blue"
        />
        <MetricCard
          title="Étudiants Actifs"
          value={activeStudents}
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Enseignants Actifs"
          value={activeTeachers}
          icon={UserCheck}
          color="purple"
        />
        <MetricCard
          title="Revenus du Mois"
          value={`${monthlyRevenue.toFixed(0)} TND`}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h2>
          <div className="space-y-3">
            <StatItem
              label="Total réservations"
              value={data.bookings.length}
              icon={Calendar}
            />
            <StatItem
              label="Total étudiants"
              value={data.students.length}
              icon={Users}
            />
            <StatItem
              label="Total enseignants"
              value={data.teachers.length}
              icon={UserCheck}
            />
            <StatItem
              label="Total paiements"
              value={data.student_payments.length}
              icon={TrendingUp}
            />
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Système</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Stockage JSON Local</p>
                <p className="text-xs text-gray-600 mt-1">
                  Les données sont sauvegardées dans le navigateur (localStorage)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Dernière mise à jour</p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(data.last_updated).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Version du système: {data.version}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            href="/admin/bookings"
            label="Créer une Réservation"
            icon={Calendar}
          />
          <QuickActionButton
            href="/admin/students"
            label="Ajouter un Étudiant"
            icon={Users}
          />
          <QuickActionButton
            href="/admin/teachers"
            label="Gérer Enseignants"
            icon={UserCheck}
          />
          <QuickActionButton
            href="/admin/student-payments"
            label="Enregistrer un Paiement"
            icon={DollarSign}
          />
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: typeof Calendar;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Stat Item Component
interface StatItemProps {
  label: string;
  value: number;
  icon: typeof Calendar;
}

function StatItem({ label, value, icon: Icon }: StatItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

// Quick Action Button Component
interface QuickActionButtonProps {
  href: string;
  label: string;
  icon: typeof Calendar;
}

function QuickActionButton({ href, label, icon: Icon }: QuickActionButtonProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
    >
      <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
      <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
        {label}
      </span>
    </a>
  );
}
