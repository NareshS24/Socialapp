const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Sanitize filename: remove spaces and special characters
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscores
      .replace(/ /g, '_') // Replace spaces with underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .toLowerCase();
    
    cb(null, Date.now() + "-" + sanitizedName);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;
