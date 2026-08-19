const Category = require('../models/Category');
const DEFAULT_CATEGORIES = require('../data/defaultCategories');

const seedDefaultCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) {
    return;
  }

  await Category.insertMany(DEFAULT_CATEGORIES);
};

module.exports = seedDefaultCategories;
