export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.info('[DEV] Password reset link:', resetUrl);
    return;
  }
  // Integre aqui (Resend, SES, SMTP, etc.)
  // await transporter.sendMail({ to, subject: 'Redefinir senha', text: `... ${resetUrl}` });
}
