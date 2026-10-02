/**
 * Mailgun helper — wraps the mailgun.js SDK for server-side use only.
 * Requires MAILGUN_API_KEY and MAILGUN_DOMAIN env vars.
 */

import Mailgun from "mailgun.js";
import FormData from "form-data";

function getMailgunClient() {
  const mg = new Mailgun(FormData);
  return mg.client({ username: "api", key: process.env.MAILGUN_API_KEY ?? "" });
}

export interface SendOrderConfirmationParams {
  to: string;
  toName: string;
  orderId: string;
  items: Array<{
    name: string;
    portionLabel: string;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryDate: string;
  deliveryTimeWindow: string;
  streetAddress: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function buildOrderConfirmationHtml(p: SendOrderConfirmationParams): string {
  const itemRows = p.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#2d1f14;">
          <strong>${item.name}</strong>
          <span style="display:block;font-size:12px;color:#8a7866;margin-top:2px;">${item.portionLabel} × ${item.quantity}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#2d1f14;text-align:right;font-weight:600;">
          ${formatCurrency(item.lineTotal)}
        </td>
      </tr>`
    )
    .join("");

  const shippingRow =
    p.shippingCost > 0
      ? `<tr>
          <td style="padding:8px 0;font-size:14px;color:#8a7866;">Shipping</td>
          <td style="padding:8px 0;font-size:14px;color:#8a7866;text-align:right;">${formatCurrency(p.shippingCost)}</td>
        </tr>`
      : `<tr>
          <td style="padding:8px 0;font-size:14px;color:#5a8a5a;">Shipping</td>
          <td style="padding:8px 0;font-size:14px;color:#5a8a5a;text-align:right;font-weight:600;">FREE</td>
        </tr>`;

  const shortId = p.orderId.slice(0, 8).toUpperCase();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation — Velvet &amp; Crumb</title>
</head>
<body style="margin:0;padding:0;background-color:#faf7f2;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#2d1f14;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c5a96d;">Velvet &amp; Crumb Artisan Bakery</p>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#faf7f2;letter-spacing:-0.5px;">Your Order is Confirmed! 🎂</h1>
              <p style="margin:12px 0 0;font-size:14px;color:#c5a96d;">Order #${shortId}</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="background:#ffffff;padding:32px 40px 16px;">
              <p style="margin:0;font-size:16px;color:#2d1f14;line-height:1.6;">
                Hi <strong>${p.toName}</strong>, thank you for your order! Our bakers are already preparing your artisan treats with love.
              </p>
            </td>
          </tr>

          <!-- Delivery details -->
          <tr>
            <td style="background:#ffffff;padding:16px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;border-radius:12px;padding:20px;">
                <tr>
                  <td style="font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#c5a96d;padding-bottom:12px;">Delivery Details</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#2d1f14;padding:4px 0;">📅 <strong>${new Date(p.deliveryDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong></td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#2d1f14;padding:4px 0;">🕐 ${p.deliveryTimeWindow.replace("-", " – ").replace(/(\d{2}):00/g, (_, h) => `${parseInt(h) > 12 ? parseInt(h) - 12 : h}:00 ${parseInt(h) >= 12 ? "PM" : "AM"}`)}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#2d1f14;padding:4px 0;">📍 ${p.streetAddress}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="background:#ffffff;padding:16px 40px 8px;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#c5a96d;">Order Summary</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
                <tr><td colspan="2" style="padding:8px 0;"></td></tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#8a7866;">Subtotal</td>
                  <td style="padding:8px 0;font-size:14px;color:#8a7866;text-align:right;">${formatCurrency(p.subtotal)}</td>
                </tr>
                ${shippingRow}
                <tr>
                  <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#2d1f14;border-top:2px solid #2d1f14;">Total</td>
                  <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#2d1f14;text-align:right;border-top:2px solid #2d1f14;">${formatCurrency(p.total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#2d1f14;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#c5a96d;">Questions about your order? Reply to this email.</p>
              <p style="margin:0;font-size:12px;color:#8a6e52;">© 2026 Velvet &amp; Crumb Artisan Bakery. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends an HTML order confirmation email via Mailgun.
 * Returns `{ ok: true }` on success, `{ ok: false, error }` on failure.
 * Silently skips sending when MAILGUN_API_KEY is not set (useful in dev).
 */
export async function sendOrderConfirmation(
  params: SendOrderConfirmationParams
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    console.warn("[mailgun] MAILGUN_API_KEY or MAILGUN_DOMAIN not set — skipping email.");
    return { ok: true };
  }

  try {
    const mg = getMailgunClient();
    const shortId = params.orderId.slice(0, 8).toUpperCase();
    await mg.messages.create(domain, {
      from: `Velvet & Crumb <noreply@${domain}>`,
      to: [`${params.toName} <${params.to}>`],
      subject: `Your Velvet & Crumb Order #${shortId} is Confirmed! 🎂`,
      html: buildOrderConfirmationHtml(params),
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[mailgun] Failed to send order confirmation:", message);
    return { ok: false, error: message };
  }
}
