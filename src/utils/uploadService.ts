// Photo Upload Service
// Handles file uploads to backend API

const API_BASE_URL = 'http://localhost:3001/api';

export interface UploadResponse {
  success: boolean;
  photoPath: string;
  filename: string;
  message: string;
}

/**
 * Upload teacher photo
 */
export async function uploadTeacherPhoto(file: File, teacherId: string): Promise<string> {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('entityId', teacherId);

  const response = await fetch(`${API_BASE_URL}/upload/teacher`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload photo');
  }

  const data: UploadResponse = await response.json();
  return data.photoPath;
}

/**
 * Upload student photo
 */
export async function uploadStudentPhoto(file: File, studentId: string): Promise<string> {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('entityId', studentId);

  const response = await fetch(`${API_BASE_URL}/upload/student`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload photo');
  }

  const data: UploadResponse = await response.json();
  return data.photoPath;
}

/**
 * Delete uploaded photo
 */
export async function deletePhoto(photoPath: string): Promise<void> {
  // Extract type and filename from path
  // Example: /uploads/teachers/teacher-123.jpg
  const parts = photoPath.split('/');
  const type = parts[2]; // 'teachers' or 'students'
  const filename = parts[3];

  const response = await fetch(`${API_BASE_URL}/upload/${type}/${filename}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete photo');
  }
}

/**
 * Get full photo URL for display
 */
export function getPhotoUrl(photoPath?: string): string {
  if (!photoPath) return '';
  // If it's already a full URL, return as is
  if (photoPath.startsWith('http')) return photoPath;
  // Otherwise, prepend base URL
  return `http://localhost:3001${photoPath}`;
}
