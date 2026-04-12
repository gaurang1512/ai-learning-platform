import * as Brevo from "@getbrevo/brevo";

const client = new Brevo.TransactionalEmailsApi();
client.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY, // ← API key, NOT smtp key this time
);

const sendMail = async ({ email, subject, html }) => {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.sender = { email: process.env.BREVO_USER, name: "StudyLLM" };
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;

  await client.sendTransacEmail(sendSmtpEmail);
};

export default sendMail;
