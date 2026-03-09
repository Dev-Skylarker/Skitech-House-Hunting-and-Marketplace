const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skitech/images',
    format: async (req, file) => {
      // Convert to webp for better compression
      if (file.mimetype.startsWith('image/')) {
        return 'webp';
      }
      return file.originalname.split('.').pop();
    },
    public_id: (req, file) => {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const originalName = file.originalname.split('.')[0];
      return `${originalName}_${timestamp}_${randomString}`;
    },
    resource_type: 'auto',
    transformation: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  }
});

// Configure storage for PDFs
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skitech/documents',
    format: 'pdf',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const originalName = file.originalname.split('.')[0];
      return `${originalName}_${timestamp}_${randomString}`;
    },
    resource_type: 'raw'
  }
});

// Configure storage for profile pictures (smaller, optimized)
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skitech/profiles',
    format: async (req, file) => 'webp',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      return `profile_${timestamp}_${randomString}`;
    },
    resource_type: 'auto',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  }
});

// Upload helper functions
const uploadImage = async (fileBuffer, options = {}) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'skitech/images',
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
          ...options
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const uploadPDF = async (fileBuffer, options = {}) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'skitech/documents',
          resource_type: 'raw',
          format: 'pdf',
          ...options
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary PDF upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const uploadProfilePicture = async (fileBuffer, options = {}) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'skitech/profiles',
          resource_type: 'auto',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
          ...options
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary profile upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete helper function
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === 'pdf' ? 'raw' : 'image'
    });
    
    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get file info
const getFileInfo = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType === 'pdf' ? 'raw' : 'image'
    });
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Cloudinary get info error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  cloudinary,
  imageStorage,
  pdfStorage,
  profileStorage,
  uploadImage,
  uploadPDF,
  uploadProfilePicture,
  deleteFile,
  getFileInfo
};
