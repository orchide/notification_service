const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
const colors = require('colors')
const errorHandler = require('./middleware/error');



// connect to the Database
connectDB();

// load env vars
dotenv.config({ path: './config/config.env' });

const app = express();


// Make our api public
app.use(cors());

// Body Parse
app.use(express.json());


app.use(errorHandler);

const user = require('./Routes/User');

// Mout Routers
app.use('/api/v1/user', user);



const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} node on port ${PORT}`.yellow.bold
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server

  server.close(() => {
    process.exit(1);
  });
});

