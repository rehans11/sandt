import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllServices.css';

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
  customer_name?: string;
  car_info?: string;
}

const AllServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllServices();
  }, []);

  const fetchAllServices = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/services/all');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'planning': '#ff9800',
      'in_progress': '#2196f3',
      'completed': '#4caf50',
      'on_hold': '#f44336',
      'cancelled': '#9e9e9e'
    };
    return colors[stage] || '#666';
  };

  const filteredServices = services.filter(service => {
    const matchesStage = filterStage === 'all' || service.stage === filterStage;
    const matchesSearch = 
      service.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.car_info?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStage && matchesSearch;
  });

  if (loading) {
    return (
      <div className="all-services-container">
        <div className="loading">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="all-services-container">
      <div className="all-services-header">
        <h1>All Services</h1>
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search services, customers, or cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="stage-filter">
            <label htmlFor="stage-filter">Filter by Stage:</label>
            <select
              id="stage-filter"
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
            >
              <option value="all">All Stages</option>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="services-stats">
        <div className="stat-card">
          <h3>Total Services</h3>
          <p>{services.length}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{services.filter(s => s.stage === 'in_progress').length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{services.filter(s => s.stage === 'completed').length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${services.reduce((sum, s) => sum + s.price, 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.length === 0 ? (
          <div className="empty-state">
            <p>No services found matching your criteria.</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card-header">
                <h3>{service.service_type}</h3>
                <span 
                  className="stage-badge"
                  style={{ backgroundColor: getStageColor(service.stage) }}
                >
                  {service.stage.replace('_', ' ')}
                </span>
              </div>
              <div className="service-info">
                <div className="info-item">
                  <span className="info-label">Customer:</span>
                  <span>{service.customer_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Car:</span>
                  <span>{service.car_info}</span>
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
                {service.price > 0 && (
                  <div className="info-item">
                    <span className="info-label">Price:</span>
                    <span className="price">${service.price.toFixed(2)}</span>
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
          ))
        )}
      </div>
    </div>
  );
};

export default AllServices;
