import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common translations in all languages
const commonTranslations = {
  es: { // Spanish
    'a11y.skipToMain': 'Ir al contenido principal',
    'a11y.skipToNav': 'Ir a la navegación', 
    'a11y.skipToSearch': 'Ir a la búsqueda',
    'a11y.newPage': 'Nueva página cargada',
    'a11y.loading': 'Cargando contenido',
    'a11y.error': 'Error ocurrido',
    'a11y.success': 'Acción completada exitosamente',
    'common.unknown': 'Desconocido',
    'common.unknownGame': 'Juego Desconocido',
    'common.unknownCategory': 'Categoría Desconocida',
    'common.unknownItem': 'Artículo Desconocido',
    'common.unknownMedia': 'Medios Desconocidos',
    'common.unknownUser': 'Usuario Desconocido',
    'common.noDescription': 'Sin descripción disponible',
    'common.noDataAvailable': 'Sin datos disponibles',
    'common.userLocation': 'Ubicación del usuario',
    'common.marketplaceItem': 'Artículo del mercado',
    'common.verified': 'Verificado',
    'common.unverified': 'No verificado',
    'common.pending': 'Pendiente',
    'common.approved': 'Aprobado',
    'common.rejected': 'Rechazado',
    'common.draft': 'Borrador',
    'common.published': 'Publicado',
    'common.archived': 'Archivado',
    'account.deletion.confirmText': 'Por favor escriba "DELETE" para confirmar',
    'account.deletion.placeholder': 'DELETE',
    'account.deletion.typeDelete': 'Escriba "DELETE" para confirmar:',
    'error.unknown': 'Error desconocido',
    'error.networkError': 'Error de red ocurrido',
    'error.serverError': 'Error del servidor ocurrido',
    'error.validationError': 'Error de validación',
    'error.accessDenied': 'Acceso denegado',
    'error.notFound': 'No encontrado',
    'error.timeout': 'Tiempo de espera agotado',
    'loading.general': 'Cargando...',
    'loading.data': 'Cargando datos...',
    'loading.content': 'Cargando contenido...',
    'loading.page': 'Cargando página...',
    'loading.image': 'Cargando imagen...',
    'loading.video': 'Cargando video...',
    'status.online': 'En línea',
    'status.offline': 'Fuera de línea',
    'status.connecting': 'Conectando...',
    'status.connected': 'Conectado',
    'status.disconnected': 'Desconectado',
    'status.syncing': 'Sincronizando...',
    'status.synced': 'Sincronizado',
    'status.failed': 'Fallido',
    'status.completed': 'Completado',
    'status.inProgress': 'En progreso',
    'time.now': 'Ahora',
    'time.today': 'Hoy',
    'time.yesterday': 'Ayer',
    'time.tomorrow': 'Mañana',
    'time.thisWeek': 'Esta semana',
    'time.lastWeek': 'La semana pasada',
    'time.thisMonth': 'Este mes',
    'time.lastMonth': 'El mes pasado',
    'time.thisYear': 'Este año',
    'time.lastYear': 'El año pasado',
    'time.never': 'Nunca',
    'time.always': 'Siempre',
    'time.ago': 'hace',
    'time.remaining': 'restante',
    'time.elapsed': 'transcurrido',
    'units.seconds': 'segundos',
    'units.minutes': 'minutos',
    'units.hours': 'horas',
    'units.days': 'días',
    'units.weeks': 'semanas',
    'units.months': 'meses',
    'units.years': 'años',
    'units.bytes': 'bytes',
    'units.kb': 'KB',
    'units.mb': 'MB',
    'units.gb': 'GB'
  },
  it: { // Italian
    'a11y.skipToMain': 'Vai al contenuto principale',
    'a11y.skipToNav': 'Vai alla navigazione',
    'a11y.skipToSearch': 'Vai alla ricerca',
    'a11y.newPage': 'Nuova pagina caricata',
    'a11y.loading': 'Caricamento contenuto',
    'a11y.error': 'Errore verificatosi',
    'a11y.success': 'Azione completata con successo',
    'common.unknown': 'Sconosciuto',
    'common.unknownGame': 'Gioco Sconosciuto',
    'common.unknownCategory': 'Categoria Sconosciuta',
    'common.unknownItem': 'Articolo Sconosciuto',
    'common.unknownMedia': 'Media Sconosciuto',
    'common.unknownUser': 'Utente Sconosciuto',
    'common.noDescription': 'Nessuna descrizione disponibile',
    'common.noDataAvailable': 'Nessun dato disponibile',
    'common.userLocation': 'Posizione utente',
    'common.marketplaceItem': 'Articolo del mercato',
    'common.verified': 'Verificato',
    'common.unverified': 'Non verificato',
    'common.pending': 'In attesa',
    'common.approved': 'Approvato',
    'common.rejected': 'Rifiutato',
    'common.draft': 'Bozza',
    'common.published': 'Pubblicato',
    'common.archived': 'Archiviato',
    'account.deletion.confirmText': 'Si prega di digitare "DELETE" per confermare',
    'account.deletion.placeholder': 'DELETE',
    'account.deletion.typeDelete': 'Digitare "DELETE" per confermare:',
    'error.unknown': 'Errore sconosciuto',
    'error.networkError': 'Errore di rete verificatosi',
    'error.serverError': 'Errore del server verificatosi',
    'error.validationError': 'Errore di validazione',
    'error.accessDenied': 'Accesso negato',
    'error.notFound': 'Non trovato',
    'error.timeout': 'Timeout della richiesta',
    'loading.general': 'Caricamento...',
    'loading.data': 'Caricamento dati...',
    'loading.content': 'Caricamento contenuto...',
    'loading.page': 'Caricamento pagina...',
    'loading.image': 'Caricamento immagine...',
    'loading.video': 'Caricamento video...',
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.connecting': 'Connessione...',
    'status.connected': 'Connesso',
    'status.disconnected': 'Disconnesso',
    'status.syncing': 'Sincronizzazione...',
    'status.synced': 'Sincronizzato',
    'status.failed': 'Fallito',
    'status.completed': 'Completato',
    'status.inProgress': 'In corso',
    'time.now': 'Ora',
    'time.today': 'Oggi',
    'time.yesterday': 'Ieri',
    'time.tomorrow': 'Domani',
    'time.thisWeek': 'Questa settimana',
    'time.lastWeek': 'La scorsa settimana',
    'time.thisMonth': 'Questo mese',
    'time.lastMonth': 'Il mese scorso',
    'time.thisYear': 'Quest\'anno',
    'time.lastYear': 'L\'anno scorso',
    'time.never': 'Mai',
    'time.always': 'Sempre',
    'time.ago': 'fa',
    'time.remaining': 'rimanente',
    'time.elapsed': 'trascorso',
    'units.seconds': 'secondi',
    'units.minutes': 'minuti',
    'units.hours': 'ore',
    'units.days': 'giorni',
    'units.weeks': 'settimane',
    'units.months': 'mesi',
    'units.years': 'anni',
    'units.bytes': 'byte',
    'units.kb': 'KB',
    'units.mb': 'MB',
    'units.gb': 'GB'
  },
  pt: { // Portuguese
    'a11y.skipToMain': 'Pular para o conteúdo principal',
    'a11y.skipToNav': 'Pular para a navegação',
    'a11y.skipToSearch': 'Pular para a busca',
    'a11y.newPage': 'Nova página carregada',
    'a11y.loading': 'Carregando conteúdo',
    'a11y.error': 'Erro ocorreu',
    'a11y.success': 'Ação concluída com sucesso',
    'common.unknown': 'Desconhecido',
    'common.unknownGame': 'Jogo Desconhecido',
    'common.unknownCategory': 'Categoria Desconhecida',
    'common.unknownItem': 'Item Desconhecido',
    'common.unknownMedia': 'Mídia Desconhecida',
    'common.unknownUser': 'Usuário Desconhecido',
    'common.noDescription': 'Nenhuma descrição disponível',
    'common.noDataAvailable': 'Nenhum dado disponível',
    'common.userLocation': 'Localização do usuário',
    'common.marketplaceItem': 'Item do mercado',
    'common.verified': 'Verificado',
    'common.unverified': 'Não verificado',
    'common.pending': 'Pendente',
    'common.approved': 'Aprovado',
    'common.rejected': 'Rejeitado',
    'common.draft': 'Rascunho',
    'common.published': 'Publicado',
    'common.archived': 'Arquivado',
    'account.deletion.confirmText': 'Por favor digite "DELETE" para confirmar',
    'account.deletion.placeholder': 'DELETE',
    'account.deletion.typeDelete': 'Digite "DELETE" para confirmar:',
    'error.unknown': 'Erro desconhecido',
    'error.networkError': 'Erro de rede ocorreu',
    'error.serverError': 'Erro do servidor ocorreu',
    'error.validationError': 'Erro de validação',
    'error.accessDenied': 'Acesso negado',
    'error.notFound': 'Não encontrado',
    'error.timeout': 'Timeout da solicitação',
    'loading.general': 'Carregando...',
    'loading.data': 'Carregando dados...',
    'loading.content': 'Carregando conteúdo...',
    'loading.page': 'Carregando página...',
    'loading.image': 'Carregando imagem...',
    'loading.video': 'Carregando vídeo...',
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.connecting': 'Conectando...',
    'status.connected': 'Conectado',
    'status.disconnected': 'Desconectado',
    'status.syncing': 'Sincronizando...',
    'status.synced': 'Sincronizado',
    'status.failed': 'Falhou',
    'status.completed': 'Concluído',
    'status.inProgress': 'Em andamento',
    'time.now': 'Agora',
    'time.today': 'Hoje',
    'time.yesterday': 'Ontem',
    'time.tomorrow': 'Amanhã',
    'time.thisWeek': 'Esta semana',
    'time.lastWeek': 'Semana passada',
    'time.thisMonth': 'Este mês',
    'time.lastMonth': 'Mês passado',
    'time.thisYear': 'Este ano',
    'time.lastYear': 'Ano passado',
    'time.never': 'Nunca',
    'time.always': 'Sempre',
    'time.ago': 'atrás',
    'time.remaining': 'restante',
    'time.elapsed': 'decorrido',
    'units.seconds': 'segundos',
    'units.minutes': 'minutos',
    'units.hours': 'horas',
    'units.days': 'dias',
    'units.weeks': 'semanas',
    'units.months': 'meses',
    'units.years': 'anos',
    'units.bytes': 'bytes',
    'units.kb': 'KB',
    'units.mb': 'MB',
    'units.gb': 'GB'
  }
};

