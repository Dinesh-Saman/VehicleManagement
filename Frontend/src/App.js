import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
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
import Login from './Pages/Admin/login';
import Register from './Pages/Admin/register';
import AddInventory from './Pages/Inventory/add_inventory';
import ViewInventory from './Pages/Inventory/view_inventory';
import UpdateInventory from './Pages/Inventory/update_inventory';
import InventoryReportPage from './Pages/Inventory/inventory_report';
import InventoryAnalysis from './Pages/Inventory/analysis_report';
import OwnerDashboard from './Pages/Owner/dashboard';
import InventoryDashboard from './Pages/Inventory/dashboard';

function App() {
  return (
      <div>
        <Header></Header>
        <Routes>
          {/* Redirect from root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/main-dashboard" element={<MainDashboard />} />

          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/vehicle-dashboard" element={<VehicleManageDashboard />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/update-vehicle/:id" element={<UpdateVehicle />} />
          <Route path="/view-vehicle" element={<ViewVehicle />} />
          <Route path="/vehicle-report" element={<VehicleReport />} />
          <Route path="/vehicle-analysis-report" element={<AnalysisReport />} />

          <Route path="/add-owner" element={<AddOwner />} />
          <Route path="/view-owner" element={<ViewOwner />} />
          <Route path="/update-owner/:id" element={<UpdateOwner />} />
          <Route path="/owner-report" element={<OwnerReport />} />
          <Route path="/owner-management" element={<OwnerManagementDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/owner-analysis-report" element={<OwnerAnalysisReport />} />

          <Route path="/add-inventory" element={<AddInventory />} />
          <Route path="/view-inventory" element={<ViewInventory />} />
          <Route path="/update-inventory/:id" element={<UpdateInventory />} />
          <Route path="/inventory-report" element={<InventoryReportPage />} />
          <Route path="/inventory-management" element={<OwnerManagementDashboard />} />
          <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
          <Route path="/inventory-analysis-report" element={<InventoryAnalysis />} />
        </Routes>
        <Footer></Footer>
      </div>
  );
}

export default App;
