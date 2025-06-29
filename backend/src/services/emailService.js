// Email service placeholder - no-op
const sendEmail = async () => ({ success: true });
const sendWelcomeEmail = async () => ({ success: true });
const sendTaskReminder = async () => ({ success: true });
const sendTaskCompletionEmail = async () => ({ success: true });

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendTaskReminder,
  sendTaskCompletionEmail
}; 