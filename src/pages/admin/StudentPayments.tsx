import { useState, useMemo, useEffect } from 'react';
import { DollarSign, Search, Plus, Edit2, Trash2, Filter, Calendar, User, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AdminDataStorage } from '../../utils/adminDataStorage';
import type { StudentPayment, AdminData, PaymentMethod } from '../../types/admin.types';

export default function AdminStudentPayments() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'partial' | 'pending'>('all');
  const [filterMonth, setFilterMonth] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<StudentPayment | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    method: 'cash' as PaymentMethod,
    period_covered: '',
    status: 'paid' as StudentPayment['status'],
    notes: ''
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AdminDataStorage.load();
        setAdminData(data);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Get students for dropdown
  const students = adminData?.students || [];

  // Filter payments
  const filteredPayments = useMemo(() => {
    if (!adminData) return [];
    let filtered = adminData.student_payments;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Filter by month
    if (filterMonth) {
      filtered = filtered.filter(p => p.payment_date.startsWith(filterMonth));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => {
        const student = students.find(s => s.id === p.student_id);
        return (
          student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.period_covered.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.amount.toString().includes(searchTerm)
        );
      });
    }

    return filtered.sort((a, b) => {
      return new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime();
    });
  }, [adminData, filterStatus, filterMonth, searchTerm, students]);

  // Calculate totals
  const totals = useMemo(() => {
    const payments = filteredPayments;
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

    return { total, paid, pending };
  }, [filteredPayments]);

  // Generate invoice number
  const generateInvoiceNumber = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const count = (adminData?.student_payments.length || 0) + 1;
    return `INV-${year}-${month}-${String(count).padStart(3, '0')}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData) return;

    if (editingPayment) {
      // Update existing payment
      const updated = adminData.student_payments.map(p =>
        p.id === editingPayment.id
          ? {
              ...p,
              ...formData,
              amount: parseFloat(formData.amount)
            }
          : p
      );

      const newData = { ...adminData, student_payments: updated, last_updated: new Date().toISOString() };
      await AdminDataStorage.save(newData);
      setAdminData(newData);
    } else {
      // Create new payment
      const newPayment: StudentPayment = {
        id: `payment-${Date.now()}`,
        student_id: formData.student_id,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        method: formData.method,
        period_covered: formData.period_covered,
        invoice_number: generateInvoiceNumber(),
        status: formData.status,
        notes: formData.notes,
        created_at: new Date().toISOString()
      };

      const newData = {
        ...adminData,
        student_payments: [...adminData.student_payments, newPayment],
        last_updated: new Date().toISOString()
      };
      await AdminDataStorage.save(newData);
      setAdminData(newData);
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      student_id: '',
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      method: 'cash',
      period_covered: '',
      status: 'paid',
      notes: ''
    });
    setEditingPayment(null);
    setShowModal(false);
  };

  // Handle edit
  const handleEdit = (payment: StudentPayment) => {
    setEditingPayment(payment);
    setFormData({
      student_id: payment.student_id,
      amount: payment.amount.toString(),
      payment_date: payment.payment_date,
      method: payment.method,
      period_covered: payment.period_covered,
      status: payment.status,
      notes: payment.notes || ''
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (paymentId: string) => {
    if (!adminData) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      const newData = {
        ...adminData,
        student_payments: adminData.student_payments.filter(p => p.id !== paymentId),
        last_updated: new Date().toISOString()
      };
      await AdminDataStorage.save(newData);
      setAdminData(newData);
    }
  };

  // Get student name
  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Inconnu';
  };

  // Get status badge
  const getStatusBadge = (status: StudentPayment['status']) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-red-100 text-red-800'
    };

    const labels = {
      paid: 'Payé',
      partial: 'Partiel',
      pending: 'En Attente'
    };

    const icons = {
      paid: <CheckCircle className="w-3 h-3" />,
      partial: <AlertCircle className="w-3 h-3" />,
      pending: <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  // Get payment method label
  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const labels: Record<PaymentMethod, string> = {
      cash: 'Espèces',
      check: 'Chèque',
      bank_transfer: 'Virement',
      mobile_payment: 'Mobile'
    };
    return labels[method];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur de chargement des données</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paiements Étudiants</h1>
          <p className="text-gray-600 mt-1">
            {filteredPayments.length} paiement{filteredPayments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Enregistrer Paiement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totals.total.toFixed(2)} TND</p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Payé</p>
              <p className="text-2xl font-bold text-green-600">{totals.paid.toFixed(2)} TND</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-red-600">{totals.pending.toFixed(2)} TND</p>
            </div>
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, facture, période..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="paid">Payé</option>
              <option value="partial">Partiel</option>
              <option value="pending">En Attente</option>
            </select>
          </div>

          {/* Month filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun paiement trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.invoice_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-900">{getStudentName(payment.student_id)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{payment.amount.toFixed(2)} TND</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.period_covered}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="w-3 h-3" />
                        {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <CreditCard className="w-3 h-3" />
                        {getPaymentMethodLabel(payment.method)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingPayment ? 'Modifier le Paiement' : 'Enregistrer un Paiement'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Student */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Étudiant *
                  </label>
                  <select
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un étudiant</option>
                    {students.filter(s => s.status === 'active').map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant (TND) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de Paiement *
                  </label>
                  <input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Period Covered */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Période Couverte *
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Octobre 2025"
                    value={formData.period_covered}
                    onChange={(e) => setFormData({ ...formData, period_covered: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Méthode de Paiement *
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as PaymentMethod })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="cash">Espèces</option>
                    <option value="check">Chèque</option>
                    <option value="bank_transfer">Virement Bancaire</option>
                    <option value="mobile_payment">Paiement Mobile</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentPayment['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="paid">Payé</option>
                    <option value="partial">Paiement Partiel</option>
                    <option value="pending">En Attente</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingPayment ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
