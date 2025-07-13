/**
 * Run Submission Form für Battle64 Speedrun Events
 * 
 * Formular zum Einreichen von Speedruns mit Kategorie-Auswahl und Glitch-Erklärung
 */

import { 
  CategoryConfig, 
  RunSubmission, 
  CategorySystem,
  GameRegion,
  Platform,
  FairnessLevel
} from '../models/CategorySystem';

interface RunSubmissionFormProps {
  eventId: string;
  userId: string;
  allowedCategories: CategoryConfig[];
  onSubmit: (submission: Omit<RunSubmission, 'id' | 'submissionDate' | 'verified' | 'disqualified'>) => void;
  onCancel: () => void;
}

interface FormData {
  category: CategoryConfig | null;
  time: string; // Format: MM:SS.mm
  videoUrl: string;
  glitchDeclaration: boolean;
  notes: string;
}

export class RunSubmissionForm {
  private formData: FormData = {
    category: null,
    time: '',
    videoUrl: '',
    glitchDeclaration: false,
    notes: ''
  };

  private errors: string[] = [];

  /**
   * Validiert das Formular
   */
  validate(): boolean {
    this.errors = [];

    // Kategorie validieren
    if (!this.formData.category) {
      this.errors.push('Bitte wählen Sie eine Kategorie aus');
    } else {
      const validation = CategorySystem.validateCategory(this.formData.category);
      if (!validation.valid) {
        this.errors.push(...validation.errors);
      }
    }

    // Zeit validieren
    if (!this.formData.time) {
      this.errors.push('Bitte geben Sie Ihre Zeit ein');
    } else if (!this.isValidTimeFormat(this.formData.time)) {
      this.errors.push('Zeit muss im Format MM:SS.mm sein (z.B. 02:30.45)');
    }

    // Glitch-Erklärung für Emulator-Kategorien
    if (this.formData.category && CategorySystem.isEmulator(this.formData.category) && !this.formData.glitchDeclaration) {
      this.errors.push('Glitch-Erklärung ist für Emulator-Kategorien erforderlich');
    }

    // Video-URL validieren (optional)
    if (this.formData.videoUrl && !this.isValidUrl(this.formData.videoUrl)) {
      this.errors.push('Bitte geben Sie eine gültige Video-URL ein');
    }

    return this.errors.length === 0;
  }

  /**
   * Konvertiert Zeit-String zu Millisekunden
   */
  private timeStringToMs(timeString: string): number {
    const parts = timeString.split(':');
    const minutes = parseInt(parts[0]);
    const secondsParts = parts[1].split('.');
    const seconds = parseInt(secondsParts[0]);
    const milliseconds = parseInt(secondsParts[1]) * 10; // .45 -> 450ms

    return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
  }

  /**
   * Validiert Zeit-Format
   */
  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^\d{2}:\d{2}\.\d{2}$/;
    if (!timeRegex.test(time)) return false;

    const parts = time.split(':');
    const minutes = parseInt(parts[0]);
    const secondsParts = parts[1].split('.');
    const seconds = parseInt(secondsParts[0]);
    const milliseconds = parseInt(secondsParts[1]);

