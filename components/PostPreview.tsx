'use client';

import React from 'react';
import { AdminPost } from '../types/admin';
import { X, Pin, Globe, Calendar, Image as ImageIcon } from 'lucide-react';

interface PostPreviewProps {
  post: AdminPost;
  onClose: () => void;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post, onClose }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event': return '🎮';
      case 'feature': return '🆕';
      case 'rules': return '🛡️';
      case 'winner': return '🏆';
      case 'birthday': return '🎉';
      case 'season': return '🌱';
      default: return '📝';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'systeminfo': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'announcement': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Post-Vorschau</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          {/* Admin Badge */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="admin-badge">👑 Admin</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
            {post.isPinned && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <Pin className="h-4 w-4" />
                <span className="text-xs">Fixiert</span>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            {/* Header */}
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-battle64-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {post.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getTypeIcon(post.type)} {post.title}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="font-medium text-battle64-600">{post.author.username}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('de-DE')}</span>
                  {post.publishedAt && (
                    <>
                      <span>•</span>
                      <span>Veröffentlicht {new Date(post.publishedAt).toLocaleDateString('de-DE')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Image */}
            {post.imageUrl && (
              <div className="mb-4">
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Links */}
            {(post.linkedEvent || post.linkedFanart || post.linkedQuiz || post.linkedCollection) && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Verlinkungen:</h4>
                <div className="space-y-1">
                  {post.linkedEvent && (
                    <div className="text-sm text-blue-700">🎮 Event: {post.linkedEvent}</div>
                  )}
                  {post.linkedFanart && (
                    <div className="text-sm text-blue-700">🎨 Fanart: {post.linkedFanart}</div>
                  )}
                  {post.linkedQuiz && (
                    <div className="text-sm text-blue-700">❓ Quiz: {post.linkedQuiz}</div>
                  )}
                  {post.linkedCollection && (
                    <div className="text-sm text-blue-700">📚 Sammlung: {post.linkedCollection}</div>
                  )}
                </div>
              </div>
            )}

            {/* Post Metadata */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  {post.scheduledFor && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Geplant für {new Date(post.scheduledFor).toLocaleDateString('de-DE')}</span>
                    </div>
                  )}
                  {post.pushNotification && (
                    <div className="flex items-center space-x-1">
                      <Globe className="h-3 w-3" />
                      <span>Push-Benachrichtigung</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span>Sichtbarkeit: {post.visibility}</span>
                  <span>•</span>
                  <span>Sprache: {post.language.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Translations Preview */}
          {post.translations && (post.translations.de || post.translations.en) && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Übersetzungen:</h4>
              <div className="space-y-3">
                {post.translations.de && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">🇩🇪 Deutsch</span>
                    </div>
                    <p className="text-sm text-gray-600">{post.translations.de}</p>
                  </div>
                )}
                {post.translations.en && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">🇺🇸 English</span>
                    </div>
                    <p className="text-sm text-gray-600">{post.translations.en}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Post Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Post-Status:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status: </span>
                <span className={`font-medium ${
                  post.isPublished ? 'text-green-600' : 
                  post.isDraft ? 'text-gray-600' : 'text-yellow-600'
                }`}>
                  {post.isPublished ? 'Veröffentlicht' : 
                   post.isDraft ? 'Entwurf' : 'Geplant'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Typ: </span>
                <span className="font-medium text-gray-900">{post.type}</span>
              </div>
              <div>
                <span className="text-gray-600">Kategorie: </span>
                <span className="font-medium text-gray-900">{post.category}</span>
              </div>
              <div>
                <span className="text-gray-600">Fixiert: </span>
                <span className={`font-medium ${post.isPinned ? 'text-yellow-600' : 'text-gray-600'}`}>
                  {post.isPinned ? 'Ja' : 'Nein'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full btn-secondary"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;