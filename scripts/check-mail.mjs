// Sends one test message through the configured SMTP mailbox, so a deploy can be
// checked without submitting the contact form.
//
//   node --env-file=.env scripts/check-mail.mjs
//
// Reads the same variables as the site. Prints the server's queue id on success.

import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST ?? "smtp.zoho.in";
const port = Number(process.env.SMTP_PORT ?? 465);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.MAIL_FROM ?? user;
const to = process.env.MAIL_TO ?? user;

if (!user || !pass) {
  console.error("SMTP_USER and SMTP_PASS must be set. Pass them with --env-file=.env");
  process.exit(1);
}

const secure = port === 465;
const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  requireTLS: !secure,
  auth: { user, pass },
  tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

console.log(`Connecting to ${host}:${port} (secure=${secure}) as ${user}`);

try {
  await transporter.verify();
  console.log("Authenticated.");

  const info = await transporter.sendMail({
    from: { name: "Zencyp mail check", address: from },
    to,
    subject: "Zencyp SMTP check",
    text: "If this arrived, the contact form can send mail.",
  });

  console.log(`Sent to ${to} — ${info.response}`);
} catch (error) {
  // Surface the SMTP reply, which says far more than the generic message does.
  console.error(`Failed: ${error.code ?? "error"} — ${error.response ?? error.message}`);
  process.exitCode = 1;
} finally {
  transporter.close();
}
