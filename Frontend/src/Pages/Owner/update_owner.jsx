import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Box, Typography, FormHelperText, Grid, RadioGroup, 
  FormControlLabel, Radio, FormControl
} from '@material-ui/core';
import Sidebar from '../../Components/owner_sidebar';
import Header from '../../Components/navbar';
import axios from 'axios';
import swal from 'sweetalert';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateOwner = () => {
  const { id } = useParams(); // Extract owner ID from URL params
  const navigate = useNavigate();

  // State variables for form fields
  const [ownerId, setOwnerId] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Calculate minimum date (18 years ago from today)
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  ).toISOString().split('T')[0]; // Format as YYYY-MM-DD

  // Fetch owner data when component mounts
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/owner/get-owner/${id}`);
        const ownerData = response.data;
        
        setOwnerId(ownerData.owner_id);
        setName(ownerData.name);
        setContact(ownerData.contact);
        setAddress(ownerData.address);
        setLicenseNumber(ownerData.license_number);
        
        // Format date from ISO to YYYY-MM-DD for the date input
        const dobDate = new Date(ownerData.date_of_birth);
        const formattedDOB = dobDate.toISOString().split('T')[0];
        setDateOfBirth(formattedDOB);
        
        setGender(ownerData.gender);
      } catch (error) {
        console.error(error);
        swal("Error", "Failed to fetch owner data.", "error");
      }
    };

    fetchOwner();
  }, [id]);

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

    const updatedOwner = {
      owner_id: ownerId,
      name,
      contact,
      address,
      license_number: licenseNumber,
      date_of_birth: formattedDOB,
      gender,
    };

    try {
      await axios.put(`http://localhost:3001/owner/update-owner/${id}`, updatedOwner);
      swal("Success", "Owner updated successfully!", "success");
      navigate('/view-owner'); // Navigate to owner list page after successful update
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
              Update Owner Details
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
                
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    style={{ width: '48%' }}
                    onClick={() => navigate('/view-owner')}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    style={{ width: '48%' }}
                    disabled={!isFormValid}
                  >
                    Update Owner
                  </Button>
                </Box>
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
                src="https://images.pexels.com/photos/17507682/pexels-photo-17507682.jpeg?cs=srgb&dl=pexels-introspectivedsgn-17507682.jpg&fm=jpg"
                alt="Vehicle Owner"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  marginTop:'5px'
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateOwner;