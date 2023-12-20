const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dolevjunk1903@gmail.com',
        pass: 'nkyp kdtj utay voen',
      },
    });
  
    const mailOptions = {
      from: 'dolevjunk1903@gmail.com',
      to: 'recipient-email@example.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error('Error sending email', error);
      res.status(500).send('Error sending email');
    }
  });

module.exports = router;