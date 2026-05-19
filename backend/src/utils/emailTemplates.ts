import { config } from '../config/env';

export const getVerificationEmailTemplate = (
  firstName: string,
  token: string
): { subject: string; html: string } => {
  const verificationUrl = `${config.client.url}/verify-email?token=${token}`;

  return {
    subject: 'Verify Your Email - Safespace SeminarHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Safespace SeminarHub!</h2>
        <p>Hi ${firstName},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  };
};

export const getPasswordResetTemplate = (
  firstName: string,
  token: string
): { subject: string; html: string } => {
  const resetUrl = `${config.client.url}/reset-password?token=${token}`;

  return {
    subject: 'Password Reset - Safespace SeminarHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="color: #666; font-size: 12px;">This link expires in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };
};

export const getRegistrationConfirmationTemplate = (
  firstName: string,
  seminarTitle: string,
  ticketNumber: string,
  startDate: string,
  venue: string
): { subject: string; html: string } => ({
  subject: `Registration Confirmed: ${seminarTitle}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Registration Confirmed!</h2>
      <p>Hi ${firstName},</p>
      <p>You have successfully registered for:</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${seminarTitle}</h3>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${startDate}</p>
        <p style="margin: 5px 0;"><strong>Venue:</strong> ${venue}</p>
        <p style="margin: 5px 0;"><strong>Ticket Number:</strong> ${ticketNumber}</p>
      </div>
      <p>Please present your QR code at check-in. You can find it in your account dashboard.</p>
      <p>We look forward to seeing you there!</p>
    </div>
  `,
});

export const getSeminarReminderTemplate = (
  firstName: string,
  seminarTitle: string,
  startDate: string,
  venue: string
): { subject: string; html: string } => ({
  subject: `Reminder: ${seminarTitle} starts soon`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Seminar Reminder</h2>
      <p>Hi ${firstName},</p>
      <p>This is a friendly reminder that <strong>${seminarTitle}</strong> is starting soon!</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date:</strong> ${startDate}</p>
        <p style="margin: 5px 0;"><strong>Venue:</strong> ${venue}</p>
      </div>
      <p>Don't forget to bring your QR code for check-in!</p>
    </div>
  `,
});

export const getReferralInvitationTemplate = (
  referrerName: string,
  seminarTitle: string,
  referralLink: string
): { subject: string; html: string } => ({
  subject: `${referrerName} invited you to ${seminarTitle}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">You've Been Invited!</h2>
      <p>Hi there,</p>
      <p><strong>${referrerName}</strong> thinks you might be interested in attending:</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="margin: 0 0 15px 0;">${seminarTitle}</h3>
        <a href="${referralLink}" 
           style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Seminar Details
        </a>
      </div>
      <p style="color: #666; font-size: 12px;">Safespace SeminarHub - Connecting minds, sharing knowledge.</p>
    </div>
  `,
});
