import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerDetail.css';

// Utility function to format date for display without timezone issues
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return '';
  // Parse the date string and create a local date object
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString();
};

// Utility function to format date for input (YYYY-MM-DD)
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  // Otherwise, parse and format
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Car make and model database
const CAR_DATABASE = {
  'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V', 'Passport', 'Ridgeline', 'Insight', 'Clarity'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Sienna', 'Tacoma', 'Tundra', '4Runner', 'Avalon', 'C-HR', 'Venza', 'Sequoia'],
  'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Focus', 'Fusion', 'Edge', 'Expedition', 'Ranger', 'Bronco', 'Maverick', 'Transit'],
  'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Traverse', 'Tahoe', 'Suburban', 'Camaro', 'Corvette', 'Cruze', 'Trax', 'Blazer', 'Colorado'],
  'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Maxima', 'Versa', 'Kicks', 'Armada', 'Frontier', 'Titan', '370Z', 'GT-R'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'Z4', 'i3', 'i8', '2 Series', '4 Series', '6 Series', '8 Series'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'A-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'CLA', 'CLS', 'G-Class', 'AMG GT', 'Sprinter'],
  'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'A5', 'A7', 'RS3', 'RS4', 'RS6'],
  'Volkswagen': ['Jetta', 'Passat', 'Golf', 'Tiguan', 'Atlas', 'Beetle', 'Arteon', 'ID.4', 'CC', 'Touareg', 'Golf R', 'GTI'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Accent', 'Veloster', 'Kona', 'Nexo', 'Genesis', 'Ioniq'],
  'Kia': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'Stinger', 'Niro', 'Seltos', 'Carnival', 'EV6'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-30', 'Mazda2', 'RX-7', 'RX-8'],
  'Subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'Ascent', 'WRX', 'BRZ', 'Crosstrek', 'Tribeca', 'Baja'],
  'Lexus': ['ES', 'IS', 'GS', 'LS', 'RX', 'GX', 'LX', 'NX', 'UX', 'LC', 'RC', 'CT', 'SC'],
  'Acura': ['ILX', 'TLX', 'RLX', 'RDX', 'MDX', 'NSX', 'Integra', 'Legend', 'Vigor', 'CL'],
  'Infiniti': ['Q50', 'Q60', 'Q70', 'QX30', 'QX50', 'QX60', 'QX80', 'G37', 'M37', 'FX35', 'EX35'],
  'Cadillac': ['ATS', 'CTS', 'XTS', 'XT4', 'XT5', 'XT6', 'Escalade', 'CT6', 'ELR', 'SRX', 'DTS'],
  'Lincoln': ['MKZ', 'Continental', 'MKC', 'MKT', 'MKX', 'Navigator', 'Aviator', 'Corsair', 'Nautilus', 'Town Car'],
  'Jaguar': ['XE', 'XF', 'XJ', 'F-PACE', 'E-PACE', 'I-PACE', 'F-TYPE', 'XK', 'S-TYPE', 'X-TYPE'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Discovery', 'Discovery Sport', 'Defender'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Cayman', '718', '918 Spyder'],
  'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y', 'Roadster', 'Cybertruck', 'Semi'],
  'Volvo': ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C30', 'C70', 'S40', 'V40'],
  'Genesis': ['G70', 'G80', 'G90', 'GV70', 'GV80', 'Coupe', 'Sedan'],
  'Alfa Romeo': ['Giulia', 'Stelvio', '4C', 'Spider', 'GTV', '156', '159', 'Brera', 'Giulietta'],
  'Maserati': ['Ghibli', 'Quattroporte', 'Levante', 'GranTurismo', 'GranCabrio', 'MC20'],
  'Bentley': ['Continental', 'Flying Spur', 'Bentayga', 'Mulsanne', 'Azure', 'Arnage'],
  'Rolls-Royce': ['Phantom', 'Ghost', 'Wraith', 'Dawn', 'Cullinan', 'Silver Shadow'],
  'Ferrari': ['488', 'F8', 'SF90', 'Roma', 'Portofino', '812', 'LaFerrari', 'California'],
  'Lamborghini': ['Huracán', 'Aventador', 'Urus', 'Gallardo', 'Murciélago', 'Countach'],
  'McLaren': ['720S', '570S', '600LT', 'GT', 'Senna', 'P1', '650S', '540C'],
  'Aston Martin': ['DB11', 'Vantage', 'DBS', 'Rapide', 'Vanquish', 'DB9', 'V8 Vantage'],
  'Bugatti': ['Chiron', 'Veyron', 'Divo', 'Centodieci', 'La Voiture Noire'],
  'Koenigsegg': ['Regera', 'Agera', 'Jesko', 'Gemera', 'CCX', 'CCR'],
  'Pagani': ['Huayra', 'Zonda', 'Utopia', 'Imola', 'C10'],
  'Rimac': ['Nevera', 'Concept One', 'C_Two'],
  'Lotus': ['Evora', 'Elise', 'Exige', 'Emira', 'Esprit', 'Elan'],
  'Morgan': ['Plus 4', 'Plus 6', '3 Wheeler', 'Aero 8', 'Roadster'],
  'Caterham': ['Seven', 'Seven 160', 'Seven 360', 'Seven 420', 'Seven 620'],
  'Ariel': ['Atom', 'Nomad', 'Ace'],
  'BAC': ['Mono', 'Mono R'],
  'Radical': ['SR1', 'SR3', 'SR8', 'RXC'],
  'KTM': ['X-Bow', 'X-Bow GT', 'X-Bow GT4'],
  'Donkervoort': ['D8 GTO', 'D8 GT', 'D8 270'],
  'Ginetta': ['G40', 'G50', 'G55', 'G60'],
  'Noble': ['M600', 'M12', 'M400'],
  'Ultima': ['GTR', 'Evolution', 'Can-Am'],
  'Zenvo': ['TS1', 'ST1', 'TSR-S'],
  'W Motors': ['Lykan HyperSport', 'Fenyr SuperSport'],
  'Arrinera': ['Hussarya', 'Venocara'],
  'Tramontana': ['R', 'XTR'],
  'Gumpert': ['Apollo', 'Tornante'],
  'Spyker': ['C8', 'C12', 'D8'],
  'Pininfarina': ['Battista'],
  'Automobili Pininfarina': ['Battista'],
  'Czinger': ['21C'],
  'Drako': ['GTE'],
  'Hennessey': ['Venom F5', 'Venom GT'],
  'SSC': ['Tuatara', 'Ultimate Aero'],
  'Saleen': ['S7', 'S1', 'S5S Raptor'],
  'Vector': ['W8', 'M12'],
  'Rossion': ['Q1'],
  'Panoz': ['Esperante', 'AIV Roadster'],
  'Mosler': ['MT900', 'Raptor'],
  'Venturi': ['Fetish', '400 GT'],
  'Wiesmann': ['GT', 'Roadster'],
  'Gillet': ['Vertigo'],
  'Perana': ['Z-One'],
  'Rezvani': ['Beast', 'Tank'],
  'Vencer': ['Sarthe'],
  'Arash': ['AF8', 'AF10'],
  'Fisker': ['Karma', 'Ocean'],
  'Lucid': ['Air', 'Gravity'],
  'Rivian': ['R1T', 'R1S'],
  'Polestar': ['1', '2', '3', '4', '5'],
  'NIO': ['ES8', 'ES6', 'EC6', 'ET7', 'ET5'],
  'XPeng': ['P7', 'G3', 'P5'],
  'Li Auto': ['One', 'L9', 'L8', 'L7'],
  'BYD': ['Tang', 'Song', 'Qin', 'Han', 'Dolphin', 'Seal'],
  'Hongqi': ['H9', 'HS7', 'HS5', 'E-HS9'],
  'Geely': ['Emgrand', 'Boyue', 'Coolray', 'Atlas'],
  'Great Wall': ['Haval H6', 'Haval H9', 'Wey VV7', 'Ora R1'],
  'Chery': ['Tiggo', 'Arrizo', 'Exeed'],
  'JAC': ['iEV7S', 'iEVS4', 'Refine S7'],
  'SAIC': ['Roewe', 'MG', 'Maxus'],
  'Dongfeng': ['Aeolus', 'Fengon', 'Rich'],
  'FAW': ['Hongqi', 'Besturn', 'Jiefang'],
  'BAIC': ['BJ40', 'EU5', 'EX5'],
  'GAC': ['Trumpchi', 'Aion', 'Haval'],
  'Changan': ['CS75', 'CS55', 'Eado'],
  'Haval': ['H6', 'H9', 'F7', 'H2'],
  'Wey': ['VV7', 'VV5', 'VV6', 'P8'],
  'Lynk & Co': ['01', '02', '03', '05', '06', '09'],
  'Saab': ['9-3', '9-5', '9-7X', '900', '9000'],
  'Opel': ['Astra', 'Corsa', 'Insignia', 'Mokka', 'Crossland'],
  'Vauxhall': ['Astra', 'Corsa', 'Insignia', 'Mokka', 'Crossland'],
  'Peugeot': ['208', '308', '508', '2008', '3008', '5008'],
  'Citroën': ['C3', 'C4', 'C5', 'C3 Aircross', 'C5 Aircross'],
  'Renault': ['Clio', 'Megane', 'Kadjar', 'Koleos', 'Captur'],
  'Dacia': ['Sandero', 'Duster', 'Logan', 'Lodgy', 'Dokker'],
  'Seat': ['Ibiza', 'Leon', 'Ateca', 'Tarraco', 'Arona'],
  'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kodiaq', 'Kamiq'],
  'Fiat': ['500', 'Panda', 'Tipo', '500X', '500L'],
  'Lancia': ['Ypsilon', 'Delta', 'Thema', 'Voyager']
};

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
  
  // Available models based on selected make
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  const [serviceFormData, setServiceFormData] = useState({
    car_id: '',
    service_type: '',
    description: '',
    start_date: '',
    end_date: '',
    stage: 'planning',
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
      const response = await axios.get(`http://localhost:3001/api/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/customers/${id}/cars`);
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/customers/${id}/services`);
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
    // Set available models for the selected make
    setAvailableModels(CAR_DATABASE[car.make as keyof typeof CAR_DATABASE] || []);
    setCarDialogOpen(true);
  };

  const handleDeleteCar = async (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`http://localhost:3001/api/cars/${carId}`);
        fetchCars();
        fetchServices(); // Refresh services as they might be affected
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  // Handle make selection and update available models
  const handleMakeChange = (make: string) => {
    setCarFormData({ ...carFormData, make, model: '' }); // Reset model when make changes
    setAvailableModels(CAR_DATABASE[make as keyof typeof CAR_DATABASE] || []);
  };

  // Handle model selection
  const handleModelChange = (model: string) => {
    setCarFormData({ ...carFormData, model });
  };

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await axios.put(`http://localhost:3001/api/cars/${editingCar.id}`, carFormData);
      } else {
        await axios.post(`http://localhost:3001/api/customers/${id}/cars`, carFormData);
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
      stage: 'planning',
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
      start_date: formatDateForInput(service.start_date),
      end_date: formatDateForInput(service.end_date),
      stage: service.stage,
      price: service.price,
      notes: service.notes,
    });
    setServiceDialogOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`http://localhost:3001/api/services/${serviceId}`);
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
        await axios.put(`http://localhost:3001/api/services/${editingService.id}`, serviceFormData);
      } else {
        await axios.post(`http://localhost:3001/api/customers/${id}/services`, serviceFormData);
      }
      setServiceDialogOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planning': return '#ff9800';
      case 'in_progress': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'on_hold': return '#f44336';
      case 'cancelled': return '#9e9e9e';
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
                        <span>{formatDateForDisplay(service.start_date)}</span>
                      </div>
                      {service.end_date && (
                        <div className="info-item">
                          <span className="info-label">End Date:</span>
                          <span>{formatDateForDisplay(service.end_date)}</span>
                        </div>
                      )}
                      <div className="info-item">
                        <span className="info-label">Stage:</span>
                        <span 
                          className="stage-badge"
                          style={{ backgroundColor: getStageColor(service.stage) }}
                        >
                          {service.stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                  <select
                    id="make"
                    required
                    value={carFormData.make}
                    onChange={(e) => handleMakeChange(e.target.value)}
                  >
                    <option value="">Select Make</option>
                    {Object.keys(CAR_DATABASE).sort().map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="model">Model *</label>
                  <select
                    id="model"
                    required
                    value={carFormData.model}
                    onChange={(e) => handleModelChange(e.target.value)}
                    disabled={!carFormData.make}
                  >
                    <option value="">Select Model</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
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
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
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