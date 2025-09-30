// Firebase Realtime Database service for multi-user booking system
// Provides centralized booking storage that syncs across all devices
// Using Firebase CDN - No npm installation required!

import { database, initializeFirebase } from '../config/firebase';

// Fee calculation interface
interface FeeCalculation {
  subtotalHT: number; // Amount before VAT
  vatAmount: number; // 19% VAT amount
  totalTTC: number; // Total with VAT included
  hourlyRate: number; // Rate per hour for this booking
  vatRate: number; // VAT rate used (0.19)
}

// Booking interfaces
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
  createdBy?: string; // Teacher identifier
  feeCalculation?: FeeCalculation; // Fee breakdown
  paymentStatus?: 'pending' | 'paid' | 'cancelled'; // Payment tracking
  paymentMethod?: 'online' | 'offline'; // Payment method selection
  paymentTransactionId?: string; // Payment gateway transaction ID
  paymentTimestamp?: string; // When payment was confirmed
  createdAt?: string; // ISO timestamp when booking was created
  updatedAt?: string; // ISO timestamp when booking was last modified
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
  lastUpdated: string;
}

// Default data structure
const getDefaultBookingData = (): BookingData => ({
  rooms: {
    "1": { name: "Salle 1", capacity: 15 },
    "2": { name: "Salle 2", capacity: 9 },
    "3": { name: "Salle 3", capacity: 9 }
  },
  bookings: {},
  timeSlots: {
    "weekdays": [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
      "18:00", "18:30", "19:00", "19:30"
    ],
    "sunday": [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30"
    ]
  },
  weekDays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
  startDate: "2025-09-15", // September 15th, 2025
  lastUpdated: new Date().toISOString()
});

// Export interfaces for use in components
export type { Booking, BookingData, FeeCalculation };

export class FirebaseBookingService {
  private static initialized = false;

  // Room pricing data (synchronized with Rooms.tsx)
  private static roomPricing = [
    {
      roomId: '1',
      pricing: [
        { capacity: 'Individuel (1 apprenant)', rate: 20, minStudents: 1, maxStudents: 1 },
        { capacity: '2-6 personnes', rate: 25, minStudents: 2, maxStudents: 6 },
        { capacity: '7-9 personnes', rate: 30, minStudents: 7, maxStudents: 9 },
        { capacity: '10-15 personnes', rate: 35, minStudents: 10, maxStudents: 15 }
      ]
    },
    {
      roomId: '2',
      pricing: [
        { capacity: 'Individuel (1 apprenant)', rate: 15, minStudents: 1, maxStudents: 1 },
        { capacity: '2-7 personnes', rate: 20, minStudents: 2, maxStudents: 7 },
        { capacity: '8-9 personnes', rate: 25, minStudents: 8, maxStudents: 9 }
      ]
    },
    {
      roomId: '3',
      pricing: [
        { capacity: 'Individuel (1 apprenant)', rate: 15, minStudents: 1, maxStudents: 1 },
        { capacity: '2-7 personnes', rate: 20, minStudents: 2, maxStudents: 7 },
        { capacity: '8-9 personnes', rate: 25, minStudents: 8, maxStudents: 9 }
      ]
    }
  ];

  // VAT rate (Tunisia standard rate)
  private static VAT_RATE = 0.19;

  // Calculate hourly rate based on room and student count
  static getHourlyRate(roomId: string, studentCount: number): number {
    const roomPricingData = this.roomPricing.find(room => room.roomId === roomId);
    if (!roomPricingData) return 0;

    // Find the appropriate pricing tier
    const tier = roomPricingData.pricing.find(
      p => studentCount >= p.minStudents && studentCount <= p.maxStudents
    );

    return tier ? tier.rate : roomPricingData.pricing[roomPricingData.pricing.length - 1].rate;
  }

  // Calculate fee breakdown for a créneau booking
  // Note: Duration must be validated (1.5h-3h) before calling this method
  static calculateBookingFees(roomId: string, studentCount: number, duration: number): FeeCalculation {
    // Validate duration range (defensive programming)
    const validation = this.validateCreneauDuration(duration);
    if (!validation.isValid) {
      throw new Error(`Invalid créneau duration: ${validation.message}`);
    }

    const hourlyRate = this.getHourlyRate(roomId, studentCount);
    const subtotalHT = hourlyRate * duration; // Duration is in hours (1.5, 2.0, 2.5, 3.0)
    const vatAmount = subtotalHT * this.VAT_RATE;
    const totalTTC = subtotalHT + vatAmount;

    return {
      subtotalHT,
      vatAmount,
      totalTTC,
      hourlyRate,
      vatRate: this.VAT_RATE
    };
  }

