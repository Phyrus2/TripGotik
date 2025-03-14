require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const createTables = require('./Database/migration');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Jalankan migration saat server dimulai
createTables();

// Route untuk testing
app.get('/', (req, res) => {
  res.send('Backend Express.js dengan MySQL berjalan!');
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
