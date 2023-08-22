const express = require('express');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

const app = express();

app.get('/', (req, res) => {
    res.send('Server running');
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running  in ${process.env.NODE_ENV} on port ${port}`));