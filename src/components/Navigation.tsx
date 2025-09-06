import { useState } from 'react';
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