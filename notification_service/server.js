const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const colors = require('colors')
const errorHandler = require('./middleware/error')
const ErrorResponse = require('./Utilities/ErrorResponse')
const cors = require('cors');
const limitRequests = require('./middleware/rateLimiter')
const fetch = require("node-fetch");
const Redis = require("ioredis");






// connect to the Database
// connectDB();

// load env vars
dotenv.config({ path: './config/config.env' });



const app = express();


const redis = new Redis('redis')




// Make our api public
app.use(cors());

// Body Parse
app.use(express.json());

app.use(errorHandler);






const Send = require('./Routes/Send')


/**
 * 
 * cache middleware to avoid hitting the users db on 
 * every time we fetch the user 
 * 
 */

 async function cache(req , res , next) {
  const userId = req.headers.id;

  redis.get(userId, (err , data) => {
    if(err) res.status(500).send({ err }) ;

    if(data !== null) {
      next();
    } else  {
      next();
    }
  })
}



/**
 * Middleware for the 
 * notification route 
 * 
 * We initialy check if the data isn't cached 
 * by the cache middlware above 
 * 
 * and if not we fetch a user and map their ID to their role using redis
 * 
 * 
 */


app.use("/api/v1/notification/send" ,cache,async function (req, res, next) {

  console.log('connected....'.yellow)


  const userId = req.headers.id;

  const user = await fetch(`http://users:5000/api/v1/user/${userId}`);

  const results = await user.json();


  if(results.data === null) {

    return next( new ErrorResponse("Access Denied", 401) )

  } else {
    redis.setex(userId , 2628000 , results.data.role) 
  }


  


  next()
}, Send)





const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} node on port ${PORT}`.yellow.bold
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.blue);

  // Close server

  server.close(() => {
    process.exit(1);
  });
});





