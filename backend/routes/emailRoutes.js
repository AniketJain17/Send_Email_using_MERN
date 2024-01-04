const express = require("express");
const router = express.Router();

const multer = require("multer");
const { sendEmail } = require("../controllers/emailControllers");
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 1024 * 1024 * 10 }, // Adjust the file size limit as needed (e.g., 10 MB)
  }); // Set the destination folder for uploaded files
  
  router.post("/sendEmail", upload.single('image'), sendEmail);

module.exports = router;
