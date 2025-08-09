const fs = require('fs');

// Read authService.ts
const filePath = './src/services/authService.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Replace all hardcoded German error messages with English equivalents
const replacements = [
  ['Alle rechtlichen Vereinbarungen müssen akzeptiert werden', 'All legal agreements must be accepted'],
  ['Username bereits vergeben', 'Username already taken'],
  ['Registrierung fehlgeschlagen', 'Registration failed'],
  ['Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.', 'Registration successful! Please confirm your email address to activate your account.'],
  ['Fehler beim Erstellen des Profils', 'Error creating profile'],
  ['Unerwarteter Fehler bei der Registrierung', 'Unexpected error during registration'],
  ['Login fehlgeschlagen', 'Login failed'],
  ['Unerwarteter Fehler beim Login', 'Unexpected error during login'],
  ['Unerwarteter Fehler beim Passwort-Reset', 'Unexpected error during password reset'],
  ['Unerwarteter Fehler beim Passwort-Update', 'Unexpected error during password update'],
  ['Kein angemeldeter Benutzer gefunden', 'No logged in user found'],
  ['Unerwarteter Fehler beim Löschen des Kontos', 'Unexpected error during account deletion'],
  ['Ungültige Anmeldedaten', 'Invalid login credentials'],
  ['Passwort muss mindestens 6 Zeichen lang sein', 'Password must be at least 6 characters long'],
  ['Ungültige E-Mail-Adresse', 'Invalid email address']
];

let updatedContent = content;

// Apply all replacements
replacements.forEach(([german, english]) => {
  updatedContent = updatedContent.replace(new RegExp(german.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), english);
});

// Write the updated content back
fs.writeFileSync(filePath, updatedContent, 'utf8');

console.log('✅ All hardcoded German error messages in authService.ts replaced with English equivalents');