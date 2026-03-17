const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  planName: String,
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentScreenshot: String,
  verified: {
    type: Boolean,
    default: false
  },
  invoicePDF: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
