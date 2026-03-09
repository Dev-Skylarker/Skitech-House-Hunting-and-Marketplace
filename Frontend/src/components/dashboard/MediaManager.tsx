import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/FileUpload';
import { uploadService, FileInfo } from '@/services/uploadService';
import { 
  Image, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Copy, 
  Upload,
  FolderOpen,
  Grid3X3,
  List,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MediaManagerProps {
  className?: string;
}

export function MediaManager({ className }: MediaManagerProps) {
  const [uploadedImages, setUploadedImages] = useState<FileInfo[]>([]);
  const [uploadedPDFs, setUploadedPDFs] = useState<FileInfo[]>([]);
  const [profilePicture, setProfilePicture] = useState<FileInfo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleImageUpload = (files: FileInfo[]) => {
    setUploadedImages(prev => [...prev, ...files]);
  };

  const handlePDFUpload = (files: FileInfo[]) => {
    setUploadedPDFs(prev => [...prev, ...files]);
  };

  const handleProfileUpload = (files: FileInfo[]) => {
    if (files.length > 0) {
      setProfilePicture(files[0]);
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      });
    }
  };

  const handleDeleteFile = async (file: FileInfo, type: 'image' | 'pdf' | 'profile') => {
    try {
      const result = await uploadService.deleteFile(file.public_id, type === 'pdf' ? 'pdf' : 'image');
      
      if (result.success) {
        if (type === 'image') {
          setUploadedImages(prev => prev.filter(f => f.public_id !== file.public_id));
        } else if (type === 'pdf') {
          setUploadedPDFs(prev => prev.filter(f => f.public_id !== file.public_id));
        } else if (type === 'profile') {
          setProfilePicture(null);
        }
        
        toast({
          title: "File deleted",
          description: "The file has been successfully deleted.",
        });
      } else {
        throw new Error(result.error || 'Failed to delete file');
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : 'Failed to delete file',
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "URL has been copied to your clipboard.",
    });
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterFiles = (files: FileInfo[]) => {
    if (!searchTerm) return files;
    return files.filter(file => 
      file.original_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const MediaCard = ({ file, type }: { file: FileInfo; type: 'image' | 'pdf' | 'profile' }) => (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden">
          {type === 'image' || type === 'profile' ? (
            <img 
              src={file.url} 
              alt={file.original_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">
                {file.original_name}
              </p>
              <p className="text-xs text-slate-500">
                {uploadService.formatFileSize(file.size)}
                {file.width && file.height && (
                  <span> • {file.width}×{file.height}</span>
                )}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {file.format.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(file.url, '_blank')}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(file.url)}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadFile(file.url, file.original_name)}
              className="h-8 w-8 p-0"
            >
              <Download className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteFile(file, type)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Media Manager</h2>
          <p className="text-slate-600">Upload and manage your images and documents</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center border border-s slate-200 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0 rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0 rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="images" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Images ({uploadedImages.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents ({uploadedPDFs.length})
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Profile Picture
          </TabsTrigger>
        </TabsList>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Upload Images
              </CardTitle>
              <CardDescription>
                Upload images for house listings, marketplace items, and other content. 
                Supports JPEG, PNG, GIF, and WebP formats up to 10MB each.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                type="image"
                multiple={true}
                maxFiles={10}
                onUploadComplete={handleImageUpload}
                className="max-w-2xl"
              />
            </CardContent>
          </Card>

          {filterFiles(uploadedImages).length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Uploaded Images ({filterFiles(uploadedImages).length})
              </h3>
              
              <div className={cn(
                "grid gap-4",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              )}>
                {filterFiles(uploadedImages).map((file) => (
                  <MediaCard key={file.public_id} file={file} type="image" />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Upload PDF documents such as contracts, agreements, and other important files. 
                Maximum file size is 20MB.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                type="pdf"
                multiple={true}
                maxFiles={5}
                onUploadComplete={handlePDFUpload}
                className="max-w-2xl"
              />
            </CardContent>
          </Card>

          {filterFiles(uploadedPDFs).length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Uploaded Documents ({filterFiles(uploadedPDFs).length})
              </h3>
              
              <div className={cn(
                "grid gap-4",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {filterFiles(uploadedPDFs).map((file) => (
                  <MediaCard key={file.public_id} file={file} type="pdf" />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Profile Picture Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Profile Picture
              </CardTitle>
              <CardDescription>
                Upload your profile picture. This will be displayed across the platform. 
                Recommended size is 400x400 pixels. Maximum file size is 5MB.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full overflow-hidden">
                  {profilePicture ? (
                    <img 
                      src={profilePicture.url} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <FileUpload
                    type="profile"
                    multiple={false}
                    maxFiles={1}
                    onUploadComplete={handleProfileUpload}
                    className="max-w-md"
                  />
                </div>
              </div>
              
              {profilePicture && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Current Profile Picture</h4>
                  <div className="flex items-center gap-4">
                    <img 
                      src={profilePicture.url} 
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {profilePicture.original_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {uploadService.formatFileSize(profilePicture.size)}
                        {profilePicture.width && profilePicture.height && (
                          <span> • {profilePicture.width}×{profilePicture.height}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(profilePicture.url)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy URL
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(profilePicture, 'profile')}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MediaManager;
