import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { getServerConfig } from "./config.server";

// Server-only. The .server.ts suffix keeps this — and nodemailer, which needs
// Node's net/tls — out of the client bundle.

let cached: Transporter | null = null;
let cachedKey = "";

/**
 * SMTP transport for the Hostinger mailbox.
 *
 * `secure` is derived from the port rather than hard-coded, because the two get
 * confused constantly: 465 is implicit TLS (wrapped from the first byte), 587 is
 * plaintext-then-STARTTLS. Setting the wrong one hangs the connection until the
 * function times out. When we are on the STARTTLS port we require the upgrade
 * instead of allowing a silent fall back to cleartext, and we floor the protocol
 * at TLS 1.2 either way.
 *
 * Note this needs a runtime with raw TCP sockets — Node or Bun. It cannot run on
 * an edge/Workers runtime, which only allows outbound HTTP.
 */
export function getTransporter(): Transporter {
  const { smtpHost, smtpPort, smtpUser, smtpPass } = getServerConfig();

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS.");
  }

  // Rebuild if the credentials changed under us; otherwise reuse across warm invocations.
  const key = `${smtpHost}:${smtpPort}:${smtpUser}`;
  if (cached && cachedKey === key) return cached;

  const secure = smtpPort === 465;

  cached = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure,
    requireTLS: !secure,
    auth: { user: smtpUser, pass: smtpPass },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    // Pooling is left off (nodemailer's default): on serverless the container is
    // frozen between requests, so a pooled socket is dead by the time the next
    // one arrives. Fail fast rather than sitting on the function timeout.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  cachedKey = key;

  return cached;
}

/** Strips CR/LF so submitted values can never inject extra mail headers. */
export function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Escapes submitted values before they go into the HTML part of the mail. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
