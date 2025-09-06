# SmartHub Simplified Static Files

Copy these files to your local SmartHub project directory:

## 1. src/App.tsx

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Teachers from './pages/Teachers';
import LearnMore from './pages/LearnMore';

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
```

## 2. src/components/Navigation.tsx

```typescript
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Salles', href: '/rooms' },
    { name: 'Enseignants', href: '/teachers' },
    { name: 'En Savoir Plus', href: '/learn-more' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/21699730144?text=Bonjour! Je suis intéressé(e) par vos services SmartHub.', '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+21699730144';
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SmartHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={handlePhoneClick}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">+216 99 730 144</span>
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center px-6 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile Contact Buttons */}
            <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
              <button
                onClick={handlePhoneClick}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Phone className="w-5 h-5 mr-3" />
                +216 99 730 144
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
```

## 3. src/pages/Teachers.tsx

```typescript
import React from 'react';
import { Star, Languages, Calculator, Laptop, Briefcase, BookOpen, Globe, MessageCircle } from 'lucide-react';

const Teachers = () => {
  const subjects = [
    { name: 'Langues', icon: Languages, color: 'from-blue-500 to-indigo-500' },
    { name: 'Mathématiques', icon: Calculator, color: 'from-green-500 to-teal-500' },
    { name: 'Informatique', icon: Laptop, color: 'from-purple-500 to-pink-500' },
    { name: 'Business', icon: Briefcase, color: 'from-orange-500 to-red-500' },
    { name: 'Littérature', icon: BookOpen, color: 'from-indigo-500 to-purple-500' },
    { name: 'Examens Globaux', icon: Globe, color: 'from-teal-500 to-blue-500' },
  ];

  const teachers = [
    {
      name: 'Dr. Amina Khalil',
      subject: 'Français & Anglais',
      experience: '8 ans',
      rating: 4.9,
      specialties: ['DELF', 'TOEFL', 'Conversation'],
      description: 'Docteure en linguistique, spécialisée dans l\'enseignement des langues étrangères.'
    },
    {
      name: 'Prof. Mohamed Triki',
      subject: 'Mathématiques',
      experience: '12 ans',
      rating: 4.8,
      specialties: ['Algèbre', 'Géométrie', 'Préparation Concours'],
      description: 'Ancien professeur universitaire, expert en méthodes pédagogiques modernes.'
    },
    {
      name: 'Ing. Sarah Ben Ali',
      subject: 'Informatique',
      experience: '6 ans',
      rating: 4.9,
      specialties: ['Programmation', 'Web Design', 'IA'],
      description: 'Ingénieure informatique et formatrice certifiée en nouvelles technologies.'
    },
    {
      name: 'Dr. Karim Mansouri',
      subject: 'Business & Management',
      experience: '10 ans',
      rating: 4.7,
      specialties: ['Leadership', 'Marketing', 'Finance'],
      description: 'Consultant en management avec une expérience internationale.'
    },
    {
      name: 'Prof. Leila Bouaziz',
      subject: 'Littérature Arabe',
      experience: '15 ans',
      rating: 4.8,
      specialties: ['Poésie', 'Histoire', 'Rhétorique'],
      description: 'Professeure agrégée, passionnée par le patrimoine littéraire arabe.'
    },
    {
      name: 'Dr. Ahmed Khedher',
      subject: 'Préparation IELTS/TOEIC',
      experience: '9 ans',
      rating: 4.9,
      specialties: ['IELTS', 'TOEIC', 'Cambridge Exams'],
      description: 'Formateur certifié pour les examens internationaux d\'anglais.'
    }
  ];

  const handleWhatsAppContact = (teacherName: string) => {
    const message = `Bonjour! Je suis intéressé(e) par les cours de ${teacherName} chez SmartHub.`;
    window.open(`https://wa.me/21699730144?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nos Enseignants
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-blue-100">
              Experts Certifiés
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Une équipe d'enseignants qualifiés et passionnés, prêts à vous accompagner vers l'excellence académique
          </p>
        </div>
      </section>

      {/* Subject Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Matières Enseignées
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${subject.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <subject.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {subject.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Notre Équipe Pédagogique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {teacher.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Teacher Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-2">
                    {teacher.subject}
                  </p>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-700 font-semibold">
                      {teacher.rating}
                    </span>
                    <span className="ml-2 text-gray-500">
                      ({teacher.experience})
                    </span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {teacher.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm text-center mb-6">
                  {teacher.description}
                </p>

                {/* Contact Button */}
                <button
                  onClick={() => handleWhatsAppContact(teacher.name)}
                  className="w-full flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contacter sur WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">14+</div>
              <div className="text-gray-700">Enseignants Experts</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
              <div className="text-gray-700">Note Moyenne</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-700">Taux de Réussite</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">6</div>
              <div className="text-gray-700">Matières Enseignées</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à Commencer Votre Parcours d'Apprentissage ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contactez-nous dès maintenant pour trouver l'enseignant parfait pour vos besoins
          </p>
          <button
            onClick={() => handleWhatsAppContact('notre équipe')}
            className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Contactez-nous sur WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
};

export default Teachers;
```

## 4. src/components/Footer.tsx

```typescript
import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';

const Footer = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/21699730144?text=Bonjour! Je suis intéressé(e) par vos services SmartHub.', '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+21699730144';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:contact@smarthub.com.tn';
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SmartHub
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Centre éducatif premium au cœur de Tunis, offrant des espaces d'apprentissage modernes et des enseignants qualifiés.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </button>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
            <div className="space-y-4">
              <button
                onClick={handlePhoneClick}
                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors group w-full text-left"
              >
                <Phone className="w-5 h-5 mr-3 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>+216 99 730 144</span>
              </button>
              <button
                onClick={handleEmailClick}
                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors group w-full text-left"
              >
                <Mail className="w-5 h-5 mr-3 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>contact@smarthub.com.tn</span>
              </button>
              <div className="flex items-start text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-blue-400 mt-1 flex-shrink-0" />
                <span>
                  Rue de Belgique, Immeuble MAE<br />
                  1er étage, Bureau 1.1<br />
                  1000 Tunis, Tunisie
                </span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-white">Horaires</h3>
            <div className="space-y-3">
              <div className="flex items-start text-gray-300">
                <Clock className="w-5 h-5 mr-3 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white mb-2">Lundi - Vendredi</div>
                  <div className="text-sm">8:00 - 13:00</div>
                  <div className="text-sm">15:00 - 20:00</div>
                </div>
              </div>
              <div className="flex items-start text-gray-300 ml-8">
                <div>
                  <div className="font-medium text-white mb-2">Samedi</div>
                  <div className="text-sm">9:00 - 13:00</div>
                  <div className="text-sm">15:00 - 18:00</div>
                </div>
              </div>
              <div className="flex items-start text-gray-300 ml-8">
                <div>
                  <div className="font-medium text-white mb-2">Dimanche</div>
                  <div className="text-sm">9:00 - 18:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-blue-400 transition-colors">• Location de salles</li>
              <li className="hover:text-blue-400 transition-colors">• Cours particuliers</li>
              <li className="hover:text-blue-400 transition-colors">• Formation en groupe</li>
              <li className="hover:text-blue-400 transition-colors">• Préparation aux examens</li>
              <li className="hover:text-blue-400 transition-colors">• Formation professionnelle</li>
              <li className="hover:text-blue-400 transition-colors">• Coaching académique</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 SmartHub - ELMAOUIA ET.CO. Tous droits réservés.
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={handlePhoneClick}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={handleEmailClick}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

## 5. package.json (Simplified)

```json
{
  "name": "smarthub-static",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "deploy": "npm run build && netlify deploy --prod"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.8.2",
    "lucide-react": "^0.542.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@typescript-eslint/eslint-plugin": "^8.15.0",
    "@typescript-eslint/parser": "^8.15.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.15.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.14",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.8.3",
    "vite": "^7.1.2"
  }
}
```

## 6. Remove These Files/Folders (Clean up)

Delete or move to backup folders:
- `src/components/auth/` (all authentication components)
- `src/components/dashboard/` (all dashboard components)
- `src/components/messaging/` (messaging components)
- `src/components/calendar/` (except keep GoogleMapEmbed.tsx)
- `src/contexts/AuthContext.tsx`
- `src/contexts/NotificationContext.tsx`
- `src/services/` (api.ts, websocket.ts, etc.)
- `src/hooks/` (complex hooks)
- `src/data/` (complex data files - not needed for simple version)
- `backend/` (entire backend folder)

## 7. Keep These Files (Essential)

Keep and verify these files are working:
- `src/components/GoogleMapEmbed.tsx` (for location display)
- `src/components/ui/Button.tsx` (if used)
- `src/components/ui/Card.tsx` (if used)
- `src/pages/Home.tsx` (main landing page)
- `src/pages/Rooms.tsx` (room information)
- `src/pages/LearnMore.tsx` (educational content)
- `src/main.tsx` (React entry point)
- `src/index.css` (global styles)
- `public/` folder with images

## Installation Steps

1. **Copy the files above** to your SmartHub project directory
2. **Clean dependencies** by running:
   ```bash
   npm install
   ```
3. **Remove unused imports** in existing files that reference deleted components
4. **Test the application**:
   ```bash
   npm run dev
   ```
5. **Build for production**:
   ```bash
   npm run build
   ```

## Contact Integration Summary

✅ **WhatsApp Business**: +216 99 730 144
✅ **Phone**: +216 99 730 144  
✅ **Email**: contact@smarthub.com.tn
✅ **Address**: Rue de Belgique, Immeuble MAE, Bureau 1.1, Tunis
✅ **Operating Hours**: Monday-Saturday with lunch breaks, Sunday 9-18

The simplified version maintains all the beautiful design and styling while focusing solely on:
- **Google Maps integration** for location
- **WhatsApp CTA** throughout the site
- **Static teacher profiles** 
- **Room information**
- **Contact information**

This creates a clean, fast, static website that perfectly showcases your SmartHub business!