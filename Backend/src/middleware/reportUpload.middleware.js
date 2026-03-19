const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Absolute directory where uploaded report files will be stored.
const uploadDir = path.join(__dirname, '../../uploads/reports');

// Ensure upload directory exists before handling uploads.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure how files are saved to disk.
const storage = multer.diskStorage({
  // Save all report files in the configured reports folder.
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // Generate a unique file name to avoid collisions.
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `report-${timestamp}-${random}${ext}`);
  }
});


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

module.exports = reportUpload;
