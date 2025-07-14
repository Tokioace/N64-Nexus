'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { AdminPost } from '../types/admin';
import { 
  X, 
  Save, 
  Eye, 
  Calendar, 
  Globe, 
  Pin, 
  Image as ImageIcon,
  Upload,
  Languages,
  Link,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PostFormProps {
  post?: AdminPost | null;
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onClose }) => {
  const { currentAdmin, addPost, updatePost } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'event' as const,
    category: 'event' as const,
    language: 'de' as const,
    translations: {
      de: '',
      en: ''
    },
    imageUrl: '',
    scheduledFor: '',
    isPublished: false,
    isPinned: false,
    isDraft: true,
    visibility: 'public' as const,
    targetRegions: [] as string[],
    targetGroups: [] as string[],
    pushNotification: false,
    linkedEvent: '',
    linkedFanart: '',
    linkedQuiz: '',
    linkedCollection: ''
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        type: post.type,
        category: post.category,
        language: post.language,
        translations: post.translations || { de: '', en: '' },
        imageUrl: post.imageUrl || '',
        scheduledFor: post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : '',
        isPublished: post.isPublished,
        isPinned: post.isPinned,
        isDraft: post.isDraft,
        visibility: post.visibility,
        targetRegions: post.targetRegions || [],
        targetGroups: post.targetGroups || [],
        pushNotification: post.pushNotification,
        linkedEvent: post.linkedEvent || '',
        linkedFanart: post.linkedFanart || '',
        linkedQuiz: post.linkedQuiz || '',
        linkedCollection: post.linkedCollection || ''
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const postData: Partial<AdminPost> = {
        ...formData,
        author: currentAdmin!,
        createdAt: post?.createdAt || new Date(),
        updatedAt: new Date(),
        publishedAt: formData.isPublished ? new Date() : undefined,
        scheduledFor: formData.scheduledFor ? new Date(formData.scheduledFor) : undefined
      };

      if (post) {
        // Update existing post
        updatePost(post.id, postData);
        toast.success('Post erfolgreich aktualisiert');
      } else {
        // Create new post
        const newPost: AdminPost = {
          id: Date.now().toString(),
          ...postData as AdminPost
        };
        addPost(newPost);
        toast.success('Post erfolgreich erstellt');
      }
      
      onClose();
    } catch (error) {
      toast.error('Fehler beim Speichern des Posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, imageUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {post ? 'Post bearbeiten' : 'Neuer Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                placeholder="Post-Titel eingeben..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typ *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="form-select"
              >
                <option value="event">🎮 Event</option>
                <option value="feature">🆕 Feature</option>
                <option value="rules">🛡️ Regeln</option>
                <option value="winner">🏆 Gewinner</option>
                <option value="birthday">🎉 Geburtstag</option>
                <option value="season">🌱 Saison</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="form-select"
              >
                <option value="event">Event</option>
                <option value="systeminfo">System-Info</option>
                <option value="maintenance">Wartung</option>
                <option value="announcement">Ankündigung</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sprache *
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                className="form-select"
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inhalt *
            </label>
            <textarea
              required
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="form-textarea"
              placeholder="Post-Inhalt eingeben... (Markdown unterstützt)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Markdown-Syntax wird unterstützt. Verwende **fett**, *kursiv*, [Links](url), etc.
            </p>
          </div>

          {/* Translations */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Languages className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700">Übersetzungen</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Deutsch
                </label>
                <textarea
                  rows={4}
                  value={formData.translations.de}
                  onChange={(e) => setFormData({
                    ...formData,
                    translations: { ...formData.translations, de: e.target.value }
                  })}
                  className="form-textarea text-sm"
                  placeholder="Deutsche Übersetzung..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  English
                </label>
                <textarea
                  rows={4}
                  value={formData.translations.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    translations: { ...formData.translations, en: e.target.value }
                  })}
                  className="form-textarea text-sm"
                  placeholder="English translation..."
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bild (optional)
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Bild hochladen</span>
                </div>
              </label>
              {formData.imageUrl && (
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Bild ausgewählt</span>
                </div>
              )}
            </div>
          </div>

          {/* Scheduling */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700">Veröffentlichung</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Veröffentlichungszeit
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  className="form-input text-sm"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Sofort veröffentlichen</span>
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isDraft}
                    onChange={(e) => setFormData({ ...formData, isDraft: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Als Entwurf speichern</span>
                </label>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Pin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Post fixieren</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.pushNotification}
                  onChange={(e) => setFormData({ ...formData, pushNotification: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Bell className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Push-Benachrichtigung senden</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sichtbarkeit
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                className="form-select"
              >
                <option value="public">Öffentlich</option>
                <option value="region">Nur bestimmte Regionen</option>
                <option value="group">Nur bestimmte Gruppen</option>
              </select>
            </div>
          </div>

          {/* Links */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Link className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700">Verlinkungen (optional)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.linkedEvent}
                onChange={(e) => setFormData({ ...formData, linkedEvent: e.target.value })}
                className="form-input text-sm"
                placeholder="Event-ID verlinken..."
              />
              <input
                type="text"
                value={formData.linkedFanart}
                onChange={(e) => setFormData({ ...formData, linkedFanart: e.target.value })}
                className="form-input text-sm"
                placeholder="Fanart-ID verlinken..."
              />
              <input
                type="text"
                value={formData.linkedQuiz}
                onChange={(e) => setFormData({ ...formData, linkedQuiz: e.target.value })}
                className="form-input text-sm"
                placeholder="Quiz-ID verlinken..."
              />
              <input
                type="text"
                value={formData.linkedCollection}
                onChange={(e) => setFormData({ ...formData, linkedCollection: e.target.value })}
                className="form-input text-sm"
                placeholder="Sammlung-ID verlinken..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Vorschau</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{post ? 'Aktualisieren' : 'Erstellen'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Preview */}
        {showPreview && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vorschau</h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{formData.type === 'event' ? '🎮' : '📝'}</span>
                <h4 className="text-lg font-medium">{formData.title}</h4>
                {formData.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
              </div>
              <p className="text-gray-600 text-sm mb-3">{formData.content}</p>
              <div className="text-xs text-gray-500">
                Von {currentAdmin?.username} • {new Date().toLocaleDateString('de-DE')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostForm;