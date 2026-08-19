const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/sync', async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ error: 'Payload must include a categories array' });
    }

    const syncedIds = [];

    const bulkOps = categories.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: {
          $set: {
            name: item.name,
            ui: item.ui,
            transactionType: item.transactionType,
            type: item.type ?? 'image',
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await Category.bulkWrite(bulkOps);
      syncedIds.push(...categories.map((item) => item._id));
    }

    res.status(200).json({
      success: true,
      syncedIds,
      message: `Successfully synced ${syncedIds.length} categories.`,
    });
  } catch (error) {
    console.error('Error during category sync:', error);
    res.status(500).json({ error: 'Server error during category synchronization' });
  }
});

router.post('/', async(req,res) => {
  
})

module.exports = router;