  // Initialize Firebase database with default data if needed
  static async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    // Ensure Firebase is initialized
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      console.error('Firebase database not available');
      return false;
    }

    try {
      const dbRef = database.ref('/');
      const snapshot = await dbRef.once('value');

      if (!snapshot.exists()) {
        // Initialize with default data
        const defaultData = getDefaultBookingData();
        await dbRef.set(defaultData);
        console.log('Firebase initialized with default booking data');
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      return false;
    }
  }

  // Load all booking data
  static async loadBookingData(): Promise<BookingData> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      throw new Error('Firebase not available');
    }

    try {
      const dbRef = database.ref('/');
      const snapshot = await dbRef.once('value');

      if (snapshot.exists()) {
        return snapshot.val() as BookingData;
      }

      // Initialize with default data if empty
      const defaultData = getDefaultBookingData();
      await dbRef.set(defaultData);
      return defaultData;
    } catch (error) {
      console.error('Failed to load Firebase data:', error);
      throw error;
    }
  }

  // Validate créneau duration (business rule: 1.5h to 3h only)
  static validateCreneauDuration(duration: number): { isValid: boolean; message: string } {
    if (duration < 1.5) {
      return { isValid: false, message: 'La durée minimale d\'un créneau est de 1h30 (90 minutes).' };
    }
    if (duration > 3.0) {
      return { isValid: false, message: 'La durée maximale d\'un créneau est de 3h00 (180 minutes).' };
    }
    if (duration % 0.5 !== 0) {
      return { isValid: false, message: 'La durée d\'un créneau doit être un multiple de 30 minutes (0.5h).' };
    }
    return { isValid: true, message: 'Durée de créneau valide.' };
  }

  // Create a new booking
  static async createBooking(booking: Omit<Booking, 'id'>): Promise<string | null> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      throw new Error('Firebase not available');
    }

    try {
      // Validate créneau duration first
      const durationValidation = this.validateCreneauDuration(booking.duration);
      if (!durationValidation.isValid) {
        throw new Error(durationValidation.message);
      }

      // Check for conflicts first
      const hasConflict = await this.checkBookingConflict(booking.roomId, booking.date, booking.timeSlot);
      if (hasConflict) {
        throw new Error('Time slot already booked');
      }

      const bookingsRef = database.ref('bookings');
      const newBookingRef = bookingsRef.push();

      // Calculate fees for this booking
      const feeCalculation = this.calculateBookingFees(booking.roomId, booking.studentCount, booking.duration);

      const bookingWithId: Booking = {
        ...booking,
        id: newBookingRef.key!,
        bookingDate: new Date().toISOString(),
        createdBy: booking.teacherName, // Simple teacher identification
        feeCalculation, // Store fee breakdown
        paymentStatus: booking.paymentStatus || 'pending', // Preserve provided status or default to pending
        createdAt: new Date().toISOString(), // Track creation time
        updatedAt: new Date().toISOString() // Track last modification
      };

      await newBookingRef.set(bookingWithId);

      // Update last modified timestamp
      await database.ref('lastUpdated').set(new Date().toISOString());

      return newBookingRef.key;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  }

  // Cancel a booking
  static async cancelBooking(bookingId: string): Promise<boolean> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      throw new Error('Firebase not available');
    }

    try {
      const bookingRef = database.ref(`bookings/${bookingId}`);
      await bookingRef.remove();
      
      // Update last modified timestamp
      await database.ref('lastUpdated').set(new Date().toISOString());
      
      return true;
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      return false;
    }
  }


  // Check for booking conflicts (updated for date-based system)
  static async checkBookingConflict(roomId: string, date: string, timeSlot: string): Promise<boolean> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      return false;
    }

    try {
      const bookingsRef = database.ref('bookings');
      const snapshot = await bookingsRef.once('value');
      
      if (snapshot.exists()) {
        const bookings = snapshot.val();
        
        // Check if any ACTIVE booking matches room, date, and time slot
        // Exclude cancelled bookings so they don't block new reservations
        const bookingsArray = Object.values(bookings as Record<string, Booking>);
        return bookingsArray.some((booking: Booking) => 
          booking.roomId === roomId && 
          booking.date === date && 
          booking.timeSlot === timeSlot &&
          booking.paymentStatus !== 'cancelled' // Allow booking over cancelled slots
        );
      }
      
      return false;
    } catch (error) {
      console.error('Failed to check booking conflict:', error);
      return false;
    }
  }

  // Get bookings for a specific room and date
  static async getBookingsForRoomAndDate(roomId: string, date: string): Promise<Booking[]> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      return [];
    }

    try {
      const bookingsRef = database.ref('bookings');
      const snapshot = await bookingsRef.once('value');
      
      if (snapshot.exists()) {
        const bookings = snapshot.val();
        
        const bookingsArray = Object.values(bookings as Record<string, Booking>);
        return bookingsArray.filter((booking: Booking) => 
          booking.roomId === roomId && booking.date === date
        );
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get bookings:', error);
      return [];
    }
  }


  // Subscribe to real-time updates
  static async subscribeToBookingUpdates(callback: (data: BookingData) => void): Promise<() => void> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      console.error('Firebase not available for subscriptions');
      return () => {};
    }

    const dbRef = database.ref('/');

    const unsubscribe = dbRef.on('value', (snapshot: { exists: () => boolean; val: () => unknown }) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as BookingData);
      }
    });

    return () => {
      dbRef.off('value', unsubscribe);
    };
  }

  // Export booking data for backup
  static async exportBookingData(): Promise<string> {
    try {
      const data = await this.loadBookingData();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export booking data:', error);
      throw error;
    }
  }

  // Clear all booking data (admin function)
  static async clearAllBookings(): Promise<boolean> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      return false;
    }

    try {
      const bookingsRef = database.ref('bookings');
      await bookingsRef.set({});
      
      // Update last modified timestamp
      await database.ref('lastUpdated').set(new Date().toISOString());
      
      return true;
    } catch (error) {
      console.error('Failed to clear bookings:', error);
      return false;
    }
  }

  // Bulk delete multiple bookings (admin function)
  static async bulkDeleteBookings(bookingIds: string[]): Promise<{ success: boolean; deletedCount: number; errors: string[] }> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      return { success: false, deletedCount: 0, errors: ['Firebase not available'] };
    }

    const errors: string[] = [];
    let deletedCount = 0;

    try {
      const bookingsRef = database.ref('bookings');
      
      // Create batch updates object
      const updates: Record<string, null> = {};
      
      for (const bookingId of bookingIds) {
        updates[bookingId] = null; // Setting to null deletes the key
      }
      
      // Execute batch delete
      await bookingsRef.update(updates);
      deletedCount = bookingIds.length;
      
      // Update last modified timestamp
      await database.ref('lastUpdated').set(new Date().toISOString());
      
      return { success: true, deletedCount, errors };
    } catch (error) {
      console.error('Failed to bulk delete bookings:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
      return { success: false, deletedCount, errors };
    }
  }

  // Update booking payment status (admin function)
  static async updatePaymentStatus(bookingId: string, status: 'pending' | 'paid' | 'cancelled'): Promise<boolean> {
    console.log(`🔥 Firebase Service: updatePaymentStatus called for ${bookingId} → ${status}`);
    
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      console.error('❌ Firebase Service: Firebase not initialized or database unavailable');
      return false;
    }

    try {
      console.log(`📍 Firebase Service: Creating booking reference for path bookings/${bookingId}`);
      const bookingRef = database.ref(`bookings/${bookingId}`);
      
      const updates = {
        paymentStatus: status,
        updatedAt: new Date().toISOString(),
        ...(status === 'paid' && { paymentTimestamp: new Date().toISOString() })
      };
      
      console.log(`📝 Firebase Service: Preparing updates:`, updates);
      
      console.log(`⏳ Firebase Service: Executing database update...`);
      await bookingRef.update(updates);
      console.log(`✅ Firebase Service: Booking update completed successfully`);
      
      // Update last modified timestamp
      console.log(`⏳ Firebase Service: Updating lastUpdated timestamp...`);
      await database.ref('lastUpdated').set(new Date().toISOString());
      console.log(`✅ Firebase Service: LastUpdated timestamp set successfully`);
      
      console.log(`🎉 Firebase Service: Payment status update COMPLETE for ${bookingId}`);
      return true;
    } catch (error) {
      console.error('❌ Firebase Service: Failed to update payment status:', error);
      console.error('❌ Firebase Service: Error details:', error);
      return false;
    }
  }

  // Enhanced payment confirmation with transaction details (for payment gateway integration)
  static async confirmPayment(
    bookingId: string, 
    paymentMethod: 'online' | 'offline',
    transactionId?: string
  ): Promise<boolean> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      return false;
    }

    try {
      const bookingRef = database.ref(`bookings/${bookingId}`);
      const updates = {
        paymentStatus: 'paid',
        paymentMethod,
        paymentTimestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(transactionId && { paymentTransactionId: transactionId })
      };
      
      await bookingRef.update(updates);
      
      // Update last modified timestamp
      await database.ref('lastUpdated').set(new Date().toISOString());
      
      return true;
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      return false;
    }
  }

  // Get bookings by payment status (admin function)
  static async getBookingsByStatus(status: 'pending' | 'paid' | 'cancelled'): Promise<Booking[]> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      return [];
    }

    try {
      const bookingsRef = database.ref('bookings');
      const snapshot = await bookingsRef.once('value');
      
      if (snapshot.exists()) {
        const bookings = snapshot.val();
        
        const bookingsArray = Object.entries(bookings as Record<string, Booking>)
          .map(([id, booking]) => ({ ...booking, id }));
        
        return bookingsArray.filter((booking: Booking) => 
          (booking.paymentStatus || 'pending') === status
        );
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get bookings by status:', error);
      return [];
    }
  }

  // Force update Firebase structure (admin function)
  static async forceUpdateStructure(): Promise<boolean> {
    const firebaseReady = await initializeFirebase();
    if (!firebaseReady || !database) {
      return false;
    }

    try {
      const dbRef = database.ref('/');
      const defaultData = getDefaultBookingData();
      
      // Force set the complete new structure
      await dbRef.set(defaultData);
      
      console.log('Firebase structure updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update Firebase structure:', error);
      return false;
    }
  }
}