// Firebase Realtime Database service for multi-user booking system
// Provides centralized booking storage that syncs across all devices
// Using Firebase CDN - No npm installation required!

import { database, initializeFirebase } from '../config/firebase';

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
  bookingPeriod?: 'week' | '2weeks' | '3weeks' | 'month'; // New: booking period
  endDate?: string; // YYYY-MM-DD format for recurring bookings
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
  bookingPeriods: [
    { label: "1 Semaine", value: "week", weeks: 1 },
    { label: "2 Semaines", value: "2weeks", weeks: 2 },
    { label: "3 Semaines", value: "3weeks", weeks: 3 },
    { label: "1 Mois", value: "month", weeks: 4 }
  ],
  lastUpdated: new Date().toISOString()
});

export class FirebaseBookingService {
  private static initialized = false;

  // Initialize Firebase database with default data if needed
  static async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    
    // Ensure Firebase is initialized
    if (!initializeFirebase() || !database) {
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
    if (!initializeFirebase() || !database) {
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

  // Create a new booking
  static async createBooking(booking: Omit<Booking, 'id'>): Promise<string | null> {
    if (!initializeFirebase() || !database) {
      throw new Error('Firebase not available');
    }

    try {
      // Check for conflicts first
      const hasConflict = await this.checkBookingConflict(booking.roomId, booking.date, booking.timeSlot);
      if (hasConflict) {
        throw new Error('Time slot already booked');
      }

      const bookingsRef = database.ref('bookings');
      const newBookingRef = bookingsRef.push();
      
      const bookingWithId: Booking = {
        ...booking,
        id: newBookingRef.key!,
        bookingDate: new Date().toISOString(),
        createdBy: booking.teacherName // Simple teacher identification
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
    if (!initializeFirebase() || !database) {
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

  // Helper function to generate dates based on booking period
  static generateBookingDates(startDate: string, bookingPeriod: 'week' | '2weeks' | '3weeks' | 'month'): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    
    let weeks = 1;
    switch (bookingPeriod) {
      case 'week': weeks = 1; break;
      case '2weeks': weeks = 2; break;
      case '3weeks': weeks = 3; break;
      case 'month': weeks = 4; break;
    }
    
    for (let week = 0; week < weeks; week++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + (week * 7));
      dates.push(currentDate.toISOString().split('T')[0]);
    }
    
    return dates;
  }

  // Check for booking conflicts (updated for date-based system)
  static async checkBookingConflict(roomId: string, date: string, timeSlot: string): Promise<boolean> {
    if (!initializeFirebase() || !database) {
      return false;
    }

    try {
      const bookingsRef = database.ref('bookings');
      const snapshot = await bookingsRef.once('value');
      
      if (snapshot.exists()) {
        const bookings = snapshot.val();
        
        // Check if any booking matches room, date, and time slot
        const bookingsArray = Object.values(bookings as Record<string, Booking>);
        return bookingsArray.some((booking: Booking) => 
          booking.roomId === roomId && 
          booking.date === date && 
          booking.timeSlot === timeSlot
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
    if (!initializeFirebase() || !database) {
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

  // Create multiple bookings for recurring schedule
  static async createRecurringBooking(booking: Omit<Booking, 'id'>, bookingPeriod: 'week' | '2weeks' | '3weeks' | 'month'): Promise<string[]> {
    if (!initializeFirebase() || !database) {
      throw new Error('Firebase not available');
    }

    const bookingIds: string[] = [];
    const dates = this.generateBookingDates(booking.date, bookingPeriod);

    try {
      for (const date of dates) {
        // Check for conflicts on each date
        const hasConflict = await this.checkBookingConflict(booking.roomId, date, booking.timeSlot);
        if (hasConflict) {
          throw new Error(`Conflit de réservation détecté le ${date} à ${booking.timeSlot}`);
        }
      }

      // Create bookings for each date
      for (const date of dates) {
        const dateBooking = {
          ...booking,
          date,
          bookingPeriod,
          endDate: dates[dates.length - 1]
        };

        const bookingId = await this.createBooking(dateBooking);
        if (bookingId) {
          bookingIds.push(bookingId);
        }
      }

      return bookingIds;
    } catch (error) {
      console.error('Failed to create recurring booking:', error);
      throw error;
    }
  }

  // Subscribe to real-time updates
  static subscribeToBookingUpdates(callback: (data: BookingData) => void): () => void {
    if (!initializeFirebase() || !database) {
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
    if (!initializeFirebase() || !database) {
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

  // Force update Firebase structure (admin function)
  static async forceUpdateStructure(): Promise<boolean> {
    if (!initializeFirebase() || !database) {
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