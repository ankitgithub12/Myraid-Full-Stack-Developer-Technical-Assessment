const sgMail = require('@sendgrid/mail');

/**
 * Sends a password reset email using SendGrid API.
 * This replaces the previous Nodemailer SMTP implementation to avoid
 * ENETUNREACH errors on cloud platforms like Render.
 *
 * @param {string} toEmail  - Recipient's email address
 * @param {string} token    - The plain-text reset token
 */
const sendResetEmail = async (toEmail, token) => {
  // 1. Configure SendGrid with API Key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/resetpassword/${token}`;

  // 2. Define Email Content
  const msg = {
    to: toEmail,
    from: process.env.EMAIL_FROM, // Must be a verified sender in SendGrid
    subject: 'TaskFlow — Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width:520px;background:#1a1a2e;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding:36px 40px 24px;background:linear-gradient(135deg,#7c3aed,#4f46e5);">
                      <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
                        🔐 TaskFlow
                      </h1>
                      <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
                        Password Reset Request
                      </p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="margin:0 0 16px;color:#cbd5e1;font-size:15px;line-height:1.6;">
                        Hi there 👋
                      </p>
                      <p style="margin:0 0 24px;color:#cbd5e1;font-size:15px;line-height:1.6;">
                        We received a request to reset the password for your <strong style="color:#a78bfa;">TaskFlow</strong> account.
                        Click the button below to create a new password. This link expires in <strong style="color:#f59e0b;">10 minutes</strong>.
                      </p>
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:8px 0 32px;">
                            <a href="${resetUrl}"
                               style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;letter-spacing:0.4px;">
                               Reset My Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 8px;color:#64748b;font-size:13px;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="margin:0 0 28px;word-break:break-all;">
                        <a href="${resetUrl}" style="color:#818cf8;font-size:13px;">${resetUrl}</a>
                      </p>
                      <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;padding-top:20px;border-top:1px solid rgba(255,255,255,0.07);">
                        If you didn't request this reset, you can safely ignore this email — your password won't change.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding:20px 40px;background:rgba(0,0,0,0.2);">
                      <p style="margin:0;color:#475569;font-size:12px;">
                        © 2025 TaskFlow. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  // 3. Send Email with Fallback Logging
  try {
    await sgMail.send(msg);
    console.log(`[Email] Reset link sent successfully to: ${toEmail}`);
  } catch (error) {
    console.error('[Email Error] SendGrid failed to send email:', error.message);
    
    if (error.response) {
      console.error('[Email Error Details]', error.response.body);
    }

    // Critical Fallback: Log the URL so it can be retrieved from logs if email fails
    console.warn(`[CRITICAL FALLBACK] Password Reset URL for ${toEmail}: ${resetUrl}`);
    
    // Optional: throw error to be handled by the controller
    throw new Error('Failed to send password reset email. Please check server logs.');
  }
};

module.exports = sendResetEmail;
