/**
 * Cloudflare Pages Function: POST /api/rfq
 *
 * Validates the RFQ, verifies Cloudflare Turnstile, and emails it to the sales
 * mailbox through the Resend API (https://resend.com), with the optional spec
 * sheet attached and Reply-To set to the enquirer.
 *
 * Environment variables (Cloudflare Pages → Settings → Variables and Secrets):
 *   RESEND_API_KEY        secret, required
 *   TURNSTILE_SECRET_KEY  secret, required when PUBLIC_TURNSTILE_SITE_KEY is set
 *   RFQ_TO                optional, default sales@chalybesteel.com
 *   RFQ_FROM              optional, default "Chalybe Steel RFQ <rfq@chalybesteel.com>"
 *                         (the sending domain must be verified in Resend)
 */

interface Env {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RFQ_TO?: string;
  RFQ_FROM?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_FILE = /\.(pdf|docx?|xlsx?|csv|png|jpe?g)$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED = ["name", "company", "country", "email", "product", "quantity", "destination"];

const FIELDS: [string, string][] = [
  ["name", "Name"],
  ["company", "Company"],
  ["country", "Country"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["product", "Product"],
  ["od", "OD"],
  ["weight_wall", "Weight / wall"],
  ["grade", "Grade"],
  ["connection", "Connection"],
  ["psl", "PSL"],
  ["quantity", "Quantity"],
  ["quantity_unit", "Unit"],
  ["destination", "Destination"],
  ["delivery_date", "Required delivery"],
  ["incoterm", "Incoterm"],
  ["message", "Message"],
];

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function verifyTurnstile(token: string, secret: string, ip: string | null) {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, message: "Invalid form submission." }, 400);
  }

  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim().slice(0, 5000) : "";
  };

  // Honeypot: pretend success so bots learn nothing.
  if (get("website")) return json({ ok: true });

  if (env.TURNSTILE_SECRET_KEY) {
    const token = get("cf-turnstile-response");
    const ip = request.headers.get("CF-Connecting-IP");
    if (!token || !(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip))) {
      return json({ ok: false, message: "Verification failed. Please try again." }, 400);
    }
  }

  const missing = REQUIRED.filter((k) => !get(k));
  if (missing.length || !EMAIL.test(get("email")) || get("consent") !== "yes") {
    return json({ ok: false, message: "Please complete all required fields." }, 422);
  }

  const attachments: { filename: string; content: string }[] = [];
  const file = form.get("attachment");
  if (file && typeof file !== "string" && file.size > 0) {
    if (file.size > MAX_FILE_BYTES || !ACCEPTED_FILE.test(file.name)) {
      return json({ ok: false, message: "Attachment must be 5 MB or smaller." }, 422);
    }
    attachments.push({
      filename: file.name.replace(/[^\w.\- ]/g, "_"),
      content: toBase64(await file.arrayBuffer()),
    });
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, message: "Email delivery is not configured." }, 500);
  }

  const rows = FIELDS.filter(([k]) => get(k)).map(([k, label]) => [label, get(k)]);
  const text = rows.map(([l, v]) => `${l}: ${v}`).join("\n");
  const html = `<h2 style="font-family:Arial,sans-serif">New RFQ — chalybesteel.com</h2>
<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(
      ([l, v]) =>
        `<tr><th align="left" style="padding:6px 12px 6px 0;vertical-align:top;color:#565E68">${escapeHtml(l)}</th><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;

  const subject = `RFQ: ${get("product")} — ${get("company")} (${get("country")})`.slice(0, 200);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RFQ_FROM || "Chalybe Steel RFQ <rfq@chalybesteel.com>",
      to: [env.RFQ_TO || "sales@chalybesteel.com"],
      reply_to: get("email"),
      subject,
      text,
      html,
      attachments,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return json({ ok: false, message: "Could not send your RFQ. Please email us directly." }, 502);
  }

  return json({ ok: true });
};
