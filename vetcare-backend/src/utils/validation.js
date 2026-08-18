/**
 * Helpers de validare reutilizabile.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return EMAIL_RE.test(email.trim());
}

function isStrongPassword(pwd) {
  // minim 8 caractere, cel putin 1 litera si 1 cifra
  if (typeof pwd !== 'string' || pwd.length < 8) return false;
  return /[A-Za-z]/.test(pwd) && /\d/.test(pwd);
}

function sanitizeText(str, maxLen = 1000) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

module.exports = { isValidEmail, isStrongPassword, sanitizeText };
