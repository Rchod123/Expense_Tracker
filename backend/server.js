require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());

app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

app.use('/api/auth', authRoutes);
app.use('/ai', aiRoutes);
app.use('/api/user', userRoutes);

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log(' Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(
        `Groq key: ${process.env.GROQ_API_KEY ? '✓ loaded' : '✗ missing'}`,
      );
    });
  })
  .catch(err => {
    console.error(' MongoDB connection failed:', err.message);
  });
