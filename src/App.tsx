import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { Home } from './pages/Home';
import { Rooms } from './pages/Rooms';
import Teachers from './pages/Teachers';
import { LearnMore } from './pages/LearnMore';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
