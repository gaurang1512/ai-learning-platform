import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER, // your Brevo login email
    pass: process.env.BREVO_SMTP_KEY, // SMTP key from Brevo dashboard
  },
});

const sendMail = async ({ email, subject, html }) => {
  await transport.sendMail({
    from: process.env.BREVO_USER,
    to: email,
    subject,
    html,
  });
};

export default sendMail;
