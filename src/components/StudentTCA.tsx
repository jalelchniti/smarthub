import React from 'react';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

interface StudentTCAProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentTCA: React.FC<StudentTCAProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 text-center">Demande d'Information - Étudiant</h3>
            <p className="text-gray-600 text-center mt-1">Rejoignez SmartHub en tant qu'étudiant</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center justify-center w-10 h-10 rounded-full p-0 border-gray-300 hover:border-red-400 hover:text-red-600"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6">
          <div className="mb-4 text-center">
            <p className="text-lg text-gray-700 font-medium mb-2">Formulaire d'Information :</p>
            <p className="text-gray-600">Remplissez ce formulaire pour recevoir plus d'informations sur nos services éducatifs</p>
          </div>
          <div className="flex justify-center">
            <iframe 
              width="540" 
              height="305" 
              src="https://e631d0f7.sibforms.com/serve/MUIFAC69023LELGenQ99uhNfVAihNH6v_L3gN6ICAUvJjiFtwfg8oXtq-VNKYuIaLVWfwaaxEn0rPjP0jNvEJdUDfF6yQd39EaKnPDOIjwRzy1UaFNmE0TzULgs2utUKAmG9kNU5wtSwmIBaavdZO_yG824Zr_XFv9hX9DDk8speRXYVz1006Od2DeilksxDc5BJSxyQubWFO4D7" 
              frameBorder="0" 
              scrolling="auto" 
              allowFullScreen 
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%' }}
              title="Formulaire de demande d'information étudiant"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTCA;