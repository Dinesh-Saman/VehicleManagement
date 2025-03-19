import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, TextField, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Email, Lock, Person } from '@material-ui/icons';
import axios from 'axios'; // Import axios

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
  margin-bottom: 10px;
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


const RegistrationPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegistration = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      username,
      email,
      password,
    };

    try {
      // Use axios for the POST request
      const response = await axios.post('http://localhost:3001/admin/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
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
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: '15px' }}
          />
        </IconWrapper>
        <IconWrapper>
          <Email style={{ marginRight: '10px', color: '#3f51b5' }} />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '15px' }}
          />
        </IconWrapper>
        <IconWrapper>
          <Lock style={{ marginRight: '10px', color: '#3f51b5' }} />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '15px' }}
          />
        </IconWrapper>
        <IconWrapper>
          <Lock style={{ marginRight: '10px', color: '#3f51b5' }} />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
        </IconWrapper>
        {error && <Typography color="error" style={{ marginBottom: '10px' }}>{error}</Typography>}
        <RegistrationButton
          variant="contained"
          onClick={handleRegistration}
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