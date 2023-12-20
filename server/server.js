require('./loadEnvironment');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const conn = require('./db/conn');
const apple = require('./routes/apple');
const spotify = require('./routes/spotify');
const auth = require('./routes/auth');
const transfers = require('./routes/transfers');
const sendEmail = require('./routes/send-email');
const redis = require('redis');
const RedisStore = require("connect-redis").default;


// Constants
const PORT = process.env.PORT || 8888;
const app = express();

// Session
if (process.env.NODE_ENV === 'production') {
  // Redis
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL // Redis URL from environment variable
  });
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.connect();

  app.set('trust proxy', 1);
  app.use(session({
    secret: 'matandolev', // Replace with your secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      domain: `.${process.env.FRONTEND_BASE_URI}`,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 1000
    },
    store: new RedisStore({ client: redisClient })
  }));
} else {
  app.use(session({
    secret: 'matandolev', // Replace with your secret key
    resave: false,
    saveUninitialized: false,
  }));
}

// Cors
const corsOptions = {
  origin: `https://www.${process.env.FRONTEND_BASE_URI}`,
  credentials: true,
};
app.use(cors(corsOptions));

// Json
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Server is running');
});

// Routes
app.use('/Apple', apple);
app.use('/Spotify', spotify);
app.use('/auth', auth);
app.use('/transfers', transfers);
app.use('/send-email', sendEmail);

// conn.getDb();

// Server Start
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT} with fixed page.`);
});
