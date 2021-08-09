const ErrorResponse = require('../Utilities/ErrorResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @Desc        Add a Review
// @ROUTE       POST /api/v1/user/:id
// @access      Private
exports.getUser = asyncHandler(async (req, res, next) => {


  const user = await User.findById(req.params.id);


  res.status(201).json({ success: true, data: user });
});


