/**
 * Payment Model
 * Represents a payment transaction in the system
 */

class Payment {
  constructor(id, clientName, clientEmail, cardNumber, cardType, amount, company, status = 'pending') {
    this.id = id;
    this.clientName = clientName;
    this.clientEmail = clientEmail;
    this.cardNumber = cardNumber;
    this.cardType = cardType;
    this.amount = amount;
    this.company = company;
    this.status = status; // pending, approved, rejected
    this.timestamp = new Date();
  }

  approve() {
    this.status = 'approved';
  }

  reject(reason) {
    this.status = 'rejected';
    this.rejectionReason = reason;
  }

  toJSON() {
    return {
      id: this.id,
      clientName: this.clientName,
      clientEmail: this.clientEmail,
      cardNumber: this.cardNumber,
      cardType: this.cardType,
      amount: this.amount,
      company: this.company,
      status: this.status,
      timestamp: this.timestamp,
      rejectionReason: this.rejectionReason || null
    };
  }
}

module.exports = Payment;
