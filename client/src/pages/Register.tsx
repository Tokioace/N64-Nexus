import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/helpers';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Benutzername ist erforderlich';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Benutzername muss mindestens 3 Zeichen lang sein';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Benutzername darf maximal 20 Zeichen lang sein';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwort-Bestätigung ist erforderlich';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      setRegisterError(error.response?.data?.message || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            🎮 Registrierung bei Battle64
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Erstellen Sie ein Konto, um Ihre N64-Sammlung zu verwalten und Spiele zu bewerten.
          </Typography>

          {registerError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {registerError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Benutzername"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-Mail-Adresse"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Passwort"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
            />
            
            {/* Password requirements */}
            {formData.password && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Passwort-Anforderungen:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      {formData.password.length >= 8 ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText primary="Mindestens 8 Zeichen" />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      {/[A-Z]/.test(formData.password) ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText primary="Mindestens ein Großbuchstabe" />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      {/[a-z]/.test(formData.password) ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText primary="Mindestens ein Kleinbuchstabe" />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      {/\d/.test(formData.password) ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText primary="Mindestens eine Zahl" />
                  </ListItem>
                </List>
              </Box>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Passwort bestätigen"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Registrieren'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {"Bereits ein Konto? Jetzt anmelden"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;