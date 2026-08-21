const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authenticateToken = require('../middleware/authMiddleware.js');

router.post('/sync',authenticateToken, async (req, res) => {
  try {
    const { expenses } = req.body;
    const userId = req.user.userId;
    if (!expenses || !Array.isArray(expenses)) {
      return res.status(400).json({ error: 'Payload must include an expenses array' });
    }

    const syncedIds = [];

    const bulkOps = expenses.map((item) => ({
      updateOne: {
        filter: { _id: item._id, userId: userId },
        update: {
          $set: {
            title: item.title,
            amount: item.amount,
            type: item.type,
            ui: item.ui,
            date: new Date(item.date),
            description: item.description,
            userId: userId,
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await Expense.bulkWrite(bulkOps);
      syncedIds.push(...expenses.map((item) => item._id));
    }

    res.status(200).json({
      success: true,
      syncedIds,
      message: `Successfully synced ${syncedIds.length} records.`,
    });
  } catch (error) {
    console.error('Error during expense sync:', error);
    res.status(500).json({ error: 'Server error during synchronization' });
  }
});

router.get('/',authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenses = await Expense.find({userId}).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

module.exports = router;
