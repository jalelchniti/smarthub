import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Building, DollarSign, Filter, Search, Download, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { FirebaseBookingService, type Booking, type BookingData } from '../services/firebaseBookingService';

interface BookingWithDetails extends Booking {
  roomName: string;
  formattedDate: string;
  formattedTime: string;
  dayOfWeek: string;
}

export const AdminBookings: React.FC = () => {
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

  // Load all bookings on component mount
  useEffect(() => {
    
    const loadBookings = async () => {
      try {
        setLoading(true);
        console.log('Initializing Firebase for admin bookings...');
        
        // Wait for Firebase CDN to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize Firebase
        const initialized = await FirebaseBookingService.initialize();
        if (!initialized) {
          throw new Error('Firebase initialization failed');
        }
        
        // Load booking data
        const data = await FirebaseBookingService.loadBookingData();
        setBookingData(data);
        
        // Process bookings for display
        const processedBookings = processBookingsForDisplay(data);
        setAllBookings(processedBookings);
        setFilteredBookings(processedBookings);
        
        console.log('Admin bookings loaded:', processedBookings.length, 'total bookings');
        
      } catch (err) {
        console.error('Error loading admin bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Process bookings for display with additional details
  const processBookingsForDisplay = (data: BookingData): BookingWithDetails[] => {
    const bookings: BookingWithDetails[] = [];
    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    Object.entries(data.bookings).forEach(([bookingId, booking]) => {
      const roomName = data.rooms[booking.roomId]?.name || `Salle ${booking.roomId}`;
      const date = new Date(booking.date);
      const dayOfWeek = weekDays[date.getDay()];
      const formattedDate = date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const formattedTime = booking.timeSlot;

      bookings.push({
        ...booking,
        id: bookingId,
        roomName,
        formattedDate,
        formattedTime,
        dayOfWeek
      });
    });

    // Sort by date and time (most recent first)
    return bookings.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.timeSlot.localeCompare(a.timeSlot);
    });
  };

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
    if (!bookingData) return;
    
    try {
      setLoading(true);
      const data = await FirebaseBookingService.loadBookingData();
      setBookingData(data);
      const processedBookings = processBookingsForDisplay(data);
      setAllBookings(processedBookings);
      setFilteredBookings(processedBookings);
    } catch (err) {
      console.error('Error refreshing bookings:', err);
      setError('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
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
    link.download = `smarthub-bookings-${new Date().toISOString().split('T')[0]}.csv`;
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

  // Calculate total revenue
  const totalRevenue = filteredBookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + (booking.feeCalculation?.totalTTC || 0), 0);

  const pendingRevenue = filteredBookings
    .filter(booking => booking.paymentStatus === 'pending' || !booking.paymentStatus)
    .reduce((sum, booking) => sum + (booking.feeCalculation?.totalTTC || 0), 0);


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
                Administration des Réservations
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredBookings.length} réservation(s) • Total payé: {totalRevenue.toFixed(2)} TND • En attente: {pendingRevenue.toFixed(2)} TND
              </p>
            </div>
            <div className="flex gap-3">
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
              {bookingData && Object.entries(bookingData.rooms).map(([id, room]) => (
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
              <option value="cancelled">Annulé</option>
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
                        <div className="mt-1">
                          {getStatusBadge(booking.paymentStatus)}
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