// PDF Generation Utility for SmartHub Admin Data
// Generates formatted PDF documents with title, date, and organized data tables

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AdminData, Student, Teacher, Group, Booking, StudentPayment } from '../types/admin.types';

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: typeof autoTable;
  lastAutoTable?: { finalY: number };
}

interface PDFExportOptions {
  dataType: 'all' | 'students' | 'teachers' | 'groups' | 'bookings' | 'student_payments';
  filteredData: {
    students: Student[];
    teachers: Teacher[];
    groups: Group[];
    bookings: Booking[];
    student_payments: StudentPayment[];
  };
  adminData: AdminData | null;
  searchTerm?: string;
  dateRange?: string;
}

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private margin = 15;
  private yPosition = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
  }

  // Add document header with logo and title
  private addHeader(title: string) {
    // Add SmartHub title
    this.doc.setFontSize(22);
    this.doc.setTextColor(59, 130, 246); // Primary blue
    this.doc.text('SmartHub', this.margin, this.yPosition);

    // Add document title
    this.yPosition += 10;
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(title, this.margin, this.yPosition);

    // Add generation date
    this.yPosition += 7;
    this.doc.setFontSize(10);
    this.doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    this.doc.text(`Généré le ${dateStr}`, this.margin, this.yPosition);

    // Add separator line
    this.yPosition += 5;
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition);

    this.yPosition += 10;
  }

  // Add section header
  private addSectionHeader(title: string, count: number) {
    this.doc.setFontSize(14);
    this.doc.setTextColor(30, 64, 175); // Dark blue
    this.doc.text(`${title} (${count})`, this.margin, this.yPosition);
    this.yPosition += 5;
  }

  // Generate Students table
  private addStudentsTable(students: Student[], adminData: AdminData | null) {
    if (students.length === 0) return;

    this.addSectionHeader('Étudiants', students.length);

    const tableData = students.map(student => {
      // Find groups this student is enrolled in
      const enrollments = adminData?.student_enrollments?.filter(e => e.student_id === student.id) || [];
      const groupNames = enrollments.map(enrollment => {
        const group = adminData?.groups.find(g => g.id === enrollment.group_id);
        return group?.group_name || 'N/A';
      });
      const groupsText = groupNames.length > 0 ? groupNames.join(', ') : 'Aucun';

      return [
        student.name,
        student.email,
        student.phone,
        student.parent_name,
        groupsText,
        student.status === 'active' ? 'Actif' :
        student.status === 'inactive' ? 'Inactif' :
        student.status === 'graduated' ? 'Diplômé' : 'Retiré',
        student.registration_date
      ];
    });

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Nom', 'Email', 'Téléphone', 'Parent', 'Groupe(s)', 'Statut', 'Inscription']],
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 35 },
        2: { cellWidth: 23 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 18 },
        6: { cellWidth: 20 }
      }
    });

    this.yPosition = (this.doc as any).lastAutoTable?.finalY + 10 || this.yPosition;
  }

  // Generate Teachers table
  private addTeachersTable(teachers: Teacher[], adminData: AdminData | null) {
    if (teachers.length === 0) return;

    this.addSectionHeader('Enseignants', teachers.length);

    const tableData = teachers.map(teacher => {
      // Find groups assigned to this teacher
      const assignedGroups = adminData?.groups.filter(g => g.teacher_id === teacher.id) || [];
      const groupNames = assignedGroups.map(g => g.group_name);
      const groupsText = groupNames.length > 0 ? groupNames.join(', ') : 'Aucun';

      return [
        teacher.name,
        teacher.email,
        teacher.phone,
        teacher.subjects.join(', '),
        groupsText,
        `${teacher.payment_terms.hourly_rate} TND/h`,
        teacher.status === 'active' ? 'Actif' : 'Inactif'
      ];
    });

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Nom', 'Email', 'Téléphone', 'Matières', 'Groupe(s)', 'Tarif', 'Statut']],
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 35 },
        2: { cellWidth: 23 },
        3: { cellWidth: 28 },
        4: { cellWidth: 30 },
        5: { cellWidth: 20 },
        6: { cellWidth: 17 }
      }
    });

    this.yPosition = (this.doc as any).lastAutoTable?.finalY + 10 || this.yPosition;
  }

  // Generate Groups table
  private addGroupsTable(groups: Group[]) {
    if (groups.length === 0) return;

    this.addSectionHeader('Groupes', groups.length);

    const tableData = groups.map(group => [
      group.group_name,
      group.subject,
      group.level,
      `${group.current_enrollment}/${group.capacity}`,
      group.schedule.days.join(', '),
      `${group.schedule.start_time}-${group.schedule.end_time}`,
      group.status === 'active' ? 'Actif' : 'Inactif'
    ]);

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Nom', 'Matière', 'Niveau', 'Effectif', 'Jours', 'Horaires', 'Statut']],
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 20 }
      }
    });

    this.yPosition = (this.doc as any).lastAutoTable?.finalY + 10 || this.yPosition;
  }

  // Generate Bookings table
  private addBookingsTable(bookings: Booking[], adminData: AdminData | null) {
    if (bookings.length === 0 || !adminData) return;

    this.addSectionHeader('Réservations', bookings.length);

    const tableData = bookings.map(booking => {
      const room = adminData.rooms.find(r => r.id === booking.room_id);
      const group = adminData.groups.find(g => g.id === booking.group_id);

      return [
        booking.date,
        room?.name || 'N/A',
        group?.group_name || 'N/A',
        `${booking.start_time}-${booking.end_time}`,
        `${booking.duration_hours}h`,
        booking.status === 'confirmed' ? 'Confirmé' :
        booking.status === 'completed' ? 'Terminé' : 'Annulé'
      ];
    });

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Date', 'Salle', 'Groupe', 'Horaires', 'Durée', 'Statut']],
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 }
      }
    });

    this.yPosition = (this.doc as any).lastAutoTable?.finalY + 10 || this.yPosition;
  }

  // Generate Student Payments table
  private addStudentPaymentsTable(payments: StudentPayment[], adminData: AdminData | null) {
    if (payments.length === 0 || !adminData) return;

    this.addSectionHeader('Paiements Étudiants', payments.length);

    const tableData = payments.map(payment => {
      const student = adminData.students.find(s => s.id === payment.student_id);

      return [
        payment.invoice_number,
        student?.name || 'N/A',
        `${payment.amount} TND`,
        payment.period,
        payment.payment_date,
        payment.payment_method === 'cash' ? 'Espèces' :
        payment.payment_method === 'check' ? 'Chèque' :
        payment.payment_method === 'bank_transfer' ? 'Virement' : 'Mobile',
        payment.status === 'paid' ? 'Payé' :
        payment.status === 'partial' ? 'Partiel' : 'En attente'
      ];
    });

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Facture', 'Étudiant', 'Montant', 'Période', 'Date', 'Méthode', 'Statut']],
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 22 },
        3: { cellWidth: 25 },
        4: { cellWidth: 22 },
        5: { cellWidth: 22 },
        6: { cellWidth: 24 }
      }
    });

    this.yPosition = (this.doc as any).lastAutoTable?.finalY + 10 || this.yPosition;
  }

  // Add footer with page numbers
  private addFooter() {
    const pageCount = this.doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);

      const footerText = `SmartHub - 13 Rue de Belgique, Tunis | Page ${i} sur ${pageCount}`;
      const textWidth = this.doc.getTextWidth(footerText);
      const xPosition = (this.pageWidth - textWidth) / 2;

      this.doc.text(footerText, xPosition, this.doc.internal.pageSize.getHeight() - 10);
    }
  }

  // Main export function
  public exportToPDF(options: PDFExportOptions): void {
    const { dataType, filteredData, adminData } = options;

    // Determine document title based on data type
    let title = 'Rapport Complet des Données';
    if (dataType === 'students') title = 'Liste des Étudiants';
    else if (dataType === 'teachers') title = 'Liste des Enseignants';
    else if (dataType === 'groups') title = 'Liste des Groupes';
    else if (dataType === 'bookings') title = 'Liste des Réservations';
    else if (dataType === 'student_payments') title = 'Liste des Paiements Étudiants';

    // Add header
    this.addHeader(title);

    // Add data tables based on type
    if (dataType === 'all' || dataType === 'students') {
      this.addStudentsTable(filteredData.students, adminData);
    }

    if (dataType === 'all' || dataType === 'teachers') {
      this.addTeachersTable(filteredData.teachers, adminData);
    }

    if (dataType === 'all' || dataType === 'groups') {
      this.addGroupsTable(filteredData.groups);
    }

    if (dataType === 'all' || dataType === 'bookings') {
      this.addBookingsTable(filteredData.bookings, adminData);
    }

    if (dataType === 'all' || dataType === 'student_payments') {
      this.addStudentPaymentsTable(filteredData.student_payments, adminData);
    }

    // Add footer with page numbers
    this.addFooter();

    // Generate filename
    const filename = `smarthub-${dataType}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Save the PDF
    this.doc.save(filename);
  }
}

// Export convenience function
export const generatePDF = (options: PDFExportOptions): void => {
  const generator = new PDFGenerator();
  generator.exportToPDF(options);
};
