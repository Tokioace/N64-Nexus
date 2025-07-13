/**
 * Event Management Service für Battle64 Speedrun Events
 * 
 * Verwaltet Events, Teilnehmerregistrierung und Kategorievalidierung
 */

import { 
  EventConfig, 
  CategoryConfig, 
  RunSubmission, 
  CategorySystem,
  GameRegion,
  Platform,
  FairnessLevel
} from '../models/CategorySystem';

export interface EventParticipant {
  userId: string;
  username: string;
  category: CategoryConfig;
  registrationDate: Date;
  submissions: RunSubmission[];
}

export interface EventStatistics {
  totalParticipants: number;
  participantsByCategory: Record<string, number>;
  totalSubmissions: number;
  verifiedSubmissions: number;
  disqualifiedSubmissions: number;
}

export class EventService {
  private events: Map<string, EventConfig> = new Map();
  private participants: Map<string, EventParticipant[]> = new Map();
  private submissions: Map<string, RunSubmission[]> = new Map();

  /**
   * Erstellt ein neues Event
   */
  createEvent(config: Omit<EventConfig, 'id'>): EventConfig {
    const id = this.generateEventId();
    const event: EventConfig = {
      ...config,
      id
    };

    // Validiere erlaubte Kategorien
    const validation = this.validateEventCategories(config.allowedCategories);
    if (!validation.valid) {
      throw new Error(`Ungültige Event-Kategorien: ${validation.errors.join(', ')}`);
    }

    this.events.set(id, event);
    this.participants.set(id, []);
    this.submissions.set(id, []);

    return event;
  }

  /**
   * Registriert einen Teilnehmer für ein Event
   */
  registerParticipant(
    eventId: string, 
    userId: string, 
    username: string, 
    category: CategoryConfig
  ): EventParticipant {
    const event = this.events.get(eventId);
    if (!event) {
      throw new Error('Event nicht gefunden');
    }

    // Prüfe ob Event noch läuft
    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      throw new Error('Event ist nicht aktiv');
    }

    // Prüfe Teilnehmerlimit
    const currentParticipants = this.participants.get(eventId) || [];
    if (event.maxParticipants && currentParticipants.length >= event.maxParticipants) {
      throw new Error('Event ist voll');
    }

    // Prüfe ob Kategorie erlaubt ist
    const isCategoryAllowed = event.allowedCategories.some(allowed => 
      this.categoriesMatch(allowed, category)
    );
    if (!isCategoryAllowed) {
      throw new Error('Kategorie ist für dieses Event nicht erlaubt');
    }

    // Prüfe ob Nutzer bereits registriert ist
    const existingParticipant = currentParticipants.find(p => p.userId === userId);
    if (existingParticipant) {
      throw new Error('Nutzer ist bereits für dieses Event registriert');
    }

    const participant: EventParticipant = {
      userId,
      username,
      category,
      registrationDate: new Date(),
      submissions: []
    };

    currentParticipants.push(participant);
    this.participants.set(eventId, currentParticipants);

