-- ====================================================
-- Full-Stack Auth App - PostgreSQL Schema
-- ====================================================

-- Create database (run this manually if needed)
-- CREATE DATABASE authdb;

-- Connect to authdb, then run:

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Verify
SELECT 'Schema created successfully!' AS status;
