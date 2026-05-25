import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json'
]);

const allowedExtensions = new Set(['.pdf', '.txt', '.csv', '.json']);

// Reject unsupported files before they are written to disk.
const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.has(file.mimetype) || allowedExtensions.has(extension)) {
    return cb(null, true);
  }

  return cb(new Error('Unsupported file type. Please upload PDF, TXT, CSV, or JSON files only.'));
};

const reportUpload = multer({
  storage,
  fileFilter,
  limits: {
   
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

export default reportUpload;
