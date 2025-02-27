import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Vehicle/dashboard';
import AddVehicle from './Pages/Vehicle/add_vehicle';
import UpdateVehicle from './Pages/Vehicle/update_vehicle';
import ViewVehicle from './Pages/Vehicle/view_vehicle';
import VehicleReport from './Pages/Vehicle/vehicle_report';
import AnalysisReport from './Pages/Vehicle/analysis_report';
import Footer from './Components/footer';
import Header from './Components/guest_header';

function App() {
  return (
      <div>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/update-vehicle/:id" element={<UpdateVehicle />} />
          <Route path="/view-vehicle" element={<ViewVehicle />} />
          <Route path="/vehicle-report" element={<VehicleReport />} />
          <Route path="/analysis-report" element={<AnalysisReport />} />
        </Routes>
        <Footer></Footer>
      </div>
  );
}

export default App;
