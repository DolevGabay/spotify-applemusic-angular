require('./loadEnvironment');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const conn = require('./db/conn');
const apple = require('./routes/apple');
const spotify = require('./routes/spotify');
const auth = require('./routes/auth');
const transfers = require('./routes/transfers');
const nodemailer = require('nodemailer');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

// Constants
const PORT = process.env.PORT || 8888;
const app = express();

// Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL // Redis URL from environment variable
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

// Session
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'matandolev', // Replace with your secret key
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: true, // Ensure cookies are only sent over HTTPS
      sameSite: 'none' // Allow cookies to be sent with cross-site requests
  }
}));

// Cors
const corsOptions = {
  origin: process.env.FRONTEND_BASE_URI,
  credentials: true,
};
app.use(cors(corsOptions));

// Json
app.use(express.json());

app.post('/send-email', async (req, res) => {
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

app.get('/', (_, res) => {
  res.send('Server is running');
});

// Routes
app.use('/Apple', apple);
app.use('/Spotify', spotify);
app.use('/auth', auth);
app.use('/transfers', transfers);

// conn.getDb();

// Server Start
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
