import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      company: z.string().optional(),
      enquiryType: z
        .enum([
          "Branding & Meta/Google Ads",
          "Video Production",
          "Digital Marketing & Ads",
          "Website Development",
          "Social Media Management",
          "Graphic Design",
          "General Inquiry",
        ])
        .default("General Inquiry"),
      message: z.string().min(10),
    }),
  )
  .handler(async ({ data }) => {
    const config = getServerConfig();
    const apiKey = config.sendgridApiKey;
    const fromEmail = config.sendgridFromEmail;
    const toEmail = config.sendgridToEmail;

    if (!apiKey || !fromEmail || !toEmail) {
      throw new Error(
        "Mail configuration not found. Please set SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, and SENDGRID_TO_EMAIL.",
      );
    }

    const payload = {
      personalizations: [
        {
          to: [{ email: toEmail }],
          subject: `New inquiry: ${data.enquiryType} from ${data.name}`,
        },
      ],
      from: { email: fromEmail },
      reply_to: { email: data.email },
      content: [
        {
          type: "text/plain",
          value: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone ?? "N/A"}\nCompany: ${data.company ?? "N/A"}\nService: ${data.enquiryType}\n\nMessage:\n${data.message}`,
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
