const express = require('express');



const {
  sendNotification
} = require('../controllers/notification');
const limitRequests = require('../middleware/rateLimiter');

const router = express.Router();

const app = express();





router.get('/' ,limitRequests(2, 30), sendNotification)



module.exports = router;
