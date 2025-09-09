# 🔥 Firebase Functions Email Notifications Setup

## ✅ **What's Implemented:**
- Automatic email notifications when new bookings are created
- Beautiful HTML + plain text email templates
- Professional formatting with booking details
- Automatic retry on failures
- **Cost: FREE** (within generous Firebase limits)

## 🚀 **Setup Steps:**

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Firebase Functions
```bash
# Navigate to your project directory
cd C:\Users\asus\smarthub

# Initialize Firebase Functions (if not done already)
firebase init functions
# Select TypeScript when prompted
# Install dependencies: Yes
```

### 3. Install Function Dependencies
```bash
cd functions
npm install
```

### 4. Set up Email Configuration
You need a Gmail account for sending emails. **Create a dedicated Gmail account** for SmartHub:

#### Option A: Create SmartHub Gmail Account (Recommended)
1. Create: `smarthub.booking@gmail.com` (or similar)
2. Enable 2-factor authentication
3. Generate App Password:
   - Google Account → Security → 2-Step Verification → App Passwords
   - Select "Mail" and "Other" → Enter "SmartHub Booking"
   - Copy the generated password

#### Option B: Use Existing Gmail
- Use any existing Gmail with App Password enabled

### 5. Configure Email Settings
Edit `functions/src/index.ts` and update:
```typescript
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'smarthub.booking@gmail.com', // Your dedicated Gmail
    pass: 'your-16-character-app-password'    // Gmail App Password
  }
};
```

### 6. Deploy Firebase Functions
```bash
# From project root
firebase deploy --only functions
```

## 🎯 **How It Works:**

1. **User creates booking** → Firebase Realtime Database updated
2. **Firebase Function automatically triggered** → `sendBookingNotification` function runs
3. **Email sent to jalel.chniti@gmail.com** → Professional HTML email with all booking details
4. **Done!** No frontend changes needed

## 📧 **Email Content Includes:**
- 📋 Booking ID and timestamp
- 👨‍🏫 Teacher name and subject
- 🏢 Room name and capacity info
- 📅 Date and time slot
- ⏳ Duration and student count
- 📞 Contact information
- 📆 Booking period (week/month)
- 📍 SmartHub contact details

## 🔧 **Testing:**
```bash
# Test locally with Firebase emulator
cd functions
npm run serve

# Create a test booking in your app
# Check the emulator logs for email sending
```

## 💰 **Costs (FREE for your usage):**
- **Firebase Functions**: 2M invocations/month FREE
- **Your usage**: ~100-500 bookings/month = $0
- **Gmail SMTP**: Free unlimited emails
- **Total**: $0/month

## 🛠️ **Advanced Configuration:**

### Custom Email Templates
Edit the HTML template in `generateHTMLEmail()` function for custom branding.

### Multiple Recipients
Add more emails to the `to` field:
```typescript
to: ['jalel.chniti@gmail.com', 'admin@smarthub.com.tn'],
```

### SMS Notifications (Future)
Add SMS service like Twilio for instant notifications.

### Booking Confirmations
Extend to send confirmation emails to teachers.

## 🚨 **Important Security Notes:**
- Never commit Gmail passwords to Git
- Use environment variables for production:
  ```bash
  firebase functions:config:set gmail.email="your@gmail.com" gmail.password="app-password"
  ```

## ✅ **Deployment Checklist:**
- [ ] Gmail account created and App Password generated
- [ ] Email configuration updated in functions/src/index.ts
- [ ] Functions deployed: `firebase deploy --only functions`
- [ ] Test booking created to verify email delivery
- [ ] Check Firebase Functions logs for any errors

**Result**: Every new booking automatically sends a professional email notification to jalel.chniti@gmail.com! 🎉