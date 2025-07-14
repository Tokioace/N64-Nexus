'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  UserX, 
  Flag,
  Filter,
  Search,
  Clock,
  Eye
} from 'lucide-react';
import { ContentItem, ModerationAction, ModerationReason } from '../../types/admin';
import toast from 'react-hot-toast';

const ModerationTab: React.FC = () => {
  const { flaggedContent, setFlaggedContent, addModerationAction } = useAdminStore();
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockContent: ContentItem[] = [
      {
        id: '1',
        type: 'fanart',
        title: 'Mario Fanart',
        content: 'Ein schönes Mario Fanart...',
        author: {
          id: 'user1',
          username: 'Artist123',
          email: 'artist@example.com',
          isBlocked: false,
          warnings: [],
          createdAt: new Date(),
          lastActive: new Date()
        },
        isFlagged: true,
        flags: [
          {
            id: 'flag1',
            type: 'nsfw',
            confidence: 0.85,
            isAutomated: true,
            createdAt: new Date()
          }
        ],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        type: 'comment',
        content: 'Spam comment with repeated text...',
        author: {
          id: 'user2',
          username: 'Spammer',
          email: 'spam@example.com',
          isBlocked: false,
          warnings: [],
          createdAt: new Date(),
          lastActive: new Date()
        },
        isFlagged: true,
        flags: [
          {
            id: 'flag2',
            type: 'spam',
            confidence: 0.95,
            isAutomated: true,
            createdAt: new Date()
          }
        ],
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19')
      }
    ];
    setFlaggedContent(mockContent);
  }, [setFlaggedContent]);

  const moderationReasons: ModerationReason[] = [
    {
      id: '1',
      code: 'NSFW',
      title: 'Nicht jugendfreier Inhalt',
      description: 'Inhalt ist nicht für alle Altersgruppen geeignet',
      category: 'inappropriate',
      severity: 'high'
    },
    {
      id: '2',
      code: 'SPAM',
      title: 'Spam',
      description: 'Wiederholte oder unerwünschte Inhalte',
      category: 'spam',
      severity: 'medium'
    },
    {
      id: '3',
      code: 'COPYRIGHT',
      title: 'Urheberrechtsverletzung',
      description: 'Verletzung von geistigen Eigentumsrechten',
      category: 'copyright',
      severity: 'critical'
    },
    {
      id: '4',
      code: 'HARASSMENT',
      title: 'Belästigung',
      description: 'Beleidigende oder belästigende Inhalte',
      category: 'harassment',
      severity: 'high'
    }
  ];

  const handleModerationAction = (action: 'approve' | 'delete' | 'warn' | 'block', reason?: string) => {
    if (!selectedContent) return;

    const moderationAction: ModerationAction = {
      id: Date.now().toString(),
      type: action,
      targetType: selectedContent.type,
      targetId: selectedContent.id,
      reason: moderationReasons.find(r => r.code === reason) || moderationReasons[0],
      moderator: {
        id: '1',
        username: 'Admin',
        email: 'admin@battle64.com',
        role: 'admin',
        permissions: ['posts', 'moderation', 'users', 'settings'],
        createdAt: new Date(),
        lastActive: new Date()
      },
      affectedUser: selectedContent.author.id,
      isAutomated: false,
      createdAt: new Date()
    };

    addModerationAction(moderationAction);
    
    // Remove from flagged content
    setFlaggedContent(flaggedContent.filter(item => item.id !== selectedContent.id));
    
    setSelectedContent(null);
    setShowActionModal(false);
    
    toast.success(`Aktion erfolgreich ausgeführt: ${action}`);
  };

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'nsfw': return '🔞';
      case 'spam': return '🚫';
      case 'copyright': return '©️';
      case 'harassment': return '⚠️';
      default: return '🚩';
    }
  };

  const getSeverityColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-red-600';
    if (confidence > 0.6) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredContent = flaggedContent.filter(item => {
    if (filter === 'all') return true;
    return item.flags.some(flag => flag.type === filter);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Moderation</h2>
          <p className="text-gray-600">Verwalte gemeldete Inhalte und Benutzer</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-battle64-600" />
            <span className="text-sm text-gray-600">
              {flaggedContent.length} gemeldete Inhalte
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select text-sm"
          >
            <option value="all">Alle Flags</option>
            <option value="nsfw">NSFW</option>
            <option value="spam">Spam</option>
            <option value="copyright">Urheberrecht</option>
            <option value="harassment">Belästigung</option>
          </select>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Gemeldete Inhalte ({filteredContent.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredContent.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">
                      {item.type === 'fanart' ? '🎨' : 
                       item.type === 'comment' ? '💬' : 
                       item.type === 'post' ? '📝' : '📅'}
                    </span>
                    <h4 className="text-lg font-medium text-gray-900">
                      {item.title || `${item.type} von ${item.author.username}`}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.content}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Von {item.author.username}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.flags.length} Flag(s)</span>
                  </div>

                  {/* Flags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.flags.map((flag) => (
                      <div
                        key={flag.id}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                          flag.isAutomated ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span>{getFlagIcon(flag.type)}</span>
                        <span className="font-medium">{flag.type.toUpperCase()}</span>
                        <span className={`font-bold ${getSeverityColor(flag.confidence)}`}>
                          {Math.round(flag.confidence * 100)}%
                        </span>
                        {flag.isAutomated && (
                          <span className="text-blue-600">🤖</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedContent(item);
                      setShowActionModal(true);
                    }}
                    className="btn-primary text-sm"
                  >
                    Moderieren
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moderation Action Modal */}
      {showActionModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Moderationsaktion
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Wähle eine Aktion für diesen Inhalt
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Inhalt:</h4>
                <p className="text-sm text-gray-600">
                  {selectedContent.title || selectedContent.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Von {selectedContent.author.username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Begründung
                </label>
                <select className="form-select">
                  {moderationReasons.map((reason) => (
                    <option key={reason.id} value={reason.code}>
                      {reason.title} ({reason.severity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleModerationAction('approve')}
                  className="flex items-center justify-center space-x-2 p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Genehmigen</span>
                </button>
                
                <button
                  onClick={() => handleModerationAction('delete')}
                  className="flex items-center justify-center space-x-2 p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Löschen</span>
                </button>
                
                <button
                  onClick={() => handleModerationAction('warn')}
                  className="flex items-center justify-center space-x-2 p-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Verwarnen</span>
                </button>
                
                <button
                  onClick={() => handleModerationAction('block')}
                  className="flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <UserX className="h-4 w-4" />
                  <span>Blockieren</span>
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedContent(null);
                }}
                className="w-full btn-secondary"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModerationTab;