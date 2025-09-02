import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerDetail.css';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

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
}

interface Service {
  id: string;
  customer_id: string;
  car_id: string;
  service_type: string;
  description: string;
  start_date: string;
  end_date: string;
  stage: string;
  price: number;
  notes: string;
  created_at: string;
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [carDialogOpen, setCarDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // Form data
  const [carFormData, setCarFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    license_plate: '',
    vin: '',
    notes: '',
  });
  
  const [serviceFormData, setServiceFormData] = useState({
    car_id: '',
    service_type: '',
    description: '',
    start_date: '',
    end_date: '',
    stage: 'pending',
    price: 0,
    notes: '',
  });

  useEffect(() => {
    if (id) {
      fetchCustomer();
      fetchCars();
      fetchServices();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/customers/${id}/cars`);
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/customers/${id}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleAddCar = () => {
    setEditingCar(null);
    setCarFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      license_plate: '',
      vin: '',
      notes: '',
    });
    setCarDialogOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setCarFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
      license_plate: car.license_plate,
      vin: car.vin,
      notes: car.notes,
    });
    setCarDialogOpen(true);
  };

  const handleDeleteCar = async (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`http://localhost:5001/api/cars/${carId}`);
        fetchCars();
        fetchServices(); // Refresh services as they might be affected
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await axios.put(`http://localhost:5001/api/cars/${editingCar.id}`, carFormData);
      } else {
        await axios.post(`http://localhost:5001/api/customers/${id}/cars`, carFormData);
      }
      setCarDialogOpen(false);
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const handleAddService = () => {
    if (cars.length === 0) {
      alert('Please add a car first before creating services.');
      return;
    }
    setEditingService(null);
    setServiceFormData({
      car_id: cars[0]?.id || '',
      service_type: '',
      description: '',
      start_date: '',
      end_date: '',
      stage: 'pending',
      price: 0,
      notes: '',
    });
    setServiceDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormData({
      car_id: service.car_id,
      service_type: service.service_type,
      description: service.description,
      start_date: service.start_date,
      end_date: service.end_date,
      stage: service.stage,
      price: service.price,
      notes: service.notes,
    });
    setServiceDialogOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`http://localhost:5001/api/services/${serviceId}`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`http://localhost:5001/api/services/${editingService.id}`, serviceFormData);
      } else {
        await axios.post(`http://localhost:5001/api/customers/${id}/services`, serviceFormData);
      }
      setServiceDialogOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'pending': return '#ff9800';
      case 'in_progress': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getCarName = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.year} ${car.make} ${car.model}` : 'Unknown Car';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading customer details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="error-container">
        <h2>Customer not found</h2>
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="customer-detail-container">
      <div className="customer-detail-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Customers
        </button>
        <h1>{customer.name}</h1>
      </div>

      <div className="customer-info-card">
        <div className="customer-info-grid">
          <div className="info-section">
            {customer.email && (
              <div className="info-item">
                <span className="info-icon">📧</span>
                <span>{customer.email}</span>
              </div>
            )}
            {customer.phone && (
              <div className="info-item">
                <span className="info-icon">📞</span>
                <span>{customer.phone}</span>
              </div>
            )}
          </div>
          <div className="info-section">
            {customer.address && (
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>{customer.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveTab(0)}
          >
            Cars ({cars.length})
          </button>
          <button 
            className={`tab ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            Services ({services.length})
          </button>
        </div>

        {activeTab === 0 && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Cars</h2>
              <button className="add-btn" onClick={handleAddCar}>
                + Add Car
              </button>
            </div>
            
            {cars.length === 0 ? (
              <div className="empty-state">
                <p>No cars added yet</p>
              </div>
            ) : (
              <div className="cars-grid">
                {cars.map((car) => (
                  <div key={car.id} className="car-card">
                    <div className="car-card-header">
                      <h3>{car.year} {car.make} {car.model}</h3>
                      <div className="card-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditCar(car)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteCar(car.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="car-info">
                      <div className="info-item">
                        <span className="info-label">Color:</span>
                        <span>{car.color}</span>
                      </div>
                      {car.license_plate && (
                        <div className="info-item">
                          <span className="info-label">License:</span>
                          <span>{car.license_plate}</span>
                        </div>
                      )}
                      {car.vin && (
                        <div className="info-item">
                          <span className="info-label">VIN:</span>
                          <span>{car.vin}</span>
                        </div>
                      )}
                      {car.notes && (
                        <div className="info-item">
                          <span className="info-label">Notes:</span>
                          <span>{car.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Services</h2>
              <button 
                className="add-btn" 
                onClick={handleAddService}
                disabled={cars.length === 0}
              >
                + Add Service
              </button>
            </div>
            
            {cars.length === 0 ? (
              <div className="empty-state">
                <p>Add a car first before creating services</p>
              </div>
            ) : services.length === 0 ? (
              <div className="empty-state">
                <p>No services added yet</p>
              </div>
            ) : (
              <div className="services-grid">
                {services.map((service) => (
                  <div key={service.id} className="service-card">
                    <div className="service-card-header">
                      <h3>{service.service_type}</h3>
                      <div className="card-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditService(service)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteService(service.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="service-info">
                      <div className="info-item">
                        <span className="info-label">Car:</span>
                        <span>{getCarName(service.car_id)}</span>
                      </div>
                      {service.description && (
                        <div className="info-item">
                          <span className="info-label">Description:</span>
                          <span>{service.description}</span>
                        </div>
                      )}
                      <div className="info-item">
                        <span className="info-label">Start Date:</span>
                        <span>{new Date(service.start_date).toLocaleDateString()}</span>
                      </div>
                      {service.end_date && (
                        <div className="info-item">
                          <span className="info-label">End Date:</span>
                          <span>{new Date(service.end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="info-item">
                        <span className="info-label">Stage:</span>
                        <span 
                          className="stage-badge"
                          style={{ backgroundColor: getStageColor(service.stage) }}
                        >
                          {service.stage.replace('_', ' ')}
                        </span>
                      </div>
                      {service.price > 0 && (
                        <div className="info-item">
                          <span className="info-label">Price:</span>
                          <span>${service.price.toFixed(2)}</span>
                        </div>
                      )}
                      {service.notes && (
                        <div className="info-item">
                          <span className="info-label">Notes:</span>
                          <span>{service.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Car Dialog */}
      {carDialogOpen && (
        <div className="dialog-overlay" onClick={() => setCarDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button className="close-btn" onClick={() => setCarDialogOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCarSubmit} className="dialog-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="make">Make *</label>
                  <input
                    id="make"
                    type="text"
                    required
                    value={carFormData.make}
                    onChange={(e) => setCarFormData({ ...carFormData, make: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="model">Model *</label>
                  <input
                    id="model"
                    type="text"
                    required
                    value={carFormData.model}
                    onChange={(e) => setCarFormData({ ...carFormData, model: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year *</label>
                  <input
                    id="year"
                    type="number"
                    required
                    value={carFormData.year}
                    onChange={(e) => setCarFormData({ ...carFormData, year: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="color">Color *</label>
                  <input
                    id="color"
                    type="text"
                    required
                    value={carFormData.color}
                    onChange={(e) => setCarFormData({ ...carFormData, color: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="license_plate">License Plate</label>
                  <input
                    id="license_plate"
                    type="text"
                    value={carFormData.license_plate}
                    onChange={(e) => setCarFormData({ ...carFormData, license_plate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="vin">VIN</label>
                  <input
                    id="vin"
                    type="text"
                    value={carFormData.vin}
                    onChange={(e) => setCarFormData({ ...carFormData, vin: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  rows={3}
                  value={carFormData.notes}
                  onChange={(e) => setCarFormData({ ...carFormData, notes: e.target.value })}
                />
              </div>
              <div className="dialog-actions">
                <button type="button" className="cancel-btn" onClick={() => setCarDialogOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingCar ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Dialog */}
      {serviceDialogOpen && (
        <div className="dialog-overlay" onClick={() => setServiceDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="close-btn" onClick={() => setServiceDialogOpen(false)}>×</button>
            </div>
            <form onSubmit={handleServiceSubmit} className="dialog-form">
              <div className="form-group">
                <label htmlFor="car_id">Car *</label>
                <select
                  id="car_id"
                  required
                  value={serviceFormData.car_id}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, car_id: e.target.value })}
                >
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.year} {car.make} {car.model} ({car.color})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="service_type">Service Type *</label>
                <input
                  id="service_type"
                  type="text"
                  required
                  value={serviceFormData.service_type}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, service_type: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={3}
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date">Start Date *</label>
                  <input
                    id="start_date"
                    type="date"
                    required
                    value={serviceFormData.start_date}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, start_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="end_date">End Date</label>
                  <input
                    id="end_date"
                    type="date"
                    value={serviceFormData.end_date}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stage">Stage *</label>
                  <select
                    id="stage"
                    required
                    value={serviceFormData.stage}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, stage: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  rows={3}
                  value={serviceFormData.notes}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, notes: e.target.value })}
                />
              </div>
              <div className="dialog-actions">
                <button type="button" className="cancel-btn" onClick={() => setServiceDialogOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingService ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail;