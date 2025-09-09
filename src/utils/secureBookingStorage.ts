// Secure booking storage utility with basic encryption
// For production use, implement server-side storage with proper authentication

interface Booking {
  roomId: string;
  day: string;
  timeSlot: string;
  teacherName: string;
  subject: string;
  studentCount: number;
  duration: number;
  contactInfo: string;
  bookingDate: string;
}

interface BookingData {
  rooms: {
    [roomId: string]: {
      name: string;
      capacity: number;
      bookings: {
        [key: string]: Booking;
      };
    };
  };
  timeSlots: string[];
  weekDays: string[];
  lastUpdated: string;
}

// Simple encryption/decryption for basic data protection
// WARNING: This is client-side obfuscation, not true security
const ENCRYPTION_KEY = 'SmartHub2025BookingSystem';

function simpleEncrypt(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Base64 encode
}

function simpleDecrypt(encryptedText: string): string {
  try {
    const decoded = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch {
    return '';
  }
}

// Default booking data structure
const getDefaultBookingData = (): BookingData => ({
  rooms: {
    "1": { name: "Salle 1", capacity: 15, bookings: {} },
    "2": { name: "Salle 2", capacity: 9, bookings: {} },
    "3": { name: "Salle 3", capacity: 9, bookings: {} }
  },
  timeSlots: [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
    "18:00", "18:30", "19:00", "19:30"
  ],
  weekDays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
  lastUpdated: new Date().toISOString()
});

// Secure localStorage keys
const BOOKING_STORAGE_KEY = 'sh_booking_data_v1';
const BOOKING_AUTH_KEY = 'sh_booking_auth_v1';

// Simple authentication check (for basic access control)
function isAuthorized(): boolean {
  const authToken = localStorage.getItem(BOOKING_AUTH_KEY);
  if (!authToken) {
    // First time access - set auth token
    const token = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(BOOKING_AUTH_KEY, simpleEncrypt(token));
    return true;
  }
  return simpleDecrypt(authToken).startsWith('auth_');
}

export class SecureBookingStorage {
  
  // Load booking data from secure localStorage
  static loadBookingData(): BookingData {
    if (!isAuthorized()) {
      throw new Error('Unauthorized access to booking system');
    }

    try {
      const encryptedData = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (!encryptedData) {
        // First time - initialize with default data
        const defaultData = getDefaultBookingData();
        this.saveBookingData(defaultData);
        return defaultData;
      }
      
      const decryptedData = simpleDecrypt(encryptedData);
      if (!decryptedData) {
        throw new Error('Failed to decrypt booking data');
      }
      
      return JSON.parse(decryptedData) as BookingData;
    } catch (error) {
      console.error('Failed to load booking data:', error);
      // Return default data if loading fails
      return getDefaultBookingData();
    }
  }

  // Save booking data to secure localStorage
  static saveBookingData(data: BookingData): boolean {
    if (!isAuthorized()) {
      throw new Error('Unauthorized access to booking system');
    }

    try {
      const dataWithTimestamp = {
        ...data,
        lastUpdated: new Date().toISOString()
      };
      
      const jsonData = JSON.stringify(dataWithTimestamp);
      const encryptedData = simpleEncrypt(jsonData);
      localStorage.setItem(BOOKING_STORAGE_KEY, encryptedData);
      return true;
    } catch (error) {
      console.error('Failed to save booking data:', error);
      return false;
    }
  }

  // Clear all booking data (for testing/reset)
  static clearBookingData(): void {
    if (!isAuthorized()) {
      throw new Error('Unauthorized access to booking system');
    }
    
    localStorage.removeItem(BOOKING_STORAGE_KEY);
    localStorage.removeItem(BOOKING_AUTH_KEY);
  }

  // Export booking data (for backup purposes)
  static exportBookingData(): string {
    if (!isAuthorized()) {
      throw new Error('Unauthorized access to booking system');
    }
    
    const data = this.loadBookingData();
    return JSON.stringify(data, null, 2);
  }

  // Import booking data (for restore purposes)
  static importBookingData(jsonData: string): boolean {
    if (!isAuthorized()) {
      throw new Error('Unauthorized access to booking system');
    }
    
    try {
      const data = JSON.parse(jsonData) as BookingData;
      return this.saveBookingData(data);
    } catch (error) {
      console.error('Failed to import booking data:', error);
      return false;
    }
  }
}