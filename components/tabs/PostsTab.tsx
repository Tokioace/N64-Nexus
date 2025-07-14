'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Globe, 
  Pin,
  Image,
  Clock,
  Filter
} from 'lucide-react';
import PostForm from '../PostForm';
import PostPreview from '../PostPreview';
import { AdminPost } from '../../types/admin';
import toast from 'react-hot-toast';

const PostsTab: React.FC = () => {
  const { 
    posts, 
    setPosts, 
    currentPost, 
    setCurrentPost, 
    postFilters, 
    setPostFilters 
  } = useAdminStore();
  
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<AdminPost[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts: AdminPost[] = [
      {
        id: '1',
        title: '🎮 Neues Event: Mario Kart Turnier',
        content: 'Am kommenden Wochenende findet unser großes Mario Kart Turnier statt! Alle Details findest du hier...',
        type: 'event',
        category: 'event',
        language: 'de',
        isPublished: true,
        isPinned: true,
        isDraft: false,
        author: {
          id: '1',
          username: 'Admin',
          email: 'admin@battle64.com',
          role: 'admin',
          permissions: ['posts', 'moderation', 'users', 'settings'],
          createdAt: new Date(),
          lastActive: new Date()
        },
        visibility: 'public',
        pushNotification: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        publishedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: '🆕 Neue Features verfügbar',
        content: 'Wir haben einige neue Features hinzugefügt, die eure Battle64-Erfahrung verbessern werden...',
        type: 'feature',
        category: 'systeminfo',
        language: 'de',
        isPublished: true,
        isPinned: false,
        isDraft: false,
        author: {
          id: '1',
          username: 'Admin',
          email: 'admin@battle64.com',
          role: 'admin',
          permissions: ['posts', 'moderation', 'users', 'settings'],
          createdAt: new Date(),
          lastActive: new Date()
        },
        visibility: 'public',
        pushNotification: false,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        publishedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        title: '🏆 Gewinner des letzten Turniers',
        content: 'Herzlichen Glückwunsch an alle Teilnehmer! Hier sind die Gewinner...',
        type: 'winner',
        category: 'announcement',
        language: 'de',
        isPublished: false,
        isPinned: false,
        isDraft: true,
        author: {
          id: '1',
          username: 'Admin',
          email: 'admin@battle64.com',
          role: 'admin',
          permissions: ['posts', 'moderation', 'users', 'settings'],
          createdAt: new Date(),
          lastActive: new Date()
        },
        visibility: 'public',
        pushNotification: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ];
    setPosts(mockPosts);
  }, [setPosts]);

  // Filter posts based on current filters
  useEffect(() => {
    let filtered = posts;
    
    if (postFilters.type) {
      filtered = filtered.filter(post => post.type === postFilters.type);
    }
    if (postFilters.category) {
      filtered = filtered.filter(post => post.category === postFilters.category);
    }
    if (postFilters.status) {
      if (postFilters.status === 'published') {
        filtered = filtered.filter(post => post.isPublished);
      } else if (postFilters.status === 'draft') {
        filtered = filtered.filter(post => post.isDraft);
      } else if (postFilters.status === 'scheduled') {
        filtered = filtered.filter(post => post.scheduledFor);
      }
    }
    if (postFilters.language) {
      filtered = filtered.filter(post => post.language === postFilters.language);
    }
    
    setFilteredPosts(filtered);
  }, [posts, postFilters]);

  const handleDeletePost = (id: string) => {
    if (confirm('Möchtest du diesen Post wirklich löschen?')) {
      // In a real app, this would be an API call
      setPosts(posts.filter(post => post.id !== id));
      toast.success('Post erfolgreich gelöscht');
    }
  };

  const getStatusBadge = (post: AdminPost) => {
    if (post.isDraft) {
      return <span className="status-draft">Entwurf</span>;
    }
    if (post.scheduledFor) {
      return <span className="status-pending">Geplant</span>;
    }
    if (post.isPublished) {
      return <span className="status-published">Veröffentlicht</span>;
    }
    return <span className="status-draft">Entwurf</span>;
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Posts</h2>
          <p className="text-gray-600">Verwalte offizielle Posts und Ankündigungen</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Neuer Post</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          <select
            value={postFilters.type}
            onChange={(e) => setPostFilters({ type: e.target.value })}
            className="form-select text-sm"
          >
            <option value="">Alle Typen</option>
            <option value="event">Event</option>
            <option value="feature">Feature</option>
            <option value="rules">Regeln</option>
            <option value="winner">Gewinner</option>
            <option value="birthday">Geburtstag</option>
            <option value="season">Saison</option>
          </select>

          <select
            value={postFilters.status}
            onChange={(e) => setPostFilters({ status: e.target.value })}
            className="form-select text-sm"
          >
            <option value="">Alle Status</option>
            <option value="published">Veröffentlicht</option>
            <option value="draft">Entwurf</option>
            <option value="scheduled">Geplant</option>
          </select>

          <select
            value={postFilters.language}
            onChange={(e) => setPostFilters({ language: e.target.value })}
            className="form-select text-sm"
          >
            <option value="">Alle Sprachen</option>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Posts ({filteredPosts.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getTypeIcon(post.type)}</span>
                    <h4 className="text-lg font-medium text-gray-900">{post.title}</h4>
                    {post.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                    {getStatusBadge(post)}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Von {post.author.username}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('de-DE')}</span>
                    {post.scheduledFor && (
                      <>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Geplant für {new Date(post.scheduledFor).toLocaleDateString('de-DE')}</span>
                        </span>
                      </>
                    )}
                    {post.pushNotification && (
                      <>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>Push-Benachrichtigung</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setCurrentPost(post);
                      setShowPreview(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Vorschau"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPost(post);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Bearbeiten"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <PostForm
          post={currentPost}
          onClose={() => {
            setShowForm(false);
            setCurrentPost(null);
          }}
        />
      )}
      
      {showPreview && currentPost && (
        <PostPreview
          post={currentPost}
          onClose={() => {
            setShowPreview(false);
            setCurrentPost(null);
          }}
        />
      )}
    </div>
  );
};

export default PostsTab;