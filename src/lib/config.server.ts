import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  // Zoho's India endpoint and the implicit-TLS port are the defaults, so a deploy
  // only strictly needs the mailbox credentials set.
  //
  // Zoho is region-sharded and a mailbox only authenticates against its own
  // datacenter: smtp.zoho.in, smtp.zoho.com, smtp.zoho.eu, smtp.zoho.com.au and so on.
  // The right one matches the domain you sign in on. Override SMTP_HOST if this
  // account is not on the India shard.
  const smtpPort = Number(process.env.SMTP_PORT ?? 465);

  return {
    nodeEnv: process.env.NODE_ENV,
    smtpHost: process.env.SMTP_HOST ?? "smtp.zoho.in",
    smtpPort: Number.isFinite(smtpPort) ? smtpPort : 465,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    // The envelope sender must be the authenticated mailbox or one of its verified
    // aliases — Zoho rejects a From it does not own.
    mailFrom: process.env.MAIL_FROM ?? process.env.SMTP_USER,
    mailTo: process.env.MAIL_TO ?? process.env.SMTP_USER,
  };
}
