// Data Preview Page - View all data with filtering capabilities
// Allows viewing and exporting all system data

import { useState, useEffect, useMemo } from 'react';
import { AdminDataStorage } from '../../utils/adminDataStorage';
import type { AdminData } from '../../types/admin.types';
import {
  Search,
  Download,
  RefreshCw,
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  DollarSign,
  Grid3x3,
  Filter,
  X,
  FileText
} from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';

type DataType = 'all' | 'students' | 'teachers' | 'groups' | 'bookings' | 'student_payments' | 'teacher_payments';
type DateRange = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

export default function DataPreview() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataType, setDataType] = useState<DataType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Load admin data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AdminDataStorage.load();
      setAdminData(data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Filter data by date range
  const filterByDateRange = (dateString: string): boolean => {
    if (dateRange === 'all') return true;

    const itemDate = new Date(dateString);
    const now = new Date();

    switch (dateRange) {
      case 'today':
        return itemDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= monthAgo;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return itemDate >= yearAgo;
      case 'custom':
        if (!customStartDate && !customEndDate) return true;
        const start = customStartDate ? new Date(customStartDate) : new Date(0);
        const end = customEndDate ? new Date(customEndDate) : new Date();
        return itemDate >= start && itemDate <= end;
      default:
        return true;
    }
  };

  // Get filtered data
  const filteredData = useMemo(() => {
    if (!adminData) return null;

    const result: any = {
      students: [],
      teachers: [],
      groups: [],
      bookings: [],
      student_payments: [],
      teacher_payments: []
    };

    // Filter students
    if (dataType === 'all' || dataType === 'students') {
      result.students = adminData.students.filter(s => {
        const matchesSearch = searchTerm === '' ||
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.phone.includes(searchTerm) ||
          s.parent_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = filterByDateRange(s.created_at);

        // Filter by selected groups
        let matchesGroup = true;
        if (selectedGroups.length > 0) {
          const studentEnrollments = adminData.student_enrollments?.filter(e => e.student_id === s.id) || [];
          const studentGroupIds = studentEnrollments.map(e => e.group_id);
          matchesGroup = selectedGroups.some(groupId => studentGroupIds.includes(groupId));
        }

        return matchesSearch && matchesDate && matchesGroup;
      });
    }

    // Filter teachers
    if (dataType === 'all' || dataType === 'teachers') {
      result.teachers = adminData.teachers.filter(t => {
        const matchesSearch = searchTerm === '' ||
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.phone.includes(searchTerm) ||
          t.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDate = filterByDateRange(t.created_at);

        // Filter by selected groups
        let matchesGroup = true;
        if (selectedGroups.length > 0) {
          const teacherGroups = adminData.groups.filter(g => g.teacher_id === t.id);
          const teacherGroupIds = teacherGroups.map(g => g.id);
          matchesGroup = selectedGroups.some(groupId => teacherGroupIds.includes(groupId));
        }

        return matchesSearch && matchesDate && matchesGroup;
      });
    }

    // Filter groups
    if (dataType === 'all' || dataType === 'groups') {
      result.groups = adminData.groups.filter(g => {
        const matchesSearch = searchTerm === '' ||
          g.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.level.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = filterByDateRange(g.created_at);

        // Filter by selected groups
        const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(g.id);

        return matchesSearch && matchesDate && matchesGroup;
      });
    }

    // Filter bookings
    if (dataType === 'all' || dataType === 'bookings') {
      result.bookings = adminData.bookings.filter(b => {
        const group = adminData.groups.find(g => g.id === b.group_id);
        const teacher = adminData.teachers.find(t => t.id === b.teacher_id);
        const room = adminData.rooms.find(r => r.id === b.room_id);

        const matchesSearch = searchTerm === '' ||
          (group?.group_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (teacher?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (room?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          b.notes.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = filterByDateRange(b.date);
        return matchesSearch && matchesDate;
      });
    }

    // Filter student payments
    if (dataType === 'all' || dataType === 'student_payments') {
      result.student_payments = adminData.student_payments.filter(p => {
        const student = adminData.students.find(s => s.id === p.student_id);
        const matchesSearch = searchTerm === '' ||
          p.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (student?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          p.period.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = filterByDateRange(p.payment_date);
        return matchesSearch && matchesDate;
      });
    }

    // Filter teacher payments
    if (dataType === 'all' || dataType === 'teacher_payments') {
      result.teacher_payments = adminData.teacher_payments.filter(p => {
        const teacher = adminData.teachers.find(t => t.id === p.teacher_id);
        const matchesSearch = searchTerm === '' ||
          (teacher?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          p.period.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = filterByDateRange(p.payment_date);
        return matchesSearch && matchesDate;
      });
    }

    return result;
  }, [adminData, dataType, searchTerm, dateRange, customStartDate, customEndDate, selectedGroups]);

  // Export data as JSON
  const handleExport = () => {
    if (!filteredData) return;

    const dataToExport = dataType === 'all' ? filteredData : { [dataType]: filteredData[dataType] };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smarthub-${dataType}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export data as PDF
  const handlePrintPDF = () => {
    console.log('PDF Print button clicked');
    if (!filteredData) {
      console.error('No filtered data available');
      alert('Aucune donnée à exporter');
      return;
    }

    try {
      console.log('Generating PDF with data:', { dataType, filteredData, adminData });
      generatePDF({
        dataType,
        filteredData,
        adminData,
        searchTerm,
        dateRange
      });
      console.log('PDF generation completed');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF: ' + error);
    }
  };

  // Get total counts
  const getTotalCount = () => {
    if (!filteredData) return 0;
    if (dataType === 'all') {
      return Object.values(filteredData).reduce((sum: number, arr: any) => sum + arr.length, 0);
    }
    return filteredData[dataType]?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aperçu des Données</h1>
          <p className="text-gray-600 mt-1">
            Visualisez et exportez toutes les données du système
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filtres {showFilters && <X className="w-4 h-4" />}
          </button>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FileText className="w-4 h-4" />
            Imprimer PDF
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Download className="w-4 h-4" />
            Exporter JSON
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-4">Filtres</h3>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom, email, téléphone, matière..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Data Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de données
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'all', label: 'Tout', icon: Grid3x3 },
                { value: 'students', label: 'Étudiants', icon: Users },
                { value: 'teachers', label: 'Enseignants', icon: UserCheck },
                { value: 'groups', label: 'Groupes', icon: Grid3x3 },
                { value: 'bookings', label: 'Réservations', icon: Calendar },
                { value: 'student_payments', label: 'Paiements Étudiants', icon: CreditCard },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setDataType(type.value as DataType)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      dataType === type.value
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par groupe(s)
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {adminData?.groups.map((group) => (
                <label key={group.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGroups([...selectedGroups, group.id]);
                      } else {
                        setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                      }
                    }}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{group.group_name}</span>
                </label>
              ))}
              {adminData?.groups.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">Aucun groupe disponible</p>
              )}
            </div>
            {selectedGroups.length > 0 && (
              <button
                onClick={() => setSelectedGroups([])}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700"
              >
                Effacer la sélection ({selectedGroups.length} groupe(s) sélectionné(s))
              </button>
            )}
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plage de dates
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { value: 'all', label: 'Tout' },
                { value: 'today', label: "Aujourd'hui" },
                { value: 'week', label: '7 jours' },
                { value: 'month', label: '30 jours' },
                { value: 'year', label: '1 an' },
                { value: 'custom', label: 'Personnalisé' },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value as DateRange)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                    dateRange === range.value
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Date début</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Date fin</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total résultats</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{getTotalCount()}</p>
            </div>
            <Grid3x3 className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        {filteredData && (
          <>
            {(dataType === 'all' || dataType === 'students') && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Étudiants</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {filteredData.students.length}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
              </div>
            )}

            {(dataType === 'all' || dataType === 'teachers') && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Enseignants</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {filteredData.teachers.length}
                    </p>
                  </div>
                  <UserCheck className="w-12 h-12 text-green-600" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Data Tables */}
      {filteredData && (
        <div className="space-y-6">
          {/* Students Table */}
          {(dataType === 'all' || dataType === 'students') && filteredData.students.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Étudiants ({filteredData.students.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groupe(s)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.students.map((student) => {
                      const enrollments = adminData?.student_enrollments?.filter(e => e.student_id === student.id) || [];
                      const groupNames = enrollments.map(enrollment => {
                        const group = adminData?.groups.find(g => g.id === enrollment.group_id);
                        return group?.group_name || 'N/A';
                      });
                      const groupsText = groupNames.length > 0 ? groupNames.join(', ') : 'Aucun';

                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.phone}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.parent_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{groupsText}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              student.status === 'active' ? 'bg-green-100 text-green-800' :
                              student.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                              student.status === 'graduated' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {student.status === 'active' ? 'Actif' :
                               student.status === 'inactive' ? 'Inactif' :
                               student.status === 'graduated' ? 'Diplômé' : 'Retiré'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.registration_date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Teachers Table */}
          {(dataType === 'all' || dataType === 'teachers') && filteredData.teachers.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Enseignants ({filteredData.teachers.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matières</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groupe(s)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarif horaire</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.teachers.map((teacher) => {
                      const assignedGroups = adminData?.groups.filter(g => g.teacher_id === teacher.id) || [];
                      const groupNames = assignedGroups.map(g => g.group_name);
                      const groupsText = groupNames.length > 0 ? groupNames.join(', ') : 'Aucun';

                      return (
                        <tr key={teacher.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{teacher.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{teacher.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{teacher.phone}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {teacher.subjects.join(', ')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{groupsText}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {teacher.payment_terms.hourly_rate} TND/h
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              teacher.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {teacher.status === 'active' ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Groups Table */}
          {(dataType === 'all' || dataType === 'groups') && filteredData.groups.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Grid3x3 className="w-5 h-5" />
                  Groupes ({filteredData.groups.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom du groupe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacité</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscrits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.groups.map((group) => (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{group.group_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{group.subject}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{group.level}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{group.capacity}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{group.current_enrollment}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            group.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {group.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings Table */}
          {(dataType === 'all' || dataType === 'bookings') && filteredData.bookings.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Réservations ({filteredData.bookings.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groupe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horaires</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.bookings.map((booking) => {
                      const room = adminData?.rooms.find(r => r.id === booking.room_id);
                      const group = adminData?.groups.find(g => g.id === booking.group_id);
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{booking.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{room?.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{group?.group_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {booking.start_time} - {booking.end_time}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.duration_hours}h</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmé' :
                               booking.status === 'completed' ? 'Terminé' : 'Annulé'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Student Payments Table */}
          {(dataType === 'all' || dataType === 'student_payments') && filteredData.student_payments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Paiements Étudiants ({filteredData.student_payments.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facture</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.student_payments.map((payment) => {
                      const student = adminData?.students.find(s => s.id === payment.student_id);
                      return (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.invoice_number}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student?.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{payment.amount} TND</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{payment.period}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{payment.payment_date}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {payment.payment_method === 'cash' ? 'Espèces' :
                             payment.payment_method === 'check' ? 'Chèque' :
                             payment.payment_method === 'bank_transfer' ? 'Virement' : 'Mobile'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                              payment.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.status === 'paid' ? 'Payé' :
                               payment.status === 'partial' ? 'Partiel' : 'En attente'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No Results */}
          {getTotalCount() === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
              <p className="text-gray-600">
                Aucune donnée ne correspond à vos critères de filtrage
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
