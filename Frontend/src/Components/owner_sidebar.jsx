import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaTachometerAlt, FaCar, FaPlusCircle, 
  FaFileAlt, FaChartLine, FaSignOutAlt, FaHome 
} from 'react-icons/fa';
import { Dashboard } from '@material-ui/icons';

// Styled components
const SidebarContainer = styled.div`
  width: 220px;
  height: auto;
  background: url('https://img.freepik.com/premium-photo/illustration-dark-black-geometric-abstract_1163991-353.jpg?semt=ais_hybrid') repeat;
  background-size: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: #ecf0f1;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 0;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
`;

const LogoImage = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 10px;
`;

const Menu = styled.div`
  flex-grow: 1;
  position: relative;
  z-index: 1;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 18px;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #34495e;
    color: #fff;
  }
`;

const Icon = styled.div`
  margin-right: 15px;
  font-size: 20px;
`;

const SignOutContainer = styled.div`
  margin-top: auto;
  position: relative;
  z-index: 1;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage style={{ width: '180px' }} />
      </LogoContainer>
      <Menu>
        <Link to="/owner-dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaTachometerAlt /></Icon>
            Dashboard
          </MenuItem>
        </Link>
        <Link to="/view-owner" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaCar /></Icon>
            View Owners
          </MenuItem>
        </Link>
        <Link to="/add-owner" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaPlusCircle /></Icon>
            Add Owner
          </MenuItem>
        </Link>
        <Link to="/owner-report" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaFileAlt /></Icon>
            Owner Report
          </MenuItem>
        </Link>
        <Link to="/owner-analysis-report" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaChartLine /></Icon>
            Analysis Report
          </MenuItem>
        </Link>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaHome /></Icon>
            Home
          </MenuItem>
        </Link>
        <Link to="/main-dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><Dashboard /></Icon>
            Main Dashboard
          </MenuItem>
        </Link>
      </Menu>
      <SignOutContainer>
        <Link to="/main-dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaSignOutAlt /></Icon>
            Sign Out
          </MenuItem>
        </Link>
      </SignOutContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
