import React, { useState, useEffect } from 'react';
import { Users, XCircle, MapPin, Building, Save, RotateCcw, ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle, Calculator, TrendingUp } from 'lucide-react';
import { FirebaseBookingService, type Booking, type BookingData, type FeeCalculation } from '../services/firebaseBookingService';
import { PaymentChoiceModal } from '../components/ui/PaymentChoiceModal';

interface BookingFormData {
  teacherName: string;
  subject: string;
  studentCount: number;
  duration: number;
  contactInfo: string;
}

interface ExtendedFeeCalculation extends FeeCalculation {
  totalHours: number;
  studentCount: number;
  roomName: string;
  slotCount: number;
}

export const BookingSystem: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('1');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ date: string; timeSlot: string; id: string }[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);
  const [bookingTotal, setBookingTotal] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [availabilityCheck, setAvailabilityCheck] = useState<{
    isAvailable: boolean;
    message: string;
    suggestedSlots?: { date: string; time: string }[];
  } | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    teacherName: '',
    subject: '',
    studentCount: 1,
    duration: 1.5, // Minimum créneau duration
    contactInfo: ''
  });
  const [loading, setLoading] = useState(true);


  // Calculate total fees for bookings using Firebase service
  const calculateFees = (): ExtendedFeeCalculation | null => {
    if (!bookingData || !selectedRoom) return null;

    const bookingsToCalculate = selectedTimeSlots.length > 0 ? selectedTimeSlots : 
      (selectedDate && selectedTimeSlot ? [{ date: selectedDate, timeSlot: selectedTimeSlot, id: `${selectedDate}-${selectedTimeSlot}` }] : []);

    if (bookingsToCalculate.length === 0) return null;

    // Use Firebase service for consistent fee calculation
    const baseFeeCalculation = FirebaseBookingService.calculateBookingFees(
      selectedRoom, 
      formData.studentCount, 
      formData.duration
    );

    // Calculate number of créneaux (not time slots)
    const slotsPerCreneau = formData.duration * 2; // 2 slots per hour
    const numberOfCreneaux = Math.ceil(bookingsToCalculate.length / slotsPerCreneau);
    
    const totalHours = numberOfCreneaux * formData.duration;
    const totalSubtotalHT = baseFeeCalculation.subtotalHT * numberOfCreneaux;
    const totalVatAmount = baseFeeCalculation.vatAmount * numberOfCreneaux;
    const totalTTC = baseFeeCalculation.totalTTC * numberOfCreneaux;

    return {
      ...baseFeeCalculation,
      subtotalHT: totalSubtotalHT,
      vatAmount: totalVatAmount,
      totalTTC,
      totalHours,
      studentCount: formData.studentCount,
      roomName: bookingData.rooms[selectedRoom].name,
      slotCount: numberOfCreneaux
    };
  };

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
          
          // Set current month for month view
          const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          setCurrentMonth(monthStart.toISOString().split('T')[0]);
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
          lastUpdated: new Date().toISOString()
        };
        
        setBookingData(defaultData);
        if (!selectedDate && defaultData.startDate) {
          const startDate = new Date(defaultData.startDate);
          const monday = getWeekStart(startDate);
          setCurrentWeekStart(monday.toISOString().split('T')[0]);
          setSelectedDate(defaultData.startDate);
          
          // Set current month for month view
          const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          setCurrentMonth(monthStart.toISOString().split('T')[0]);
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

  // Helper function to get month view dates
  const getMonthDates = (): { date: string; dayName: string; dayOfWeek: number; inCurrentMonth: boolean }[] => {
    if (!currentMonth) return [];
    
    const monthStart = new Date(currentMonth);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const calendarStart = new Date(monthStart);
    const calendarEnd = new Date(monthEnd);
    
    // Start from Monday of the week containing the first day of the month
    calendarStart.setDate(monthStart.getDate() - monthStart.getDay() + 1);
    if (monthStart.getDay() === 0) calendarStart.setDate(monthStart.getDate() - 6);
    
    // End at Sunday of the week containing the last day of the month
    calendarEnd.setDate(monthEnd.getDate() + (7 - monthEnd.getDay()));
    if (monthEnd.getDay() === 0) calendarEnd.setDate(monthEnd.getDate());
    
    const dates = [];
    const current = new Date(calendarStart);
    
    while (current <= calendarEnd) {
      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      dates.push({
        date: current.toISOString().split('T')[0],
        dayName: dayNames[current.getDay()],
        dayOfWeek: current.getDay(),
        inCurrentMonth: current.getMonth() === monthStart.getMonth()
      });
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  // Helper function to check availability for a specific time slot
  const checkTimeSlotAvailability = (roomId: string, date: string, timeSlot: string, duration: number) => {
    if (!bookingData) return { isAvailable: false, message: 'Données non chargées' };
    
    // Check if the requested time slots are available
    const requiredSlots = getAffectedTimeSlots(timeSlot, duration, date);
    const hasConflict = requiredSlots.some(slot => isTimeSlotBooked(roomId, date, slot));
    
    if (hasConflict) {
      // Find alternative slots for the same day
      const dayOfWeek = new Date(date).getDay();
      const availableSlots = dayOfWeek === 0 ? bookingData.timeSlots.sunday : bookingData.timeSlots.weekdays;
      
      const alternatives = availableSlots
        .filter(slot => {
          const testSlots = getAffectedTimeSlots(slot, duration, date);
          return testSlots.length === duration * 2 && 
                 !testSlots.some(testSlot => isTimeSlotBooked(roomId, date, testSlot));
        })
        .slice(0, 3)
        .map(slot => ({ date, time: slot }));
      
      return {
        isAvailable: false,
        message: `Ce créneau n'est pas disponible. Voici des alternatives pour le même jour:`,
        suggestedSlots: alternatives
      };
    }
    
    return { isAvailable: true, message: 'Créneau disponible!' };
  };

  // Legacy function - kept for backward compatibility but unused in créneau system
  // const addTimeSlotSelection = (date: string, timeSlot: string) => {
  //   const id = `${date}-${timeSlot}`;
  //   if (!selectedTimeSlots.some(slot => slot.id === id)) {
  //     setSelectedTimeSlots(prev => [...prev, { date, timeSlot, id }]);
  //   }
  // };

  // Helper function to remove a time slot from selections
  const removeTimeSlotSelection = (id: string) => {
    setSelectedTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  // Helper function to clear all selections
  const clearAllSelections = () => {
    setSelectedTimeSlots([]);
  };

  // Helper function to check if a slot is selected
  const isSlotSelected = (date: string, timeSlot: string) => {
    const id = `${date}-${timeSlot}`;
    return selectedTimeSlots.some(slot => slot.id === id);
  };

  // Helper function to add a complete créneau (multiple consecutive time slots)
  const addCreneauSelection = (date: string, startTimeSlot: string) => {
    if (!bookingData) return;
    
    const slotsNeeded = formData.duration * 2; // 2 slots per hour (30-minute intervals)
    const timeSlots = bookingData.timeSlots[new Date(date).getDay() === 0 ? 'sunday' : 'weekdays'];
    const startIndex = timeSlots.indexOf(startTimeSlot);
    
    
    if (startIndex === -1 || startIndex + slotsNeeded > timeSlots.length) {
      setAvailabilityCheck({
        isAvailable: false,
        message: `Impossible de réserver un créneau de ${formData.duration}h à cette heure. Pas assez de créneaux consécutifs disponibles.`,
        suggestedSlots: []
      });
      return;
    }

    // Check if any of the required slots are already booked
    for (let i = 0; i < slotsNeeded; i++) {
      const timeSlot = timeSlots[startIndex + i];
      if (isTimeSlotBooked(selectedRoom, date, timeSlot)) {
        setAvailabilityCheck({
          isAvailable: false,
          message: `Créneau de ${formData.duration}h non disponible. Conflit détecté au créneau ${timeSlot}.`,
          suggestedSlots: []
        });
        return;
      }
    }

    // Add all consecutive time slots for this créneau
    const creneauSlots: { date: string; timeSlot: string; id: string }[] = [];
    for (let i = 0; i < slotsNeeded; i++) {
      const timeSlot = timeSlots[startIndex + i];
      const id = `${date}-${timeSlot}`;
      creneauSlots.push({ date, timeSlot, id });
    }

    setSelectedTimeSlots(prev => {
      // Remove any existing slots for this date/time to avoid duplicates
      const filtered = prev.filter(slot => 
        !creneauSlots.some(creneauSlot => creneauSlot.id === slot.id)
      );
      return [...filtered, ...creneauSlots];
    });
  };

  // Helper function to remove a complete créneau
  const removeCreneauSelection = (date: string, startTimeSlot: string) => {
    if (!bookingData) return;
    
    const slotsNeeded = formData.duration * 2; // 2 slots per hour (30-minute intervals)
    const timeSlots = bookingData.timeSlots[new Date(date).getDay() === 0 ? 'sunday' : 'weekdays'];
    const startIndex = timeSlots.indexOf(startTimeSlot);
    
    if (startIndex === -1) return;

    // Remove all consecutive time slots for this créneau
    const slotsToRemove: string[] = [];
    for (let i = 0; i < slotsNeeded && startIndex + i < timeSlots.length; i++) {
      const timeSlot = timeSlots[startIndex + i];
      const id = `${date}-${timeSlot}`;
      slotsToRemove.push(id);
    }

    setSelectedTimeSlots(prev => 
      prev.filter(slot => !slotsToRemove.includes(slot.id))
    );
  };

  // Helper function to check if a complete créneau can be booked
  const checkCreneauAvailability = (roomId: string, date: string, startTimeSlot: string, duration: number) => {
    if (!bookingData) {
      return { 
        isAvailable: false, 
        message: "Données de réservation non disponibles.",
        suggestedSlots: []
      };
    }
    
    const slotsNeeded = duration * 2; // 2 slots per hour (30-minute intervals)
    const timeSlots = bookingData.timeSlots[new Date(date).getDay() === 0 ? 'sunday' : 'weekdays'];
    const startIndex = timeSlots.indexOf(startTimeSlot);
    
    if (startIndex === -1) {
      return { 
        isAvailable: false, 
        message: "Créneau horaire invalide.",
        suggestedSlots: []
      };
    }

    if (startIndex + slotsNeeded > timeSlots.length) {
      return { 
        isAvailable: false, 
        message: `Impossible de réserver un créneau de ${duration}h à cette heure. Pas assez de créneaux consécutifs disponibles.`,
        suggestedSlots: []
      };
    }

    // Check if all required consecutive slots are available
    const conflictingSlots = [];
    for (let i = 0; i < slotsNeeded; i++) {
      const timeSlot = timeSlots[startIndex + i];
      const slotAvailability = checkTimeSlotAvailability(roomId, date, timeSlot, 0.5); // Check each 30-minute slot
      
      if (!slotAvailability.isAvailable) {
        conflictingSlots.push(timeSlot);
      }
    }

    if (conflictingSlots.length > 0) {
      return { 
        isAvailable: false, 
        message: `Créneau de ${duration}h non disponible. Conflit détecté aux heures: ${conflictingSlots.join(', ')}.`,
        suggestedSlots: []
      };
    }
    
    return { isAvailable: true, message: `Créneau de ${duration}h disponible!` };
  };

  // Helper function to batch check availability for all créneaux to be created
  const checkBatchAvailability = () => {
    const conflicts: { date: string; timeSlot: string; message: string }[] = [];

    // Group time slots into créneaux for proper validation
    const slotsPerCreneau = formData.duration * 2; // 2 slots per hour
    const creneauxToCheck = [];

    if (selectedTimeSlots.length > 0) {
      // Group selected time slots into créneaux
      for (let i = 0; i < selectedTimeSlots.length; i += slotsPerCreneau) {
        const creneauSlots = selectedTimeSlots.slice(i, i + slotsPerCreneau);
        const firstSlot = creneauSlots[0];
        creneauxToCheck.push({
          date: firstSlot.date,
          timeSlot: firstSlot.timeSlot, // Start time of the créneau
          duration: formData.duration
        });
      }
    } else if (selectedDate && selectedTimeSlot) {
      // Single créneau selection
      creneauxToCheck.push({
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        duration: formData.duration
      });
    }

    // Check availability for each créneau properly
    creneauxToCheck.forEach(creneau => {
      const availability = checkCreneauAvailability(selectedRoom, creneau.date, creneau.timeSlot, creneau.duration);
      if (!availability.isAvailable) {
        conflicts.push({
          date: creneau.date,
          timeSlot: creneau.timeSlot,
          message: availability.message
        });
      }
    });

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
      availableCount: creneauxToCheck.length - conflicts.length,
      totalCreneaux: creneauxToCheck.length
    };
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
    
    // Check if this specific time slot is booked by any active booking
    // IMPORTANT: Exclude cancelled bookings so they appear available to users
    const bookings = Object.values(bookingData.bookings);
    return bookings.some(booking => {
      if (!booking || booking.roomId !== roomId || booking.date !== date) return false;
      
      // Skip cancelled bookings - they should appear available to users
      if (booking.paymentStatus === 'cancelled') return false;
      
      // Check if this time slot falls within any existing active booking's duration
      const affectedSlots = getAffectedTimeSlots(booking.timeSlot, booking.duration, date);
      return affectedSlots.includes(timeSlot);
    });
  };


  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData || !selectedRoom) return;

    // Group time slots into créneaux for booking creation
    const slotsPerCreneau = formData.duration * 2; // 2 slots per hour
    const creneauxToCreate = [];
    
    if (selectedTimeSlots.length > 0) {
      // Group selected time slots into créneaux
      for (let i = 0; i < selectedTimeSlots.length; i += slotsPerCreneau) {
        const creneauSlots = selectedTimeSlots.slice(i, i + slotsPerCreneau);
        const firstSlot = creneauSlots[0];
        creneauxToCreate.push({
          date: firstSlot.date,
          timeSlot: firstSlot.timeSlot, // Start time of the créneau
          duration: formData.duration
        });
      }
    } else if (selectedDate && selectedTimeSlot) {
      // Single créneau
      creneauxToCreate.push({
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        duration: formData.duration
      });
    }

    if (creneauxToCreate.length === 0) return;

    // Final availability check for all créneaux
    if (selectedTimeSlots.length > 0) {
      const finalCheck = checkBatchAvailability();
      if (finalCheck.hasConflicts) {
        alert(`Certains créneaux ne sont plus disponibles. Veuillez actualiser votre sélection.`);
        return;
      }
    }

    let successCount = 0;
    try {
      const results = [];

      for (const creneau of creneauxToCreate) {
        const newBooking: Omit<Booking, 'id'> = {
          roomId: selectedRoom,
          date: creneau.date,
          timeSlot: creneau.timeSlot,
          teacherName: formData.teacherName,
          subject: formData.subject,
          studentCount: formData.studentCount,
          duration: creneau.duration,
          contactInfo: formData.contactInfo,
          bookingDate: new Date().toISOString(),
          paymentStatus: 'pending' // New bookings start as pending
        };

        try {
          // Save booking to Firebase
          const bookingId = await FirebaseBookingService.createBooking(newBooking);
          if (bookingId) {
            results.push({ success: true, creneau, bookingId });
            successCount++;
          } else {
            results.push({ success: false, creneau, error: 'No booking ID returned' });
          }
        } catch (error) {
          console.error(`Failed to save booking for ${creneau.date} ${creneau.timeSlot}:`, error);
          results.push({ success: false, creneau, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }

      // Show payment choice modal for successful bookings
      if (successCount === creneauxToCreate.length) {
        // Calculate total amount for successful bookings
        const feeCalc = calculateFees();
        const totalAmount = feeCalc ? feeCalc.totalTTC : 0;
        
        setBookingTotal(totalAmount);
        setBookingCount(successCount);
        setShowPaymentChoice(true);
      } else {
        alert(`⚠️ ${successCount}/${creneauxToCreate.length} réservations créées avec succès. Certaines réservations ont échoué.`);
      }

      console.log('Booking results:', results);

    } catch (error) {
      console.error('Failed to process bookings:', error);
      alert('Erreur lors de la sauvegarde des réservations. Veuillez réessayer.');
      return;
    }
    
    // Only reset form and close modals if there were errors
    // For successful bookings, this will be handled by the payment modal's onClose
    if (successCount !== creneauxToCreate.length) {
      setFormData({
        teacherName: '',
        subject: '',
        studentCount: 1,
        duration: 1.5,
        contactInfo: ''
      });
      setShowBookingForm(false);
      setShowTimeSlots(false);
      setShowConfirmation(false);
      setAvailabilityCheck(null);
      setSelectedTimeSlot('');
      setSelectedTimeSlots([]);
    }
  };

  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
    setShowTimeSlots(true);
    setAvailabilityCheck(null);
  };

  const handleTimeSlotSelection = (timeSlot: string) => {
    if (!selectedDate || !formData.duration) return;
    
    // Validate créneau duration (1.5h to 3h only)
    if (formData.duration < 1.5 || formData.duration > 3.0) {
      setAvailabilityCheck({
        isAvailable: false,
        message: "La durée d'un créneau doit être entre 1h30 (minimum) et 3h00 (maximum).",
        suggestedSlots: []
      });
      return;
    }
    
    const isSelected = isSlotSelected(selectedDate, timeSlot);
    
    if (isSelected) {
      // Remove entire créneau from selection
      removeCreneauSelection(selectedDate, timeSlot);
    } else {
      // Check if we can book a complete créneau starting at this time slot
      const availability = checkCreneauAvailability(selectedRoom, selectedDate, timeSlot, formData.duration);
      
      if (availability.isAvailable) {
        addCreneauSelection(selectedDate, timeSlot);
      } else {
        setAvailabilityCheck(availability);
      }
    }
  };

  const handleConfirmSelections = () => {
    if (selectedTimeSlots.length === 0) return;
    
    const batchCheck = checkBatchAvailability();
    
    if (batchCheck.hasConflicts) {
      setAvailabilityCheck({
        isAvailable: false,
        message: `${batchCheck.conflicts.length}/${batchCheck.totalCreneaux} créneaux ne sont plus disponibles. ${batchCheck.availableCount} créneaux restent disponibles.`,
        suggestedSlots: []
      });
    } else {
      setShowTimeSlots(false);
      setShowConfirmation(true);
    }
  };

  const handleAlternativeSlotSelection = (date: string, timeSlot: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setAvailabilityCheck(null);
    setShowBookingForm(true);
    setShowTimeSlots(false);
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (!currentMonth) return;
    
    const current = new Date(currentMonth);
    const newDate = new Date(current.getFullYear(), current.getMonth() + (direction === 'next' ? 1 : -1), 1);
    
    setCurrentMonth(newDate.toISOString().split('T')[0]);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'week' ? 'month' : 'week');
    setShowTimeSlots(false);
    setAvailabilityCheck(null);
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
  const monthDates = getMonthDates();
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Configuration de Réservation</h2>
              
              {/* Room Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">Salle de cours</label>
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

              {/* Duration Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">Durée de Session</label>
                <div className="flex justify-center">
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseFloat(e.target.value)})}
                    className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  >
                    <option value={1.5}>1h30 (Créneau minimum)</option>
                    <option value={2}>2h00</option>
                    <option value={2.5}>2h30</option>
                    <option value={3}>3h00 (Créneau maximum)</option>
                  </select>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Un créneau = période d'enseignement complète<br/>
                  <span className="text-blue-600 font-medium">Ex: 2h = 4 plages horaires de 30 min consécutifs (8:00-9:00 puis 9:00-10:00)</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={toggleViewMode}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Vue {viewMode === 'week' ? 'Mensuelle' : 'Hebdomadaire'}
                </button>
                
                <button
                  onClick={() => setShowCalculator(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-200"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculateur de Frais
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar View */}
      <section className="pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Calendrier - {bookingData.rooms[selectedRoom].name}
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateMonth('prev')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  
                  <div className="text-center min-w-48">
                    {viewMode === 'week' ? (
                      <div className="text-lg font-semibold text-gray-900">
                        Semaine du {currentWeekStart && new Date(currentWeekStart).toLocaleDateString('fr-FR')}
                      </div>
                    ) : (
                      <div className="text-lg font-semibold text-gray-900">
                        {currentMonth && new Date(currentMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateMonth('next')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Week View */}
              {viewMode === 'week' && (
                <div>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                      <div key={day} className="p-2 text-center font-bold text-gray-600 bg-gray-50 rounded-lg">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((dayInfo) => {
                      const hasBookings = Object.values(bookingData.bookings || {}).some(
                        booking => booking && booking.roomId === selectedRoom && booking.date === dayInfo.date && booking.paymentStatus !== 'cancelled'
                      );
                      
                      return (
                        <button
                          key={dayInfo.date}
                          onClick={() => handleDateSelection(dayInfo.date)}
                          className={`p-6 rounded-xl text-center transition-all duration-200 border-2 ${
                            selectedDate === dayInfo.date
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : hasBookings
                              ? 'border-orange-300 bg-orange-50 text-orange-700 hover:border-orange-400'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-25'
                          }`}
                        >
                          <div className="font-bold text-lg">{new Date(dayInfo.date).getDate()}</div>
                          <div className="text-xs mt-1">{dayInfo.dayName}</div>
                          {hasBookings && (
                            <div className="w-2 h-2 bg-orange-400 rounded-full mx-auto mt-1"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Month View */}
              {viewMode === 'month' && (
                <div>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                      <div key={day} className="p-2 text-center font-bold text-gray-600 bg-gray-50 rounded-lg">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {monthDates.map((dayInfo) => {
                      const hasBookings = Object.values(bookingData.bookings || {}).some(
                        booking => booking && booking.roomId === selectedRoom && booking.date === dayInfo.date && booking.paymentStatus !== 'cancelled'
                      );
                      
                      return (
                        <button
                          key={dayInfo.date}
                          onClick={() => dayInfo.inCurrentMonth && handleDateSelection(dayInfo.date)}
                          disabled={!dayInfo.inCurrentMonth}
                          className={`p-4 rounded-xl text-center transition-all duration-200 border-2 min-h-16 ${
                            !dayInfo.inCurrentMonth
                              ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                              : selectedDate === dayInfo.date
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : hasBookings
                              ? 'border-orange-300 bg-orange-50 text-orange-700 hover:border-orange-400'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-25'
                          }`}
                        >
                          <div className="font-bold">{new Date(dayInfo.date).getDate()}</div>
                          {hasBookings && dayInfo.inCurrentMonth && (
                            <div className="w-2 h-2 bg-orange-400 rounded-full mx-auto mt-1"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Time Slot Selection Modal */}
      {showTimeSlots && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Sélectionnez vos Plages Horaires</h3>
                  <p className="text-gray-600">
                    {selectedDate && new Date(selectedDate).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} - Durée: {formData.duration}h
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    {Math.ceil(selectedTimeSlots.length / (formData.duration * 2))} plage{Math.ceil(selectedTimeSlots.length / (formData.duration * 2)) > 1 ? 's' : ''} horaire{Math.ceil(selectedTimeSlots.length / (formData.duration * 2)) > 1 ? 's' : ''} sélectionnée{Math.ceil(selectedTimeSlots.length / (formData.duration * 2)) > 1 ? 's' : ''} - Cliquez pour ajouter/retirer
                  </p>
                </div>
                <button
                  onClick={() => setShowTimeSlots(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Selected Slots Summary */}
              {selectedTimeSlots.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">Plages Horaires Sélectionnées:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTimeSlots.map((slot) => (
                      <span
                        key={slot.id}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} - {slot.timeSlot}
                        <button
                          onClick={() => removeTimeSlotSelection(slot.id)}
                          className="ml-2 w-4 h-4 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {availableTimeSlots.map((timeSlot, index) => {
                  const isSelected = isSlotSelected(selectedDate, timeSlot);
                  const isBooked = isTimeSlotBooked(selectedRoom, selectedDate, timeSlot);
                  
                  return (
                    <button
                      key={timeSlot}
                      onClick={() => handleTimeSlotSelection(timeSlot)}
                      disabled={isBooked}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center font-semibold ${
                        isBooked
                          ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'border-green-400 bg-green-50 text-green-700'
                          : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100'
                      }`}
                    >
                      <Clock className="w-4 h-4 mb-1" />
                      <div className="text-sm">
                        {(() => {
                          const nextTimeSlot = availableTimeSlots[index + 1];
                          if (nextTimeSlot) {
                            return `${timeSlot}-${nextTimeSlot}`;
                          } else {
                            // Calculate next 30-minute slot for the last slot
                            const [hours, minutes] = timeSlot.split(':').map(Number);
                            const nextHour = minutes === 30 ? hours + 1 : hours;
                            const nextMinutes = minutes === 30 ? 0 : 30;
                            const endTime = `${nextHour.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`;
                            return `${timeSlot}-${endTime}`;
                          }
                        })()}
                      </div>
                      {isSelected && (
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Sélectionné
                        </div>
                      )}
                      {isBooked && (
                        <div className="text-xs text-red-400 mt-1">
                          Occupé
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={clearAllSelections}
                  disabled={selectedTimeSlots.length === 0}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                >
                  Tout Effacer
                </button>
                
                <div className="space-x-4">
                  <button
                    onClick={() => setShowTimeSlots(false)}
                    className="px-6 py-3 text-lg bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={handleConfirmSelections}
                    disabled={selectedTimeSlots.length === 0}
                    className="px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmer {Math.ceil(selectedTimeSlots.length / (formData.duration * 2))} Créneau{Math.ceil(selectedTimeSlots.length / (formData.duration * 2)) > 1 ? 'x' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Availability Check Modal */}
      {availabilityCheck && !availabilityCheck.isAvailable && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <AlertCircle className="w-8 h-8 text-orange-500 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Créneau Non Disponible</h3>
                  <p className="text-gray-600">{availabilityCheck.message}</p>
                </div>
              </div>

              {availabilityCheck.suggestedSlots && availabilityCheck.suggestedSlots.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Créneaux Alternatifs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {availabilityCheck.suggestedSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleAlternativeSlotSelection(slot.date, slot.time)}
                        className="p-4 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100 transition-all duration-200"
                      >
                        <div className="flex items-center justify-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {slot.time}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setAvailabilityCheck(null);
                    setShowTimeSlots(true);
                  }}
                  className="px-6 py-3 text-lg bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200"
                >
                  Choisir un Autre Créneau
                </button>
                <button
                  onClick={() => setAvailabilityCheck(null)}
                  className="px-6 py-3 text-lg bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Multiple Bookings */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Confirmer vos Réservations</h3>
                  <p className="text-gray-600">
                    {Math.ceil(selectedTimeSlots.length / (formData.duration * 2))} plage{Math.ceil(selectedTimeSlots.length / (formData.duration * 2)) > 1 ? 's' : ''} horaire{Math.ceil(selectedTimeSlots.length / (formData.duration * 2)) > 1 ? 's' : ''} sélectionnée{Math.ceil(selectedTimeSlots.length / (formData.duration * 2)) > 1 ? 's' : ''} dans {bookingData.rooms[selectedRoom].name}
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Selected Slots Summary with Fees */}
              <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-gray-900">Récapitulatif des Plages Horaires</h4>
                  <button
                    onClick={() => setShowCalculator(true)}
                    className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-semibold transition-colors flex items-center"
                  >
                    <Calculator className="w-4 h-4 mr-1" />
                    Calculateur
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {(() => {
                    // Group time slots into créneaux based on duration
                    const slotsPerCreneau = formData.duration * 2; // 2 slots per hour
                    const creneaux = [];
                    
                    for (let i = 0; i < selectedTimeSlots.length; i += slotsPerCreneau) {
                      const creneauSlots = selectedTimeSlots.slice(i, i + slotsPerCreneau);
                      const firstSlot = creneauSlots[0];
                      
                      // Calculate end time for the créneau
                      const startTime = firstSlot.timeSlot;
                      const [hours, minutes] = startTime.split(':').map(Number);
                      const totalMinutes = hours * 60 + minutes + (formData.duration * 60);
                      const endHours = Math.floor(totalMinutes / 60);
                      const endMinutes = totalMinutes % 60;
                      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                      
                      creneaux.push({
                        id: `creneau-${i}`,
                        date: firstSlot.date,
                        startTime,
                        endTime,
                        duration: formData.duration,
                        slotCount: creneauSlots.length
                      });
                    }
                    
                    return creneaux.map((creneau, index) => (
                      <div key={creneau.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div>
                          <div className="font-semibold text-gray-900">
                            Créneau #{index + 1}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(creneau.date).toLocaleDateString('fr-FR', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </div>
                          <div className="text-sm font-medium text-blue-600">
                            {creneau.startTime} - {creneau.endTime} ({creneau.duration}h)
                          </div>
                        </div>
                        <Clock className="w-5 h-5 text-blue-500" />
                      </div>
                    ));
                  })()}
                </div>

                {/* Fees Preview */}
                {(() => {
                  const calculation = calculateFees();
                  if (calculation) {
                    return (
                      <div className="p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                        <h5 className="font-bold text-green-800 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Estimation des Frais
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="text-center">
                            <div className="text-gray-600">Tarif</div>
                            <div className="font-bold text-blue-600">{calculation.hourlyRate} TND/h</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600">Total Heures</div>
                            <div className="font-bold text-purple-600">{calculation.totalHours}h</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600">Sous-total HT</div>
                            <div className="font-bold text-gray-800">{calculation.subtotalHT.toFixed(0)} TND</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600">Total TTC</div>
                            <div className="font-bold text-green-600">{calculation.totalTTC.toFixed(0)} TND</div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Teacher Information Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                handleBookingSubmit(e);
              }} className="space-y-6">
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
                    <option value="Sciences de la Vie et de la Terre">Sciences de la Vie et de la Terre</option>
                    <option value="Arabe">Arabe</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Économie & Gestion">Économie & Gestion</option>
                    <option value="ESP">ESP</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

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
                    onClick={() => setShowConfirmation(false)}
                    className="px-6 py-3 text-lg bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Modifier Sélection
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Confirmer {Math.ceil(selectedTimeSlots.length / (formData.duration * 2))} Créneau{Math.ceil(selectedTimeSlots.length / (formData.duration * 2)) > 1 ? 'x' : ''}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Rental Fees Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Calculator className="w-8 h-8 text-green-600 mr-3" />
                    Calculateur de Frais de Location
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Estimez vos coûts de location avec TVA incluse
                  </p>
                </div>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Current Configuration */}
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building className="w-6 h-6 text-blue-600 mr-2" />
                  Configuration Actuelle
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Salle Sélectionnée</div>
                    <div className="text-lg font-bold text-blue-600">
                      {bookingData?.rooms[selectedRoom]?.name || 'Aucune'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Durée de Session</div>
                    <div className="text-lg font-bold text-purple-600">
                      {formData.duration}h
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Nombre d'Étudiants</div>
                    <div className="text-lg font-bold text-green-600">
                      {formData.studentCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculator Form */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Paramètres de Calcul</h4>
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre d'Étudiants (affecte le tarif)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={bookingData?.rooms[selectedRoom]?.capacity || 15}
                      value={formData.studentCount}
                      onChange={(e) => setFormData({...formData, studentCount: parseInt(e.target.value) || 1})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Fee Calculation Results */}
              {(() => {
                const calculation = calculateFees();
                if (!calculation) {
                  return (
                    <div className="p-6 bg-gray-50 rounded-xl text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        Sélectionnez des créneaux ou configurez votre réservation pour voir le calcul des frais
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                      Estimation des Frais
                    </h4>
                    
                    {/* Calculation Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-gray-700">Tarif Horaire:</span>
                          <span className="font-bold text-blue-600">{calculation.hourlyRate} TND/h</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-gray-700">Total Heures:</span>
                          <span className="font-bold text-purple-600">{calculation.totalHours}h</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-gray-700">Créneaux Réservés:</span>
                          <span className="font-bold text-orange-600">{calculation.slotCount} créneau{calculation.slotCount > 1 ? 'x' : ''}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-gray-700">Sous-total (HT):</span>
                          <span className="font-bold text-gray-800">{calculation.subtotalHT.toFixed(3)} TND</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-gray-700">TVA (19%):</span>
                          <span className="font-bold text-orange-600">+{calculation.vatAmount.toFixed(3)} TND</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg">
                          <span className="font-bold text-lg">Total (TTC):</span>
                          <span className="font-bold text-2xl">{calculation.totalTTC.toFixed(3)} TND</span>
                        </div>
                      </div>
                    </div>

                    {/* Current Rate Information */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-900 mb-2">Tarif Actuel</h5>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-800">
                          {FirebaseBookingService.getHourlyRate(selectedRoom, formData.studentCount)} TND/h
                        </div>
                        <div className="text-sm text-blue-600">
                          Pour {formData.studentCount} étudiant{formData.studentCount > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

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
                    <option value="Sciences de la Vie et de la Terre">Sciences de la Vie et de la Terre</option>
                    <option value="Arabe">Arabe</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Économie & Gestion">Économie & Gestion</option>
                    <option value="ESP">ESP</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Durée du Créneau *</label>
                  <select
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseFloat(e.target.value)})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  >
                    <option value={1.5}>1h30 (90 minutes) - Minimum</option>
                    <option value={2.0}>2h00 (120 minutes)</option>
                    <option value={2.5}>2h30 (150 minutes)</option>
                    <option value={3.0}>3h00 (180 minutes) - Maximum</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Un créneau = période d'enseignement (minimum 1h30, maximum 3h00)</p>
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

      {/* Payment Choice Modal */}
      <PaymentChoiceModal
        isOpen={showPaymentChoice}
        onClose={() => {
          setShowPaymentChoice(false);
          // Reset form and close all modals after payment choice
          setFormData({
            teacherName: '',
            subject: '',
            studentCount: 1,
            duration: 1.5,
            contactInfo: ''
          });
          setShowBookingForm(false);
          setShowTimeSlots(false);
          setShowConfirmation(false);
          setAvailabilityCheck(null);
          setSelectedTimeSlot('');
          setSelectedTimeSlots([]);
        }}
        totalAmount={bookingTotal}
        bookingCount={bookingCount}
      />
    </div>
  );
};