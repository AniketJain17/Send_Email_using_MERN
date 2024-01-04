const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email, subject, message } = req.body;
  console.log(email, subject, message);

  const image = req.file; // Access the uploaded image using req.file

  if(!image) {
    return res.status(400).json({error: 'No image uploaded'});
  }
  
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    text: message,
    attachments: [
      {
        filename: image.originalname, // Use the original filename
        content: image.buffer, // Use the image buffer
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Email could not be sent." });
    } else {
      console.log("Email sent successfully!");
      return res.status(200).json({ message: "Email sent successfully!" });
    }
  });
});


module.exports = { sendEmail };
