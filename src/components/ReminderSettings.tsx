import React, { useState } from 'react';
import { ReminderType, NotificationMethod, ReminderSettings as ReminderSettingsType } from '../types/event';
import { Bell, Clock, Mail, Smartphone, Settings } from 'lucide-react';

interface ReminderSettingsProps {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  currentSettings: ReminderSettingsType[];
  onSave: (eventId: string, settings: ReminderSettingsType[]) => void;
  onClose: () => void;
  className?: string;
}

const reminderOptions: { type: ReminderType; label: string; description: string }[] = [
  {
    type: '1_day_before',
    label: '1 Tag vorher',
    description: 'Erinnerung 24 Stunden vor Event-Start'
  },
  {
    type: '1_hour_before',
    label: '1 Stunde vorher',
    description: 'Erinnerung 60 Minuten vor Event-Start'
  },
  {
    type: 'at_start',
    label: 'Beim Start',
    description: 'Benachrichtigung zum Event-Start'
  },
  {
    type: 'at_end',
    label: 'Beim Ende',
    description: 'Erinnerung zum Upload nach Event-Ende'
  }
];

const notificationMethods: { method: NotificationMethod; label: string; icon: React.ReactNode }[] = [
  {
    method: 'push',
    label: 'Push-Benachrichtigung',
    icon: <Smartphone size={16} />
  },
  {
    method: 'in_app',
    label: 'In-App',
    icon: <Bell size={16} />
  },
  {
    method: 'email',
    label: 'E-Mail',
    icon: <Mail size={16} />
  }
];

export const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  eventId,
  eventTitle,
  eventDate,
  currentSettings,
  onSave,
  onClose,
  className = ''
}) => {
  const [settings, setSettings] = useState<ReminderSettingsType[]>(
    currentSettings.length > 0 ? currentSettings : [
      {
        type: '1_hour_before',
        methods: ['push', 'in_app'],
        enabled: true
      }
    ]
  );

  const handleToggleReminder = (type: ReminderType) => {
    setSettings(prev => {
      const existing = prev.find(s => s.type === type);
      if (existing) {
        return prev.map(s => 
          s.type === type ? { ...s, enabled: !s.enabled } : s
        );
      } else {
        return [...prev, { type, methods: ['push', 'in_app'], enabled: true }];
      }
    });
  };

  const handleToggleMethod = (type: ReminderType, method: NotificationMethod) => {
    setSettings(prev => 
      prev.map(s => {
        if (s.type === type) {
          const methods = s.methods.includes(method)
            ? s.methods.filter(m => m !== method)
            : [...s.methods, method];
          return { ...s, methods };
        }
        return s;
      })
    );
  };

  const handleSave = () => {
    onSave(eventId, settings.filter(s => s.enabled));
    onClose();
  };

  const formatEventDate = (date: Date): string => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-battle64-dark border border-battle64-primary rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings size={24} className="text-battle64-primary" />
          <h3 className="font-pixel text-xl text-battle64-primary">Erinnerungen</h3>
        </div>
        <button
          onClick={onClose}
          className="text-battle64-light hover:text-battle64-primary transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Event Info */}
      <div className="bg-battle64-dark/50 border border-battle64-primary rounded-lg p-4 mb-6">
        <h4 className="font-pixel text-lg text-battle64-primary mb-2">{eventTitle}</h4>
        <div className="flex items-center gap-2 text-battle64-light/80">
          <Clock size={16} />
          <span>{formatEventDate(eventDate)}</span>
        </div>
      </div>

      {/* Reminder Options */}
      <div className="space-y-4 mb-6">
        <h4 className="font-pixel text-lg text-battle64-accent">Erinnerungstypen</h4>
        
        {reminderOptions.map(option => {
          const setting = settings.find(s => s.type === option.type);
          const isEnabled = setting?.enabled || false;
          
          return (
            <div key={option.type} className="border border-battle64-primary rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-pixel text-battle64-primary">{option.label}</h5>
                  <p className="text-sm text-battle64-light/70">{option.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleToggleReminder(option.type)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-battle64-dark border border-battle64-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-battle64-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-battle64-primary"></div>
                </label>
              </div>
              
              {isEnabled && (
                <div className="space-y-2">
                  <p className="text-sm text-battle64-light/80">Benachrichtigungsmethoden:</p>
                  <div className="flex flex-wrap gap-2">
                    {notificationMethods.map(method => {
                      const isSelected = setting?.methods.includes(method.method) || false;
                      
                      return (
                        <label
                          key={method.method}
                          className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-battle64-accent text-white'
                              : 'bg-battle64-dark border border-battle64-accent text-battle64-accent hover:bg-battle64-accent hover:text-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleMethod(option.type, method.method)}
                            className="sr-only"
                          />
                          {method.icon}
                          <span className="text-sm font-retro">{method.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview */}
      <div className="bg-battle64-dark/50 border border-battle64-primary rounded-lg p-4 mb-6">
        <h4 className="font-pixel text-lg text-battle64-accent mb-3">Vorschau</h4>
        <div className="space-y-2">
          {settings.filter(s => s.enabled).map(setting => {
            const option = reminderOptions.find(o => o.type === setting.type);
            return (
              <div key={setting.type} className="flex items-center justify-between text-sm">
                <span className="text-battle64-light">{option?.label}</span>
                <div className="flex items-center gap-1">
                  {setting.methods.map(method => {
                    const methodInfo = notificationMethods.find(m => m.method === method);
                    return (
                      <span key={method} className="text-battle64-accent">
                        {methodInfo?.icon}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-battle64-primary text-white rounded font-pixel hover:bg-battle64-primary/80 transition-colors"
        >
          Speichern
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-battle64-dark border border-battle64-primary text-battle64-primary rounded font-pixel hover:bg-battle64-primary/20 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
};