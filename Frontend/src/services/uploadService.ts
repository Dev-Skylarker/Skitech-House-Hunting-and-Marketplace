import { apiService } from './apiService';

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    url: string;
    public_id: string;
    original_name: string;
    size: number;
    format: string;
    width?: number;
    height?: number;
  };
  error?: string;
}

export interface FileInfo {
  url: string;
  public_id: string;
  original_name: string;
  size: number;
  format: string;
  width?: number;
  height?: number;
}

class UploadService {
  private getAuthHeaders() {
    const token = localStorage.getItem('skitech_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private getFormDataHeaders() {
    const token = localStorage.getItem('skitech_token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // Upload multiple images (for house listings)
  async uploadImages(files: File[]): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('images', file);
      });

      const response = await fetch(`${apiService.getApiUrl()}/api/upload/images`, {
        method: 'POST',
        headers: this.getFormDataHeaders(),
        body: formData
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload images error:', error);
      return {
        success: false,
        message: 'Failed to upload images',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Upload single image
  async uploadImage(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${apiService.getApiUrl()}/api/upload/image`, {
        method: 'POST',
        headers: this.getFormDataHeaders(),
        body: formData
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload image error:', error);
      return {
        success: false,
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Upload PDF
  async uploadPDF(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch(`${apiService.getApiUrl()}/api/upload/pdf`, {
        method: 'POST',
        headers: this.getFormDataHeaders(),
        body: formData
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload PDF error:', error);
      return {
        success: false,
        message: 'Failed to upload PDF',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('profile', file);

      const response = await fetch(`${apiService.getApiUrl()}/api/upload/profile`, {
        method: 'POST',
        headers: this.getFormDataHeaders(),
        body: formData
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload profile picture error:', error);
      return {
        success: false,
        message: 'Failed to upload profile picture',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Upload base64 image
  async uploadBase64Image(base64Data: string, filename?: string): Promise<UploadResponse> {
    try {
      const response = await fetch(`${apiService.getApiUrl()}/api/upload/base64-image`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          image: base64Data,
          filename: filename || 'image'
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload base64 image error:', error);
      return {
        success: false,
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Upload base64 PDF
  async uploadBase64PDF(base64Data: string, filename?: string): Promise<UploadResponse> {
    try {
      const response = await fetch(`${apiService.getApiUrl()}/api/upload/base64-pdf`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          pdf: base64Data,
          filename: filename || 'document'
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload base64 PDF error:', error);
      return {
        success: false,
        message: 'Failed to upload PDF',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Delete file
  async deleteFile(publicId: string, resourceType: 'image' | 'pdf' = 'image'): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const response = await fetch(`${apiService.getApiUrl()}/api/upload/file/${publicId}?resourceType=${resourceType}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Delete file error:', error);
      return {
        success: false,
        message: 'Failed to delete file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get file info
  async getFileInfo(publicId: string, resourceType: 'image' | 'pdf' = 'image'): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
    try {
      const response = await fetch(`${apiService.getApiUrl()}/api/upload/file/${publicId}?resourceType=${resourceType}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get file info error:', error);
      return {
        success: false,
        message: 'Failed to get file info',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Validate file type
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, GIF, and WebP images are allowed'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Image size must be less than 10MB'
      };
    }

    return { valid: true };
  }

  // Validate PDF file
  validatePDFFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (file.type !== 'application/pdf') {
      return {
        valid: false,
        error: 'Only PDF files are allowed'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'PDF size must be less than 20MB'
      };
    }

    return { valid: true };
  }

  // Validate profile picture
  validateProfilePicture(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, GIF, and WebP images are allowed'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Profile picture size must be less than 5MB'
      };
    }

    return { valid: true };
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate preview URL for base64
  generatePreviewUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
}

export const uploadService = new UploadService();
export default uploadService;
