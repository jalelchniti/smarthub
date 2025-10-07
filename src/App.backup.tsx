import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { Home } from './pages/Home';
import { Rooms } from './pages/Rooms';
import Teachers from './pages/Teachers';
import { LearnMore } from './pages/LearnMore';
import { Formations } from './pages/Formations';
import StudentThankYou from './pages/StudentThankYou';
import TeacherThankYou from './pages/TeacherThankYou';
import StudentRegistration from './pages/StudentRegistration';
import TeacherRegistration from './pages/TeacherRegistration';
import TeacherRevenueCalculator from './pages/RevenueSimulator';
import ParentCostCalculator from './pages/parent-cost-simulator';
import { OurMission } from './pages/Our_Mission';

// Admin imports
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/Bookings';
import AdminStudents from './pages/admin/Students';
import AdminStudentPayments from './pages/admin/StudentPayments';
import AdminDataPreview from './pages/admin/DataPreview';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Login (no layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes (free access with layout) */}
          <Route path="/admin/*" element={
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                {/* Bookings Management - Phase 1 */}
                <Route path="/bookings" element={<AdminBookings />} />
                {/* Students Management - Phase 4 */}
                <Route path="/students" element={<AdminStudents />} />
                {/* Student Payments - Phase 5 */}
                <Route path="/student-payments" element={<AdminStudentPayments />} />
                {/* Data Preview - All Data with Filtering */}
                <Route path="/data-preview" element={<AdminDataPreview />} />
                {/* Placeholder routes - will be implemented in future phases */}
                <Route path="/room-status" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Statut des Salles</h2><p className="text-gray-600 mt-2">En cours de développement</p></div>} />
                <Route path="/working-hours" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Horaires de Travail</h2><p className="text-gray-600 mt-2">En cours de développement</p></div>} />
                <Route path="/teachers" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Gestion des Enseignants</h2><p className="text-gray-600 mt-2">En cours de développement</p></div>} />
                <Route path="/teacher-payments" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Paiements Enseignants</h2><p className="text-gray-600 mt-2">En cours de développement</p></div>} />
                <Route path="/reports" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Rapports Financiers</h2><p className="text-gray-600 mt-2">En cours de développement</p></div>} />
              </Routes>
            </AdminLayout>
          } />

          {/* Thank You pages without navigation/footer */}
          <Route path="/thank-you/student" element={<StudentThankYou />} />
          <Route path="/thank-you/teacher" element={<TeacherThankYou />} />

          {/* Private Revenue Simulator page - hidden from public navigation */}
          <Route path="/simulation" element={<TeacherRevenueCalculator />} />

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
                  <Route path="/formations" element={<Formations />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/learn-more" element={<LearnMore />} />
                  <Route path="/subjects" element={<LearnMore />} />
                  <Route path="/our-mission" element={<OurMission />} />
                  <Route path="/revenue-simulator" element={<TeacherRevenueCalculator />} />
                  <Route path="/parentsimulator" element={<ParentCostCalculator />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
