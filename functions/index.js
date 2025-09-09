const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Email configuration - using Gmail SMTP (free)
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'smarthub.booking@gmail.com', // Your dedicated Gmail for sending
    pass: 'twsf njpi xupl iddm'   
  }
};

// Create nodemailer transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Firebase Function triggered when a new booking is created
exports.sendBookingNotification = functions.database
  .ref('/bookings/{bookingId}')
  .onCreate(async (snapshot, context) => {
    try {
      const bookingId = context.params.bookingId;
      const bookingData = snapshot.val();
      
      // Add the booking ID to the data
      bookingData.id = bookingId;
      
      console.log(`New booking created: ${bookingId}`, bookingData);
      
      // Get room information
      const roomSnapshot = await admin.database().ref(`/rooms/${bookingData.roomId}`).once('value');
      const roomData = roomSnapshot.val();
      
      if (!roomData) {
        console.error(`Room data not found for room ID: ${bookingData.roomId}`);
        return;
      }
      
      // Send email notification
      await sendEmailNotification(bookingData, roomData);
      
      console.log(`Booking notification sent successfully for booking: ${bookingId}`);
      
    } catch (error) {
      console.error('Error sending booking notification:', error);
      throw error; // This will trigger Firebase Functions retry mechanism
    }
  });

// Function to send email notification
async function sendEmailNotification(booking, room) {
  const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const bookingPeriodText = formatBookingPeriod(booking.bookingPeriod || 'week');
  
  const htmlContent = generateHTMLEmail(booking, room, formattedDate, bookingPeriodText);
  const textContent = generateTextEmail(booking, room, formattedDate, bookingPeriodText);
  
  const mailOptions = {
    from: {
      name: 'SmartHub Booking System',
      address: emailConfig.auth.user
    },
    to: 'jalel.chniti@gmail.com',
    subject: `🏫 Nouvelle Réservation SmartHub - ${booking.teacherName} (${room.name})`,
    html: htmlContent,
    text: textContent
  };
  
  await transporter.sendMail(mailOptions);
}

// Generate HTML email content
function generateHTMLEmail(booking, room, formattedDate, bookingPeriodText) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🏫 SmartHub</h1>
        <h2 style="margin: 10px 0 0 0; font-size: 18px; font-weight: normal;">Nouvelle Réservation</h2>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #1976d2; font-size: 20px;">📋 Détails de la Réservation</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">ID: <strong>${booking.id}</strong></p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333; width: 40%;">👨‍🏫 Enseignant:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${booking.teacherName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">📚 Matière:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${booking.subject}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">🏢 Salle:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${room.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">📅 Date:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">⏰ Heure:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${booking.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">⏳ Durée:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${booking.duration} heure${booking.duration > 1 ? 's' : ''}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">👥 Étudiants:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${booking.studentCount}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">📞 Contact:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${booking.contactInfo}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">📆 Période:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${bookingPeriodText}</td>
          </tr>
          ${booking.endDate ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">🏁 Date de fin:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">${new Date(booking.endDate).toLocaleDateString('fr-FR')}</td>
          </tr>
          ` : ''}
        </table>
        
        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px; text-align: center;">
          <h4 style="margin: 0 0 10px 0; color: #333;">📍 SmartHub</h4>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1</p>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">1000 Tunis</p>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">📞 +216 99 456 059 | 📧 souad.dkhili@u-smart.net</p>
        </div>
        
        <p style="margin-top: 25px; color: #999; font-size: 12px; text-align: center;">
          Réservation créée le: ${new Date(booking.bookingDate).toLocaleString('fr-FR')}
        </p>
      </div>
    </div>
  `;
}

// Generate plain text email content
function generateTextEmail(booking, room, formattedDate, bookingPeriodText) {
  return `
🏫 NOUVELLE RÉSERVATION SMARTHUB 🏫

📋 DÉTAILS DE LA RÉSERVATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 ID Réservation: ${booking.id}
🔹 Enseignant: ${booking.teacherName}
🔹 Matière: ${booking.subject}
🔹 Salle: ${room.name}
🔹 Date: ${formattedDate}
🔹 Heure: ${booking.timeSlot}
🔹 Durée: ${booking.duration} heure${booking.duration > 1 ? 's' : ''}
🔹 Nombre d'étudiants: ${booking.studentCount}
🔹 Contact: ${booking.contactInfo}
🔹 Période: ${bookingPeriodText}
${booking.endDate ? `🔹 Date de fin: ${new Date(booking.endDate).toLocaleDateString('fr-FR')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 SmartHub - 13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis
📞 +216 99 456 059 | 📧 souad.dkhili@u-smart.net

Réservation créée le: ${new Date(booking.bookingDate).toLocaleString('fr-FR')}
  `;
}

// Format booking period
function formatBookingPeriod(period) {
  switch (period) {
    case 'week': return '1 Semaine';
    case '2weeks': return '2 Semaines';
    case '3weeks': return '3 Semaines';  
    case 'month': return '1 Mois (4 semaines)';
    default: return period;
  }
}