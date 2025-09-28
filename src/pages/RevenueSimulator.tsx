import React, { useState, useEffect } from 'react';
import { Calculator, Users, Clock, DollarSign, Shield, AlertTriangle, CheckCircle, TrendingUp, Building } from 'lucide-react';

const TeacherRevenueCalculator = () => {
  const [formData, setFormData] = useState({
    roomId: '2',
    studentCount: 6,
    sessionHours: 2,
    sessionsPerWeek: 2,
    studentFee: 120
  });

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Room pricing data
  const rooms = {
    '1': {
      name: 'Salle 1 (Premium)',
      capacity: 15,
      equipment: 'Projecteur Interactif, Climatisation, WiFi',
      pricing: [
        { min: 1, max: 1, rate: 20 },
        { min: 2, max: 6, rate: 25 },
        { min: 7, max: 9, rate: 30 },
        { min: 10, max: 15, rate: 35 }
      ]
    },
    '2': {
      name: 'Salle 2 (Standard)',
      capacity: 9,
      equipment: 'Tableau Blanc, Climatisation, WiFi',
      pricing: [
        { min: 1, max: 1, rate: 15 },
        { min: 2, max: 7, rate: 20 },
        { min: 8, max: 9, rate: 25 }
      ]
    },
    '3': {
      name: 'Salle 3 (Standard)',
      capacity: 9,
      equipment: 'Tableau Blanc, Climatisation, WiFi',
      pricing: [
        { min: 1, max: 1, rate: 15 },
        { min: 2, max: 7, rate: 20 },
        { min: 8, max: 9, rate: 25 }
      ]
    }
  };

  // Get room hourly rate based on student count
  const getRoomRate = (roomId, studentCount) => {
    const room = rooms[roomId];
    if (!room) return 0;
    
    const tier = room.pricing.find(p => studentCount >= p.min && studentCount <= p.max);
    return tier ? tier.rate : 0;
  };

  // Calculate teacher protection
  const calculateProtectedRevenue = (roomId, studentCount, hours, studentFee, sessionsPerWeek) => {
    const roomRateHTVA = getRoomRate(roomId, studentCount);
    const weeklyHours = hours * sessionsPerWeek;
    const monthlyHours = weeklyHours * 4;
    const monthlyStudentRevenue = studentFee * studentCount;
    const monthlyRoomCostHTVA = roomRateHTVA * monthlyHours;
    const monthlyRoomCostTTC = monthlyRoomCostHTVA * 1.19;
    
    const baseTeacherIncome = monthlyStudentRevenue - monthlyRoomCostTTC;
    const baseTeacherRate = baseTeacherIncome / monthlyHours;
    
    let finalRoomCostTTC = monthlyRoomCostTTC;
    let discountApplied = false;
    let discountPercentage = 0;
    let teacherFinalRate = baseTeacherRate;
    
    if (baseTeacherRate < 12) {
      const targetTeacherIncome = 12 * monthlyHours;
      const requiredRoomCost = monthlyStudentRevenue - targetTeacherIncome;
      const discountAmount = monthlyRoomCostTTC - requiredRoomCost;
      discountPercentage = (discountAmount / monthlyRoomCostTTC) * 100;
      
      if (discountPercentage <= 35) {
        finalRoomCostTTC = requiredRoomCost;
        teacherFinalRate = 12.00;
        discountApplied = true;
      } else {
        const maxDiscountAmount = monthlyRoomCostTTC * 0.35;
        finalRoomCostTTC = monthlyRoomCostTTC - maxDiscountAmount;
        teacherFinalRate = (monthlyStudentRevenue - finalRoomCostTTC) / monthlyHours;
        discountPercentage = 35.0;
        discountApplied = true;
      }
    }
    
    return {
      monthlyStudentRevenue,
      baseRoomCostTTC: monthlyRoomCostTTC,
      finalRoomCostTTC,
      discountApplied,
      discountPercentage: Math.min(discountPercentage, 35),
      discountAmount: monthlyRoomCostTTC - finalRoomCostTTC,
      teacherFinalRate,
      teacherMonthlyIncome: monthlyStudentRevenue - finalRoomCostTTC,
      monthlyHours,
      roomRateHTVA
    };
  };

  // Handle form changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate results
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const selectedRoom = rooms[formData.roomId];
      if (formData.studentCount > selectedRoom.capacity) {
        setResults({ error: `Capacité dépassée! Maximum ${selectedRoom.capacity} étudiants pour cette salle.` });
      } else {
        const calculation = calculateProtectedRevenue(
          formData.roomId,
          formData.studentCount,
          formData.sessionHours,
          formData.studentFee,
          formData.sessionsPerWeek
        );
        setResults(calculation);
      }
      setIsCalculating(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [formData]);

  const selectedRoom = rooms[formData.roomId];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">ELMAOUIA ET.CO</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Simulateur de Revenus Enseignants</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculez vos revenus nets avec notre système de protection enseignant garantissant un minimum de 12 TND/heure
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-3 text-blue-600" />
              Configuration
            </h2>

            <div className="space-y-6">
              {/* Room Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Building className="w-4 h-4 inline mr-2" />
                  Sélection de la salle
                </label>
                <div className="grid gap-3">
                  {Object.entries(rooms).map(([id, room]) => (
                    <div
                      key={id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.roomId === id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleInputChange('roomId', id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{room.name}</h3>
                          <p className="text-sm text-gray-600">{room.equipment}</p>
                          <p className="text-xs text-blue-600 mt-1">Capacité: {room.capacity} étudiants</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {getRoomRate(id, formData.studentCount)} TND/h
                          </div>
                          <div className="text-xs text-gray-500">HTVA</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Nombre d'étudiants
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedRoom.capacity}
                  value={formData.studentCount}
                  onChange={(e) => handleInputChange('studentCount', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {selectedRoom.capacity} étudiants pour {selectedRoom.name}
                </p>
              </div>

              {/* Session Hours */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Durée par session (heures)
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  step="0.5"
                  value={formData.sessionHours}
                  onChange={(e) => handleInputChange('sessionHours', parseFloat(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Sessions Per Week */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Sessions par semaine
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.sessionsPerWeek}
                  onChange={(e) => handleInputChange('sessionsPerWeek', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Student Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Frais par étudiant (TND/mois)
                </label>
                <input
                  type="number"
                  min="50"
                  value={formData.studentFee}
                  onChange={(e) => handleInputChange('studentFee', parseInt(e.target.value) || 120)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-green-600" />
              Résultats Financiers
            </h2>

            {isCalculating ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : results?.error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Erreur de Configuration</h3>
                  <p className="text-red-700">{results.error}</p>
                </div>
              </div>
            ) : results && (
              <div className="space-y-6">
                {/* Teacher Protection Status */}
                <div className={`p-4 rounded-xl border-2 ${
                  results.discountApplied 
                    ? 'border-orange-200 bg-orange-50' 
                    : 'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-center mb-2">
                    {results.discountApplied ? (
                      <Shield className="w-5 h-5 text-orange-600 mr-2" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    )}
                    <h3 className={`font-semibold ${
                      results.discountApplied ? 'text-orange-800' : 'text-green-800'
                    }`}>
                      {results.discountApplied ? 'Protection Enseignant Activée' : 'Revenus Standards'}
                    </h3>
                  </div>
                  <p className={`text-sm ${
                    results.discountApplied ? 'text-orange-700' : 'text-green-700'
                  }`}>
                    {results.discountApplied 
                      ? `Remise de ${results.discountPercentage.toFixed(1)}% appliquée pour garantir 12 TND/heure minimum`
                      : 'Vos revenus dépassent déjà le minimum garanti'
                    }
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-800">
                      {results.teacherFinalRate.toFixed(2)} TND
                    </div>
                    <div className="text-sm text-blue-600">Taux horaire final</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="text-2xl font-bold text-green-800">
                      {results.teacherMonthlyIncome.toFixed(0)} TND
                    </div>
                    <div className="text-sm text-green-600">Revenu mensuel net</div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 border-b pb-2">Détail des Calculs</h4>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Revenus étudiants/mois:</span>
                    <span className="font-semibold">{results.monthlyStudentRevenue.toFixed(0)} TND</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Coût salle (base):</span>
                    <span className="font-semibold">{results.baseRoomCostTTC.toFixed(0)} TND TTC</span>
                  </div>
                  
                  {results.discountApplied && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-orange-600">Remise protection:</span>
                      <span className="font-semibold text-orange-600">-{results.discountAmount.toFixed(0)} TND</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Coût salle final:</span>
                    <span className="font-semibold">{results.finalRoomCostTTC.toFixed(0)} TND TTC</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Heures mensuelles:</span>
                    <span className="font-semibold">{results.monthlyHours}h</span>
                  </div>
                  
                  <div className="flex justify-between py-3 bg-gray-50 px-3 rounded-lg font-semibold text-lg">
                    <span>Revenu enseignant:</span>
                    <span className="text-green-600">{results.teacherMonthlyIncome.toFixed(0)} TND</span>
                  </div>
                </div>

                {/* Room Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Information Salle</h4>
                  <p className="text-sm text-gray-600 mb-1">{selectedRoom.name}</p>
                  <p className="text-sm text-gray-600 mb-1">{selectedRoom.equipment}</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {results.roomRateHTVA} TND/h HTVA pour {formData.studentCount} étudiant{formData.studentCount > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            ELMAOUIA ET.CO - Espaces d'Excellence pour l'Enseignement Indépendant
          </p>
          <p className="text-xs mt-1">
            Système de protection enseignant garantissant un minimum de 12 TND/heure
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRevenueCalculator;