import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Star as StarIcon,
  Collections as CollectionsIcon,
} from '@mui/icons-material';
import { GameWithStats, Rating as RatingType, Collection } from '../types';
import { getRegionLabel, getStatusLabel, generateGameCover } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';
import { ratingsAPI, collectionsAPI } from '../services/api';

interface GameCardProps {
  game: GameWithStats;
  onUpdate?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onUpdate }) => {
  const { user } = useAuth();
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [rating, setRating] = useState<Partial<RatingType>>({
    gameplay: 3,
    graphics: 3,
    music: 3,
    nostalgia: 3,
    comment: '',
  });
  const [collection, setCollection] = useState<Partial<Collection>>({
    status: 'owned',
    condition: 'complete',
    hasManual: true,
    hasBox: true,
  });

  const handleRatingSubmit = async () => {
    if (!user) return;

    try {
      const overall = Math.round(
        ((rating.gameplay! + rating.graphics! + rating.music! + rating.nostalgia!) / 4) * 10
      ) / 10;

      await ratingsAPI.create({
        userId: user.id,
        gameId: game.id,
        gameplay: rating.gameplay!,
        graphics: rating.graphics!,
        music: rating.music!,
        nostalgia: rating.nostalgia!,
        overall,
        comment: rating.comment,
      });

      setRatingDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const handleCollectionSubmit = async () => {
    if (!user) return;

    try {
      await collectionsAPI.addToCollection({
        userId: user.id,
        gameId: game.id,
        status: collection.status!,
        condition: collection.condition,
        hasManual: collection.hasManual,
        hasBox: collection.hasBox,
      });

      setCollectionDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to add to collection:', error);
    }
  };

  const coverImage = game.coverImage || generateGameCover(game.title);

  return (
    <>
      <Card
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
        <CardMedia
          component="img"
          height="200"
          image={coverImage}
          alt={game.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {game.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {game.developer} • {game.releaseYear}
          </Typography>

          <Box sx={{ mb: 1 }}>
            <Chip
              label={getRegionLabel(game.region)}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={game.genre}
              size="small"
              sx={{ ml: 0.5 }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={game.averageRating}
              precision={0.1}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              ({game.totalRatings})
            </Typography>
          </Box>

          {game.userCollection && (
            <Chip
              label={getStatusLabel(game.userCollection.status)}
              color="success"
              size="small"
              sx={{ mb: 1 }}
            />
          )}

          <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
            <Tooltip title="Bewerten">
              <IconButton
                size="small"
                onClick={() => setRatingDialogOpen(true)}
                color={game.userRating ? 'primary' : 'default'}
              >
                <StarIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Zur Sammlung hinzufügen">
              <IconButton
                size="small"
                onClick={() => setCollectionDialogOpen(true)}
                color={game.userCollection ? 'primary' : 'default'}
              >
                <CollectionsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bewertung für {game.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <Typography component="legend">Gameplay</Typography>
              <Rating
                value={rating.gameplay}
                onChange={(_, value) => setRating({ ...rating, gameplay: value || 3 })}
              />
            </Box>
            <Box>
              <Typography component="legend">Grafik</Typography>
              <Rating
                value={rating.graphics}
                onChange={(_, value) => setRating({ ...rating, graphics: value || 3 })}
              />
            </Box>
            <Box>
              <Typography component="legend">Musik/Sound</Typography>
              <Rating
                value={rating.music}
                onChange={(_, value) => setRating({ ...rating, music: value || 3 })}
              />
            </Box>
            <Box>
              <Typography component="legend">Nostalgie</Typography>
              <Rating
                value={rating.nostalgia}
                onChange={(_, value) => setRating({ ...rating, nostalgia: value || 3 })}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Kommentar (optional)"
                value={rating.comment}
                onChange={(e) => setRating({ ...rating, comment: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleRatingSubmit} variant="contained">
            Bewertung speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Collection Dialog */}
      <Dialog open={collectionDialogOpen} onClose={() => setCollectionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Zur Sammlung hinzufügen: {game.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={collection.status}
                onChange={(e) => setCollection({ ...collection, status: e.target.value as any })}
                label="Status"
              >
                <MenuItem value="owned">Besitzt</MenuItem>
                <MenuItem value="wanted">Will ich</MenuItem>
                <MenuItem value="traded">Getauscht</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Zustand</InputLabel>
              <Select
                value={collection.condition}
                onChange={(e) => setCollection({ ...collection, condition: e.target.value as any })}
                label="Zustand"
              >
                <MenuItem value="loose">Lose</MenuItem>
                <MenuItem value="complete">Komplett</MenuItem>
                <MenuItem value="sealed">Versiegelt</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Anleitung</InputLabel>
                <Select
                  value={collection.hasManual}
                  onChange={(e) => setCollection({ ...collection, hasManual: e.target.value as boolean })}
                  label="Anleitung"
                >
                  <MenuItem value="true">Ja</MenuItem>
                  <MenuItem value="false">Nein</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Box</InputLabel>
                <Select
                  value={collection.hasBox}
                  onChange={(e) => setCollection({ ...collection, hasBox: e.target.value as boolean })}
                  label="Box"
                >
                  <MenuItem value="true">Ja</MenuItem>
                  <MenuItem value="false">Nein</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCollectionDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleCollectionSubmit} variant="contained">
            Zur Sammlung hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GameCard;