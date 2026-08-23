import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";
import { escapeHtml, getTransporter, headerSafe } from "../mailer.server";

export const SERVICE_OPTIONS = [
  "Branding",
  "Video Production",
  "Digital Marketing & Ads",
  "Website Development",
  "Social Media Management",
  "Graphic Design",
  "General Inquiry",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      company: z.string().optional(),
      /** Every service the visitor picked in step one. */
      services: z.array(z.enum(SERVICE_OPTIONS)).min(1).default(["General Inquiry"]),
      message: z.string().min(10).max(5000),
      /** Honeypot — hidden from real users, so any value means a bot filled it in. */
      website: z.string().max(0).optional(),
    }),
  )
  .handler(async ({ data }) => {
    // Silently accept and drop bot submissions so the bot gets no useful signal.
    if (data.website) return { success: true };

    const { mailFrom, mailTo } = getServerConfig();
    if (!mailFrom || !mailTo) {
      throw new Error("Mail configuration not found. Please set SMTP_USER (or MAIL_FROM/MAIL_TO).");
    }

    const serviceList = data.services.join(", ");
    // Keep the subject scannable when several services are selected
    const subjectServices =
      data.services.length > 2
        ? `${data.services[0]} +${data.services.length - 1} more`
        : serviceList;

    const rows: [string, string][] = [
      ["Name", data.name],
      ["Email", data.email],
      ["Phone", data.phone ?? "N/A"],
      ["Company", data.company ?? "N/A"],
      ["Services", serviceList],
    ];

    const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "Message:", data.message].join("\n");

    const html = [
      '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;line-height:1.6;color:#0a2e33">',
      '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">',
      ...rows.map(
        ([k, v]) =>
          `<tr><td style="padding:2px 16px 2px 0;color:#5b7278">${k}</td>` +
          `<td style="padding:2px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
      ),
      "</table>",
      '<p style="margin:20px 0 4px;color:#5b7278">Message</p>',
      // Submitted copy is escaped, then only newlines are turned back into markup.
      `<p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
      "</div>",
    ].join("");

    await getTransporter().sendMail({
      from: { name: "Zencyp website", address: mailFrom },
      to: mailTo,
      // So hitting reply in the inbox answers the visitor, not our own mailbox.
      replyTo: { name: headerSafe(data.name), address: data.email },
      subject: headerSafe(`New inquiry: ${subjectServices} from ${data.name}`),
      text,
      html,
    });

    return { success: true };
  });
