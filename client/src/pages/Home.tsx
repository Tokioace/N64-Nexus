import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Paper,
} from '@mui/material';
import {
  Games as GamesIcon,
  Star as StarIcon,
  Collections as CollectionsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <GamesIcon sx={{ fontSize: 40 }} />,
      title: 'Spielekatalog',
      description: 'Entdecke alle N64-Titel mit detaillierten Informationen, Cover-Bildern und Metadaten.',
      action: 'Katalog durchsuchen',
      path: '/games',
    },
    {
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      title: 'Bewertungssystem',
      description: 'Bewerte Spiele in verschiedenen Kategorien: Gameplay, Grafik, Musik und Nostalgie.',
      action: 'Bewertungen ansehen',
      path: '/ratings',
    },
    {
      icon: <CollectionsIcon sx={{ fontSize: 40 }} />,
      title: 'Persönliche Sammlung',
      description: 'Verwalte deine eigene N64-Sammlung und verfolge deine Fortschritte.',
      action: 'Sammlung verwalten',
      path: '/collection',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Community-Rankings',
      description: 'Entdecke die beliebtesten Spiele und versteckte Schätze der Community.',
      action: 'Rankings ansehen',
      path: '/games?sortBy=rating&sortOrder=desc',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: 'white',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?nintendo)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            p: { xs: 3, md: 6 },
            pr: { md: 0 },
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            🎮 Willkommen bei Battle64
          </Typography>
          <Typography variant="h5" paragraph>
            Das ultimative N64 Spielbewertung & Katalogsystem
          </Typography>
          <Typography variant="body1" paragraph>
            Entdecke, bewerte und verwalte deine Nintendo 64 Spiele-Sammlung. 
            Tausche dich mit anderen Sammlern aus und finde neue Schätze.
          </Typography>
          {!user && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ mr: 2 }}
              >
                Jetzt registrieren
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Anmelden
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Was Battle64 bietet
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4, mb: 6 }}>
        {features.map((feature, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography gutterBottom variant="h6" component="h3">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {feature.description}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(feature.path)}
                sx={{ mt: 'auto' }}
              >
                {feature.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Stats Section */}
      {user && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Deine Statistiken
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {user.points}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gesammelte Punkte
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                🎯
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sammler-Level
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                ⭐
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bewertungen
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* About Section */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Über Battle64
        </Typography>
        <Typography variant="body1" paragraph>
          Battle64 ist eine Community-gestützte Plattform für Nintendo 64 Sammler und Enthusiasten. 
          Unser Ziel ist es, die Nostalgie und Leidenschaft für die N64-Ära zu bewahren und zu teilen.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Wichtiger Hinweis:</strong> Battle64 respektiert geistige Eigentumsrechte. 
          Wir erlauben keine ROMs, BIOS-Dateien oder markengeschützte Inhalte. 
          Alle Cover-Bilder sind entweder Fanart oder automatisch generiert.
        </Typography>
        <Typography variant="body1">
          Entdecke die Vielfalt der N64-Bibliothek, von bekannten Klassikern bis hin zu versteckten Schätzen. 
          Bewerte deine Lieblingsspiele und hilf anderen Sammlern dabei, neue Entdeckungen zu machen.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;