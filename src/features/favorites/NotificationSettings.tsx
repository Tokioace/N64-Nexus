import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Calendar, 
  Image, 
  Users, 
  Mail,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useFavoritesStore } from '@/stores/favoritesStore';

export const NotificationSettings: React.FC = () => {
  const {
    notificationSettings,
    updateNotificationSettings
  } = useFavoritesStore();

  const handleToggle = (key: keyof typeof notificationSettings) => {
    updateNotificationSettings({
      [key]: !notificationSettings[key]
    });
  };

  const settings = [
    {
      key: 'eventReminders' as const,
      title: 'Event-Erinnerungen',
      description: 'Erhalte Benachrichtigungen vor Events, die du favorisiert hast',
      icon: Calendar,
      color: 'text-n64-yellow-400'
    },
    {
      key: 'newContent' as const,
      title: 'Neue Inhalte',
      description: 'Benachrichtigungen über neue Fanarts, Quiz-Serien und mehr',
      icon: Image,
      color: 'text-n64-green-400'
    },
    {
      key: 'friendActivity' as const,
      title: 'Freunde-Aktivität',
      description: 'Sieh, wenn Freunde deine favorisierten Inhalte auch favorisieren',
      icon: Users,
      color: 'text-n64-blue-400'
    },
    {
      key: 'weeklyDigest' as const,
      title: 'Wöchentlicher Überblick',
      description: 'Zusammenfassung deiner Favoriten-Aktivität der Woche',
      icon: Mail,
      color: 'text-n64-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Bell className="w-6 h-6 text-n64-purple-400" />
        <h2 className="text-2xl font-bold text-white">Benachrichtigungen</h2>
      </div>

      {/* Global Toggle */}
      <div className="retro-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Alle Benachrichtigungen</h3>
            <p className="text-retro-gray-400 text-sm">
              Aktiviere oder deaktiviere alle Favoriten-Benachrichtigungen
            </p>
          </div>
          <button
            onClick={() => handleToggle('enabled')}
            className="flex items-center space-x-2"
          >
            {notificationSettings.enabled ? (
              <ToggleRight className="w-8 h-6 text-n64-green-400" />
            ) : (
              <ToggleLeft className="w-8 h-6 text-retro-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Individual Settings */}
      <div className="space-y-4">
        {settings.map((setting, index) => {
          const Icon = setting.icon;
          const isEnabled = notificationSettings[setting.key];
          
          return (
            <motion.div
              key={setting.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`retro-card p-4 ${
                !notificationSettings.enabled ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${setting.color}`} />
                  <div>
                    <h4 className="font-bold text-white">{setting.title}</h4>
                    <p className="text-sm text-retro-gray-400">{setting.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleToggle(setting.key)}
                  disabled={!notificationSettings.enabled}
                  className="flex items-center space-x-2 disabled:opacity-50"
                >
                  {isEnabled ? (
                    <ToggleRight className="w-6 h-4 text-n64-green-400" />
                  ) : (
                    <ToggleLeft className="w-6 h-4 text-retro-gray-600" />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="retro-card p-6 bg-n64-purple-900/20 border-n64-purple-500/30">
        <h3 className="text-lg font-bold text-n64-purple-400 mb-3">
          💡 Tipp
        </h3>
        <p className="text-retro-gray-300 text-sm leading-relaxed">
          Benachrichtigungen helfen dir dabei, keine wichtigen Events oder neue Inhalte zu verpassen. 
          Du kannst sie jederzeit anpassen und sie werden nur für deine favorisierten Inhalte gesendet.
        </p>
      </div>
    </div>
  );
};