import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VehicleManageDashboard from './Pages/Vehicle/dashboard';
import OwnerManageDashboard from './Pages/Vehicle/dashboard';
import AddVehicle from './Pages/Vehicle/add_vehicle';
import UpdateVehicle from './Pages/Vehicle/update_vehicle';
import ViewVehicle from './Pages/Vehicle/view_vehicle';
import VehicleReport from './Pages/Vehicle/vehicle_report';
import AnalysisReport from './Pages/Vehicle/analysis_report';
import OwnerAnalysisReport from './Pages/Owner/analysis_report';
import AddOwner from './Pages/Owner/add_owner';
import ViewOwner from './Pages/Owner/view_owner';
import UpdateOwner from './Pages/Owner/update_owner';
import OwnerReport from './Pages/Owner/owner_report';
import OwnerManagementDashboard from './Pages/Owner/dashboard';
import MainDashboard from './Pages/Admin/main_dashboard';
import Footer from './Components/footer';
import Header from './Components/guest_header';

function App() {
  return (
      <div>
        <Header></Header>
        <Routes>
          <Route path="/vehicle-management" element={<VehicleManageDashboard />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/update-vehicle/:id" element={<UpdateVehicle />} />
          <Route path="/view-vehicle" element={<ViewVehicle />} />
          <Route path="/vehicle-report" element={<VehicleReport />} />
          <Route path="/analysis-report" element={<AnalysisReport />} />
          <Route path="/owner-analysis-report" element={<OwnerAnalysisReport />} />
          <Route path="/add-owner" element={<AddOwner />} />
          <Route path="/view-owner" element={<ViewOwner />} />
          <Route path="/update-owner/:id" element={<UpdateOwner />} />
          <Route path="/owner-report" element={<OwnerReport />} />
          <Route path="/owner-management" element={<OwnerManagementDashboard />} />
          <Route path="/main-dashboard" element={<MainDashboard />} />
        </Routes>
        <Footer></Footer>
      </div>
  );
}

export default App;
