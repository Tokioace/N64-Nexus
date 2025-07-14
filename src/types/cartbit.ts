export interface CartbitProps {
  /** Whether Cartbit is in minimized state */
  isMinimized?: boolean;
  /** Callback function when minimize/maximize is toggled */
  onToggleMinimize?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export interface HelpTopic {
  /** Unique identifier for the help topic */
  id: string;
  /** Display title for the topic */
  title: string;
  /** Help content/answer for the topic */
  content: string;
  /** Keywords that trigger this help topic */
  keywords: string[];
}

export interface CartbitState {
  /** Whether the chat interface is open */
  isOpen: boolean;
  /** Current message being displayed */
  currentMessage: string;
  /** Whether Cartbit is currently typing */
  isTyping: boolean;
  /** Current search query */
  searchQuery: string;
  /** Current random fact being displayed */
  currentFact: string;
  /** Whether Cartbit is blinking */
  isBlinking: boolean;
  /** Whether Cartbit is jubilating */
  isJubilating: boolean;
  /** Whether Cartbit is confused */
  isConfused: boolean;
}