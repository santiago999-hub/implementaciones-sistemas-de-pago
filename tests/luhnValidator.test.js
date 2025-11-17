/**
 * Tests for Luhn Algorithm Validator
 * Run with: node tests/luhnValidator.test.js
 */

const { validateLuhn, identifyCardType, maskCardNumber } = require('../src/utils/luhnValidator');

// Simple test runner
let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passed++;
  } catch (error) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

console.log('🧪 Running Luhn Validator Tests\n');

// Test valid card numbers
test('Valid Visa card (4532015112830366) should pass', () => {
  assert(validateLuhn('4532015112830366'), 'Should be valid');
});

test('Valid Visa card (4916338506082832) should pass', () => {
  assert(validateLuhn('4916338506082832'), 'Should be valid');
});

test('Valid Mastercard (5425233430109903) should pass', () => {
  assert(validateLuhn('5425233430109903'), 'Should be valid');
});

test('Valid Mastercard (5105105105105100) should pass', () => {
  assert(validateLuhn('5105105105105100'), 'Should be valid');
});

// Test invalid card numbers
test('Invalid card number (1234567890123456) should fail', () => {
  assert(!validateLuhn('1234567890123456'), 'Should be invalid');
});

test('Card number (0000000000000000) passes Luhn but is not a real card', () => {
  // Note: 0000000000000000 technically passes Luhn algorithm (sum = 0, 0 % 10 = 0)
  // In production, additional checks would reject this as invalid
  assert(validateLuhn('0000000000000000'), 'Mathematically valid per Luhn');
});

// Test card number with spaces
test('Valid card with spaces should pass', () => {
  assert(validateLuhn('4532 0151 1283 0366'), 'Should be valid with spaces');
});

// Test card number with dashes
test('Valid card with dashes should pass', () => {
  assert(validateLuhn('4532-0151-1283-0366'), 'Should be valid with dashes');
});

// Test invalid inputs
test('Empty string should fail', () => {
  assert(!validateLuhn(''), 'Empty string should be invalid');
});

test('String with letters should fail', () => {
  assert(!validateLuhn('abcd1234efgh5678'), 'Letters should be invalid');
});

test('Too short number should fail', () => {
  assert(!validateLuhn('123456789012'), 'Too short should be invalid');
});

test('Too long number should fail', () => {
  assert(!validateLuhn('12345678901234567890'), 'Too long should be invalid');
});

// Test card type identification
test('Card starting with 4 should be identified as Visa', () => {
  assertEquals(identifyCardType('4532015112830366'), 'Visa', 'Should be Visa');
});

test('Card starting with 5 should be identified as Mastercard', () => {
  assertEquals(identifyCardType('5425233430109903'), 'Mastercard', 'Should be Mastercard');
});

test('Card starting with 3 should be Unknown', () => {
  assertEquals(identifyCardType('3530111333300000'), 'Unknown', 'Should be Unknown');
});

// Test card masking
test('Card number should be masked correctly', () => {
  assertEquals(maskCardNumber('4532015112830366'), '************0366', 'Should mask all but last 4 digits');
});

test('Card number with spaces should be masked correctly', () => {
  assertEquals(maskCardNumber('4532 0151 1283 0366'), '************0366', 'Should remove spaces and mask');
});

test('Short card number should be masked as ****', () => {
  assertEquals(maskCardNumber('123'), '****', 'Short number should be ****');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
