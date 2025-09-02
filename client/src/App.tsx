import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customer/:id" element={<CustomerDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;