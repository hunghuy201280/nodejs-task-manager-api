const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = ({ email, name } = {}) => {
  sgMail.send({
    to: email,
    from: "humghuy201280@gmail.com",
    subject: "Welcome to Task Manager App",
    text: `Thank for joining us, ${name}.Let me know how you get along with the app`,
  });
};

const sendCancellationEmail = ({ email, name } = {}) => {
  sgMail.send({
    to: email,
    from: "humghuy201280@gmail.com",
    subject: "Cancellation of Task Manager App",
    text: `It's sad for seeing you off, ${name}.Feel free to join us again if you need!`,
  });
};
module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
