// Admin Data Storage Utility
// Manages JSON data persistence via Backend API (saves to admin-data.json file)

import type { AdminData } from '../types/admin.types';
import React from 'react';

const API_BASE_URL = 'http://localhost:3001/api';
const STORAGE_VERSION = '1.0.0';

/**
 * Admin Data Storage Service
 * Provides CRUD operations for all admin data using Backend API that writes to admin-data.json
 */
export class AdminDataStorage {

  /**
   * Load admin data from backend API
   */
  static async load(): Promise<AdminData> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/data`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as AdminData;
      console.log('Admin data loaded from backend');
      return data;

    } catch (error) {
      console.error('Failed to load admin data from backend:', error);

      // Fallback: return empty structure if backend is unavailable
      // Components should handle this gracefully with their own fallback data
      throw error;
    }
  }

  /**
   * Save admin data to backend API (writes to admin-data.json)
   */
  static async save(data: AdminData): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Admin data saved to backend:', result.message);
      return true;

    } catch (error) {
      console.error('Failed to save admin data to backend:', error);
      alert('Erreur: Impossible de sauvegarder les données. Vérifiez que le serveur backend est démarré.');
      return false;
    }
  }

  /**
   * Export admin data as JSON string for backup
   */
  static async export(): Promise<string> {
    const data = await this.load();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import admin data from JSON string (for restore)
   */
  static async import(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData) as AdminData;

      // Basic validation
      if (!data.version || !data.rooms || !Array.isArray(data.rooms)) {
        throw new Error('Invalid data structure');
      }

      return await this.save(data);

    } catch (error) {
      console.error('Failed to import admin data:', error);
      alert('Erreur lors de l\'importation. Vérifiez le format JSON.');
      return false;
    }
  }

  /**
   * Download admin data as JSON file from backend
   */
  static async downloadBackup(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/backup`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `smarthub-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);
      console.log('Backup downloaded successfully');

    } catch (error) {
      console.error('Failed to download backup:', error);
      alert('Erreur: Impossible de télécharger la sauvegarde.');
    }
  }

  /**
   * Restore admin data from uploaded backup file
   */
  static async restoreBackup(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await fetch(`${API_BASE_URL}/admin/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Data restored successfully:', result.message);
      alert('Données restaurées avec succès!');
      return true;

    } catch (error) {
      console.error('Failed to restore backup:', error);
      alert('Erreur lors de la restauration. Vérifiez le fichier JSON.');
      return false;
    }
  }

  /**
   * Get empty data structure
   */
  private static getEmptyData(): AdminData {
    return {
      rooms: [],
      teachers: [],
      students: [],
      groups: [],
      bookings: [],
      student_enrollments: [],
      student_payments: [],
      teacher_payments: [],
      working_hours: [],
      holidays: [],
      waitlist: [],
      users: [],
      last_updated: new Date().toISOString(),
      version: STORAGE_VERSION
    };
  }

  /**
   * Check backend health
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

/**
 * React Hook for admin data management with backend API
 * Usage: const { data, updateData, loading, reload } = useAdminData();
 */
export function useAdminData() {
  const [data, setData] = React.useState<AdminData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Load data on mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const loadedData = await AdminDataStorage.load();
        setData(loadedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update data function
  const updateData = React.useCallback(async (updater: (prev: AdminData) => AdminData) => {
    if (!data) return;

    try {
      const updated = updater(data);
      const success = await AdminDataStorage.save(updated);

      if (success) {
        setData(updated);
      }
    } catch (err) {
      console.error('Failed to update data:', err);
      setError(err instanceof Error ? err : new Error('Failed to update data'));
    }
  }, [data]);

  // Reload data from backend
  const reload = React.useCallback(async () => {
    try {
      setLoading(true);
      const reloaded = await AdminDataStorage.load();
      setData(reloaded);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reload data'));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    updateData,
    reload
  };
}
