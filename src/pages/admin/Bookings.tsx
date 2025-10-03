import { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, Search, Plus, Edit2, Trash2, CheckCircle, XCircle, Filter } from 'lucide-react';
import { AdminDataStorage } from '../../utils/adminDataStorage';
import type { Booking, Room, Group, Teacher, AdminData } from '../../types/admin.types';

export default function AdminBookings() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [filterDate, setFilterDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    room_id: '',
    group_id: '',
    date: '',
    start_time: '',
    end_time: '',
    notes: ''
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AdminDataStorage.load();
        setAdminData(data);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Get related data
  const rooms = adminData?.rooms || [];
  const groups = adminData?.groups || [];
  const teachers = adminData?.teachers || [];

  // Filter bookings
  const filteredBookings = useMemo(() => {
    if (!adminData) return [];
    let filtered = adminData.bookings;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(b => b.date === filterDate);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(b => {
        const room = rooms.find(r => r.id === b.room_id);
        const group = groups.find(g => g.id === b.group_id);
        const teacher = teachers.find(t => t.id === b.teacher_id);

        return (
          room?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group?.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.notes?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered.sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [adminData, filterStatus, filterDate, searchTerm]);

  // Calculate duration
  const calculateDuration = (start: string, end: string): number => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return (endMinutes - startMinutes) / 60;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData) return;

    const duration = calculateDuration(formData.start_time, formData.end_time);

    if (editingBooking) {
      // Update existing booking
      const updated = adminData.bookings.map(b =>
        b.id === editingBooking.id
          ? {
              ...b,
              ...formData,
              duration_hours: duration,
              updated_at: new Date().toISOString()
            }
          : b
      );

      const newData = { ...adminData, bookings: updated, last_updated: new Date().toISOString() };
      await AdminDataStorage.save(newData);
      setAdminData(newData);
    } else {
      // Create new booking
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        ...formData,
        teacher_id: groups.find(g => g.id === formData.group_id)?.teacher_id || '',
        duration_hours: duration,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const newData = {
        ...adminData,
        bookings: [...adminData.bookings, newBooking],
        last_updated: new Date().toISOString()
      };
      await AdminDataStorage.save(newData);
      setAdminData(newData);
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      room_id: '',
      group_id: '',
      date: '',
      start_time: '',
      end_time: '',
      notes: ''
    });
    setEditingBooking(null);
    setShowModal(false);
  };

  // Handle edit
  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      room_id: booking.room_id,
      group_id: booking.group_id,
      date: booking.date,
      start_time: booking.start_time,
      end_time: booking.end_time,
      notes: booking.notes || ''
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (bookingId: string) => {
    if (!adminData) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      const newData = {
        ...adminData,
        bookings: adminData.bookings.filter(b => b.id !== bookingId),
        last_updated: new Date().toISOString()
      };
      await AdminDataStorage.save(newData);
      setAdminData(newData);
    }
  };

  // Handle status change
  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    if (!adminData) return;
    const updated = adminData.bookings.map(b =>
      b.id === bookingId
        ? {
            ...b,
            status: newStatus,
            updated_at: new Date().toISOString(),
            ...(newStatus === 'cancelled' && {
              cancelled_at: new Date().toISOString()
            })
          }
        : b
    );

    const newData = { ...adminData, bookings: updated, last_updated: new Date().toISOString() };
    await AdminDataStorage.save(newData);
    setAdminData(newData);
  };

  // Get room name
  const getRoomName = (roomId: string) => rooms.find(r => r.id === roomId)?.name || 'N/A';

  // Get group name
  const getGroupName = (groupId: string) => groups.find(g => g.id === groupId)?.group_name || 'N/A';

  // Get teacher name
  const getTeacherName = (teacherId: string) => teachers.find(t => t.id === teacherId)?.name || 'N/A';

  // Get status badge
  const getStatusBadge = (status: Booking['status']) => {
    const styles = {
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    const labels = {
      confirmed: 'Confirmé',
      completed: 'Terminé',
      cancelled: 'Annulé'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur de chargement des données</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
          <p className="text-gray-600 mt-1">Gérez les réservations de salles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Réservation
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="confirmed">Confirmé</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          {/* Date filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Clear filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterDate('');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Groupe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enseignant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(booking.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.start_time} - {booking.end_time}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{getRoomName(booking.room_id)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getGroupName(booking.group_id)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getTeacherName(booking.teacher_id)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.duration_hours}h</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {booking.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'completed')}
                              className="text-green-600 hover:text-green-900"
                              title="Marquer comme terminé"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                              title="Annuler"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(booking)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingBooking ? 'Modifier la Réservation' : 'Nouvelle Réservation'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salle *
                </label>
                <select
                  value={formData.room_id}
                  onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une salle</option>
                  {rooms.filter(r => r.status === 'active').map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>

              {/* Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Groupe *
                </label>
                <select
                  value={formData.group_id}
                  onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un groupe</option>
                  {groups.filter(g => g.status === 'active').map(group => (
                    <option key={group.id} value={group.id}>{group.group_name}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure début *
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure fin *
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingBooking ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
