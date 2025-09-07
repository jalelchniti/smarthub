import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

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
              Centre éducatif premium au cœur de Tunis, offrant des espaces d'apprentissage modernes, des enseignants compétents et qualifiés, et une expérience d'enseignement exceptionnelle.
            </p>
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
              <div className="text-gray-300">
                <div className="font-medium text-white mb-2">Lundi - Vendredi</div>
                <div className="text-sm">8:00 - 13:00</div>
                <div className="text-sm">15:00 - 20:00</div>
              </div>
              <div className="text-gray-300">
                <div className="font-medium text-white mb-2">Samedi</div>
                <div className="text-sm">9:00 - 13:00</div>
                <div className="text-sm">15:00 - 18:00</div>
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;