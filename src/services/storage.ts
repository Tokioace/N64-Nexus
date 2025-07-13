import { UserProfile, ProgressEntry, PrivacySettings } from '../types';

// GDPR-compliant local storage service
export class StorageService {
  private static readonly USER_PROFILE_KEY = 'battle64_user_profile';
  private static readonly PROGRESS_KEY = 'battle64_progress';
  private static readonly SETTINGS_KEY = 'battle64_settings';
  private static readonly CONSENT_KEY = 'battle64_consent';

  // User Profile Storage
  static saveUserProfile(profile: UserProfile): void {
    if (this.hasConsent()) {
      localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(profile));
    }
  }

  static getUserProfile(): UserProfile | null {
    if (!this.hasConsent()) return null;
    
    const data = localStorage.getItem(this.USER_PROFILE_KEY);
    if (!data) return null;

    try {
      const profile = JSON.parse(data);
      // Convert date strings back to Date objects
      profile.createdAt = new Date(profile.createdAt);
      profile.lastActive = new Date(profile.lastActive);
      profile.medals = profile.medals.map((medal: any) => ({
        ...medal,
        earnedAt: new Date(medal.earnedAt)
      }));
      return profile;
    } catch (error) {
      console.error('Error parsing user profile:', error);
      return null;
    }
  }

  // Progress Storage
  static saveProgress(entries: ProgressEntry[]): void {
    if (this.hasConsent()) {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(entries));
    }
  }

  static getProgress(): ProgressEntry[] {
    if (!this.hasConsent()) return [];
    
    const data = localStorage.getItem(this.PROGRESS_KEY);
    if (!data) return [];

    try {
      const entries = JSON.parse(data);
      return entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    } catch (error) {
      console.error('Error parsing progress data:', error);
      return [];
    }
  }

  static addProgressEntry(entry: ProgressEntry): void {
    const entries = this.getProgress();
    entries.push(entry);
    this.saveProgress(entries);
  }

  // Settings Storage
  static saveSettings(settings: PrivacySettings): void {
    if (this.hasConsent()) {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }
  }

  static getSettings(): PrivacySettings | null {
    if (!this.hasConsent()) return null;
    
    const data = localStorage.getItem(this.SETTINGS_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing settings:', error);
      return null;
    }
  }

  // Consent Management (GDPR Compliance)
  static setConsent(consent: boolean): void {
    localStorage.setItem(this.CONSENT_KEY, JSON.stringify({
      consent,
      timestamp: new Date().toISOString()
    }));
  }

  static hasConsent(): boolean {
    const data = localStorage.getItem(this.CONSENT_KEY);
    if (!data) return false;

    try {
      const consent = JSON.parse(data);
      return consent.consent === true;
    } catch {
      return false;
    }
  }

  static getConsentTimestamp(): Date | null {
    const data = localStorage.getItem(this.CONSENT_KEY);
    if (!data) return null;

    try {
      const consent = JSON.parse(data);
      return new Date(consent.timestamp);
    } catch {
      return null;
    }
  }

  // Data Export (GDPR Right to Data Portability)
  static exportUserData(): string {
    const profile = this.getUserProfile();
    const progress = this.getProgress();
    const settings = this.getSettings();

    return JSON.stringify({
      profile,
      progress,
      settings,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  // Data Deletion (GDPR Right to be Forgotten)
  static deleteAllData(): void {
    localStorage.removeItem(this.USER_PROFILE_KEY);
    localStorage.removeItem(this.PROGRESS_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
    localStorage.removeItem(this.CONSENT_KEY);
  }

  // Utility Methods
  static clearProgress(): void {
    if (this.hasConsent()) {
      localStorage.removeItem(this.PROGRESS_KEY);
    }
  }

  static updateLastActive(): void {
    const profile = this.getUserProfile();
    if (profile) {
      profile.lastActive = new Date();
      this.saveUserProfile(profile);
    }
  }
}