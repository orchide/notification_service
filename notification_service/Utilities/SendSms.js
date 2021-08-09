const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

async function SendSms(message) {
   client.messages.create({
    to: "+250788533511",
    from: "+18643830295",
    body: message,
  });
}

module.exports = SendSms;
