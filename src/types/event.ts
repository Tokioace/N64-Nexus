export type EventCategory = 'speedrun' | 'fanart' | 'glitch' | 'teams' | 'custom';

export type EventStatus = 'planned' | 'active' | 'ended';

export type Platform = 'NTSC' | 'PAL' | 'console' | 'emulator';

export type ReminderType = '1_day_before' | '1_hour_before' | 'at_start' | 'at_end';

export type NotificationMethod = 'push' | 'in_app' | 'email';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  platform: Platform;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  isTopEvent: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  organizer: string;
  rules?: string;
  prizes?: string;
  imageUrl?: string;
  tags: string[];
}

export interface UserEvent {
  eventId: string;
  userId: string;
  isParticipating: boolean;
  hasInterested: boolean;
  reminders: ReminderSettings[];
  subscribed: boolean;
}

export interface ReminderSettings {
  type: ReminderType;
  methods: NotificationMethod[];
  enabled: boolean;
}

export interface EventSeries {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  events: Event[];
  subscribers: string[];
}

export interface CalendarView {
  type: 'month' | 'list';
  filter?: EventCategory;
  showOnlyMyEvents: boolean;
  showTopEvents: boolean;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'start' | 'end' | 'new_event';
  title: string;
  message: string;
  eventId?: string;
  timestamp: Date;
  read: boolean;
}