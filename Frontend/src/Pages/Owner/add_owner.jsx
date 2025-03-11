import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, 
  Typography, FormHelperText, Grid, RadioGroup, FormControlLabel, Radio
} from '@material-ui/core';
import Sidebar from '../../Components/owner_sidebar';
import Header from '../../Components/navbar';
import axios from 'axios';
import swal from 'sweetalert';

const AddOwner = () => {
  // State variables for form fields
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [ownerId, setOwnerId] = useState('');
  
  // Function to generate owner ID
  const generateOwnerId = () => {
    // Generate a random 8-digit number
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    // Create owner ID with OWN prefix followed by 8 digits
    return `OWN${randomNum}`;
  };
  
  // Generate owner ID on component mount
  useEffect(() => {
    const newOwnerId = generateOwnerId();
    setOwnerId(newOwnerId);
  }, []);

  // Calculate minimum date (18 years ago from today)
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  ).toISOString().split('T')[0]; // Format as YYYY-MM-DD

  // Effect to check if all required fields are filled
  useEffect(() => {
    const requiredFields = {
      name,
      contact,
      address,
      licenseNumber,
      dateOfBirth,
      gender
    };
    
    // Check if all required fields have values
    const valid = Object.values(requiredFields).every(field => field !== '' && field !== null);
    setIsFormValid(valid);
  }, [name, contact, address, licenseNumber, dateOfBirth, gender]);

  // Validate contact number (10 digits)
  const validateContact = (value) => {
    const contactRegex = /^\d{10}$/;
    return contactRegex.test(value);
  };

  // Validate Sri Lankan license number
  // Format: B1234567 or NEW1234567 or old format XX0000000000000
  const validateLicense = (value) => {
    // Sri Lankan license formats:
    // B followed by 7 digits
    // NEW followed by 7 digits
    // Old format: XX followed by 13 digits
    const sriLankanLicenseRegex = /^(B\d{7}|NEW\d{7})$/;
    const oldLicenseRegex = /^[A-Z]{2}\d{13}$/;
    
    return sriLankanLicenseRegex.test(value) || oldLicenseRegex.test(value);
  };

  const handleContactChange = (e) => {
    const value = e.target.value;
    setContact(value);
    
    // Real-time validation for contact
    if (value && !validateContact(value)) {
      setErrors(prevErrors => ({ 
        ...prevErrors, 
        contact: "Contact number must be 10 digits" 
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, contact: '' }));
    }
  };

  const handleLicenseChange = (e) => {
    const value = e.target.value;
    setLicenseNumber(value);
    
    // Real-time validation for license
    if (value && !validateLicense(value)) {
      setErrors(prevErrors => ({ 
        ...prevErrors, 
        licenseNumber: "Invalid license format. Use B1234567, NEW1234567, or XX followed by 13 digits" 
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, licenseNumber: '' }));
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, gender: '' }));
  };

  const handleDateChange = (e) => {
    setDateOfBirth(e.target.value);
    setErrors(prevErrors => ({ ...prevErrors, dateOfBirth: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!contact) newErrors.contact = "Contact number is required.";
    else if (!validateContact(contact)) newErrors.contact = "Contact number must be 10 digits.";
    
    if (!address) newErrors.address = "Address is required.";
    
    if (!licenseNumber) newErrors.licenseNumber = "License number is required.";
    else if (!validateLicense(licenseNumber)) 
      newErrors.licenseNumber = "Invalid license format. Use B1234567, NEW1234567, or XX followed by 13 digits";
    
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
    else {
      const birthDate = new Date(dateOfBirth);
      const ageDate = new Date(today - birthDate);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      
      if (age < 18) {
        newErrors.dateOfBirth = "Owner must be at least 18 years old.";
      }
    }
    
    if (!gender) newErrors.gender = "Gender is required.";
    
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Format date of birth for backend
    const formattedDOB = new Date(dateOfBirth).toISOString();

    const newOwner = {
      owner_id: ownerId,
      name,
      contact,
      address,
      license_number: licenseNumber,
      date_of_birth: formattedDOB,
      gender,
    };

    try {
      await axios.post('http://localhost:3001/owner/add-owner', newOwner);
      swal("Success", "New owner added successfully!", "success");
      // Reset form fields but keep the owner ID
      setName('');
      setContact('');
      setAddress('');
      setLicenseNumber('');
      setDateOfBirth('');
      setGender('');
      setErrors({});
      
      // Generate a new owner ID for the next entry with the new format
      const newOwnerId = generateOwnerId();
      setOwnerId(newOwnerId);
    } catch (error) {
      console.error(error);
      
      // Check if it's a duplicate error (HTTP 409 Conflict)
      if (error.response && error.response.status === 409) {
        // Show the specific error message from the server
        swal("Error", error.response.data.message, "error");
        
        // Set appropriate field error based on the error message
        if (error.response.data.message.includes("contact")) {
          setErrors(prevErrors => ({ 
            ...prevErrors, 
            contact: "This contact number is already registered" 
          }));
        } else if (error.response.data.message.includes("license")) {
          setErrors(prevErrors => ({ 
            ...prevErrors, 
            licenseNumber: "This license number is already registered" 
          }));
        }
      } else {
        // Generic error message for other errors
        swal("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <Box>
      <Header /> 
      <Box display="flex">
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ 
            backgroundColor: 'white', 
            borderRadius: 8, 
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', 
            flex: 1, 
            margin: '15px' 
          }}
        >
          {/* Title Section */}
          <Box
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4" gutterBottom style={{ 
              fontFamily: 'cursive', 
              fontWeight: 'bold', 
              color: 'purple', 
              textAlign: 'center', 
              marginTop:'30px' 
            }}>
              Register New Owner
            </Typography>
          </Box>

          <Box display="flex" width="100%">
            {/* Form Section */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ flex: 1, padding: '20px', margin: '15px' }}
            >
              <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
                {/* Owner ID field (read-only) with gray styling */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Owner ID"
                  variant="outlined"
                  value={ownerId}
                  InputProps={{
                    readOnly: true,
                    style: {
                      backgroundColor: '#f0f0f0', // Light gray background
                      color: '#757575',           // Darker gray text
                      cursor: 'not-allowed',      // Change cursor to indicate it's not editable
                    },
                  }}
                  helperText="System generated ID (cannot be modified)"
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  helperText={errors.name}
                  error={!!errors.name}
                  required
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="Contact Number"
                  variant="outlined"
                  value={contact}
                  onChange={handleContactChange}
                  helperText={errors.contact}
                  error={!!errors.contact}
                  required
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  helperText={errors.address}
                  error={!!errors.address}
                  required
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="License Number"
                  variant="outlined"
                  value={licenseNumber}
                  onChange={handleLicenseChange}
                  helperText={errors.licenseNumber || "Use format B1234567, NEW1234567, or XX followed by 13 digits"}
                  error={!!errors.licenseNumber}
                  required
                />
                
                {/* Native HTML date input instead of Material-UI DatePicker */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Date of Birth"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={dateOfBirth}
                  onChange={handleDateChange}
                  inputProps={{ max: minDate }}
                  helperText={errors.dateOfBirth || "Must be at least 18 years old"}
                  error={!!errors.dateOfBirth}
                  required
                />
                
                <FormControl component="fieldset" margin="normal" error={!!errors.gender} required>
                  <Typography variant="subtitle1">Gender</Typography>
                  <RadioGroup 
                    aria-label="gender" 
                    name="gender" 
                    value={gender} 
                    onChange={handleGenderChange}
                    row
                  >
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  </RadioGroup>
                  <FormHelperText>{errors.gender}</FormHelperText>
                </FormControl>
                
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  style={{ marginTop: 16 }}
                  disabled={!isFormValid}
                >
                  Register Owner
                </Button>
              </Box>
            </Box>

            {/* Image Section */}
            <Box
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '20px',
                margin: '25px',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1620899011820-e22f724e8084?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3ViYXJ1JTIwYnJ6fGVufDB8fDB8fHww"
                alt="Vehicle Owner"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddOwner;