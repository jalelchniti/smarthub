import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { Home } from './pages/Home';
import { Rooms } from './pages/Rooms';
import Teachers from './pages/Teachers';
import { LearnMore } from './pages/LearnMore';
import StudentThankYou from './pages/StudentThankYou';
import TeacherThankYou from './pages/TeacherThankYou';

function App() {
  return (
    <Router>
      <Routes>
        {/* Thank You pages without navigation/footer */}
        <Route path="/thank-you/student" element={<StudentThankYou />} />
        <Route path="/thank-you/teacher" element={<TeacherThankYou />} />
        
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
