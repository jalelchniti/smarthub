import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Building, 
  DollarSign, 
  Filter, 
  Search, 
  Download, 
  RefreshCw, 
  Eye, 
  AlertCircle,
  Shield,
  LogOut,
  Trash2,
  CheckSquare,
  Square,
  Check,
  X,
  AlertTriangle,
  User
} from 'lucide-react';
import { FirebaseBookingService, type Booking, type BookingData } from '../services/firebaseBookingService';
import { FirebaseAuthService, type AuthState } from '../services/firebaseAuthService';

interface BookingWithDetails extends Booking {
  roomName: string;
  formattedDate: string;
  formattedTime: string;
  dayOfWeek: string;
  selected?: boolean;
}

export const FirebaseAdminBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [allBookings, setAllBookings] = useState<BookingWithDetails[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, user: null, loading: true });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adminStats, setAdminStats] = useState<{
    totalLogins: number;
    lastLoginDate: string;
    sessionDuration: number;
  } | null>(null);

  // Authentication check and state management
  useEffect(() => {
    const unsubscribe = FirebaseAuthService.onAuthStateChanged((state) => {
      setAuthState(state);
      
      if (!state.loading) {
        if (!state.isAuthenticated) {
          navigate('/admin/firebase-login');
        } else {
          // Load admin stats
          loadAdminStats();
        }
      }
    });

    return unsubscribe;
  }, [navigate]);

  // Load admin stats
  const loadAdminStats = async () => {
    try {
      const stats = await FirebaseAuthService.getAdminStats();
      setAdminStats(stats);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  // Process bookings for display with additional details
  const processBookingsForDisplay = useCallback((data: BookingData): BookingWithDetails[] => {
    const bookings: BookingWithDetails[] = [];
    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    // Check if data and data.bookings exist
    if (!data || !data.bookings || typeof data.bookings !== 'object') {
      console.log('No bookings data available:', data);
      return bookings;
    }
    
    Object.entries(data.bookings).forEach(([bookingId, booking]) => {
      if (!booking || typeof booking !== 'object') {
        console.warn('Invalid booking data:', bookingId, booking);
        return;
      }

      // Skip cancelled bookings - they should not persist in the admin dashboard
      if (booking.paymentStatus === 'cancelled') {
        return;
      }
      
      const date = new Date(booking.date);
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      const formattedTime = `${booking.timeSlot} (${booking.duration}h)`;
      const dayOfWeek = weekDays[date.getDay()];
      
      bookings.push({
        ...booking,
        id: bookingId,
        roomName: `Salle ${booking.roomId}`,
        formattedDate,
        formattedTime,
        dayOfWeek,
        selected: selectedBookings.has(bookingId)
      });
    });

    // Sort by date and time (most recent first)
    return bookings.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.timeSlot.localeCompare(a.timeSlot);
    });
  }, [selectedBookings]); // Include selectedBookings as it's used to set the selected property

  // Load all bookings when authenticated
  useEffect(() => {
    if (!authState.isAuthenticated || authState.loading) {
      return;
    }

    const loadBookings = async () => {
      try {
        setLoading(true);
        console.log('Loading bookings for Firebase authenticated admin...');
        
        // Wait for Firebase CDN to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize Firebase
        const initialized = await FirebaseBookingService.initialize();
        if (!initialized) {
          throw new Error('Firebase initialization failed');
        }
        
        // Load booking data
        const data = await FirebaseBookingService.loadBookingData();
        console.log('Loaded booking data:', data);
        setBookingData(data);
        
        // Process bookings for display
        const processedBookings = processBookingsForDisplay(data);
        setAllBookings(processedBookings);
        setFilteredBookings(processedBookings);
        
        console.log('Firebase admin bookings loaded:', processedBookings.length, 'total bookings');
        
      } catch (err) {
        console.error('Error loading Firebase admin bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [authState.isAuthenticated, authState.loading, processBookingsForDisplay]);

  // Filter bookings based on search and filters
  useEffect(() => {
    let filtered = [...allBookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.contactInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Room filter
    if (filterRoom !== 'all') {
      filtered = filtered.filter(booking => booking.roomId === filterRoom);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => 
        (booking.paymentStatus || 'pending') === filterStatus
      );
    }

    // Date filter
    if (filterDate) {
      filtered = filtered.filter(booking => booking.date === filterDate);
    }

    setFilteredBookings(filtered);
  }, [allBookings, searchTerm, filterRoom, filterStatus, filterDate]);

  // Refresh bookings
  const refreshBookings = async () => {
    if (!bookingData || !authState.isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await FirebaseBookingService.loadBookingData();
      setBookingData(data);
      const processedBookings = processBookingsForDisplay(data);
      setAllBookings(processedBookings);
      setFilteredBookings(processedBookings);
      setSelectedBookings(new Set()); // Clear selections
    } catch (err) {
      console.error('Error refreshing bookings:', err);
      setError('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  // Toggle booking selection
  const toggleBookingSelection = (bookingId: string) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(bookingId)) {
      newSelected.delete(bookingId);
    } else {
      newSelected.add(bookingId);
    }
    setSelectedBookings(newSelected);
  };

  // Select all filtered bookings
  const selectAllBookings = () => {
    const allIds = new Set(filteredBookings.map(b => b.id!));
    setSelectedBookings(allIds);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedBookings(new Set());
  };

  // Select only pending bookings
  const selectPendingBookings = () => {
    const pendingIds = new Set(
      filteredBookings
        .filter(b => (b.paymentStatus || 'pending') === 'pending')
        .map(b => b.id!)
    );
    setSelectedBookings(pendingIds);
  };

  // Bulk delete selected bookings
  const bulkDeleteSelected = async () => {
    if (selectedBookings.size === 0) return;
    
    setBulkLoading(true);
    try {
      const bookingIds = Array.from(selectedBookings);
      const result = await FirebaseBookingService.bulkDeleteBookings(bookingIds);
      
      if (result.success) {
        await refreshBookings();
        setShowDeleteConfirm(false);
        setError('');
      } else {
        setError(`Erreur lors de la suppression: ${result.errors.join(', ')}`);
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      setError('Erreur lors de la suppression en masse');
    } finally {
      setBulkLoading(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (bookingId: string, status: 'pending' | 'paid' | 'cancelled') => {
    try {
      const success = await FirebaseBookingService.updatePaymentStatus(bookingId, status);
      if (success) {
        await refreshBookings();
      } else {
        setError('Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  // Confirm offline payment (enhanced method)
  const confirmOfflinePayment = async (bookingId: string) => {
    try {
      const success = await FirebaseBookingService.confirmPayment(bookingId, 'offline');
      if (success) {
        await refreshBookings();
        setError('');
      } else {
        setError('Erreur lors de la confirmation du paiement');
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setError('Erreur lors de la confirmation du paiement');
    }
  };

  // Logout function
  const handleLogout = async () => {
    const success = await FirebaseAuthService.signOut();
    if (success) {
      navigate('/admin/firebase-login');
    }
  };

  // Export bookings to CSV
  const exportToCSV = () => {
    const headers = [
      'Date', 'Heure', 'Salle', 'Enseignant', 'Matière', 'Étudiants', 'Durée (h)', 
      'Contact', 'Coût HT', 'TVA', 'Total TTC', 'Statut'
    ];
    
    const csvData = filteredBookings.map(booking => [
      booking.date,
      booking.timeSlot,
      booking.roomName,
      booking.teacherName,
      booking.subject,
      booking.studentCount,
      booking.duration,
      booking.contactInfo,
      booking.feeCalculation ? `${booking.feeCalculation.subtotalHT.toFixed(2)} TND` : 'N/A',
      booking.feeCalculation ? `${booking.feeCalculation.vatAmount.toFixed(2)} TND` : 'N/A',
      booking.feeCalculation ? `${booking.feeCalculation.totalTTC.toFixed(2)} TND` : 'N/A',
      booking.paymentStatus || 'pending'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `smarthub-firebase-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Get status badge color
  const getStatusBadge = (status: string = 'pending') => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const labels = {
      pending: 'En attente',
      paid: 'Payé',
      cancelled: 'Annulé'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors] || colors.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  // Calculate comprehensive revenue analytics
  const paymentAnalytics = filteredBookings.reduce((stats, booking) => {
    const amount = booking.feeCalculation?.totalTTC || 0;
    const status = booking.paymentStatus || 'pending';
    const method = booking.paymentMethod || 'unknown';

    if (status === 'paid') {
      stats.totalPaid += amount;
      if (method === 'online') {
        stats.onlinePayments += amount;
      } else if (method === 'offline') {
        stats.offlinePayments += amount;
      }
    } else if (status === 'pending') {
      stats.totalPending += amount;
    }
    
    return stats;
  }, {
    totalPaid: 0,
    totalPending: 0,
    onlinePayments: 0,
    offlinePayments: 0
  });

  // Legacy variables for backward compatibility
  const totalRevenue = paymentAnalytics.totalPaid;
  const pendingRevenue = paymentAnalytics.totalPending;

  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Vérification de l'authentification...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Chargement des réservations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg mb-4">Erreur: {error}</p>
              <button
                onClick={refreshBookings}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Firebase Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredBookings.length} réservation(s) • Total payé: {totalRevenue.toFixed(2)} TND • En attente: {pendingRevenue.toFixed(2)} TND
              </p>
            </div>
            
            {/* Admin Info & Actions */}
            <div className="flex items-center gap-4">
              {authState.user && (
                <div className="text-right text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {authState.user.displayName || authState.user.email}
                  </p>
                  <p className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Firebase Auth
                  </p>
                  {adminStats && (
                    <p className="text-xs text-gray-500">
                      Connexions: {adminStats.totalLogins}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={refreshBookings}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualiser
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exporter CSV
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Room Filter */}
            <select
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les salles</option>
              {bookingData?.rooms && Object.entries(bookingData.rooms).map(([id, room]) => (
                <option key={id} value={id}>{room.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="paid">Payé</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Payment Analytics Dashboard */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Aperçu des Paiements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Paid */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 font-medium">Total Payé</p>
                  <p className="text-2xl font-bold text-green-800">{paymentAnalytics.totalPaid.toFixed(2)} TND</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Total Pending */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-700 font-medium">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-800">{paymentAnalytics.totalPending.toFixed(2)} TND</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Online Payments */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-medium">Paiements En Ligne</p>
                  <p className="text-2xl font-bold text-blue-800">{paymentAnalytics.onlinePayments.toFixed(2)} TND</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Offline Payments */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 font-medium">Paiements Sur Place</p>
                  <p className="text-2xl font-bold text-purple-800">{paymentAnalytics.offlinePayments.toFixed(2)} TND</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBookings.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-blue-700 font-medium">
                  {selectedBookings.size} réservation(s) sélectionnée(s)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={selectPendingBookings}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                  >
                    Sélectionner en attente
                  </button>
                  <button
                    onClick={selectAllBookings}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    Tout sélectionner
                  </button>
                  <button
                    onClick={clearAllSelections}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Désélectionner
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={bulkLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {bulkLoading ? 'Suppression...' : 'Supprimer sélection'}
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer {selectedBookings.size} réservation(s) ? 
                Cette action est irréversible.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={bulkDeleteSelected}
                  disabled={bulkLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {bulkLoading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/80 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Selection Checkbox */}
                    <button
                      onClick={() => toggleBookingSelection(booking.id!)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {selectedBookings.has(booking.id!) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {/* Booking Info */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* Date & Time */}
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{booking.formattedDate}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.formattedTime} ({booking.duration}h)
                          </p>
                        </div>
                      </div>

                      {/* Room & Teacher */}
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{booking.roomName}</p>
                          <p className="text-sm text-gray-600">{booking.teacherName}</p>
                        </div>
                      </div>

                      {/* Subject & Students */}
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{booking.subject}</p>
                          <p className="text-sm text-gray-600">{booking.studentCount} étudiant(s)</p>
                        </div>
                      </div>

                      {/* Fee & Status */}
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          {booking.feeCalculation ? (
                            <>
                              <p className="font-semibold text-gray-800">{booking.feeCalculation.totalTTC.toFixed(2)} TND</p>
                              <p className="text-xs text-gray-500">HT: {booking.feeCalculation.subtotalHT.toFixed(2)} + TVA: {booking.feeCalculation.vatAmount.toFixed(2)}</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Tarif non calculé</p>
                          )}
                          <div className="mt-1 space-y-1">
                            {getStatusBadge(booking.paymentStatus)}
                            {booking.paymentStatus === 'pending' && (
                              <div className="flex items-center gap-1">
                                {/* Quick status buttons */}
                                <button
                                  onClick={() => updatePaymentStatus(booking.id!, 'paid')}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Marquer comme payé"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => updatePaymentStatus(booking.id!, 'cancelled')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Marquer comme annulé"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                            {booking.paymentStatus === 'pending' && (
                              <button
                                onClick={() => confirmOfflinePayment(booking.id!)}
                                className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                                title="Confirmer le paiement sur place"
                              >
                                <DollarSign className="w-3 h-3" />
                                Confirmer Paiement
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setShowDetails(showDetails === booking.id ? null : booking.id || null)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {showDetails === booking.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Informations de contact
                        </h4>
                        <p className="text-gray-600 mb-4">{booking.contactInfo}</p>
                        
                        <h4 className="font-semibold text-gray-800 mb-2">Détails de la réservation</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><span className="font-medium">ID:</span> {booking.id}</p>
                          <p><span className="font-medium">Date de réservation:</span> {new Date(booking.bookingDate).toLocaleString('fr-FR')}</p>
                          <p><span className="font-medium">Jour de la semaine:</span> {booking.dayOfWeek}</p>
                        </div>
                      </div>

                      {booking.feeCalculation && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Détail des coûts
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Tarif horaire:</span>
                              <span className="font-medium">{booking.feeCalculation.hourlyRate} TND/h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Durée:</span>
                              <span className="font-medium">{booking.duration}h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sous-total HT:</span>
                              <span className="font-medium">{booking.feeCalculation.subtotalHT.toFixed(2)} TND</span>
                            </div>
                            <div className="flex justify-between">
                              <span>TVA (19%):</span>
                              <span className="font-medium">{booking.feeCalculation.vatAmount.toFixed(2)} TND</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-base">
                              <span>Total TTC:</span>
                              <span className="text-blue-600">{booking.feeCalculation.totalTTC.toFixed(2)} TND</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};