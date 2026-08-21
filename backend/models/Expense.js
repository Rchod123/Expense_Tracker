const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    userId: {type:String, required: true},
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ['income', 'expense'] },
    description: {type: String, default: ''},
    ui: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
