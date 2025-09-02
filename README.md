# Auto Wrap CRM

A comprehensive Customer Relationship Management system designed specifically for auto wrap shops to manage customers, their vehicles, and services.

## Features

### Customer Management
- Add, edit, and delete customers
- Store customer information including name, email, phone, and address
- View customer details and history

### Vehicle Management
- Add multiple vehicles per customer
- Track vehicle details: make, model, year, color, license plate, VIN
- Add notes for each vehicle

### Service Tracking
- Create services for specific vehicles
- Track service stages: Pending, In Progress, Completed, Cancelled
- Set start and end dates for services
- Add pricing information
- Include detailed descriptions and notes

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite
- **Frontend**: React with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Styling**: Emotion (CSS-in-JS)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd auto-wrap-crm
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start the application**
   
   **Option 1: Start both backend and frontend together**
   ```bash
   npm run dev
   ```
   
   **Option 2: Start them separately**
   
   Terminal 1 (Backend):
   ```bash
   npm start
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Adding Customers
1. Click "Add Customer" on the main page
2. Fill in customer details (name is required)
3. Click "Add" to save

### Managing Vehicles
1. Click on a customer to view their details
2. Go to the "Cars" tab
3. Click "Add Car" to add a new vehicle
4. Fill in vehicle details and save

### Tracking Services
1. In the customer detail view, go to the "Services" tab
2. Click "Add Service" (requires at least one car to be added)
3. Select the vehicle and fill in service details:
   - Service type (e.g., "Full Wrap", "Partial Wrap", "Vinyl Removal")
   - Description
   - Start and end dates
   - Current stage
   - Price
   - Additional notes

### Service Stages
- **Pending**: Service is scheduled but not started
- **In Progress**: Work is currently being performed
- **Completed**: Service has been finished
- **Cancelled**: Service was cancelled

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get specific customer
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Cars
- `GET /api/customers/:customerId/cars` - Get customer's cars
- `POST /api/customers/:customerId/cars` - Add car to customer
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Services
- `GET /api/customers/:customerId/services` - Get customer's services
- `POST /api/customers/:customerId/services` - Add service to customer
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## Database Schema

The application uses SQLite with the following tables:

- **customers**: Customer information
- **cars**: Vehicle information linked to customers
- **services**: Service records linked to customers and cars

## Customization

### Adding New Service Types
You can add predefined service types by modifying the service form in `client/src/components/CustomerDetail.tsx`.

### Styling
The application uses Material-UI theming. You can customize colors and styles in `client/src/App.tsx`.

### Database
The SQLite database file (`crm.db`) is created automatically when you first run the server.

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Backend runs on port 5000, frontend on port 3000
   - Make sure these ports are available

2. **Database errors**
   - Delete `crm.db` file and restart the server to reset the database

3. **Dependencies issues**
   - Run `npm install` in both root and client directories

## Future Enhancements

- User authentication and authorization
- File uploads for vehicle photos
- Email notifications
- Reporting and analytics
- Mobile app
- Integration with payment systems
- Calendar integration for scheduling

## License

MIT License - feel free to use and modify for your business needs.
