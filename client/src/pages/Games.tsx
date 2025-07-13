import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { GameWithStats, GameFilter } from '../types';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard';
import { useAuth } from '../contexts/AuthContext';
import { debounce } from '../utils/helpers';

const Games: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<GameFilter>({
    sortBy: 'title',
    sortOrder: 'asc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = debounce((term: string) => {
    setFilters(prev => ({ ...prev, search: term }));
    setPage(1);
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (key: keyof GameFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ sortBy: 'title', sortOrder: 'asc' });
    setSearchTerm('');
    setPage(1);
  };

  const { data: games, isLoading, error, refetch } = useQuery({
    queryKey: ['games', filters, page],
    queryFn: () => gamesAPI.getAll(filters),
  });

  const genres = [
    'Action', 'Adventure', 'Racing', 'Sports', 'Puzzle', 'RPG', 'Strategy',
    'Fighting', 'Platformer', 'Shooter', 'Simulation', 'Music', 'Educational'
  ];

  const years = Array.from({ length: 10 }, (_, i) => 1996 + i);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Spielekatalog
        </Typography>
        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* TODO: Add game dialog */}}
          >
            Spiel hinzufügen
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Spiele suchen..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
          >
            Zurücksetzen
          </Button>
        </Box>

        {showFilters && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Genre</InputLabel>
              <Select
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange('genre', e.target.value || undefined)}
                label="Genre"
              >
                <MenuItem value="">Alle Genres</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Region</InputLabel>
              <Select
                value={filters.region || ''}
                onChange={(e) => handleFilterChange('region', e.target.value || undefined)}
                label="Region"
              >
                <MenuItem value="">Alle Regionen</MenuItem>
                <MenuItem value="PAL">PAL (Europa)</MenuItem>
                <MenuItem value="NTSC">NTSC (USA)</MenuItem>
                <MenuItem value="NTSC-J">NTSC-J (Japan)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Jahr</InputLabel>
              <Select
                value={filters.year || ''}
                onChange={(e) => handleFilterChange('year', e.target.value || undefined)}
                label="Jahr"
              >
                <MenuItem value="">Alle Jahre</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Sortierung</InputLabel>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                label="Sortierung"
              >
                <MenuItem value="title-asc">Titel A-Z</MenuItem>
                <MenuItem value="title-desc">Titel Z-A</MenuItem>
                <MenuItem value="rating-desc">Beste Bewertung</MenuItem>
                <MenuItem value="rating-asc">Schlechteste Bewertung</MenuItem>
                <MenuItem value="year-desc">Neueste zuerst</MenuItem>
                <MenuItem value="year-asc">Älteste zuerst</MenuItem>
                <MenuItem value="mostCollected-desc">Am meisten gesammelt</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Paper>

      {/* Results */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Fehler beim Laden der Spiele: {error.message}
        </Alert>
      )}

      {games && games.length === 0 && !isLoading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Keine Spiele gefunden. Versuche andere Suchkriterien.
        </Alert>
      )}

      {games && games.length > 0 && (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
            {games.map((game) => (
              <GameCard key={game.id} game={game} onUpdate={refetch} />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil((games.length || 0) / 20)} // Assuming 20 items per page
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Quick Stats */}
      {games && games.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Katalog-Statistiken
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {games.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Spiele gefunden
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {Math.round(games.reduce((sum, game) => sum + game.averageRating, 0) / games.length * 10) / 10}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Durchschnittliche Bewertung
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {games.reduce((sum, game) => sum + game.totalCollections, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gesamte Sammlungen
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Games;