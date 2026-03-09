require('dotenv').config();
const { cloudinary, uploadImage, uploadPDF } = require('./config/cloudinary');

async function testCloudinaryConnection() {
  console.log('🔍 Testing Cloudinary connection...');
  
  try {
    // Test basic connection by checking account info
    const result = await cloudinary.api.account();
    console.log('✅ Cloudinary connection successful!');
    console.log('📊 Account info:', {
      cloud_name: result.cloud_name,
      enabled: result.enabled
    });
    
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

async function testImageUpload() {
  console.log('📤 Testing image upload...');
  
  try {
    // Create a simple test image buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const result = await uploadImage(testImageBuffer, {
      public_id: 'test_image_' + Date.now()
    });
    
    if (result.success) {
      console.log('✅ Image upload successful!');
      console.log('🔗 Image URL:', result.url);
      console.log('📏 Dimensions:', result.width + 'x' + result.height);
      
      // Clean up - delete the test image
      const deleteResult = await cloudinary.uploader.destroy(result.public_id);
      console.log('🗑️ Test image deleted:', deleteResult.result);
      
      return true;
    } else {
      console.error('❌ Image upload failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Image upload test failed:', error.message);
    return false;
  }
}

async function testPDFUpload() {
  console.log('📄 Testing PDF upload...');
  
  try {
    // Create a simple test PDF buffer
    const testPDFBuffer = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000054 00000 n\n0000000123 00000 n\n0000000225 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n312\n%%EOF',
      'latin1'
    );
    
    const result = await uploadPDF(testPDFBuffer, {
      public_id: 'test_pdf_' + Date.now()
    });
    
    if (result.success) {
      console.log('✅ PDF upload successful!');
      console.log('🔗 PDF URL:', result.url);
      console.log('📊 File size:', result.size + ' bytes');
      
      // Clean up - delete the test PDF
      const deleteResult = await cloudinary.uploader.destroy(result.public_id, { resource_type: 'raw' });
      console.log('🗑️ Test PDF deleted:', deleteResult.result);
      
      return true;
    } else {
      console.error('❌ PDF upload failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ PDF upload test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Cloudinary integration tests...\n');
  
  // Check environment variables
  console.log('🔧 Checking environment variables...');
  const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars.join(', '));
    console.log('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  
  console.log('✅ All environment variables are set.\n');
  
  // Run tests
  const connectionOk = await testCloudinaryConnection();
  console.log('');
  
  if (connectionOk) {
    const imageUploadOk = await testImageUpload();
    console.log('');
    
    const pdfUploadOk = await testPDFUpload();
    console.log('');
    
    if (imageUploadOk && pdfUploadOk) {
      console.log('🎉 All tests passed! Cloudinary integration is working correctly.');
      console.log('\n📋 Available upload endpoints:');
      console.log('  POST /api/upload/images - Upload multiple images');
      console.log('  POST /api/upload/image - Upload single image');
      console.log('  POST /api/upload/pdf - Upload PDF document');
      console.log('  POST /api/upload/profile - Upload profile picture');
      console.log('  POST /api/upload/base64-image - Upload base64 image');
      console.log('  POST /api/upload/base64-pdf - Upload base64 PDF');
      console.log('  DELETE /api/upload/file/:publicId - Delete file');
      console.log('  GET /api/upload/file/:publicId - Get file info');
    } else {
      console.log('❌ Some tests failed. Please check the error messages above.');
    }
  } else {
    console.log('❌ Cannot proceed with upload tests due to connection failure.');
  }
}

// Run the tests
runTests().catch(console.error);
