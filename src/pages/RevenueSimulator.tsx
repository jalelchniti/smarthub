import React, { useState, useEffect } from 'react';
import { Calculator, Users, Clock, DollarSign, TrendingUp, Building, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  capacity: number;
  pricing: { capacity: string; rate: number }[];
}

interface SimulationResult {
  monthlyRevenue: number;
  monthlyRoomCostHT: number;
  monthlyRoomCostTTC: number;
  vatAmount: number;
  netMonthlyIncome: number;
  weeklyHours: number;
  totalStudents: number;
  hourlyIncome: number;
  minimumHourlyIncome: number;
  roomDiscount: number;
  discountedRoomCostHT: number;
  discountedRoomCostTTC: number;
  discountedVatAmount: number;
  discountApplied: boolean;
}

// Room data from Rooms.tsx
const rooms: Room[] = [
    {
      id: '1',
      name: 'Salle 1',
      capacity: 15,
      pricing: [
        { capacity: 'Individuel (1 apprenant)', rate: 20 },
        { capacity: '2-6 personnes', rate: 25 },
        { capacity: '7-9 personnes', rate: 30 },
        { capacity: '10-15 personnes', rate: 35 }
      ]
    },
    {
      id: '2',
      name: 'Salle 2',
      capacity: 9,
      pricing: [
        { capacity: 'Individuel (1 apprenant)', rate: 15 },
        { capacity: '2-7 personnes', rate: 20 },
        { capacity: '8-9 personnes', rate: 25 }
      ]
    },
    {
      id: '3',
      name: 'Salle 3',
      capacity: 9,
      pricing: [
        { capacity: 'Individuel (1 apprenant)', rate: 15 },
        { capacity: '2-7 personnes', rate: 20 },
        { capacity: '8-9 personnes', rate: 25 }
      ]
    }
];

