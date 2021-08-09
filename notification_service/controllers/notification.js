const User = require("../models/User");
const ErrorResponse = require("../Utilities/ErrorResponse");
const limitRequests = require("../middleware/rateLimiter");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../Utilities/SendEmail");
const SendSms = require("../Utilities/SendSms");
const rateLimit = require("express-rate-limit");

const Redis = require("ioredis");
const redis = new Redis("redis");
// @Desc        Send Notification
// @ROUTE       POST /api/v1/user/:id/send_notification
// @access      Public
exports.sendNotification = asyncHandler(async (req, res, next) => {
  const message = req.body.message;
  const subject = req.body.subject;

  const notifications = [
    sendEmail({
      email: "support@irembo.io",
      subject: subject,
      message,
    }),
    SendSms(message),
  ];

  try {
    Promise.all(notifications);

    res.status(200).json({ success: true, data: "Message has been sent !" });
  } catch (err) {
    console.log(err);

    next(new ErrorResponse("Email couldn't be sent", 500));
  }
});
