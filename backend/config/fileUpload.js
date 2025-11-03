import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Use memory storage for Vercel serverless environment
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
  }
};

export const uploadResume = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
}).single('resume');

// Generate unique filename for base64 storage
export const generateUniqueFilename = (originalname) => {
  const extension = path.extname(originalname);
  return `${uuidv4()}_${Date.now()}${extension}`;
};

// Convert file buffer to base64 string for database storage
export const fileToBase64 = (buffer, mimeType) => {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
};

// Extract base64 data from data URL
export const base64ToBuffer = (base64String) => {
  try {
    // Remove data:mime;base64, prefix if present
    const base64Data = base64String.split(',')[1] || base64String;
    return Buffer.from(base64Data, 'base64');
  } catch (error) {
    console.error('Error converting base64 to buffer:', error);
    throw new Error('Invalid base64 data');
  }
};

// Get file extension from base64 data URL
export const getFileExtensionFromBase64 = (base64String) => {
  try {
    const mimeType = base64String.split(';')[0].split(':')[1];
    const extensionMap = {
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'text/plain': '.txt'
    };
    return extensionMap[mimeType] || '.pdf';
  } catch (error) {
    return '.pdf'; // Default fallback
  }
};

// Generate resume URL for base64 stored files
export const getResumeUrl = (fileId) => {
  return `/api/files/resume/${fileId}`;
};

// Validate base64 file size (for Vercel function limits)
export const validateBase64Size = (base64String, maxSizeMB = 5) => {
  try {
    // Calculate approximate file size from base64
    const base64Data = base64String.split(',')[1] || base64String;
    const sizeInBytes = (base64Data.length * 3) / 4; // Base64 to bytes approximation
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    return sizeInMB <= maxSizeMB;
  } catch (error) {
    console.error('Error validating base64 size:', error);
    return false;
  }
};

// Delete resume file (now just a placeholder since we store in database)
export const deleteResumeFile = (filename) => {
  // Since files are stored as base64 in database, 
  // deletion is handled at the database level
  console.log(`Resume file deletion requested for: ${filename}`);
  return true;
};

export default { 
  uploadResume, 
  generateUniqueFilename,
  fileToBase64,
  base64ToBuffer,
  getFileExtensionFromBase64,
  getResumeUrl, 
  validateBase64Size,
  deleteResumeFile 
};