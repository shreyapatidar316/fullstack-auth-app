CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  salary NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO employees (name, email, position, department, salary) VALUES
('Alice Johnson', 'alice.j@example.com', 'Software Engineer', 'Engineering', 95000.00),
('Bob Smith', 'bob.s@example.com', 'Product Manager', 'Product', 110000.00),
('Charlie Davis', 'charlie.d@example.com', 'UX Designer', 'Design', 85000.00),
('Diana Prince', 'diana.p@example.com', 'HR Director', 'Human Resources', 125000.00),
('Ethan Hunt', 'ethan.h@example.com', 'DevOps Specialist', 'Engineering', 105000.00)
ON CONFLICT (email) DO NOTHING;
