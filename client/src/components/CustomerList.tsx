import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerList.css';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    console.log('Add customer button clicked');
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setDialogOpen(true);
    console.log('Dialog should be open:', true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
    });
    setDialogOpen(true);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5001/api/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    try {
      if (editingCustomer) {
        console.log('Updating customer:', editingCustomer.id);
        await axios.put(`http://localhost:5001/api/customers/${editingCustomer.id}`, formData);
      } else {
        console.log('Creating new customer');
        await axios.post('http://localhost:5001/api/customers', formData);
      }
      setDialogOpen(false);
      fetchCustomers();
      console.log('Customer saved successfully');
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCustomer(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <div className="customer-list-header">
        <h1>Customers</h1>
        <button className="add-customer-btn" onClick={handleAddCustomer}>
          + Add Customer
        </button>
      </div>
      
      {/* Debug info */}
      <div style={{padding: '10px', background: '#f0f0f0', margin: '10px 0'}}>
        Debug: Dialog open = {dialogOpen ? 'true' : 'false'}
      </div>

      <div className="customers-grid">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-card-content">
              <div className="customer-card-header">
                <h3>{customer.name}</h3>
                <div className="customer-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditCustomer(customer)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteCustomer(customer.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="customer-info">
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
                {customer.address && (
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <span>{customer.address}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="customer-card-footer">
              <button 
                className="view-details-btn"
                onClick={() => navigate(`/customer/${customer.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="empty-state">
          <h3>No customers found</h3>
          <p>Click "Add Customer" to get started</p>
        </div>
      )}

      {/* Add/Edit Customer Dialog */}
      {dialogOpen && (
        <div className="dialog-overlay" onClick={handleClose}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button className="close-btn" onClick={handleClose}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="dialog-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="dialog-actions">
                <button type="button" className="cancel-btn" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingCustomer ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;