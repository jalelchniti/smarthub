import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Calendar,
  Clock,
  User,
  BookOpen,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AdminDataStorage } from '../../utils/adminDataStorage';
import type { AdminData, Group, Teacher } from '../../types/admin.types';

export default function AdminGroups() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    group_name: '',
    teacher_id: '',
    subject: '',
    level: '',
    capacity: 9,
    current_enrollment: 0,
    status: 'active' as 'active' | 'inactive',
    schedule: [
      { day: '', start_time: '', end_time: '' }
    ]
  });

  const subjects = [
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

  const levels = [
    'Primaire',
    'Collège',
    '7ème',
    '8ème',
    '9ème',
    'Secondaire',
    '1ère année secondaire',
    '2ème année secondaire',
    '3ème année secondaire',
    '4ème année secondaire',
    'Bac',
    'Universitaire'
  ];

  const days = [
    { value: 'monday', label: 'Lundi' },
    { value: 'tuesday', label: 'Mardi' },
    { value: 'wednesday', label: 'Mercredi' },
    { value: 'thursday', label: 'Jeudi' },
    { value: 'friday', label: 'Vendredi' },
    { value: 'saturday', label: 'Samedi' },
    { value: 'sunday', label: 'Dimanche' }
  ];

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const adminData = await AdminDataStorage.load();
      setData(adminData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Get teacher name by ID
  const getTeacherName = (teacherId: string): string => {
    const teacher = data?.teachers.find(t => t.id === teacherId);
    return teacher?.name || 'Enseignant non trouvé';
  };

  // Get teacher subject by ID
  const getTeacherSubjects = (teacherId: string): string[] => {
    const teacher = data?.teachers.find(t => t.id === teacherId);
    return teacher?.subjects || [];
  };

  // Filter groups
  const filteredGroups = data?.groups.filter(group => {
    const matchesSearch =
      group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTeacherName(group.teacher_id).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || group.status === filterStatus;

    return matchesSearch && matchesStatus;
  }) || [];

  // Open modal for new group
  const handleNewGroup = () => {
    setEditingGroup(null);
    setFormData({
      group_name: '',
      teacher_id: '',
      subject: '',
      level: '',
      capacity: 9,
      current_enrollment: 0,
      status: 'active',
      schedule: [{ day: '', start_time: '', end_time: '' }]
    });
    setShowModal(true);
  };

  // Open modal for editing
  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      group_name: group.group_name,
      teacher_id: group.teacher_id,
      subject: group.subject,
      level: group.level,
      capacity: group.capacity,
      current_enrollment: group.current_enrollment,
      status: group.status,
      schedule: group.schedule.length > 0 ? group.schedule : [{ day: '', start_time: '', end_time: '' }]
    });
    setShowModal(true);
  };

  // Add schedule slot
  const addScheduleSlot = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: '', start_time: '', end_time: '' }]
    });
  };

  // Remove schedule slot
  const removeScheduleSlot = (index: number) => {
    if (formData.schedule.length > 1) {
      const newSchedule = formData.schedule.filter((_, i) => i !== index);
      setFormData({ ...formData, schedule: newSchedule });
    }
  };

  // Update schedule slot
  const updateScheduleSlot = (index: number, field: string, value: string) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: newSchedule });
  };

  // Save group (create or update)
  const handleSaveGroup = async () => {
    if (!data) return;

    // Validation
    if (!formData.group_name.trim()) {
      alert('Le nom du groupe est requis');
      return;
    }
    if (!formData.teacher_id) {
      alert('Veuillez sélectionner un enseignant');
      return;
    }
    if (!formData.subject) {
      alert('La matière est requise');
      return;
    }
    if (!formData.level) {
      alert('Le niveau est requis');
      return;
    }

    // Validate schedule
    const validSchedule = formData.schedule.filter(
      slot => slot.day && slot.start_time && slot.end_time
    );
    if (validSchedule.length === 0) {
      alert('Veuillez ajouter au moins une plage horaire complète');
      return;
    }

    try {
      if (editingGroup) {
        // Update existing group
        const updatedGroups = data.groups.map(group =>
          group.id === editingGroup.id
            ? {
                ...group,
                group_name: formData.group_name,
                teacher_id: formData.teacher_id,
                subject: formData.subject,
                level: formData.level,
                capacity: formData.capacity,
                current_enrollment: formData.current_enrollment,
                status: formData.status,
                schedule: validSchedule,
                updated_at: new Date().toISOString()
              }
            : group
        );

        await AdminDataStorage.save({
          ...data,
          groups: updatedGroups
        });
      } else {
        // Create new group
        const newGroup: Group = {
          id: `group-${Date.now()}`,
          group_name: formData.group_name,
          teacher_id: formData.teacher_id,
          subject: formData.subject,
          level: formData.level,
          capacity: formData.capacity,
          current_enrollment: formData.current_enrollment,
          status: formData.status,
          schedule: validSchedule,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await AdminDataStorage.save({
          ...data,
          groups: [...data.groups, newGroup]
        });
      }

      setShowModal(false);
      loadData();
      alert(editingGroup ? 'Groupe mis à jour avec succès' : 'Groupe créé avec succès');
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Erreur lors de la sauvegarde du groupe');
    }
  };

  // Delete group
  const handleDeleteGroup = async (groupId: string) => {
    if (!data) return;

    // Check if any students are enrolled in this group
    const enrolledStudents = data.student_enrollments.filter(
      enrollment => enrollment.group_id === groupId && enrollment.status === 'active'
    );

    if (enrolledStudents.length > 0) {
      const confirmDelete = window.confirm(
        `Ce groupe a ${enrolledStudents.length} étudiant(s) inscrit(s). Êtes-vous sûr de vouloir le supprimer?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe?');
      if (!confirmDelete) return;
    }

    try {
      // Remove group
      const updatedGroups = data.groups.filter(group => group.id !== groupId);

      // Optionally: deactivate enrollments for this group
      const updatedEnrollments = data.student_enrollments.map(enrollment =>
        enrollment.group_id === groupId
          ? { ...enrollment, status: 'inactive' as const, updated_at: new Date().toISOString() }
          : enrollment
      );

      await AdminDataStorage.save({
        ...data,
        groups: updatedGroups,
        student_enrollments: updatedEnrollments
      });

      loadData();
      alert('Groupe supprimé avec succès');
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Erreur lors de la suppression du groupe');
    }
  };

  // Get day label in French
  const getDayLabel = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche'
    };
    return dayMap[day] || day;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const activeTeachers = data?.teachers.filter(t => t.status === 'active') || [];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Groupes</h1>
            <p className="text-gray-600">Créez et gérez les groupes d'étudiants avec leurs enseignants</p>
          </div>
          <button
            onClick={handleNewGroup}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouveau Groupe
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Groupes</p>
                <p className="text-2xl font-bold text-gray-900">{data?.groups.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Groupes Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.groups.filter(g => g.status === 'active').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Enseignants Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{activeTeachers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Matières</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(data?.groups.map(g => g.subject)).size || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, matière, niveau ou enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Groups List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun groupe trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Groupe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enseignant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matière & Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horaires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{group.group_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{getTeacherName(group.teacher_id)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{group.subject}</div>
                      <div className="text-sm text-gray-500">{group.level}</div>
                    </td>
                    <td className="px-6 py-4">
                      {group.schedule.map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>{getDayLabel(slot.day)}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{slot.start_time} - {slot.end_time}</span>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {group.current_enrollment} / {group.capacity}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${
                            group.current_enrollment >= group.capacity
                              ? 'bg-red-500'
                              : group.current_enrollment >= group.capacity * 0.8
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(group.current_enrollment / group.capacity) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          group.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {group.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditGroup(group)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal for Create/Edit Group */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingGroup ? 'Modifier le Groupe' : 'Nouveau Groupe'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Groupe *
                </label>
                <input
                  type="text"
                  value={formData.group_name}
                  onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                  placeholder="Ex: G1 - Mathématiques Bac"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Teacher Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enseignant *
                </label>
                <select
                  value={formData.teacher_id}
                  onChange={(e) => {
                    const teacherId = e.target.value;
                    setFormData({ ...formData, teacher_id: teacherId });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un enseignant</option>
                  {activeTeachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subjects.join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject & Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matière *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une matière</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un niveau</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Capacity & Current Enrollment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacité Maximale
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 9 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inscriptions Actuelles
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.current_enrollment}
                    onChange={(e) => setFormData({ ...formData, current_enrollment: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>

              {/* Schedule */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Horaires *
                  </label>
                  <button
                    type="button"
                    onClick={addScheduleSlot}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Ajouter un horaire
                  </button>
                </div>

                {formData.schedule.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <select
                      value={slot.day}
                      onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Jour</option>
                      {days.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => updateScheduleSlot(index, 'start_time', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <span className="text-gray-500">-</span>

                    <input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => updateScheduleSlot(index, 'end_time', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {formData.schedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeScheduleSlot(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Warning if teacher doesn't teach the subject */}
              {formData.teacher_id && formData.subject && !getTeacherSubjects(formData.teacher_id).includes(formData.subject) && (
                <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold">Attention</p>
                    <p>L'enseignant sélectionné n'enseigne pas {formData.subject}.</p>
                    <p className="mt-1">Matières de {getTeacherName(formData.teacher_id)}: {getTeacherSubjects(formData.teacher_id).join(', ')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveGroup}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingGroup ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
