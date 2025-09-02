import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import AllServices from './components/AllServices';
import AllCars from './components/AllCars';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customer/:id" element={<CustomerDetail />} />
            <Route path="/services" element={<AllServices />} />
            <Route path="/cars" element={<AllCars />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;