    return participant;
  }

  /**
   * Reicht einen Speedrun ein
   */
  submitRun(
    eventId: string,
    userId: string,
    category: CategoryConfig,
    time: number,
    videoUrl?: string,
    glitchDeclaration: boolean = false
  ): RunSubmission {
    const event = this.events.get(eventId);
    if (!event) {
      throw new Error('Event nicht gefunden');
    }

    // Prüfe ob Nutzer registriert ist
    const participants = this.participants.get(eventId) || [];
    const participant = participants.find(p => p.userId === userId);
    if (!participant) {
      throw new Error('Nutzer ist nicht für dieses Event registriert');
    }

    // Prüfe ob Kategorie mit Registrierung übereinstimmt
    if (!this.categoriesMatch(participant.category, category)) {
      throw new Error('Kategorie stimmt nicht mit Registrierung überein');
    }

    // Validiere Glitch-Erklärung für Emulator-Kategorien
    if (CategorySystem.isEmulator(category) && !glitchDeclaration) {
      throw new Error('Glitch-Erklärung ist für Emulator-Kategorien erforderlich');
    }

    const submission: RunSubmission = {
      id: this.generateSubmissionId(),
      userId,
      eventId,
      category,
      time,
      videoUrl,
      glitchDeclaration,
      submissionDate: new Date(),
      verified: false,
      disqualified: false
    };

    const submissions = this.submissions.get(eventId) || [];
    submissions.push(submission);
    this.submissions.set(eventId, submissions);

    // Füge Submission zum Teilnehmer hinzu
    participant.submissions.push(submission);

    return submission;
  }

  /**
   * Generiert Leaderboard für ein Event
   */
  generateLeaderboard(eventId: string, category?: CategoryConfig): RunSubmission[] {
    const submissions = this.submissions.get(eventId) || [];
    let filteredSubmissions = submissions.filter(s => !s.disqualified);

    // Filtere nach Kategorie falls angegeben
    if (category) {
      filteredSubmissions = filteredSubmissions.filter(s => 
        this.categoriesMatch(s.category, category)
      );
    }

    // Sortiere nach Zeit (schnellste zuerst)
    return filteredSubmissions.sort((a, b) => a.time - b.time);
  }

  /**
   * Generiert Statistiken für ein Event
   */
  getEventStatistics(eventId: string): EventStatistics {
    const participants = this.participants.get(eventId) || [];
    const submissions = this.submissions.get(eventId) || [];

    const participantsByCategory: Record<string, number> = {};
    participants.forEach(p => {
      const categoryId = CategorySystem.generateCategoryId(p.category);
      participantsByCategory[categoryId] = (participantsByCategory[categoryId] || 0) + 1;
    });

    return {
      totalParticipants: participants.length,
      participantsByCategory,
      totalSubmissions: submissions.length,
      verifiedSubmissions: submissions.filter(s => s.verified).length,
      disqualifiedSubmissions: submissions.filter(s => s.disqualified).length
    };
  }

  /**
   * Validiert Event-Kategorien
   */
  private validateEventCategories(categories: CategoryConfig[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (categories.length === 0) {
      errors.push('Mindestens eine Kategorie muss erlaubt sein');
    }

    categories.forEach(category => {
      const validation = CategorySystem.validateCategory(category);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Prüft ob zwei Kategorien übereinstimmen
   */
  private categoriesMatch(a: CategoryConfig, b: CategoryConfig): boolean {
    return a.region === b.region && 
           a.platform === b.platform && 
           a.fairnessLevel === b.fairnessLevel;
  }

  /**
   * Generiert eine eindeutige Event-ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generiert eine eindeutige Submission-ID
   */
  private generateSubmissionId(): string {
    return `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Holt ein Event nach ID
   */
  getEvent(eventId: string): EventConfig | undefined {
    return this.events.get(eventId);
  }

  /**
   * Holt alle aktiven Events
   */
  getActiveEvents(): EventConfig[] {
    const now = new Date();
    return Array.from(this.events.values()).filter(event => 
      now >= event.startDate && now <= event.endDate
    );
  }

  /**
   * Holt Teilnehmer eines Events
   */
  getEventParticipants(eventId: string): EventParticipant[] {
    return this.participants.get(eventId) || [];
  }

  /**
   * Holt Submissions eines Events
   */
  getEventSubmissions(eventId: string): RunSubmission[] {
    return this.submissions.get(eventId) || [];
  }

  /**
   * Disqualifiziert eine Submission
   */
  disqualifySubmission(submissionId: string, reason: string): void {
    for (const [eventId, submissions] of this.submissions.entries()) {
      const submission = submissions.find(s => s.id === submissionId);
      if (submission) {
        submission.disqualified = true;
        submission.disqualificationReason = reason;
        break;
      }
    }
  }

  /**
   * Verifiziert eine Submission
   */
  verifySubmission(submissionId: string): void {
    for (const [eventId, submissions] of this.submissions.entries()) {
      const submission = submissions.find(s => s.id === submissionId);
      if (submission) {
        submission.verified = true;
        break;
      }
    }
  }
}