export const RevenueSimulator: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [studentsPerGroup, setStudentsPerGroup] = useState<number>(1);
  const [sessionHours, setSessionHours] = useState<number>(1);
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(1);
  const [feePerStudent, setFeePerStudent] = useState<number>(120);
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Calculate simulation results
  useEffect(() => {
    // Get room hourly rate based on number of students
    const getRoomRate = (roomId: string, students: number): number => {
      const room = rooms.find(r => r.id === roomId);
      if (!room) return 0;

      if (students === 1) return room.pricing[0].rate;
      
      for (const tier of room.pricing) {
        if (tier.capacity.includes('-')) {
          const [min, max] = tier.capacity.match(/(\d+)-(\d+)/)?.slice(1, 3).map(Number) || [0, 0];
          if (students >= min && students <= max) {
            return tier.rate;
          }
        }
      }
      
      return room.pricing[room.pricing.length - 1].rate;
    };

    if (selectedRoom && studentsPerGroup > 0 && sessionHours > 0 && sessionsPerWeek > 0 && feePerStudent > 0) {
      const roomRate = getRoomRate(selectedRoom, studentsPerGroup);
      const weeklyHours = sessionHours * sessionsPerWeek;
      const monthlyHours = weeklyHours * 4.33; // Average weeks per month
      
      // Prevent division by zero
      if (monthlyHours <= 0) {
        setResult(null);
        return;
      }
      
      const monthlyRevenue = feePerStudent * studentsPerGroup;
      const monthlyRoomCostHT = roomRate * monthlyHours; // HT = VAT excluded
      const vatAmount = monthlyRoomCostHT * 0.19; // VAT on room cost
      const monthlyRoomCostTTC = monthlyRoomCostHT + vatAmount; // TTC = VAT included
      const netMonthlyIncome = monthlyRevenue - monthlyRoomCostTTC; // Revenue minus TTC room cost
      
      // Calculate teacher's net hourly income (after room costs)
      // This is what the teacher actually takes home per hour worked
      const teacherNetHourlyIncome = netMonthlyIncome / monthlyHours;
      const minimumHourlyIncome = 12; // TND per hour - SmartHub policy (net take-home)
      
      let roomDiscount = 0;
      let discountedRoomCostHT = monthlyRoomCostHT;
      let discountedVatAmount = vatAmount;
      let discountedRoomCostTTC = monthlyRoomCostTTC;
      let finalNetIncome = netMonthlyIncome;
      let discountApplied = false;
      
      // If teacher's net hourly income is below minimum, apply discount up to 35%
      if (teacherNetHourlyIncome < minimumHourlyIncome) {
        const requiredAdditionalIncome = (minimumHourlyIncome - teacherNetHourlyIncome) * monthlyHours;
        const maxDiscountAmountHT = monthlyRoomCostHT * 0.35; // Maximum 35% discount on HT cost
        
        // Calculate the required HT discount to achieve the target additional income
        // Since VAT is 19%, reducing HT by X saves teacher X * 1.19 total
        const requiredHTDiscount = requiredAdditionalIncome / 1.19; // Account for VAT savings
        
        // Apply discount (limited to maximum 35% of HT cost)
        const discountAmountHT = Math.min(requiredHTDiscount, maxDiscountAmountHT);
        
        // Only apply discount if it's meaningful (> 0.01 TND)
        if (discountAmountHT > 0.01 && monthlyRoomCostHT > 0) {
          roomDiscount = (discountAmountHT / monthlyRoomCostHT) * 100; // Percentage
          discountedRoomCostHT = monthlyRoomCostHT - discountAmountHT;
          discountedVatAmount = discountedRoomCostHT * 0.19;
          discountedRoomCostTTC = discountedRoomCostHT + discountedVatAmount;
          finalNetIncome = monthlyRevenue - discountedRoomCostTTC;
          discountApplied = true;
        }
      }

      setResult({
        monthlyRevenue,
        monthlyRoomCostHT,
        monthlyRoomCostTTC,
        vatAmount,
        netMonthlyIncome: finalNetIncome,
        weeklyHours,
        totalStudents: studentsPerGroup,
        hourlyIncome: finalNetIncome / monthlyHours,
        minimumHourlyIncome,
        roomDiscount,
        discountedRoomCostHT,
        discountedRoomCostTTC,
        discountedVatAmount,
        discountApplied
      });
    } else {
      setResult(null);
    }
  }, [selectedRoom, studentsPerGroup, sessionHours, sessionsPerWeek, feePerStudent]);

  const selectedRoomData = rooms.find(r => r.id === selectedRoom);
  
  // Helper function for getting room rate (duplicate of the one in useEffect)
  const getCurrentRoomRate = (roomId: string, students: number): number => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 0;

    if (students === 1) return room.pricing[0].rate;
    
    for (const tier of room.pricing) {
      if (tier.capacity.includes('-')) {
        const [min, max] = tier.capacity.match(/(\d+)-(\d+)/)?.slice(1, 3).map(Number) || [0, 0];
        if (students >= min && students <= max) {
          return tier.rate;
        }
      }
    }
    
    return room.pricing[room.pricing.length - 1].rate;
  };
  
  const currentRoomRate = selectedRoom ? getCurrentRoomRate(selectedRoom, studentsPerGroup) : 0;

  return (
    <div className="text-center">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 text-white section-padding overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <Calculator className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 text-center tracking-tight leading-normal">
              Simulateur de Revenus
              <span className="block text-yellow-300">
                Enseignants
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto text-center leading-relaxed">
              Calculez vos <span className="font-semibold text-yellow-300">revenus nets mensuels</span> en utilisant nos espaces d'apprentissage. 
              Outil exclusif pour planifier votre activité d'enseignement à SmartHub.
            </p>
            <div className="mt-8 bg-yellow-400 bg-opacity-20 border border-yellow-300 rounded-2xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-yellow-200">
                <AlertCircle className="w-5 h-5" />
                <span className="text-center text-sm">Outil confidentiel - Usage interne uniquement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="section-padding bg-gray-50 text-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Input Form */}
              <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Paramètres de Simulation
                </h2>

                <div className="space-y-6 text-center">
                  {/* Room Selection */}
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
                      <Building className="w-6 h-6 inline mr-2 text-blue-600" />
                      Salle d'Apprentissage
                    </label>
                    <select
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white text-lg font-medium"
                    >
                      <option value="">Sélectionnez une salle</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} (Capacité: {room.capacity} personnes)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Students per Group */}
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
                      <Users className="w-6 h-6 inline mr-2 text-purple-600" />
                      Nombre d'Étudiants par Groupe
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedRoomData?.capacity || 15}
                      value={studentsPerGroup}
                      onChange={(e) => setStudentsPerGroup(parseInt(e.target.value) || 1)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
                    />
                    {selectedRoomData && (
                      <p className="text-base text-gray-600 mt-3 text-center font-medium">
                        Maximum: {selectedRoomData.capacity} étudiants
                      </p>
                    )}
                  </div>

                  {/* Session Hours */}
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
                      <Clock className="w-6 h-6 inline mr-2 text-green-600" />
                      Durée d'une Séance (heures)
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      max="8"
                      step="0.5"
                      value={sessionHours}
                      onChange={(e) => setSessionHours(parseFloat(e.target.value) || 1)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
                    />
                  </div>

                  {/* Sessions per Week */}
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
                      <Calendar className="w-6 h-6 inline mr-2 text-orange-600" />
                      Nombre de Séances par Semaine
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={sessionsPerWeek}
                      onChange={(e) => setSessionsPerWeek(parseInt(e.target.value) || 1)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
                    />
                  </div>

                  {/* Fee per Student */}
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
                      <DollarSign className="w-6 h-6 inline mr-2 text-indigo-600" />
                      Frais par Étudiant (TND/mois)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={feePerStudent}
                      onChange={(e) => setFeePerStudent(parseInt(e.target.value) || 0)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
                    />
                    <div className="mt-3 text-center bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-base text-blue-700 font-bold">
                        💡 Recommandé: 120 TND/mois par étudiant
                      </p>
                    </div>
                  </div>

                  {/* Current Room Rate Display */}
                  {selectedRoom && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Building className="w-6 h-6 text-blue-600" />
                        <span className="text-lg font-bold text-gray-800">
                          Tarif salle: <span className="text-blue-600">{currentRoomRate} TND/heure</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Résultats de la Simulation
                </h2>

                {result ? (
                  <div className="space-y-6 text-center">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{result.weeklyHours}h</div>
                        <div className="text-sm text-gray-600">par semaine</div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{result.totalStudents}</div>
                        <div className="text-sm text-gray-600">étudiants</div>
                      </div>
                    </div>

                    {/* Revenue Breakdown */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                        <span className="font-medium text-gray-700">Revenus Mensuels Bruts</span>
                        <span className="text-xl font-bold text-green-600">+{result.monthlyRevenue.toFixed(0)} TND</span>
                      </div>
                      
                      {/* SmartHub Discount Section */}
                      {result.discountApplied && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                          <div className="text-center mb-3">
                            <span className="text-lg font-bold text-blue-700">🎁 Remise SmartHub Appliquée</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Tarif salle original HT:</span>
                              <span className="line-through text-gray-500">{result.monthlyRoomCostHT.toFixed(0)} TND</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-blue-700 font-medium">Remise appliquée ({result.roomDiscount.toFixed(1)}%):</span>
                              <span className="text-blue-700 font-bold">-{(result.monthlyRoomCostHT - result.discountedRoomCostHT).toFixed(0)} TND</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                        <span className="font-medium text-gray-700">Coût Location Salle HT</span>
                        <span className="text-xl font-bold text-red-600">
                          -{(result.discountApplied ? result.discountedRoomCostHT : result.monthlyRoomCostHT).toFixed(0)} TND
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
                        <span className="font-medium text-gray-700">TVA sur Location (19%)</span>
                        <span className="text-xl font-bold text-orange-600">
                          -{(result.discountApplied ? result.discountedVatAmount : result.vatAmount).toFixed(0)} TND
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-red-100 rounded-xl border-2 border-red-200">
                        <span className="font-bold text-gray-800">Coût Location Salle TTC</span>
                        <span className="text-xl font-bold text-red-700">
                          -{(result.discountApplied ? result.discountedRoomCostTTC : result.monthlyRoomCostTTC).toFixed(0)} TND
                        </span>
                      </div>
                      
                      <div className="border-t-2 border-gray-200 pt-4">
                        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
                          <span className="text-xl font-bold text-gray-900">Revenu Net Mensuel</span>
                          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            {result.netMonthlyIncome.toFixed(0)} TND
                          </span>
                        </div>
                      </div>

                      {/* Hourly Income Display */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">Revenu Horaire</span>
                          <span className="text-2xl font-bold text-orange-600">
                            {result.hourlyIncome.toFixed(1)} TND/h
                          </span>
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-sm text-gray-600">
                            Minimum garanti SmartHub: {result.minimumHourlyIncome} TND/h
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Profitability Indicator */}
                    <div className="mt-6">
                      {result.netMonthlyIncome > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 rounded-xl p-4">
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-semibold">Configuration Profitable</span>
                          </div>
                          {result.hourlyIncome >= result.minimumHourlyIncome ? (
                            <div className="flex items-center justify-center space-x-2 text-blue-600 bg-blue-50 rounded-xl p-3">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Revenu horaire optimal atteint</span>
                            </div>
                          ) : result.discountApplied ? (
                            <div className="flex items-center justify-center space-x-2 text-purple-600 bg-purple-50 rounded-xl p-3">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">SmartHub vous soutient avec une remise</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2 text-orange-600 bg-orange-50 rounded-xl p-3">
                              <AlertCircle className="w-5 h-5" />
                              <span className="font-medium">Revenu horaire en dessous du minimum</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2 text-red-600 bg-red-50 rounded-xl p-4">
                          <AlertCircle className="w-6 h-6" />
                          <span className="font-semibold">Ajustez les paramètres</span>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Remplissez tous les champs pour voir les résultats</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="section-padding bg-gray-900 text-white text-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6 text-center">
              Informations Importantes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="font-bold text-xl mb-4 text-center text-yellow-300">Calculs Utilisés</h4>
                <ul className="text-sm text-gray-200 space-y-2 text-center">
                  <li>• Mois = 4.33 semaines en moyenne</li>
                  <li>• TVA = 19% sur coût location salle</li>
                  <li>• Coût final = Location TTC (HT + TVA)</li>
                  <li>• Tarifs salles selon capacité</li>
                  <li>• Remise SmartHub jusqu'à 35% si nécessaire</li>
                </ul>
              </div>
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="font-bold text-xl mb-4 text-center text-green-300">Politique SmartHub</h4>
                <ul className="text-sm text-gray-200 space-y-2 text-center">
                  <li>• Revenu minimum garanti: 12 TND/heure</li>
                  <li>• Remise automatique si revenu insuffisant</li>
                  <li>• Frais étudiants recommandés: 120 TND/mois</li>
                  <li>• Groupes 6-8 étudiants optimal</li>
                  <li>• Contactez-nous pour réserver</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};