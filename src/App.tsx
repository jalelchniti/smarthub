import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { Home } from './pages/Home';
import { Rooms } from './pages/Rooms';
import Teachers from './pages/Teachers';
import { LearnMore } from './pages/LearnMore';
import StudentThankYou from './pages/StudentThankYou';
import TeacherThankYou from './pages/TeacherThankYou';
import StudentRegistration from './pages/StudentRegistration';
import TeacherRegistration from './pages/TeacherRegistration';
import { RevenueSimulator } from './pages/RevenueSimulator';
import { BookingSystem } from './pages/BookingSystem';
import { BookingThankYou } from './pages/BookingThankYou';
import { PaymentOnlineComingSoon } from './pages/PaymentOnlineComingSoon';
import TeacherEntrepreneurship from './pages/TeacherEntrepreneurship';
import { AdminBookings } from './pages/AdminBookings';
import { AdminLogin } from './pages/AdminLogin';
import { SecureAdminBookings } from './pages/SecureAdminBookings';
import { FirebaseAdminLogin } from './pages/FirebaseAdminLogin';
import { FirebaseAdminBookings } from './pages/FirebaseAdminBookings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Thank You pages without navigation/footer */}
        <Route path="/thank-you/student" element={<StudentThankYou />} />
        <Route path="/thank-you/teacher" element={<TeacherThankYou />} />
        
        {/* Payment pages without navigation/footer */}
        <Route path="/booking/thank-you" element={<BookingThankYou />} />
        <Route path="/payment/online-coming-soon" element={<PaymentOnlineComingSoon />} />
        
        {/* Private Revenue Simulator page - hidden from public navigation */}
        <Route path="/simulation" element={<RevenueSimulator />} />
        
        {/* Admin Login pages - secure authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/firebase-login" element={<FirebaseAdminLogin />} />
        
        {/* Secure Admin Bookings Management pages - protected routes */}
        <Route path="/admin/bookings" element={<SecureAdminBookings />} />
        <Route path="/admin/firebase-bookings" element={<FirebaseAdminBookings />} />
        
        {/* Legacy Admin Bookings page - for reference */}
        <Route path="/admin/legacy" element={<AdminBookings />} />
        
        {/* Registration pages with their own navigation/footer */}
        <Route path="/register/student" element={<StudentRegistration />} />
        <Route path="/register/teacher" element={<TeacherRegistration />} />
        
        {/* Regular pages with navigation/footer */}
        <Route path="/*" element={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/learn-more" element={<LearnMore />} />
                <Route path="/subjects" element={<LearnMore />} />
                <Route path="/teacher-entrepreneurship" element={<TeacherEntrepreneurship />} />
                <Route path="/revenue-simulator" element={<RevenueSimulator />} />
                <Route path="/booking-system" element={<BookingSystem />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
