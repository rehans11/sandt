import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './Dashboard.css';

interface Service {
  id: string;
  customer_id: string;
  car_id: string;
  service_type: string;
  start_date: string;
  end_date: string;
  stage: string;
  customer_name: string;
  car_info: string;
}

interface Car {
  id: string;
  customer_id: string;
  make: string;
  model: string;
  year: string;
  color: string;
  customer_name: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalCars: number;
  totalServices: number;
  servicesToday: number;
  servicesTomorrow: number;
  servicesThisWeek: number;
}

const Dashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalCars: 0,
    totalServices: 0,
    servicesToday: 0,
    servicesTomorrow: 0,
    servicesThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [servicesResponse, carsResponse, customersResponse] = await Promise.all([
        axios.get('http://localhost:5001/api/services/all'),
        axios.get('http://localhost:5001/api/cars/all'),
        axios.get('http://localhost:5001/api/customers')
      ]);

      setServices(servicesResponse.data);
      setCars(carsResponse.data);

      // Calculate statistics
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      const servicesToday = servicesResponse.data.filter((service: Service) => {
        const endDate = new Date(service.end_date);
        return endDate.toDateString() === today.toDateString();
      });

      const servicesTomorrow = servicesResponse.data.filter((service: Service) => {
        const endDate = new Date(service.end_date);
        return endDate.toDateString() === tomorrow.toDateString();
      });

      const servicesThisWeek = servicesResponse.data.filter((service: Service) => {
        const endDate = new Date(service.end_date);
        return endDate >= today && endDate <= weekFromNow;
      });

      setStats({
        totalCustomers: customersResponse.data.length,
        totalCars: carsResponse.data.length,
        totalServices: servicesResponse.data.length,
        servicesToday: servicesToday.length,
        servicesTomorrow: servicesTomorrow.length,
        servicesThisWeek: servicesThisWeek.length
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServicesDueToday = () => {
    const today = new Date();
    return services.filter(service => {
      const endDate = new Date(service.end_date);
      return endDate.toDateString() === today.toDateString();
    });
  };

  const getServicesDueTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return services.filter(service => {
      const endDate = new Date(service.end_date);
      return endDate.toDateString() === tomorrow.toDateString();
    });
  };

  const getCarMakeData = () => {
    const makeCounts: { [key: string]: number } = {};
    cars.forEach(car => {
      makeCounts[car.make] = (makeCounts[car.make] || 0) + 1;
    });

    return Object.entries(makeCounts).map(([make, count]) => ({
      name: make,
      value: count
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your auto wrap shop</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>{stats.totalCars}</h3>
            <p>Total Cars</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>{stats.totalServices}</h3>
            <p>Total Services</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.servicesToday}</h3>
            <p>Due Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{stats.servicesTomorrow}</h3>
            <p>Due Tomorrow</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.servicesThisWeek}</h3>
            <p>This Week</p>
          </div>
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div className="dashboard-content">
        {/* Pie Chart */}
        <div className="chart-section">
          <h2>Car Makes Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCarMakeData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getCarMakeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Section */}
        <div className="tables-section">
          {/* Services Due Today */}
          <div className="table-container">
            <h2>Services Due Today</h2>
            {getServicesDueToday().length > 0 ? (
              <div className="table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Car</th>
                      <th>Service</th>
                      <th>Stage</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getServicesDueToday().map((service) => (
                      <tr key={service.id}>
                        <td>{service.customer_name}</td>
                        <td>{service.car_info}</td>
                        <td>{service.service_type}</td>
                        <td>
                          <span className={`stage-badge stage-${service.stage.toLowerCase()}`}>
                            {service.stage}
                          </span>
                        </td>
                        <td>{formatDate(service.end_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No services due today</p>
              </div>
            )}
          </div>

          {/* Services Due Tomorrow */}
          <div className="table-container">
            <h2>Services Due Tomorrow</h2>
            {getServicesDueTomorrow().length > 0 ? (
              <div className="table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Car</th>
                      <th>Service</th>
                      <th>Stage</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getServicesDueTomorrow().map((service) => (
                      <tr key={service.id}>
                        <td>{service.customer_name}</td>
                        <td>{service.car_info}</td>
                        <td>{service.service_type}</td>
                        <td>
                          <span className={`stage-badge stage-${service.stage.toLowerCase()}`}>
                            {service.stage}
                          </span>
                        </td>
                        <td>{formatDate(service.end_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No services due tomorrow</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
