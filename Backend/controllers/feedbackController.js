const nodemailer = require('nodemailer');

const sendFeedback = async (req, res) => {
  const { feedback } = req.body;
  const { name, email } = req.user; // Get user details from the protect middleware

  if (!feedback) {
    return res.status(400).json({ message: 'Feedback is required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail password or app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'sau24082004@gmail.com', // The developer's email address
    subject: `New Feedback from ${name}`,
    text: `Feedback from: ${name} (${email})\n\n${feedback}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error sending feedback:', error);
    res.status(500).json({ message: 'Failed to send feedback' });
  }
};

module.exports = { sendFeedback };
