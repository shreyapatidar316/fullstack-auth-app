const express = require('express');
const pool = require('../db');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Get all employees (Protected route)
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ error: 'Server Error while fetching employees' });
  }
});

// Create a new employee (Protected route)
router.post('/', authenticate, async (req, res) => {
  const { name, email, position, department, salary } = req.body;

  if (!name || !email || !position || !department || !salary) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const newEmployee = await pool.query(
      'INSERT INTO employees (name, email, position, department, salary) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, position, department, salary]
    );
    res.status(201).json(newEmployee.rows[0]);
  } catch (err) {
    console.error('Error creating employee:', err.message);
    res.status(500).json({ error: 'Server Error while creating employee' });
  }
});

module.exports = router;
