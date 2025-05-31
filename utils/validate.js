// File: utils/validate.js

/**
 * Utility functions for common validation tasks.
 */

/**
 * Cek apakah string merupakan alamat email valid.
 * Menggunakan regex sederhana untuk format email standar.
 * @param {string} str - String yang akan diperiksa.
 * @returns {boolean} - true jika valid email, false jika tidak.
 */
export function isEmail(str) {
  if (typeof str !== 'string') return false;
  // Regex sederhana untuk validasi email
  const re = /^\S+@\S+\.\S+$/;
  return re.test(str);
}

/**
 * Cek apakah string merupakan URL valid.
 * @param {string} str - String yang akan diperiksa.
 * @returns {boolean} - true jika valid URL, false jika tidak.
 */
export function isUrl(str) {
  if (typeof str !== 'string') return false;
  try {
    // Memanfaatkan konstruktor URL bawaan Node.js
    // Jika str bukan URL valid, akan melempar error
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Cek apakah nilai merupakan bilangan positif.
 * @param {any} value - Nilai yang akan diperiksa.
 * @returns {boolean} - true jika value adalah angka > 0, false otherwise.
 */
export function isPositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num) && num > 0;
}

export default {
  isEmail,
  isUrl,
  isPositiveNumber
};
