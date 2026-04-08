interface OrderDetails {
  firstName: string;
  email: string;
  amount: string;
  currency: string;
  paymentId: string;
  date: string;
  receiptUrl?: string;
}

export function preorderConfirmEmailHtml(order: OrderDetails): string {
  const receiptLink = order.receiptUrl
    ? `<tr>
        <td style="padding-top:24px;">
          <a href="${order.receiptUrl}" style="display:inline-block;padding:12px 28px;border:1px solid #2a2a2a;color:#e8a87c;text-decoration:none;border-radius:100px;font-size:13px;font-weight:500;">
            View Stripe Receipt &rarr;
          </a>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-size:20px;font-weight:400;color:#f5f0eb;font-family:Georgia,serif;">Ordo</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:32px;font-weight:400;color:#f5f0eb;font-family:Georgia,serif;line-height:1.2;">
                Pre-order confirmed, ${order.firstName}.
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#908882;">
                Your Ordo pre-order is locked in. You're among the first to get an 18-gram AI copilot behind your ear.
              </p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#908882;">
                We'll keep you updated on development milestones and ship your unit as soon as it's ready.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <div style="width:60px;height:1px;background:#e8a87c;opacity:0.4;"></div>
            </td>
          </tr>

          <!-- Invoice -->
          <tr>
            <td style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #1c1c1c;">
                <tr>
                  <td colspan="2" style="padding:16px 20px;background:#111111;">
                    <span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#5a5550;font-family:monospace;">Invoice</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#908882;border-top:1px solid #1c1c1c;">Order ID</td>
                  <td style="padding:12px 20px;font-size:13px;color:#f5f0eb;text-align:right;border-top:1px solid #1c1c1c;font-family:monospace;">${order.paymentId}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#908882;border-top:1px solid #1c1c1c;">Date</td>
                  <td style="padding:12px 20px;font-size:13px;color:#f5f0eb;text-align:right;border-top:1px solid #1c1c1c;">${order.date}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#908882;border-top:1px solid #1c1c1c;">Email</td>
                  <td style="padding:12px 20px;font-size:13px;color:#f5f0eb;text-align:right;border-top:1px solid #1c1c1c;">${order.email}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#908882;border-top:1px solid #1c1c1c;">Product</td>
                  <td style="padding:12px 20px;font-size:13px;color:#f5f0eb;text-align:right;border-top:1px solid #1c1c1c;">Ordo — Pre-Order</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#908882;border-top:1px solid #1c1c1c;">Qty</td>
                  <td style="padding:12px 20px;font-size:13px;color:#f5f0eb;text-align:right;border-top:1px solid #1c1c1c;">1</td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;font-size:15px;font-weight:600;color:#f5f0eb;border-top:2px solid #2a2a2a;">Total</td>
                  <td style="padding:14px 20px;font-size:15px;font-weight:600;color:#e8a87c;text-align:right;border-top:2px solid #2a2a2a;">${order.amount} ${order.currency}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;font-size:13px;color:#908882;border-top:1px solid #1c1c1c;">Status</td>
                  <td style="padding:12px 20px;font-size:13px;color:#b8c9a3;text-align:right;border-top:1px solid #1c1c1c;">Paid &#10003;</td>
                </tr>
              </table>
            </td>
          </tr>

          ${receiptLink}

          <tr>
            <td style="padding:32px 0 48px;">
              <a href="https://ai.ordospaces.com" style="display:inline-block;padding:14px 32px;background:#e8a87c;color:#0a0a0a;text-decoration:none;border-radius:100px;font-size:14px;font-weight:600;">
                Visit ordospaces.com
              </a>
            </td>
          </tr>

          <!-- Refund policy -->
          <tr>
            <td style="padding-bottom:32px;border-top:1px solid #1c1c1c;padding-top:24px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#5a5550;font-family:monospace;">Refund policy</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#908882;">
                Full refund available anytime before shipping. 30-day return after delivery.
                <a href="https://ai.ordospaces.com/refund" style="color:#e8a87c;text-decoration:underline;">View full policy</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid #1c1c1c;padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#5a5550;">
                &copy; 2026 Ordo &middot; Ordion Labs Inc &middot; ai.ordospaces.com
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#5a5550;">
                Questions? Reach us at <a href="mailto:support@ordospaces.com" style="color:#e8a87c;">support@ordospaces.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
