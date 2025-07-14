import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeart, FaBell } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  max-width: 600px;
  margin: 0 auto;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #64b5f6;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const Wishlist: React.FC = () => {
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>
          <FaHeart style={{ marginRight: '1rem' }} />
          Wunschliste
        </Title>
        <Subtitle>
          Behalte den Überblick über deine gewünschten Artikel
        </Subtitle>

        <FeatureCard
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <FeatureIcon>
            <FaBell />
          </FeatureIcon>
          <FeatureTitle>Benachrichtigungen</FeatureTitle>
          <FeatureDescription>
            Erhalte automatische Benachrichtigungen, wenn passende Artikel zum Verkauf oder Tausch angeboten werden.
          </FeatureDescription>
        </FeatureCard>
      </motion.div>
    </Container>
  );
};

export default Wishlist;