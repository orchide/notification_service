const express = require('express');

const {
  getUser
} = require('../Controllers/User');



// Merging params from the bootcamp route
const router = express.Router({ mergeParams: true });

router
  .route('/:id')
  .get(getUser);

module.exports = router;
