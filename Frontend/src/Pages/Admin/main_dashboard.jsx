import React from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import Header from '../../Components/navbar';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainSection = styled.div`
  display: flex;
  flex-grow: 1;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  margin-top: 70px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
`;

const Card = styled.div`
  background-color: #fff;
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  height: 250px; /* Increased height to accommodate illustrations */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
`;

const IllustrationContainer = styled.div`
  margin-bottom: 15px;
  width: 200px; /* Adjust size as needed */
  height: 200px; /* Adjust size as needed */
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 120%;
    height: 120%;
    object-fit: contain;
  }
`;

const CardTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
`;

const MainDashboard = () => {
  const navigate = useNavigate();

  // Card data with external image URLs
  const cards = [
    {
      title: 'Vehicle Management',
      illustration: 'https://png.pngtree.com/background/20220714/original/pngtree-big-isolated-vehicle-vector-colorful-icons-flat-illustrations-of-delivery-by-picture-image_1607668.jpg', // Replace with your image URL
      path: '/vehicle-management',
    },
    {
      title: 'Owner Management',
      illustration: 'https://img.freepik.com/premium-vector/professional-car-salesman-vector-design-illustration_1138841-28919.jpg', // Replace with your image URL
      path: '/owner-management',
    },
    {
      title: 'Service & Maintenance Records',
      illustration: 'https://cdni.iconscout.com/illustration/premium/thumb/workers-of-car-service-center-painting-illustration-download-in-svg-png-gif-file-formats--teamwork-skilled-paint-team-pack-automobile-illustrations-2451635.png', // Replace with your image URL
      path: '/service-maintenance',
    },
    {
      title: 'GPS Vehicle Tracking',
      illustration: 'https://static.vecteezy.com/system/resources/previews/002/916/703/non_2x/big-isolated-vehicle-colorful-icons-flat-illustrations-of-delivery-by-van-through-gps-tracking-location-delivery-vehicle-gas-gasoline-fuel-delivery-instant-delivery-online-delivery-vector.jpg', // Replace with your image URL
      path: '/gps-tracking',
    },
  ];

  return (
    <DashboardContainer>
      <Header /> 
      <MainSection>
        <MainContent>
          <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
            Main Dashboard
          </Typography>

          {/* Card Views for Navigation */}
          <CardContainer>
            {cards.map((card, index) => (
              <Card key={index} onClick={() => navigate(card.path)}>
                <IllustrationContainer>
                  <img src={card.illustration} alt={card.title} />
                </IllustrationContainer>
                <CardTitle>{card.title}</CardTitle>
              </Card>
            ))}
          </CardContainer>
        </MainContent>
      </MainSection>
    </DashboardContainer>
  );
};

export default MainDashboard;