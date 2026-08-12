import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

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

    const config = getServerConfig();
    const apiKey = config.sendgridApiKey;
    const fromEmail = config.sendgridFromEmail;
    const toEmail = config.sendgridToEmail;

    if (!apiKey || !fromEmail || !toEmail) {
      throw new Error(
        "Mail configuration not found. Please set SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, and SENDGRID_TO_EMAIL.",
      );
    }

    const serviceList = data.services.join(", ");
    // Keep the subject scannable when several services are selected
    const subjectServices =
      data.services.length > 2
        ? `${data.services[0]} +${data.services.length - 1} more`
        : serviceList;

    const payload = {
      personalizations: [
        {
          to: [{ email: toEmail }],
          subject: `New inquiry: ${subjectServices} from ${data.name}`,
        },
      ],
      from: { email: fromEmail },
      reply_to: { email: data.email },
      content: [
        {
          type: "text/plain",
          value: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone ?? "N/A"}\nCompany: ${data.company ?? "N/A"}\nServices: ${serviceList}\n\nMessage:\n${data.message}`,
        },
      ],
    };

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Email send failed: ${response.status} ${body}`);
    }

    return { success: true };
  });
