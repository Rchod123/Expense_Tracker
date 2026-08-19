require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

app.use("/api/auth", authRoutes)

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log(' Connected to MongoDB');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(` Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
  });