// Function to update translation file
function updateTranslationFile(langCode, translations) {
  const filePath = path.join(__dirname, 'src', 'translations', `${langCode}.ts`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} does not exist, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the position after nav.map line
  const insertAfter = "'nav.map': 'Battle64 Map',";
  const insertIndex = content.indexOf(insertAfter);
  
  if (insertIndex === -1) {
    console.log(`Could not find insertion point in ${langCode}.ts`);
    return;
  }
  
  // Build the translation block
  let translationBlock = '\n\n  // Accessibility\n';
  
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('a11y.')) {
      translationBlock += `  '${key}': '${value}',\n`;
    }
  });
  
  translationBlock += '\n  // Common fallback texts\n';
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('common.')) {
      translationBlock += `  '${key}': '${value}',\n`;
    }
  });
  
  translationBlock += '\n  // Account deletion\n';
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('account.')) {
      translationBlock += `  '${key}': '${value}',\n`;
    }
  });
  
  translationBlock += '\n  // Error messages\n';
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('error.')) {
      translationBlock += `  '${key}': '${value}',\n`;
    }
  });
  
  translationBlock += '\n  // Loading states\n';
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('loading.')) {
      translationBlock += `  '${key}': '${value}',\n`;
    }
  });
  
  translationBlock += '\n  // Status messages\n';
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('status.')) {
      translationBlock += `  '${key}': '${value}',\n`;
    }
  });
  
  translationBlock += '\n  // Time and date\n';
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('time.')) {
      translationBlock += `  '${key}': '${value}',\n`;
    }
  });
  
  translationBlock += '\n  // Units\n';
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('units.')) {
      translationBlock += `  '${key}': '${value}',\n`;
    }
  });
  
  // Insert the translations
  const beforeInsert = content.substring(0, insertIndex + insertAfter.length);
  const afterInsert = content.substring(insertIndex + insertAfter.length);
  
  const newContent = beforeInsert + translationBlock + afterInsert;
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated ${langCode}.ts with new translations`);
}

// Update all language files
Object.entries(commonTranslations).forEach(([langCode, translations]) => {
  updateTranslationFile(langCode, translations);
});

console.log('Translation update complete!');