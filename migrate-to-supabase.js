// Migration script to move data from SQLite to Supabase
const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// SQLite database path
const dbPath = path.join(__dirname, 'crm.db');

async function migrateData() {
    console.log('Starting migration from SQLite to Supabase...');
    
    // Connect to SQLite
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening SQLite database:', err);
            return;
        }
        console.log('Connected to SQLite database');
    });

    try {
        // Migrate customers
        console.log('Migrating customers...');
        const customers = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM customers', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        for (const customer of customers) {
            const { data, error } = await supabase
                .from('customers')
                .insert({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                    created_at: customer.created_at,
                    updated_at: customer.updated_at
                });

            if (error) {
                console.error('Error inserting customer:', error);
            } else {
                console.log(`Migrated customer: ${customer.name}`);
            }
        }

        // Migrate cars
        console.log('Migrating cars...');
        const cars = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM cars', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        for (const car of cars) {
            const { data, error } = await supabase
                .from('cars')
                .insert({
                    id: car.id,
                    customer_id: car.customer_id,
                    make: car.make,
                    model: car.model,
                    year: car.year,
                    color: car.color,
                    created_at: car.created_at,
                    updated_at: car.updated_at
                });

            if (error) {
                console.error('Error inserting car:', error);
            } else {
                console.log(`Migrated car: ${car.year} ${car.make} ${car.model}`);
            }
        }

        // Migrate services
        console.log('Migrating services...');
        const services = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM services', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        for (const service of services) {
            const { data, error } = await supabase
                .from('services')
                .insert({
                    id: service.id,
                    customer_id: service.customer_id,
                    car_id: service.car_id,
                    service_type: service.service_type,
                    start_date: service.start_date,
                    end_date: service.end_date,
                    stage: service.stage,
                    created_at: service.created_at,
                    updated_at: service.updated_at
                });

            if (error) {
                console.error('Error inserting service:', error);
            } else {
                console.log(`Migrated service: ${service.service_type}`);
            }
        }

        console.log('Migration completed successfully!');
        
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        db.close();
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateData();
}

module.exports = { migrateData };
