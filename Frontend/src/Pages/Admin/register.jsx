import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography, TextField, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Email, Lock, Person } from '@material-ui/icons';
import axios from 'axios';

const RegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('https://m.media-amazon.com/images/I/61lKwIqTL0S.jpg');
  background-size: cover;
  background-position: center;
`;

const RegistrationForm = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 500px;
`;

const RegistrationButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  background-color: #3f51b5;
  color: white;
  &:hover {
    background-color: #303f9f;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const LoginText = styled(Typography)`
  margin-top: 15px;
  color: black;
  
  span {
    color: #3f51b5;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorText = styled(Typography)`
  color: red;
  font-size: 0.75rem;
  text-align: left;
  margin-top: -10px;
  margin-bottom: 10px;
  padding-left: 36px;
`;

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [submitError, setSubmitError] = useState('');

  // Email validation regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Password validation (at least 6 characters)
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Real-time validation
  useEffect(() => {
    const newErrors = { ...errors };

    // Username validation
    if (formData.username.length > 0 && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else {
      newErrors.username = '';
    }

    // Email validation
    if (formData.email.length > 0 && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      newErrors.email = '';
    }

    // Password validation
    if (formData.password.length > 0 && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    } else {
      newErrors.password = '';
    }

    // Confirm password validation
    if (formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } else {
      newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegistration = async () => {
    // Check if any fields are empty
    const emptyFields = Object.entries(formData).filter(([key, value]) => !value);
    if (emptyFields.length > 0) {
      const newErrors = { ...errors };
      emptyFields.forEach(([field]) => {
        newErrors[field] = 'This field is required';
      });
      setErrors(newErrors);
      return;
    }

    // Check if there are any validation errors
    if (Object.values(errors).some(error => error)) {
      setSubmitError('Please fix the errors in the form');
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post('http://localhost:3001/admin/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        navigate('/login');
      } else {
        setSubmitError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <RegistrationContainer>
      <RegistrationForm>
        <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'Roboto', fontWeight: 'bold', color: '#3f51b5' }}>
          Admin Registration
        </Typography>
        
        <IconWrapper>
          <Person style={{ marginRight: '10px', color: '#3f51b5' }} />
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            style={{ marginBottom: '5px' }}
          />
        </IconWrapper>
        {errors.username && <ErrorText>{errors.username}</ErrorText>}
        
        <IconWrapper>
          <Email style={{ marginRight: '10px', color: '#3f51b5' }} />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            style={{ marginBottom: '5px' }}
          />
        </IconWrapper>
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
        
        <IconWrapper>
          <Lock style={{ marginRight: '10px', color: '#3f51b5' }} />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            style={{ marginBottom: '5px' }}
          />
        </IconWrapper>
        {errors.password && <ErrorText>{errors.password}</ErrorText>}
        
        <IconWrapper>
          <Lock style={{ marginRight: '10px', color: '#3f51b5' }} />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            style={{ marginBottom: '5px' }}
          />
        </IconWrapper>
        {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
        
        {submitError && <Typography color="error" style={{ marginBottom: '10px' }}>{submitError}</Typography>}
        
        <RegistrationButton
          variant="contained"
          onClick={handleRegistration}
          disabled={Object.values(errors).some(error => error) || 
                   Object.values(formData).some(value => !value)}
        >
          Register
        </RegistrationButton>
        
        <LoginText variant="body2">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </LoginText>
      </RegistrationForm>
    </RegistrationContainer>
  );
};

export default RegistrationPage;