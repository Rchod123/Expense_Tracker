const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    ui: { type: String, required: true },
    transactionType: { type: String, required: true, enum: ['income', 'expense'] },
    type: { type: String, default: 'image' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
