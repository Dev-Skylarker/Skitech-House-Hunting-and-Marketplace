const express = require('express');
const multer = require('multer');
const router = express.Router();
const { 
  imageStorage, 
  pdfStorage, 
  profileStorage,
  uploadImage,
  uploadPDF,
  uploadProfilePicture,
  deleteFile,
  getFileInfo
} = require('../config/cloudinary');
const auth = require('../middleware/auth');

// Configure multer for different file types
const uploadImages = multer({ 
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Max 10 files at once
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const uploadPDFs = multer({ 
  storage: pdfStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for PDFs
    files: 5 // Max 5 files at once
  },
  fileFilter: (req, file, cb) => {
    // Accept PDFs only
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

const uploadProfile = multer({ 
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
    files: 1 // Only one profile picture
  },
  fileFilter: (req, file, cb) => {
    // Accept images only for profile
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile pictures'), false);
    }
  }
});

// Upload multiple images (for house listings)
router.post('/images', auth, uploadImages.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      original_name: file.originalname,
      size: file.size,
      format: file.mimetype.split('/')[1]
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: uploadedImages
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// Upload single image (for marketplace items, etc.)
router.post('/image', auth, uploadImages.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }

    const uploadedImage = {
      url: req.file.path,
      public_id: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      format: req.file.mimetype.split('/')[1]
    };

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: uploadedImage
    });
  } catch (error) {
    console.error('Single image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Upload PDF (for documents, contracts, etc.)
router.post('/pdf', auth, uploadPDFs.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF uploaded'
      });
    }

    const uploadedPDF = {
      url: req.file.path,
      public_id: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      format: 'pdf'
    };

    res.status(200).json({
      success: true,
      message: 'PDF uploaded successfully',
      data: uploadedPDF
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload PDF',
      error: error.message
    });
  }
});

// Upload profile picture
router.post('/profile', auth, uploadProfile.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture uploaded'
      });
    }

    const uploadedProfile = {
      url: req.file.path,
      public_id: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      format: req.file.mimetype.split('/')[1]
    };

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: uploadedProfile
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
      error: error.message
    });
  }
});

// Upload base64 image (for frontend uploads)
router.post('/base64-image', auth, async (req, res) => {
  try {
    const { image, filename = 'image' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided'
      });
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const result = await uploadImage(buffer, {
      public_id: `${filename}_${Date.now()}`
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result.url,
          public_id: result.public_id,
          format: result.format,
          size: result.size,
          width: result.width,
          height: result.height
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Base64 upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Upload base64 PDF
router.post('/base64-pdf', auth, async (req, res) => {
  try {
    const { pdf, filename = 'document' } = req.body;

    if (!pdf) {
      return res.status(400).json({
        success: false,
        message: 'No PDF data provided'
      });
    }

    // Convert base64 to buffer
    const base64Data = pdf.replace(/^data:application\/pdf;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const result = await uploadPDF(buffer, {
      public_id: `${filename}_${Date.now()}`
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'PDF uploaded successfully',
        data: {
          url: result.url,
          public_id: result.public_id,
          format: result.format,
          size: result.size
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to upload PDF',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Base64 PDF upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload PDF',
      error: error.message
    });
  }
});

// Delete file
router.delete('/file/:publicId', auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resourceType = 'image' } = req.query;

    const result = await deleteFile(publicId, resourceType);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
        error: result.error
      });
    }
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
});

// Get file info
router.get('/file/:publicId', auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resourceType = 'image' } = req.query;

    const result = await getFileInfo(publicId, resourceType);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found',
        error: result.error
      });
    }
  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get file info',
      error: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }
  
  if (error.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  if (error.message.includes('Only PDF files are allowed')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Upload failed',
    error: error.message
  });
});

module.exports = router;
