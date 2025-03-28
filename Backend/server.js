const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db_connection = require("./database/index");
require('dotenv').config();
var cors = require('cors');

const PORT = process.env.PORT || 3000;

// Import the vehicle route
const VehicleRoutes = require("./routes/vehicleRoute");
const OwnerRoutes = require("./routes/ownerRoute");
const UserRoutes = require("./routes/userRoute");
const InventoryRoutes = require("./routes/inventoryRoute");

const app = express();

app.use(cors()); // Use this after the variable declaration
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db_connection();

// Use the vehicle route
app.use("/vehicle", VehicleRoutes);   
app.use("/owner", OwnerRoutes);  
app.use("/admin", UserRoutes);  
app.use("/inventory", InventoryRoutes);  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
