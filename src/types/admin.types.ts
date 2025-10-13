// SmartHub Admin System - TypeScript Type Definitions
// All data models for the admin management system

// ============================================
// ROOM TYPES
// ============================================

export interface Room {
  id: string;
  name: string;
  type: 'premium' | 'standard';
  capacity: number;
  equipment_list: string[];
  hourly_rate: number; // TND
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
}

// ============================================
// TEACHER TYPES
// ============================================

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio?: string; // Teacher biography/description
  photo?: string; // Profile photo path (e.g., "/uploads/teachers/teacher-001.jpg")
  subjects: string[]; // From 9 subjects offered
  payment_terms: {
    hourly_rate: number; // 35 or 40 TND
    category: 'A1-A2' | 'B1-B4';
  };
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// ============================================
// STUDENT TYPES
// ============================================

export interface Student {
  id: string;
  name: string;
  date_of_birth?: string; // YYYY-MM-DD
  id_number?: string; // National ID
  grade?: string; // Student's current grade/level (e.g., "Bac", "4ème année secondaire", etc.)
  photo?: string; // Profile photo path (e.g., "/uploads/students/student-001.jpg")
  email: string;
  phone: string;
  address?: string;

  // Parent/Guardian Information
  parent_name: string;
  parent_relationship: 'father' | 'mother' | 'guardian';
  parent_phone: string;
  parent_email?: string;

  // Emergency Contact
  emergency_contact_name: string;
  emergency_contact_phone: string;

  // Administrative
  registration_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'withdrawn';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// GROUP TYPES
// ============================================

export interface Group {
  id: string;
  group_name: string;
  teacher_id: string;
  subject: string; // One of 9 subjects
  level: string; // e.g., "Bac", "4ème année", etc.
  schedule: GroupSchedule[];
  capacity: number;
  current_enrollment: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface GroupSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
}

// ============================================
// BOOKING TYPES
// ============================================

export interface Booking {
  id: string;
  room_id: string;
  group_id: string;
  teacher_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  duration_hours: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  payment_status?: 'unpaid' | 'paid';
  payment_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

// ============================================
// ENROLLMENT TYPES
// ============================================

export interface StudentEnrollment {
  id: string;
  student_id: string;
  group_id: string;
  enrollment_date: string;
  status: 'active' | 'withdrawn';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// PAYMENT TYPES
// ============================================

export interface StudentPayment {
  id: string;
  student_id: string;
  amount: number; // TND
  payment_date: string;
  method: 'cash' | 'check' | 'bank_transfer' | 'mobile_payment';
  period_covered: string; // e.g., "Octobre 2025", "Trimestre 1"
  invoice_number: string; // INV-YYYY-MM-XXX
  status: 'paid' | 'partial' | 'pending';
  notes?: string;
  created_at: string;
}

export interface TeacherPayment {
  id: string;
  teacher_id: string;
  amount: number; // TND (net amount to teacher)
  gross_amount: number; // Total booking fees
  smarthub_fee: number; // SmartHub's margin
  payment_date: string;
  method: 'cash' | 'check' | 'bank_transfer';
  period_start: string;
  period_end: string;
  hours_used: number;
  booking_ids: string[]; // References to bookings
  receipt_number: string; // RCP-T-YYYY-MM-XXX
  status: 'paid' | 'pending' | 'approved';
  notes?: string;
  created_at: string;
}

// ============================================
// WORKING HOURS TYPES
// ============================================

export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  is_open: boolean;
  time_slots: TimeSlot[];
}

export interface TimeSlot {
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  is_available: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  is_recurring: boolean; // Annual holiday
  created_at: string;
}

// ============================================
// WAITLIST TYPES
// ============================================

export interface Waitlist {
  id: string;
  student_id: string;
  group_id: string;
  added_date: string;
  status: 'waiting' | 'enrolled' | 'cancelled';
  created_at: string;
}

// ============================================
// USER/AUTH TYPES
// ============================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'manager' | 'staff' | 'accountant';
  password_hash: string; // Simple hash for demo (NOT production-grade)
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
}

// ============================================
// MAIN DATA STRUCTURE
// ============================================

export interface AdminData {
  rooms: Room[];
  teachers: Teacher[];
  students: Student[];
  groups: Group[];
  bookings: Booking[];
  student_enrollments: StudentEnrollment[];
  student_payments: StudentPayment[];
  teacher_payments: TeacherPayment[];
  working_hours: WorkingHours[];
  holidays: Holiday[];
  waitlist: Waitlist[];
  users: AdminUser[];
  last_updated: string;
  version: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type PaymentMethod = 'cash' | 'check' | 'bank_transfer' | 'mobile_payment';

export type UserRole = 'manager' | 'staff' | 'accountant';

export type RoomStatus = 'FREE' | 'OCCUPIED' | 'UPCOMING';

// ============================================
// FORM TYPES
// ============================================

export interface BookingFormData {
  room_id: string;
  group_id: string;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  id_number?: string;
  grade?: string;
  photo?: string;
  address?: string;
  parent_name: string;
  parent_relationship: 'father' | 'mother' | 'guardian';
  parent_phone: string;
  parent_email?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  notes?: string;
}

export interface TeacherFormData {
  name: string;
  email: string;
  phone: string;
  bio?: string;
  photo?: string;
  subjects: string[];
  hourly_rate: number;
  category: 'A1-A2' | 'B1-B4';
}

export interface GroupFormData {
  group_name: string;
  teacher_id: string;
  subject: string;
  level: string;
  schedule: GroupSchedule[];
  capacity: number;
}