    return minutes >= 0 && minutes <= 59 && 
           seconds >= 0 && seconds <= 59 && 
           milliseconds >= 0 && milliseconds <= 99;
  }

  /**
   * Validiert URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Setzt Formular-Daten
   */
  setFormData(data: Partial<FormData>): void {
    this.formData = { ...this.formData, ...data };
  }

  /**
   * Holt Formular-Daten
   */
  getFormData(): FormData {
    return this.formData;
  }

  /**
   * Holt Validierungsfehler
   */
  getErrors(): string[] {
    return this.errors;
  }

  /**
   * Erstellt Submission-Objekt
   */
  createSubmission(): Omit<RunSubmission, 'id' | 'submissionDate' | 'verified' | 'disqualified'> {
    if (!this.validate()) {
      throw new Error('Formular ist nicht gültig');
    }

    return {
      userId: '', // Wird vom Service gesetzt
      eventId: '', // Wird vom Service gesetzt
      category: this.formData.category!,
      time: this.timeStringToMs(this.formData.time),
      videoUrl: this.formData.videoUrl || undefined,
      glitchDeclaration: this.formData.glitchDeclaration,
      notes: this.formData.notes
    };
  }

  /**
   * Generiert HTML für das Formular
   */
  render(): string {
    const categoryOptions = this.generateCategoryOptions();
    const errorHtml = this.errors.length > 0 ? this.renderErrors() : '';
    const glitchSection = this.formData.category && CategorySystem.isEmulator(this.formData.category) 
      ? this.renderGlitchSection() 
      : '';

    return `
      <div class="run-submission-form">
        <h2 class="text-2xl font-bold mb-6">🏃‍♂️ Speedrun einreichen</h2>
        
        ${errorHtml}
        
        <form id="submissionForm" class="space-y-6">
          <!-- Kategorie-Auswahl -->
          <div>
            <label class="block text-sm font-medium mb-2">🏆 Kategorie *</label>
            <select 
              id="categorySelect" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Kategorie auswählen...</option>
              ${categoryOptions}
            </select>
          </div>

          <!-- Zeit-Eingabe -->
          <div>
            <label class="block text-sm font-medium mb-2">⏱️ Zeit *</label>
            <input 
              type="text" 
              id="timeInput"
              placeholder="MM:SS.mm (z.B. 02:30.45)"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              required
            />
            <p class="text-xs text-gray-600 mt-1">Format: Minuten:Sekunden.Zentisekunden</p>
          </div>

          <!-- Video-URL -->
          <div>
            <label class="block text-sm font-medium mb-2">📹 Video-URL (optional)</label>
            <input 
              type="url" 
              id="videoUrlInput"
              placeholder="https://youtube.com/watch?v=..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-600 mt-1">YouTube, Twitch, oder andere Video-Plattformen</p>
          </div>

          <!-- Glitch-Erklärung -->
          ${glitchSection}

          <!-- Notizen -->
          <div>
            <label class="block text-sm font-medium mb-2">📝 Notizen (optional)</label>
            <textarea 
              id="notesInput"
              rows="3"
              placeholder="Zusätzliche Informationen über Ihren Run..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex space-x-4">
            <button 
              type="submit"
              class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🚀 Run einreichen
            </button>
            <button 
              type="button"
              id="cancelButton"
              class="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
            >
              ❌ Abbrechen
            </button>
          </div>
        </form>

        <!-- Hilfe-Sektion -->
        <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="font-medium text-blue-800 mb-2">ℹ️ Einreichungs-Richtlinien</h3>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• <strong>Zeit:</strong> Muss im Format MM:SS.mm angegeben werden</li>
            <li>• <strong>Video:</strong> Empfohlen für Verifikation, aber nicht zwingend</li>
            <li>• <strong>Glitchruns:</strong> Sind erlaubt, aber müssen deklariert werden</li>
            <li>• <strong>Exploits:</strong> Die zu Softlocks führen = Disqualifikation</li>
            <li>• <strong>Verifikation:</strong> Runs werden von Admins überprüft</li>
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * Generiert Kategorie-Optionen
   */
  private generateCategoryOptions(): string {
    return this.allowedCategories.map(category => {
      const categoryId = CategorySystem.generateCategoryId(category);
      const displayName = CategorySystem.getCategoryDisplayName(category);
      const icons = CategorySystem.getCategoryIcons(category).join(' ');
      
      return `<option value="${categoryId}">${icons} ${displayName}</option>`;
    }).join('');
  }

  /**
   * Rendert Glitch-Sektion
   */
  private renderGlitchSection(): string {
    return `
      <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 class="font-medium text-yellow-800 mb-2">⚠️ Glitch-Erklärung erforderlich</h3>
        <div class="space-y-3">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              id="glitchDeclaration"
              class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm">
              Ich bestätige, dass ich in diesem Run <strong>Glitches oder Exploits verwendet habe</strong>
            </span>
          </label>
          <p class="text-xs text-yellow-700">
            Glitchruns sind erlaubt, aber werden in separaten Kategorien bewertet. 
            Exploits die zu Softlocks oder Abstürzen führen führen zur Disqualifikation.
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Rendert Fehler
   */
  private renderErrors(): string {
    return `
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
        <h3 class="font-medium text-red-800 mb-2">⚠️ Validierungsfehler:</h3>
        <ul class="text-sm text-red-700 space-y-1">
          ${this.errors.map(error => `<li>• ${error}</li>`).join('')}
        </ul>
      </div>
    `;
  }
}