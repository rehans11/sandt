import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllCars.css';

interface Car {
  id: string;
  customer_id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  vin: string;
  notes: string;
  created_at: string;
  customer_name?: string;
}

const AllCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMake, setFilterMake] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllCars();
  }, []);

  const fetchAllCars = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/cars/all');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueMakes = () => {
    const makes = cars.map(car => car.make).filter((make, index, self) => self.indexOf(make) === index);
    return makes.sort();
  };

  const filteredCars = cars.filter(car => {
    const matchesMake = filterMake === 'all' || car.make === filterMake;
    const matchesSearch = 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.vin.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesMake && matchesSearch;
  });

  if (loading) {
    return (
      <div className="all-cars-container">
        <div className="loading">Loading cars...</div>
      </div>
    );
  }

  return (
    <div className="all-cars-container">
      <div className="all-cars-header">
        <h1>All Cars</h1>
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search cars, customers, or license plates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="make-filter">
            <label htmlFor="make-filter">Filter by Make:</label>
            <select
              id="make-filter"
              value={filterMake}
              onChange={(e) => setFilterMake(e.target.value)}
            >
              <option value="all">All Makes</option>
              {getUniqueMakes().map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="cars-stats">
        <div className="stat-card">
          <h3>Total Cars</h3>
          <p>{cars.length}</p>
        </div>
        <div className="stat-card">
          <h3>Unique Makes</h3>
          <p>{getUniqueMakes().length}</p>
        </div>
        <div className="stat-card">
          <h3>Most Common Make</h3>
          <p>
            {cars.length > 0 ? 
              getUniqueMakes().reduce((a, b) => 
                cars.filter(car => car.make === a).length > cars.filter(car => car.make === b).length ? a : b
              ) : 'N/A'
            }
          </p>
        </div>
        <div className="stat-card">
          <h3>Average Year</h3>
          <p>
            {cars.length > 0 ? 
              Math.round(cars.reduce((sum, car) => sum + car.year, 0) / cars.length) : 'N/A'
            }
          </p>
        </div>
      </div>

      <div className="cars-grid">
        {filteredCars.length === 0 ? (
          <div className="empty-state">
            <p>No cars found matching your criteria.</p>
          </div>
        ) : (
          filteredCars.map((car) => (
            <div key={car.id} className="car-card">
              <div className="car-card-header">
                <h3>{car.year} {car.make} {car.model}</h3>
                <span className="car-color" style={{ backgroundColor: car.color.toLowerCase() }}>
                  {car.color}
                </span>
              </div>
              <div className="car-info">
                <div className="info-item">
                  <span className="info-label">Customer:</span>
                  <span>{car.customer_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Make:</span>
                  <span>{car.make}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Model:</span>
                  <span>{car.model}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Year:</span>
                  <span>{car.year}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Color:</span>
                  <span>{car.color}</span>
                </div>
                {car.license_plate && (
                  <div className="info-item">
                    <span className="info-label">License Plate:</span>
                    <span className="license-plate">{car.license_plate}</span>
                  </div>
                )}
                {car.vin && (
                  <div className="info-item">
                    <span className="info-label">VIN:</span>
                    <span className="vin">{car.vin}</span>
                  </div>
                )}
                {car.notes && (
                  <div className="info-item">
                    <span className="info-label">Notes:</span>
                    <span>{car.notes}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Added:</span>
                  <span>{new Date(car.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllCars;
