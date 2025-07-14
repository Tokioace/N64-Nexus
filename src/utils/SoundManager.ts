// src/utils/SoundManager.ts

class SoundManager {
  private static instance: SoundManager;
  private bgMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public playSound(soundFile: string): void {
    if (this.isMuted) return;
    
    const audio = new Audio(soundFile);
    audio.volume = this.volume;
    audio.play().catch((e) => console.warn("Sound konnte nicht abgespielt werden:", e));
  }

  public playBackgroundMusic(musicFile: string): void {
    if (this.isMuted) return;
    
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic = null;
    }

    this.bgMusic = new Audio(musicFile);
    this.bgMusic.loop = true;
    this.bgMusic.volume = this.volume * 0.3; // Hintergrundmusik leiser
    this.bgMusic.play().catch((e) => console.warn("Hintergrundmusik konnte nicht abgespielt werden:", e));
  }

  public stopBackgroundMusic(): void {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic = null;
    }
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.bgMusic) {
      this.bgMusic.pause();
    } else if (!this.isMuted && this.bgMusic) {
      this.bgMusic.play().catch((e) => console.warn("Hintergrundmusik konnte nicht abgespielt werden:", e));
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.volume * 0.3;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
}

// Exportiere eine einfache Funktion für direkten Zugriff
export const playSound = (soundFile: string) => {
  SoundManager.getInstance().playSound(soundFile);
};

export const playBackgroundMusic = (musicFile: string) => {
  SoundManager.getInstance().playBackgroundMusic(musicFile);
};

export const stopBackgroundMusic = () => {
  SoundManager.getInstance().stopBackgroundMusic();
};

export const toggleMute = () => {
  SoundManager.getInstance().toggleMute();
};

export const setVolume = (volume: number) => {
  SoundManager.getInstance().setVolume(volume);
};

export const getVolume = (): number => {
  return SoundManager.getInstance().getVolume();
};

export const isSoundMuted = (): boolean => {
  return SoundManager.getInstance().isSoundMuted();
};

export default SoundManager;