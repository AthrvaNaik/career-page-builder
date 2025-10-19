const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const fileFilter = (req, file, cb) => {
  
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|mov|avi|wmv/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (file.fieldname === 'logo' || file.fieldname === 'banner') {
    
    if (allowedImageTypes.test(extname) && mimetype.startsWith('image/')) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files are allowed for logo and banner'));
    }
  } else if (file.fieldname === 'video') {
    
    if (allowedVideoTypes.test(extname) && mimetype.startsWith('video/')) {
      return cb(null, true);
    } else {
      return cb(new Error('Only video files are allowed'));
    }
  }
  
  cb(new Error('Unexpected field'));
};


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;