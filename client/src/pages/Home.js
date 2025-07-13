import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrophy, FaUsers, FaRocket, FaMedal, FaGamepad, FaClock } from 'react-icons/fa';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTitle = styled(motion.h1)`
  font-family: 'Press Start 2P', cursive;
  font-size: 3rem;
  color: #00ff41;
  text-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #00cc33;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #00ff41, #00cc33);
  color: #0f0f23;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 40px rgba(0, 255, 65, 0.6);
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: rgba(26, 26, 46, 0.5);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #00ff41, #00cc33);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2rem;
  color: #0f0f23;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #00ff41;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const FeatureDescription = styled.p`
  color: #00cc33;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 4rem 0;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const StatCard = styled(motion.div)`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #00ff41;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #00cc33;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CallToActionSection = styled.section`
  padding: 4rem 0;
  text-align: center;
  background: rgba(26, 26, 46, 0.5);
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 2rem;
  background: transparent;
  color: #00ff41;
  border: 2px solid #00ff41;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 65, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  }
`;

const FloatingParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00ff41;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
`;

const Home = () => {
  const features = [
    {
      icon: <FaUsers />,
      title: 'Team Building',
      description: 'Gründe Teams mit 2-4 Spielern und wähle deine Rolle als Captain oder Member.'
    },
    {
      icon: <FaTrophy />,
      title: 'Competitive Events',
      description: 'Nimm an spannenden Team-Speedrun-Events teil und kämpfe um den Sieg.'
    },
    {
      icon: <FaClock />,
      title: 'Live Rankings',
      description: 'Verfolge die Team-Zeiten in Echtzeit und sieh, wer die Nase vorn hat.'
    },
    {
      icon: <FaMedal />,
      title: 'Achievements',
      description: 'Sammle exklusive Medaillen und Abzeichen für Team-Erfolge.'
    },
    {
      icon: <FaGamepad />,
      title: 'Retro Gaming',
      description: 'Erlebe die Nostalgie der N64-Ära mit moderner Team-Dynamik.'
    },
    {
      icon: <FaRocket />,
      title: 'Real-time Chat',
      description: 'Kommuniziere mit deinem Team während des Events für maximale Koordination.'
    }
  ];

  const stats = [
    { number: '50+', label: 'Aktive Teams' },
    { number: '200+', label: 'Events' },
    { number: '1000+', label: 'Spieler' },
    { number: '24/7', label: 'Live Support' }
  ];

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5
  }));

  return (
    <HomeContainer>
      <HeroSection>
        <FloatingParticles>
          {particles.map((particle) => (
            <Particle
              key={particle.id}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: particle.delay
              }}
            />
          ))}
        </FloatingParticles>
        
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            BATTLE64 GRUPPEN-SPEEDRUNS
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Erlebe die ultimative Team-Erfahrung im N64-Speedrunning! 
            Gründet Teams, kämpft um die besten Zeiten und werdet zu Legenden.
          </HeroSubtitle>
          
          <CTAButton
            to="/events"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRocket />
            Jetzt Mitmachen
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      <CallToActionSection>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            fontSize: '2.5rem',
            color: '#00ff41',
            marginBottom: '1rem',
            fontFamily: 'Press Start 2P, cursive'
          }}
        >
          BEREIT FÜR DIE HERAUSFORDERUNG?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            fontSize: '1.2rem',
            color: '#00cc33',
            marginBottom: '2rem'
          }}
        >
          Tritt einem Team bei oder gründe dein eigenes und starte deine Speedrun-Karriere!
        </motion.p>
        
        <CTAButtons>
          <CTAButton
            to="/teams"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUsers />
            Team Finden
          </CTAButton>
          
          <SecondaryButton
            to="/events"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCalendarAlt />
            Events Ansehen
          </SecondaryButton>
        </CTAButtons>
      </CallToActionSection>
    </HomeContainer>
  );
};

export default Home;