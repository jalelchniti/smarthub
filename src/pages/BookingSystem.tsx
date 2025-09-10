import React, { useState, useEffect } from 'react';
import { Users, XCircle, MapPin, Building, Save, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { FirebaseBookingService } from '../services/firebaseBookingService';

interface Booking {
  id?: string;
  roomId: string;
  date: string; // YYYY-MM-DD format
  timeSlot: string;
  teacherName: string;
  subject: string;
  studentCount: number;
  duration: number;
  contactInfo: string;
  bookingDate: string;
  bookingPeriod?: 'week' | '2weeks' | '3weeks' | 'month';
  endDate?: string;
}

interface BookingData {
  rooms: {
    [roomId: string]: {
      name: string;
      capacity: number;
    };
  };
  bookings: {
    [bookingId: string]: Booking;
  };
  timeSlots: {
    weekdays: string[];
    sunday: string[];
  };
  weekDays: string[];
  startDate: string;
  bookingPeriods: {
    label: string;
    value: string;
    weeks: number;
  }[];
  lastUpdated: string;
}

interface BookingFormData {
  teacherName: string;
  subject: string;
  studentCount: number;
  duration: number;
  contactInfo: string;
  bookingPeriod: 'week' | '2weeks' | '3weeks' | 'month';
}

export const BookingSystem: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('1');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    teacherName: '',
    subject: '',
    studentCount: 1,
    duration: 1,
    contactInfo: '',
    bookingPeriod: 'week'
  });
  const [loading, setLoading] = useState(true);

  // Load booking data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Initializing Firebase booking service...');
        
        // Wait a bit for Firebase CDN to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize Firebase first
        const initialized = await FirebaseBookingService.initialize();
        if (!initialized) {
          throw new Error('Firebase initialization failed');
        }
        
        console.log('Firebase initialized, loading booking data...');
        
        // Load booking data
        const data = await FirebaseBookingService.loadBookingData();
        console.log('Booking data loaded:', data);
        setBookingData(data);
        
        // Set default date and week start (September 15th, 2025)
        if (!selectedDate && data.startDate) {
          const startDate = new Date(data.startDate);
          const monday = getWeekStart(startDate);
          setCurrentWeekStart(monday.toISOString().split('T')[0]);
          setSelectedDate(data.startDate);
        }
        
        // Subscribe to real-time updates
        const unsubscribe = FirebaseBookingService.subscribeToBookingUpdates((updatedData) => {
          console.log('Real-time update received:', updatedData);
          setBookingData(updatedData);
        });
        
        // Cleanup subscription on unmount
        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        console.error('Failed to load Firebase booking data:', error);
        console.log('Falling back to default data structure...');
        
        // Fallback to default data structure
        const defaultData: BookingData = {
          rooms: {
            "1": { name: "Salle 1", capacity: 15 },
            "2": { name: "Salle 2", capacity: 9 },
            "3": { name: "Salle 3", capacity: 9 }
          },
          bookings: {},
          timeSlots: {
            weekdays: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"],
            sunday: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"]
          },
          weekDays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
          startDate: "2025-09-15",
          bookingPeriods: [
            { label: "1 Semaine", value: "week", weeks: 1 },
            { label: "2 Semaines", value: "2weeks", weeks: 2 },
            { label: "3 Semaines", value: "3weeks", weeks: 3 },
            { label: "1 Mois", value: "month", weeks: 4 }
          ],
          lastUpdated: new Date().toISOString()
        };
        
        setBookingData(defaultData);
        if (!selectedDate && defaultData.startDate) {
          const startDate = new Date(defaultData.startDate);
          const monday = getWeekStart(startDate);
          setCurrentWeekStart(monday.toISOString().split('T')[0]);
          setSelectedDate(defaultData.startDate);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedDate]);

  // Helper function to get Monday of the week
  const getWeekStart = (date: Date): Date => {
    const monday = new Date(date);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    monday.setDate(diff);
    return monday;
  };

  // Helper function to get time slots affected by a booking duration
  const getAffectedTimeSlots = (startTimeSlot: string, duration: number, date: string): string[] => {
    if (!bookingData) return [];
    
    // Determine if it's Sunday (different time slots)
    const dayOfWeek = new Date(date).getDay();
    const timeSlotsList = dayOfWeek === 0 ? bookingData.timeSlots.sunday : bookingData.timeSlots.weekdays;
    
    const startIndex = timeSlotsList.indexOf(startTimeSlot);
    if (startIndex === -1) return [];
    
    const slotsNeeded = duration * 2; // 2 slots per hour (30-minute intervals)
    const affectedSlots: string[] = [];
    
    for (let i = 0; i < slotsNeeded && startIndex + i < timeSlotsList.length; i++) {
      affectedSlots.push(timeSlotsList[startIndex + i]);
    }
    
    return affectedSlots;
  };

  // Helper function to get dates for the current week
  const getCurrentWeekDates = (): { date: string; dayName: string; dayOfWeek: number }[] => {
    if (!currentWeekStart) return [];
    
    const dates = [];
    const startDate = new Date(currentWeekStart);
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      dates.push({
        date: currentDate.toISOString().split('T')[0],
        dayName: dayNames[currentDate.getDay()],
        dayOfWeek: currentDate.getDay()
      });
    }
    
    return dates;
  };

  const isTimeSlotBooked = (roomId: string, date: string, timeSlot: string): boolean => {
    if (!bookingData || !bookingData.bookings) return false;
    
    // Check if this specific time slot is booked by any booking
    const bookings = Object.values(bookingData.bookings);
    return bookings.some(booking => {
      if (!booking || booking.roomId !== roomId || booking.date !== date) return false;
      
      // Check if this time slot falls within any existing booking's duration
      const affectedSlots = getAffectedTimeSlots(booking.timeSlot, booking.duration, date);
      return affectedSlots.includes(timeSlot);
    });
  };

  const getBookingInfo = (roomId: string, date: string, timeSlot: string): Booking | null => {
    if (!bookingData || !bookingData.bookings) return null;
    
    // Find booking that affects this time slot
    const bookings = Object.values(bookingData.bookings);
    return bookings.find(booking => {
      if (!booking || booking.roomId !== roomId || booking.date !== date) return false;
      
      const affectedSlots = getAffectedTimeSlots(booking.timeSlot, booking.duration, date);
      return affectedSlots.includes(timeSlot);
    }) || null;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData || !selectedRoom || !selectedDate || !selectedTimeSlot) return;

    // Check if any of the required time slots are already booked
    const requiredSlots = getAffectedTimeSlots(selectedTimeSlot, formData.duration, selectedDate);
    const hasConflict = requiredSlots.some(slot => 
      isTimeSlotBooked(selectedRoom, selectedDate, slot)
    );
    
    if (hasConflict) {
      alert(`Conflit de réservation! Certains créneaux requis pour cette session de ${formData.duration}h sont déjà réservés.`);
      return;
    }

    const newBooking: Omit<Booking, 'id'> = {
      roomId: selectedRoom,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      teacherName: formData.teacherName,
      subject: formData.subject,
      studentCount: formData.studentCount,
      duration: formData.duration,
      contactInfo: formData.contactInfo,
      bookingDate: new Date().toISOString(),
      bookingPeriod: formData.bookingPeriod
    };

    try {
      // Create recurring booking if period is more than a week
      if (formData.bookingPeriod !== 'week') {
        const bookingIds = await FirebaseBookingService.createRecurringBooking(newBooking, formData.bookingPeriod);
        console.log('Recurring bookings created:', bookingIds);
        alert(`Réservations créées pour ${formData.bookingPeriod === '2weeks' ? '2 semaines' : formData.bookingPeriod === '3weeks' ? '3 semaines' : '1 mois'}!`);
      } else {
        // Save single booking to Firebase
        const bookingId = await FirebaseBookingService.createBooking(newBooking);
        if (bookingId) {
          console.log('Booking saved to Firebase:', bookingId);
          console.log('Affected time slots:', requiredSlots);
        } else {
          throw new Error('Failed to get booking ID');
        }
      }
    } catch (error) {
      console.error('Failed to save booking:', error);
      alert('Erreur lors de la sauvegarde de la réservation. Veuillez réessayer.');
      return;
    }
    
    // Reset form and close modal
    setFormData({
      teacherName: '',
      subject: '',
      studentCount: 1,
      duration: 1,
      contactInfo: '',
      bookingPeriod: 'week'
    });
    setShowBookingForm(false);
    setSelectedTimeSlot('');
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    if (!isTimeSlotBooked(selectedRoom, selectedDate, timeSlot)) {
      setSelectedTimeSlot(timeSlot);
      setShowBookingForm(true);
    }
  };

  const cancelBooking = async (roomId: string, date: string, timeSlot: string) => {
    if (!bookingData) return;
    
    // Find the booking that affects this time slot
    const booking = getBookingInfo(roomId, date, timeSlot);
    if (!booking || !booking.id) {
      console.error('Booking not found or missing ID');
      return;
    }
    
    try {
      const success = await FirebaseBookingService.cancelBooking(booking.id);
      if (success) {
        console.log('Booking cancelled from Firebase:', booking.id);
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Erreur lors de l\'annulation de la réservation.');
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (!currentWeekStart) return;
    
    const current = new Date(currentWeekStart);
    const newDate = new Date(current);
    newDate.setDate(current.getDate() + (direction === 'next' ? 7 : -7));
    
    setCurrentWeekStart(newDate.toISOString().split('T')[0]);
    
    // Update selected date to first day of new week
    const weekDates = getCurrentWeekDates();
    if (weekDates.length > 1) { // Skip Sunday, select Monday
      setSelectedDate(weekDates[1].date);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Chargement du système de réservation...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-600">Erreur de chargement du système de réservation</p>
        </div>
      </div>
    );
  }

  const weekDates = getCurrentWeekDates();
  const currentDate = selectedDate ? new Date(selectedDate) : new Date();
  const dayOfWeek = currentDate.getDay();
  const availableTimeSlots = dayOfWeek === 0 ? bookingData.timeSlots.sunday : bookingData.timeSlots.weekdays;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
              <Building className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 text-center tracking-tight leading-normal">
            Système de Réservation
            <span className="block text-blue-300">
              SmartHub 2025
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto text-center leading-relaxed">
            Réservez vos créneaux d'apprentissage à partir du <span className="font-semibold text-yellow-300">15 septembre 2025</span>. 
            Périodes flexibles disponibles : 1 semaine, 2 semaines, 3 semaines ou 1 mois complet.
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-200 mt-8">
            <MapPin className="w-6 h-6 text-yellow-400" />
            <span className="text-center text-lg">13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis</span>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sélectionnez Salle et Semaine</h2>
              
              {/* Room Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">Salle d'Apprentissage</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(bookingData.rooms).map(([roomId, room]) => (
                    <button
                      key={roomId}
                      onClick={() => setSelectedRoom(roomId)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedRoom === roomId
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-25'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-bold text-lg">{room.name}</div>
                          <div className="text-sm opacity-75 flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Jusqu'à {room.capacity} personnes
                          </div>
                        </div>
                        <Building className="w-8 h-8" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Week Navigation */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">Navigation Semaine</label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => navigateWeek('prev')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      Semaine du {currentWeekStart && new Date(currentWeekStart).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigateWeek('next')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Week View with Days and Time Slots */}
      <section className="pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Planning de la Semaine - {bookingData.rooms[selectedRoom].name}
              </h2>
              
              {/* Legend */}
              <div className="flex justify-center space-x-8 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 border-2 border-green-400 rounded-lg"></div>
                  <span className="text-sm font-medium text-gray-700">Disponible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-100 border-2 border-red-400 rounded-lg"></div>
                  <span className="text-sm font-medium text-gray-700">Réservé</span>
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="p-2 text-center font-bold text-gray-600">Heure</div>
                {weekDates.map((dayInfo) => (
                  <button
                    key={dayInfo.date}
                    onClick={() => setSelectedDate(dayInfo.date)}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${
                      selectedDate === dayInfo.date
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-bold text-sm">{dayInfo.dayName}</div>
                    <div className="text-xs">{new Date(dayInfo.date).getDate()}/{new Date(dayInfo.date).getMonth() + 1}</div>
                  </button>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-2">
                {availableTimeSlots.map((timeSlot) => (
                  <div key={timeSlot} className="grid grid-cols-8 gap-2">
                    <div className="p-3 text-center font-bold text-gray-600 bg-gray-50 rounded-lg">
                      {timeSlot}
                    </div>
                    {weekDates.map((dayInfo) => {
                      const isBooked = isTimeSlotBooked(selectedRoom, dayInfo.date, timeSlot);
                      const bookingInfo = getBookingInfo(selectedRoom, dayInfo.date, timeSlot);
                      
                      // Check if this day has any time slots available (skip Sunday after 13:00)
                      const dayTimeSlots = dayInfo.dayOfWeek === 0 ? bookingData.timeSlots.sunday : bookingData.timeSlots.weekdays;
                      const isTimeSlotAvailable = dayTimeSlots.includes(timeSlot);
                      
                      if (!isTimeSlotAvailable) {
                        return (
                          <div key={dayInfo.date} className="p-3 bg-gray-200 rounded-lg">
                            <div className="text-center text-gray-400 text-xs">Non disponible</div>
                          </div>
                        );
                      }
                      
                      return (
                        <div
                          key={dayInfo.date}
                          className={`relative group p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                            isBooked
                              ? 'border-red-400 bg-red-50 text-red-700'
                              : 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100 hover:scale-105 transform'
                          }`}
                          onClick={() => !isBooked && dayInfo.date === selectedDate && handleTimeSlotClick(timeSlot)}
                        >
                          <div className="text-center">
                            <div className={`text-xs ${isBooked ? 'text-red-600' : 'text-green-600'}`}>
                              {isBooked ? 'Réservé' : 'Libre'}
                            </div>
                            
                            {/* Booking Info Tooltip */}
                            {isBooked && bookingInfo && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl min-w-64">
                                  <div className="font-bold mb-1">{bookingInfo.teacherName}</div>
                                  <div>Matière: {bookingInfo.subject}</div>
                                  <div>Étudiants: {bookingInfo.studentCount}</div>
                                  <div>Durée: {bookingInfo.duration}h</div>
                                  <div className="text-yellow-300 text-xs mt-1">
                                    {bookingInfo.timeSlot === timeSlot 
                                      ? `Début de session (${bookingInfo.timeSlot} - ${getAffectedTimeSlots(bookingInfo.timeSlot, bookingInfo.duration, dayInfo.date).pop()})` 
                                      : `Partie de la session commencée à ${bookingInfo.timeSlot}`
                                    }
                                  </div>
                                  {bookingInfo.timeSlot === timeSlot && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        cancelBooking(selectedRoom, dayInfo.date, timeSlot);
                                      }}
                                      className="mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                                    >
                                      Annuler toute la session
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Nouvelle Réservation</h3>
                  <p className="text-gray-600">{bookingData.rooms[selectedRoom].name} - {selectedDate && new Date(selectedDate).toLocaleDateString('fr-FR')} à {selectedTimeSlot}</p>
                </div>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'Enseignant *</label>
                  <input
                    type="text"
                    required
                    value={formData.teacherName}
                    onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Entrez le nom de l'enseignant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Matière Enseignée *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  >
                    <option value="">Sélectionnez une matière</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Physique">Physique</option>
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Sciences Naturelles">Sciences Naturelles</option>
                    <option value="Arabe">Arabe</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Économie & Gestion">Économie & Gestion</option>
                    <option value="ESP">ESP</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre d'Étudiants *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={bookingData.rooms[selectedRoom].capacity}
                      value={formData.studentCount}
                      onChange={(e) => setFormData({...formData, studentCount: parseInt(e.target.value)})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum: {bookingData.rooms[selectedRoom].capacity} étudiants</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Durée (heures) *</label>
                    <select
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseFloat(e.target.value)})}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    >
                      <option value={0.5}>30 minutes</option>
                      <option value={1}>1 heure</option>
                      <option value={1.5}>1h30</option>
                      <option value={2}>2 heures</option>
                      <option value={2.5}>2h30</option>
                      <option value={3}>3 heures</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Période de Réservation *</label>
                  <select
                    required
                    value={formData.bookingPeriod}
                    onChange={(e) => setFormData({...formData, bookingPeriod: e.target.value as 'week' | '2weeks' | '3weeks' | 'month'})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  >
                    {bookingData.bookingPeriods.map((period) => (
                      <option key={period.value} value={period.value}>
                        {period.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Cette réservation sera créée pour {formData.bookingPeriod === 'week' ? '1 semaine' : 
                    formData.bookingPeriod === '2weeks' ? '2 semaines' : 
                    formData.bookingPeriod === '3weeks' ? '3 semaines' : '1 mois'} à partir de la date sélectionnée
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact (Téléphone/Email) *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Numéro de téléphone ou email"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-6 py-3 text-lg bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Confirmer Réservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};