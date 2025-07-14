import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Folder, 
  Users, 
  Lock,
  Star,
  MoreVertical
} from 'lucide-react';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { FavoriteList } from '@/types/favorites';

export const FavoritesLists: React.FC = () => {
  const {
    lists,
    selectedListId,
    setSelectedList,
    createList,
    updateList,
    deleteList,
    getFavoritesInList
  } = useFavoritesStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newListColor, setNewListColor] = useState('#8b5cf6');

  const colors = [
    '#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList({
        name: newListName.trim(),
        description: newListDescription.trim(),
        color: newListColor,
        isPublic: false
      });
      setNewListName('');
      setNewListDescription('');
      setNewListColor('#8b5cf6');
      setShowCreateForm(false);
    }
  };

  const handleUpdateList = (listId: string) => {
    if (newListName.trim()) {
      updateList(listId, {
        name: newListName.trim(),
        description: newListDescription.trim(),
        color: newListColor
      });
      setNewListName('');
      setNewListDescription('');
      setNewListColor('#8b5cf6');
      setEditingList(null);
    }
  };

  const handleDeleteList = (listId: string) => {
    if (confirm('Möchtest du diese Liste wirklich löschen?')) {
      deleteList(listId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Favoriten-Listen</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-n64-purple-500 hover:bg-n64-purple-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Neue Liste</span>
        </button>
      </div>

      {/* Create List Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="retro-card p-6"
          >
            <h3 className="text-lg font-bold mb-4">Neue Liste erstellen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-retro-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="z.B. Lieblingsstrecken"
                  className="w-full px-3 py-2 bg-retro-gray-700 border border-retro-gray-600 rounded-lg text-white placeholder-retro-gray-400 focus:outline-none focus:border-n64-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-retro-gray-300 mb-2">
                  Beschreibung (optional)
                </label>
                <textarea
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Beschreibe deine Liste..."
                  rows={3}
                  className="w-full px-3 py-2 bg-retro-gray-700 border border-retro-gray-600 rounded-lg text-white placeholder-retro-gray-400 focus:outline-none focus:border-n64-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-retro-gray-300 mb-2">
                  Farbe
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewListColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newListColor === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCreateList}
                  className="px-4 py-2 bg-n64-green-500 hover:bg-n64-green-600 text-white rounded-lg transition-colors"
                >
                  Liste erstellen
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-retro-gray-700 hover:bg-retro-gray-600 text-white rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => {
          const favoritesInList = getFavoritesInList(list.id);
          const isEditing = editingList === list.id;
          const isSelected = selectedListId === list.id;

          return (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`retro-card retro-card-hover p-4 cursor-pointer ${
                isSelected ? 'ring-2 ring-n64-purple-500' : ''
              }`}
              onClick={() => !isEditing && setSelectedList(list.id)}
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full px-2 py-1 bg-retro-gray-700 border border-retro-gray-600 rounded text-white text-sm"
                    autoFocus
                  />
                  <textarea
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    rows={2}
                    className="w-full px-2 py-1 bg-retro-gray-700 border border-retro-gray-600 rounded text-white text-sm"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateList(list.id)}
                      className="px-2 py-1 bg-n64-green-500 text-white text-xs rounded"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => setEditingList(null)}
                      className="px-2 py-1 bg-retro-gray-700 text-white text-xs rounded"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: list.color }}
                      />
                      <div className="flex items-center space-x-1">
                        {list.isPublic ? (
                          <Users className="w-3 h-3 text-retro-gray-400" />
                        ) : (
                          <Lock className="w-3 h-3 text-retro-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingList(list.id);
                          setNewListName(list.name);
                          setNewListDescription(list.description || '');
                          setNewListColor(list.color || '#8b5cf6');
                        }}
                        className="p-1 text-retro-gray-400 hover:text-white"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      {list.id !== 'default' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteList(list.id);
                          }}
                          className="p-1 text-retro-gray-400 hover:text-n64-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-white">{list.name}</h3>
                  {list.description && (
                    <p className="text-sm text-retro-gray-400 mb-3">{list.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-n64-yellow-400" />
                      <span className="text-sm text-retro-gray-300">
                        {favoritesInList.length} Favoriten
                      </span>
                    </div>
                    
                    <div className="text-xs text-retro-gray-500">
                      {new Date(list.updatedAt).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {lists.length === 1 && (
        <div className="text-center py-8">
          <Folder className="w-16 h-16 text-retro-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-retro-gray-400 mb-2">
            Erstelle deine erste Liste
          </h3>
          <p className="text-retro-gray-500 mb-4">
            Organisiere deine Favoriten in thematische Listen
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-n64-purple-500 hover:bg-n64-purple-600 text-white rounded-lg transition-colors"
          >
            Liste erstellen
          </button>
        </div>
      )}
    </div>
  );
};