type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Sends email via Brevo (Sendinblue) transactional API.
 * Without BREVO_API_KEY, logs in development so local OTP still works.
 */
export async function sendEmail(input: SendEmailInput) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail =
    process.env.BREVO_FROM_EMAIL?.trim() || "noreply@campusclean.local";
  const fromName = process.env.BREVO_FROM_NAME?.trim() || "CampusClean";

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("BREVO_API_KEY is not configured.");
    }
    console.info("[mail:dev]", {
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
    return { mode: "dev" as const };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: input.to }],
      subject: input.subject,
      htmlContent: input.html,
      textContent: input.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[mail:brevo]", res.status, body);
    throw new Error("Could not send email. Try again shortly.");
  }

  return { mode: "brevo" as const };
}

export async function sendCitizenOtpEmail(email: string, code: string) {
  const subject = "Your CampusClean sign-in code";
  const text = `Your CampusClean code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #10241f;">
      <p style="font-size: 14px; letter-spacing: 0.12em; text-transform: uppercase; color: #0f8f78;">CampusClean</p>
      <h1 style="font-size: 24px; margin: 12px 0;">Your sign-in code</h1>
      <p style="font-size: 15px; color: #4d675e;">Use this one-time code to sign in. It expires in 10 minutes.</p>
      <p style="font-size: 32px; letter-spacing: 0.28em; font-weight: 700; margin: 24px 0;">${code}</p>
      <p style="font-size: 13px; color: #4d675e;">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html, text });
}
