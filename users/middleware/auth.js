/* This is authentication and verification middleware 
*/


const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../Utilities/ErrorResponse');
const User = require('../models/User');

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer')
  // ) {
  //   token = req.headers.authorization.split(' ')[1];
  // }


  if (req.cookies.token) {
    token = req.cookies.token;
  }

  //   Make sure the token is valid
  if (!token) {
    return next(new errorResponse('Access Denied please log in first', 401));
  }

  try {
    //   Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new errorResponse('Access Denied', 401));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorResponse(
          'Access limited to only certain users please consult your admin',
          403
        )
      );
    }
    next();
  };
};
