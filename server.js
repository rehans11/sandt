const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Initialize SQLite database
const db = new sqlite3.Database('./crm.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Customers table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Cars table
  db.run(`CREATE TABLE IF NOT EXISTS cars (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    color TEXT,
    license_plate TEXT,
    vin TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
  )`);

  // Services table
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    car_id TEXT NOT NULL,
    service_type TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    stage TEXT NOT NULL DEFAULT 'pending',
    price DECIMAL(10,2),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE
  )`);
}

// API Routes

// Customers
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(row);
  });
});

app.post('/api/customers', (req, res) => {
  const { name, email, phone, address } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO customers (id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
    [id, name, email, phone, address],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, name, email, phone, address });
    }
  );
});

app.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  
  db.run(
    'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, email, phone, address, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, name, email, phone, address });
    }
  );
});

app.delete('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

// Cars
app.get('/api/customers/:customerId/cars', (req, res) => {
  const { customerId } = req.params;
  db.all('SELECT * FROM cars WHERE customer_id = ? ORDER BY created_at DESC', [customerId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/customers/:customerId/cars', (req, res) => {
  const { customerId } = req.params;
  const { make, model, year, color, license_plate, vin, notes } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO cars (id, customer_id, make, model, year, color, license_plate, vin, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, customerId, make, model, year, color, license_plate, vin, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, customer_id: customerId, make, model, year, color, license_plate, vin, notes });
    }
  );
});

app.put('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const { make, model, year, color, license_plate, vin, notes } = req.body;
  
  db.run(
    'UPDATE cars SET make = ?, model = ?, year = ?, color = ?, license_plate = ?, vin = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [make, model, year, color, license_plate, vin, notes, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, make, model, year, color, license_plate, vin, notes });
    }
  );
});

app.delete('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM cars WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Car deleted successfully' });
  });
});

// Services
app.get('/api/customers/:customerId/services', (req, res) => {
  const { customerId } = req.params;
  db.all(`
    SELECT s.*, c.make, c.model, c.year, c.color, c.license_plate
    FROM services s
    JOIN cars c ON s.car_id = c.id
    WHERE s.customer_id = ?
    ORDER BY s.created_at DESC
  `, [customerId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/customers/:customerId/services', (req, res) => {
  const { customerId } = req.params;
  const { car_id, service_type, description, start_date, end_date, stage, price, notes } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO services (id, customer_id, car_id, service_type, description, start_date, end_date, stage, price, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, customerId, car_id, service_type, description, start_date, end_date, stage, price, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, customer_id: customerId, car_id, service_type, description, start_date, end_date, stage, price, notes });
    }
  );
});

app.put('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const { service_type, description, start_date, end_date, stage, price, notes } = req.body;
  
  db.run(
    'UPDATE services SET service_type = ?, description = ?, start_date = ?, end_date = ?, stage = ?, price = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [service_type, description, start_date, end_date, stage, price, notes, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, service_type, description, start_date, end_date, stage, price, notes });
    }
  );
});

app.delete('/api/services/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM services WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Service deleted successfully' });
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
