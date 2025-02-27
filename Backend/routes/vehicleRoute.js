// routes/vehicle.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Add a new vehicle
router.post('/add-vehicle/', vehicleController.addNewVehicle);

// Delete a vehicle
router.delete('/delete-vehicle/:id', vehicleController.deleteVehicle);

// Get all vehicles
router.get('/get-vehicles/', vehicleController.getAllVehicles);

// Get a single vehicle by ID
router.get('/get-vehicle/:id', vehicleController.getVehicleById);

// Update a vehicle
router.put('/update-vehicle/:id', vehicleController.updateVehicle);

// Get vehicle counts by status
router.get('/status-counts', vehicleController.getVehicleCountsByStatus);

// Get vehicle counts by type
router.get('/type-counts', vehicleController.getVehicleCountsByType);

module.exports = router;