import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ email, subject, html }) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject,
    html,
  });
};

export default sendMail;
