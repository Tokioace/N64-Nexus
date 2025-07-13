import { Game, Rating } from '../types';

export const calculateAverageRating = (ratings: Rating[]): number => {
  if (ratings.length === 0) return 0;
  
  const total = ratings.reduce((sum, rating) => sum + rating.overall, 0);
  return Math.round((total / ratings.length) * 10) / 10;
};

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string): string => {
  return new Date(date).toLocaleString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRegionLabel = (region: Game['region']): string => {
  const labels = {
    'PAL': 'PAL (Europa)',
    'NTSC': 'NTSC (USA)',
    'NTSC-J': 'NTSC-J (Japan)',
  };
  return labels[region];
};

export const getStatusLabel = (status: string): string => {
  const labels = {
    'owned': 'Besitzt',
    'wanted': 'Will ich',
    'traded': 'Getauscht',
  };
  return labels[status as keyof typeof labels] || status;
};

export const getConditionLabel = (condition: string): string => {
  const labels = {
    'loose': 'Lose',
    'complete': 'Komplett',
    'sealed': 'Versiegelt',
  };
  return labels[condition as keyof typeof labels] || condition;
};

export const generateGameCover = (title: string): string => {
  // Generate a simple placeholder cover with the game title
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 400);
    
    // Title text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split title into lines if too long
    const words = title.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > 280) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Draw lines
    const lineHeight = 30;
    const startY = 200 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 150, startY + index * lineHeight);
    });
    
    // N64 logo placeholder
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('N64', 150, 350);
  }
  
  return canvas.toDataURL();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Passwort muss mindestens 8 Zeichen lang sein');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Passwort muss mindestens einen Großbuchstaben enthalten');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Passwort muss mindestens einen Kleinbuchstaben enthalten');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Passwort muss mindestens eine Zahl enthalten');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};