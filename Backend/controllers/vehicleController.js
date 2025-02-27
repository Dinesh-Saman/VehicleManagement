// controllers/vehicleController.js
const Vehicle = require("../models/vehicleModel");
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Add a new vehicle
exports.addNewVehicle = async (req, res) => {
    try {
        const { registrationNumber, make, model, year, fuelType, vehicleType, color, status } = req.body;

        // Log the received data for debugging
        console.log(req.body);

        // Create an array to hold error messages for missing fields
        const missingFields = [];

        // Check each required field and push to missingFields array if not provided
        if (!registrationNumber) missingFields.push("registrationNumber");
        if (!make) missingFields.push("make");
        if (!model) missingFields.push("model");
        if (!year) missingFields.push("year");
        if (!fuelType) missingFields.push("fuelType");
        if (!vehicleType) missingFields.push("vehicleType");
        if (!status) missingFields.push("status");

        // If there are any missing fields, return a detailed message
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "The following fields are required", 
                missingFields 
            });
        }

        // Check if a vehicle with the same registration number already exists
        const existingVehicle = await Vehicle.findOne({ registrationNumber });
        if (existingVehicle) {
            return res.status(409).json({ 
                message: "A vehicle with this registration number already exists",
                registrationNumber
            });
        }

        // Create a new vehicle
        const newVehicle = new Vehicle({
            registrationNumber,
            make,
            model,
            year,
            fuelType,
            vehicleType,
            color, // Optional field
            status,
        });

        await newVehicle.save();
        res.status(201).json({ message: "New vehicle added successfully!" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};

// Delete a vehicle
exports.deleteVehicle = (req, res) => {
  const vehicleId = req.params.id;

  Vehicle.deleteOne({ _id: vehicleId })
    .then(() => {
      res.status(200).send({ status: "Vehicle deleted" });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "Error with delete vehicle", error: err.message });
    });
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found!" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  const vehicleId = req.params.id;
  const { registrationNumber, make, model, year, fuelType, vehicleType, color, status } = req.body;

  // Validate inputs
  if (!(registrationNumber && make && model && year && fuelType && vehicleType && status)) {
    return res.status(400).send({ message: "All required inputs are missing" });
  }

  // Check if vehicleId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    return res.status(400).send({ message: "Invalid vehicle ID" });
  }

  try {
    // Check if the vehicle exists in the database
    const isVehicle = await Vehicle.findById(vehicleId);

    if (!isVehicle) {
      return res.status(404).json({ message: "Vehicle not found!" });
    }

    // Check if another vehicle with the same registration number already exists (excluding current vehicle)
    const existingVehicle = await Vehicle.findOne({ 
      registrationNumber, 
      _id: { $ne: vehicleId } 
    });
    
    if (existingVehicle) {
      return res.status(409).json({ 
        message: "Another vehicle with this registration number already exists",
        registrationNumber
      });
    }

    // Update the vehicle
    const result = await Vehicle.updateOne(
      { _id: vehicleId },
      {
        registrationNumber,
        make,
        model,
        year,
        fuelType,
        vehicleType,
        color, // Optional field
        status,
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes were made" });
    }

    return res.status(200).json({ message: "Vehicle updated successfully!" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: err.message });
  }
};

// Get vehicle counts by status
exports.getVehicleCountsByStatus = async (req, res) => {
  try {
    // Aggregate the count of vehicles by status
    const statusCounts = await Vehicle.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1
        }
      }
    ]);

    // If there are no counts, return an empty object
    if (!statusCounts.length) {
      return res.json({ message: "No vehicles found" });
    }

    res.json(statusCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get vehicle counts by vehicle type
exports.getVehicleCountsByType = async (req, res) => {
  try {
    // Aggregate the count of vehicles by vehicle type
    const typeCounts = await Vehicle.aggregate([
      {
        $group: {
          _id: "$vehicleType",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          vehicleType: "$_id",
          count: 1
        }
      }
    ]);

    // If there are no counts, return an empty object
    if (!typeCounts.length) {
      return res.json({ message: "No vehicles found" });
    }

    res.json(typeCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};