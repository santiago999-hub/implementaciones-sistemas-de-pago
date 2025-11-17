/**
 * Luhn Algorithm Implementation
 * Validates credit card numbers using the Luhn checksum algorithm
 */

/**
 * Validates a credit card number using the Luhn algorithm
 * @param {string} cardNumber - The credit card number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateLuhn(cardNumber) {
  // Remove any spaces or dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check if the input contains only digits
  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }
  
  // Check minimum length
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return (sum % 10) === 0;
}

/**
 * Identifies the card type based on the card number
 * @param {string} cardNumber - The credit card number
 * @returns {string} - Card type (Visa, Mastercard, or Unknown)
 */
function identifyCardType(cardNumber) {
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Visa: starts with 4
  if (/^4/.test(cleanNumber)) {
    return 'Visa';
  }
  
  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return 'Mastercard';
  }
  
  return 'Unknown';
}

/**
 * Masks a card number showing only the last 4 digits
 * @param {string} cardNumber - The credit card number
 * @returns {string} - Masked card number
 */
function maskCardNumber(cardNumber) {
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  if (cleanNumber.length < 4) {
    return '****';
  }
  const lastFour = cleanNumber.slice(-4);
  const masked = '*'.repeat(cleanNumber.length - 4);
  return masked + lastFour;
}

module.exports = {
  validateLuhn,
  identifyCardType,
  maskCardNumber
};
