// controllers/ownerController.js
const Owner = require("../models/ownerModel");
const Vehicle = require("../models/vehicleModel");
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Add a new owner
exports.addNewOwner = async (req, res) => {
    try {
        const { owner_id, name, contact, address, license_number, date_of_birth, gender, vehicles } = req.body;

        // Log the received data for debugging
        console.log(req.body);

        // Create an array to hold error messages for missing fields
        const missingFields = [];

        // Check each required field and push to missingFields array if not provided
        if (!owner_id) missingFields.push("owner_id");
        if (!name) missingFields.push("name");
        if (!contact) missingFields.push("contact");
        if (!address) missingFields.push("address");
        if (!license_number) missingFields.push("license_number");
        if (!date_of_birth) missingFields.push("date_of_birth");
        if (!gender) missingFields.push("gender");

        // If there are any missing fields, return a detailed message
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "The following fields are required", 
                missingFields 
            });
        }

        // Check if an owner with the same owner_id already exists
        const existingOwnerById = await Owner.findOne({ owner_id });
        if (existingOwnerById) {
            return res.status(409).json({ 
                message: "An owner with this ID already exists",
                owner_id
            });
        }

        // Check if an owner with the same contact already exists
        const existingOwnerByContact = await Owner.findOne({ contact });
        if (existingOwnerByContact) {
            return res.status(409).json({ 
                message: "An owner with this contact number already exists",
                contact
            });
        }

        // Check if an owner with the same license number already exists
        const existingOwnerByLicense = await Owner.findOne({ license_number });
        if (existingOwnerByLicense) {
            return res.status(409).json({ 
                message: "An owner with this license number already exists",
                license_number
            });
        }

        // Create a new owner
        const newOwner = new Owner({
            owner_id,
            name,
            contact,
            address,
            license_number,
            date_of_birth,
            gender,
            vehicles // Include vehicles array
        });

        await newOwner.save();
        res.status(201).json({ message: "New owner added successfully!" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};

// Delete an owner
exports.deleteOwner = (req, res) => {
    const ownerId = req.params.id;

    Owner.deleteOne({ _id: ownerId })
        .then(() => {
            res.status(200).send({ status: "Owner deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with delete owner", error: err.message });
        });
};

// Get all owners
exports.getAllOwners = async (req, res) => {
    try {
        const owners = await Owner.find();
        res.json(owners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single owner by ID
exports.getOwnerById = async (req, res) => {
    const { id } = req.params;

    try {
        const owner = await Owner.findById(id);
        if (!owner) return res.status(404).json({ message: "Owner not found!" });
        res.json(owner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get owner by owner_id
exports.getOwnerByOwnerId = async (req, res) => {
    const { owner_id } = req.params;

    try {
        const owner = await Owner.findOne({ owner_id });
        if (!owner) return res.status(404).json({ message: "Owner not found!" });
        res.json(owner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOwner = async (req, res) => {
    const ownerId = req.params.id;
    const { owner_id, name, contact, address, license_number, date_of_birth, gender, vehicles } = req.body;

    // Validate inputs
    if (!(owner_id && name && contact && address && license_number && date_of_birth && gender)) {
        return res.status(400).send({ message: "All required inputs are missing" });
    }

    // Check if ownerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        return res.status(400).send({ message: "Invalid owner ID" });
    }

    try {
        // Check if the owner exists in the database
        const isOwner = await Owner.findById(ownerId);

        if (!isOwner) {
            return res.status(404).json({ message: "Owner not found!" });
        }

        // Check if another owner with the same owner_id already exists (excluding current owner)
        const existingOwnerById = await Owner.findOne({ 
            owner_id, 
            _id: { $ne: ownerId } 
        });
        
        if (existingOwnerById) {
            return res.status(409).json({ 
                message: "Another owner with this ID already exists",
                owner_id
            });
        }

        // Check if another owner with the same contact already exists (excluding current owner)
        const existingOwnerByContact = await Owner.findOne({ 
            contact, 
            _id: { $ne: ownerId } 
        });
        
        if (existingOwnerByContact) {
            return res.status(409).json({ 
                message: "Another owner with this contact number already exists",
                contact
            });
        }

        // Check if another owner with the same license number already exists (excluding current owner)
        const existingOwnerByLicense = await Owner.findOne({ 
            license_number, 
            _id: { $ne: ownerId } 
        });
        
        if (existingOwnerByLicense) {
            return res.status(409).json({ 
                message: "Another owner with this license number already exists",
                license_number
            });
        }

        // Update the owner, now including vehicles array
        const result = await Owner.updateOne(
            { _id: ownerId },
            {
                owner_id,
                name,
                contact,
                address,
                license_number,
                date_of_birth,
                gender,
                vehicles // Include vehicles array in the update
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes were made" });
        }

        return res.status(200).json({ message: "Owner updated successfully!" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: err.message });
    }
};

// Get owner count by gender
exports.getOwnerCountsByGender = async (req, res) => {
    try {
        // Aggregate the count of owners by gender
        const genderCounts = await Owner.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    gender: "$_id",
                    count: 1
                }
            }
        ]);

        // If there are no counts, return an appropriate message
        if (!genderCounts.length) {
            return res.json({ message: "No owners found" });
        }

        res.json(genderCounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Search owners by name
exports.searchOwnersByName = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Case-insensitive search for owners by name
        const owners = await Owner.find({
            name: { $regex: query, $options: 'i' }
        });

        if (owners.length === 0) {
            return res.json({ message: "No owners found matching the search criteria" });
        }

        res.json(owners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Check if owner has associated vehicles
exports.checkOwnerVehicles = async (req, res) => {
    const ownerId = req.params.id;
    
    try {
        // Check if the ownerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: "Invalid owner ID format" });
        }
        
        // Convert ownerId to a valid ObjectId using the 'new' keyword
        const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
        
        // Find vehicles where this owner is assigned
        const vehicleCount = await Vehicle.countDocuments({ owner: ownerObjectId });
        console.log('Vehicle count for owner', ownerId, ':', vehicleCount);
        
        res.json({
            hasVehicles: vehicleCount > 0,
            count: vehicleCount
        });
    } catch (err) {
        console.error('Error checking owner vehicles:', err);
        res.status(500).json({ message: 'Server error checking owner vehicles' });
    }
};