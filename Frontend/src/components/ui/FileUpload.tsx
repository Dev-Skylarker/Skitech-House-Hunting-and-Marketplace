import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';
import { uploadService, UploadResponse, FileInfo } from '@/services/uploadService';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  type: 'image' | 'pdf' | 'profile';
  multiple?: boolean;
  maxFiles?: number;
  onUploadComplete?: (files: FileInfo[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
}

interface UploadedFile extends FileInfo {
  id: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export function FileUpload({
  type,
  multiple = false,
  maxFiles = 1,
  onUploadComplete,
  onUploadError,
  className,
  disabled = false,
  accept,
  maxSize,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    switch (type) {
      case 'image':
        return uploadService.validateImageFile(file);
      case 'pdf':
        return uploadService.validatePDFFile(file);
      case 'profile':
        return uploadService.validateProfilePicture(file);
      default:
        return { valid: true };
    }
  }, [type]);

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    const id = Math.random().toString(36).substring(2, 9);
    const uploadedFile: UploadedFile = {
      id,
      url: '',
      public_id: '',
      original_name: file.name,
      size: file.size,
      format: file.type.split('/')[1],
      status: 'uploading',
      progress: 0,
    };

    setFiles(prev => [...prev, uploadedFile]);

    try {
      let response: UploadResponse;

      switch (type) {
        case 'image':
          response = multiple ? 
            await uploadService.uploadImages([file]) : 
            await uploadService.uploadImage(file);
          break;
        case 'pdf':
          response = await uploadService.uploadPDF(file);
          break;
        case 'profile':
          response = await uploadService.uploadProfilePicture(file);
          break;
        default:
          throw new Error('Invalid upload type');
      }

      if (response.success && response.data) {
        const updatedFile: UploadedFile = {
          ...uploadedFile,
          ...response.data,
          status: 'success',
          progress: 100,
        };

        setFiles(prev => prev.map(f => f.id === id ? updatedFile : f));
        return updatedFile;
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      const updatedFile: UploadedFile = {
        ...uploadedFile,
        status: 'error',
        error: errorMessage,
      };

      setFiles(prev => prev.map(f => f.id === id ? updatedFile : f));
      return null;
    }
  }, [type, multiple]);

  const handleFiles = useCallback(async (fileList: FileList) => {
    if (disabled || isUploading) return;

    const fileArray = Array.from(fileList);
    
    // Validate file count
    if (!multiple && fileArray.length > 1) {
      toast({
        title: "Too many files",
        description: `Only ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`,
        variant: "destructive",
      });
      return;
    }

    if (multiple && files.length + fileArray.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    // Validate each file
    const invalidFiles = fileArray.filter(file => !validateFile(file).valid);
    if (invalidFiles.length > 0) {
      const error = validateFile(invalidFiles[0]).error;
      toast({
        title: "Invalid file",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = fileArray.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      const successfulFiles = results.filter((f): f is UploadedFile => f !== null && f.status === 'success');
      const failedFiles = results.filter(f => f === null || f.status === 'error');

      if (successfulFiles.length > 0) {
        onUploadComplete?.(successfulFiles);
        toast({
          title: "Upload successful",
          description: `${successfulFiles.length} file${successfulFiles.length > 1 ? 's' : ''} uploaded`,
        });
      }

      if (failedFiles.length > 0) {
        onUploadError?.(`${failedFiles.length} file${failedFiles.length > 1 ? 's' : ''} failed to upload`);
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [disabled, isUploading, multiple, maxFiles, files.length, validateFile, uploadFile, onUploadComplete, onUploadError, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const getFileIcon = (format: string) => {
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(format.toLowerCase())) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getAcceptTypes = () => {
    if (accept) return accept;
    switch (type) {
      case 'image':
        return 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
      case 'pdf':
        return 'application/pdf';
      case 'profile':
        return 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
      default:
        return '*/*';
    }
  };

  const getMaxSizeText = () => {
    if (maxSize) return uploadService.formatFileSize(maxSize);
    switch (type) {
      case 'image':
        return '10MB';
      case 'pdf':
        return '20MB';
      case 'profile':
        return '5MB';
      default:
        return '10MB';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400",
          (disabled || isUploading) && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptTypes()}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
        
        <div className="flex flex-col items-center space-y-2">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
          
          <div>
            <p className="text-sm font-medium text-slate-700">
              {isUploading ? 'Uploading...' : 'Drop files here or click to browse'}
            </p>
            <p className="text-xs text-slate-500">
              {type === 'image' && 'Images (JPEG, PNG, GIF, WebP)'}
              {type === 'pdf' && 'PDF documents'}
              {type === 'profile' && 'Profile picture (JPEG, PNG, GIF, WebP)'}
              {' • Max ' + getMaxSizeText()}
              {multiple && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                file.status === 'success' && "border-green-200 bg-green-50",
                file.status === 'error' && "border-red-200 bg-red-50",
                file.status === 'uploading' && "border-blue-200 bg-blue-50"
              )}
            >
              {getFileIcon(file.format)}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {file.original_name}
                </p>
                <p className="text-xs text-slate-500">
                  {uploadService.formatFileSize(file.size)}
                  {file.status === 'success' && ' • Uploaded'}
                  {file.status === 'error' && ` • ${file.error}`}
                </p>
                
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="h-1 mt-1" />
                )}
              </div>

              <div className="flex items-center gap-2">
                {file.status === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {file.status === 'uploading' && (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  disabled={file.status === 'uploading'}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
