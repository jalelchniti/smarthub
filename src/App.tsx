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

function App() {
  return (
    <Router>
      <Routes>
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
  );
}

export default App;
