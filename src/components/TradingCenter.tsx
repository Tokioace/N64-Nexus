import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaHandshake, FaComments } from 'react-icons/fa';

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

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
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

const TradingCenter: React.FC = () => {
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>
          <FaExchangeAlt style={{ marginRight: '1rem' }} />
          Tauschbörse
        </Title>
        <Subtitle>
          Tausche deine N64 Spiele, Merchandise und Sammlerstücke sicher und einfach
        </Subtitle>

        <FeatureGrid>
          <FeatureCard
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <FeatureIcon>
              <FaHandshake />
            </FeatureIcon>
            <FeatureTitle>Punktebasierter Tausch</FeatureTitle>
            <FeatureDescription>
              Sammle Tauschpunkte durch Aktivitäten und tausche Artikel gegen Punkte oder direkte Tauschangebote.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <FeatureIcon>
              <FaComments />
            </FeatureIcon>
            <FeatureTitle>Integrierter Chat</FeatureTitle>
            <FeatureDescription>
              Kommuniziere direkt mit anderen Sammlern über Tauschdetails und Verhandlungen.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <FeatureIcon>
              <FaExchangeAlt />
            </FeatureIcon>
            <FeatureTitle>Sichere Transaktionen</FeatureTitle>
            <FeatureDescription>
              Bewertungssystem und Betrugsschutz für sichere Tauschgeschäfte in der Community.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </motion.div>
    </Container>
  );
};

export default TradingCenter;