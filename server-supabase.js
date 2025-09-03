const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test Supabase connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('customers').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Connected to Supabase database');
    }
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
  }
}

// Initialize connection
testConnection();

// API Routes

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create customer
app.post('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([req.body])
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cars for a customer
app.get('/api/customers/:id/cars', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('customer_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create car
app.post('/api/customers/:id/cars', async (req, res) => {
  try {
    const carData = { ...req.body, customer_id: req.params.id };
    const { data, error } = await supabase
      .from('cars')
      .insert([carData])
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update car
app.put('/api/cars/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete car
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get services for a customer
app.get('/api/customers/:id/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        cars!inner(make, model, year)
      `)
      .eq('customer_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create service
app.post('/api/customers/:id/services', async (req, res) => {
  try {
    const serviceData = { ...req.body, customer_id: req.params.id };
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service
app.put('/api/services/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete service
app.delete('/api/services/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all services with customer and car information
app.get('/api/services/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        customers!inner(name),
        cars!inner(make, model, year)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Transform data to match expected format
    const transformedData = data.map(service => ({
      ...service,
      customer_name: service.customers.name,
      car_info: `${service.cars.year} ${service.cars.make} ${service.cars.model}`
    }));

    res.json(transformedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all cars with customer information
app.get('/api/cars/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select(`
        *,
        customers!inner(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Transform data to match expected format
    const transformedData = data.map(car => ({
      ...car,
      customer_name: car.customers.name
    }));

    res.json(transformedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
