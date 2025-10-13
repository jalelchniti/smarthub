import { useState, useMemo, useEffect } from 'react';
import { GraduationCap, Search, Plus, Edit2, Trash2, UserCheck, UserX, Filter, Phone, Mail, BookOpen, Upload, X } from 'lucide-react';
import { AdminDataStorage } from '../../utils/adminDataStorage';
import { uploadTeacherPhoto, getPhotoUrl, deletePhoto } from '../../utils/uploadService';
import type { Teacher, AdminData } from '../../types/admin.types';

// 9 subjects offered at SmartHub
const SUBJECTS = [
  'Mathématiques',
  'Physique',
  'Français',
  'Anglais',
  'Sciences de la Vie et de la Terre',
  'Arabe',
  'Informatique',
  'Économie & Gestion',
  'ESP'
];

export default function AdminTeachers() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Photo upload states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    photo: '',
    subjects: [] as string[],
    hourly_rate: 35,
    category: 'B1-B4' as 'A1-A2' | 'B1-B4'
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

  // Filter teachers
  const filteredTeachers = useMemo(() => {
    if (!adminData) return [];
    let filtered = adminData.teachers;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => {
        return (
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.phone.includes(searchTerm) ||
          t.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    return filtered.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [adminData, filterStatus, searchTerm]);

  // Handle photo file selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear photo selection
  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    setFormData({ ...formData, photo: '' });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData) return;

    if (formData.subjects.length === 0) {
      alert('Veuillez sélectionner au moins une matière');
      return;
    }

    try {
      setUploading(true);
      let photoPath = formData.photo;

      // Upload photo if a new file is selected
      if (photoFile) {
        const tempId = editingTeacher?.id || `teacher-${Date.now()}`;
        photoPath = await uploadTeacherPhoto(photoFile, tempId);
      }

      if (editingTeacher) {
        // Update existing teacher
        const updated = adminData.teachers.map(t =>
          t.id === editingTeacher.id
            ? {
                ...t,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bio: formData.bio,
                photo: photoPath,
                subjects: formData.subjects,
                payment_terms: {
                  hourly_rate: formData.hourly_rate,
                  category: formData.category
                },
                updated_at: new Date().toISOString()
              }
            : t
        );

        const newData = { ...adminData, teachers: updated, last_updated: new Date().toISOString() };
        await AdminDataStorage.save(newData);
        setAdminData(newData);
      } else {
        // Create new teacher
        const newTeacher: Teacher = {
          id: `teacher-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          photo: photoPath,
          subjects: formData.subjects,
          payment_terms: {
            hourly_rate: formData.hourly_rate,
            category: formData.category
          },
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const newData = {
          ...adminData,
          teachers: [...adminData.teachers, newTeacher],
          last_updated: new Date().toISOString()
        };
        await AdminDataStorage.save(newData);
        setAdminData(newData);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Erreur lors de la sauvegarde: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      bio: '',
      photo: '',
      subjects: [],
      hourly_rate: 35,
      category: 'B1-B4'
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setEditingTeacher(null);
    setShowModal(false);
  };

  // Handle edit
  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      bio: teacher.bio || '',
      photo: teacher.photo || '',
      subjects: teacher.subjects,
      hourly_rate: teacher.payment_terms.hourly_rate,
      category: teacher.payment_terms.category
    });
    // Set photo preview if teacher has a photo
    if (teacher.photo) {
      setPhotoPreview(getPhotoUrl(teacher.photo));
    }
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (teacherId: string) => {
    if (!adminData) return;

    // Check if teacher has active groups
    const hasGroups = adminData.groups.some(g => g.teacher_id === teacherId && g.status === 'active');
    if (hasGroups) {
      alert('Impossible de supprimer cet enseignant. Il a des groupes actifs.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      const newData = {
        ...adminData,
        teachers: adminData.teachers.filter(t => t.id !== teacherId),
        last_updated: new Date().toISOString()
      };
      await AdminDataStorage.save(newData);
      setAdminData(newData);
    }
  };

  // Handle status change
  const handleStatusChange = async (teacherId: string, newStatus: Teacher['status']) => {
    if (!adminData) return;
    const updated = adminData.teachers.map(t =>
      t.id === teacherId
        ? {
            ...t,
            status: newStatus,
            updated_at: new Date().toISOString()
          }
        : t
    );

    const newData = { ...adminData, teachers: updated, last_updated: new Date().toISOString() };
    await AdminDataStorage.save(newData);
    setAdminData(newData);
  };

  // Toggle subject selection
  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  // Get status badge
  const getStatusBadge = (status: Teacher['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      active: 'Actif',
      inactive: 'Inactif'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Enseignants</h1>
          <p className="text-gray-600 mt-1">
            {filteredTeachers.length} enseignant{filteredTeachers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter Enseignant
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone, matière..."
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
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun enseignant trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enseignant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matières
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarif
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
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Photo Avatar */}
                        {teacher.photo ? (
                          <img
                            src={getPhotoUrl(teacher.photo)}
                            alt={teacher.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                            {teacher.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {/* Name and Bio */}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          {teacher.bio && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-xs">
                              {teacher.bio}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Mail className="w-3 h-3" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="w-3 h-3" />
                          {teacher.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {teacher.subjects.map((subject, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-semibold">
                        {teacher.payment_terms.hourly_rate} TND/h
                      </div>
                      <div className="text-xs text-gray-500">
                        {teacher.payment_terms.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(teacher.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {teacher.status === 'active' && (
                          <button
                            onClick={() => handleStatusChange(teacher.id, 'inactive')}
                            className="text-gray-600 hover:text-gray-900"
                            title="Marquer comme inactif"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        )}
                        {teacher.status === 'inactive' && (
                          <button
                            onClick={() => handleStatusChange(teacher.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                            title="Marquer comme actif"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingTeacher ? 'Modifier l\'Enseignant' : 'Ajouter un Enseignant'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations de Base</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom Complet *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biographie / Description
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                      placeholder="Expérience, spécialités, diplômes, approche pédagogique..."
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo de profil
                    </label>
                    <div className="flex items-start gap-4">
                      {/* Photo Preview */}
                      <div className="flex-shrink-0">
                        {photoPreview ? (
                          <div className="relative">
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={clearPhoto}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <Upload className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <div className="flex-1">
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          {photoPreview ? 'Changer la photo' : 'Choisir une photo'}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG, GIF ou WEBP (max 5 MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Matières Enseignées *</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SUBJECTS.map((subject) => (
                    <label
                      key={subject}
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject)}
                        onChange={() => toggleSubject(subject)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Conditions de Paiement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tarif Horaire (TND) *
                    </label>
                    <select
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value={12}>12 TND/h</option>
                      <option value={15}>15 TND/h</option>
                      <option value={20}>20 TND/h</option>
                      <option value={25}>25 TND/h</option>
                      <option value={30}>30 TND/h</option>
                      <option value={35}>35 TND/h</option>
                      <option value={40}>40 TND/h</option>
                      <option value={45}>45 TND/h</option>
                      <option value={50}>50 TND/h</option>
                      <option value={55}>55 TND/h (+50)</option>
                      <option value={60}>60 TND/h (+50)</option>
                      <option value={65}>65 TND/h (+50)</option>
                      <option value={70}>70 TND/h (+50)</option>
                      <option value={75}>75 TND/h (+50)</option>
                      <option value={80}>80 TND/h (+50)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="A1-A2">A1-A2 (Premium)</option>
                      <option value="B1-B4">B1-B4 (Standard)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Enregistrement...
                    </>
                  ) : (
                    editingTeacher ? 'Mettre à jour' : 'Ajouter'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
