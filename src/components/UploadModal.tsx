import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Star, Tag, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react';
import { GalleryItem, GalleryCategory, User, UploadFormData } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (item: GalleryItem) => void;
  users: User[];
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, users }) => {
  const [formData, setFormData] = useState<Partial<UploadFormData>>({
    title: '',
    description: '',
    category: 'merchandise',
    origin: '',
    isForSale: false,
    tags: [],
    imageFile: null as any
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: { value: GalleryCategory; label: string; icon: string }[] = [
    { value: 'fanart', label: '🎨 Fanart', icon: '🎨' },
    { value: 'screenshots', label: '📷 Screenshots', icon: '📷' },
    { value: 'merchandise', label: '🧸 Sammlerstücke & Merch', icon: '🧸' }
  ];

  const origins = [
    'eBay', 'Flohmarkt', 'Erbstück', 'Gamestop', 'Amazon', 'Lokaler Händler', 'Tausch', 'Andere'
  ];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Titel ist erforderlich';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Beschreibung ist erforderlich';
    }

    if (!formData.imageFile) {
      newErrors.image = 'Bild ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newItem: GalleryItem = {
      id: Date.now().toString(),
      title: formData.title!,
      description: formData.description!,
      imageUrl: imagePreview,
      category: formData.category!,
      rarity: 1, // Default rarity, will be rated by community
      points: 5, // Default points for new items
      uploadDate: new Date(),
      uploader: users[0], // Current user
      origin: formData.origin,
      isForSale: formData.isForSale,
      tags: formData.tags || [],
      views: 0,
      likes: 0,
      comments: []
    };

    onUpload(newItem);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-n64-dark border border-n64-purple/50 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-retro text-white">🖼️ Item hochladen</h2>
            <button
              onClick={onClose}
              className="text-n64-light/60 hover:text-white transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                <ImageIcon size={16} className="inline mr-2" />
                Bild auswählen
              </label>
              
              <div className="border-2 border-dashed border-n64-purple/50 rounded-lg p-6 text-center hover:border-n64-purple transition-colors duration-200">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-xs mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="n64-button text-sm"
                    >
                      Anderes Bild wählen
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload size={48} className="mx-auto text-n64-purple/60" />
                    <div>
                      <p className="text-n64-light/80 mb-2">
                        Klicke hier oder ziehe ein Bild hierher
                      </p>
                      <p className="text-xs text-n64-light/60">
                        JPG, PNG bis 5MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="n64-button"
                    >
                      Bild auswählen
                    </button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              {errors.image && (
                <p className="text-n64-red text-sm mt-1">{errors.image}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Titel *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="n64-input w-full"
                placeholder="z.B. Original Mario Kart 64 Yoshi Figure (1998)"
              />
              {errors.title && (
                <p className="text-n64-red text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Beschreibung *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="n64-input w-full h-24 resize-none"
                placeholder="Beschreibe dein Item detailliert..."
              />
              {errors.description && (
                <p className="text-n64-red text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Kategorie
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.category === category.value
                        ? 'border-n64-purple bg-n64-purple/20 text-white'
                        : 'border-n64-purple/30 text-n64-light/60 hover:border-n64-purple/50 hover:text-white'
                    }`}
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="text-xs font-n64">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Origin */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                <MapPin size={16} className="inline mr-2" />
                Herkunft (optional)
              </label>
              <select
                value={formData.origin || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                className="n64-input w-full"
              >
                <option value="">Herkunft auswählen...</option>
                {origins.map((origin) => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>

            {/* For Sale */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="forSale"
                checked={formData.isForSale || false}
                onChange={(e) => setFormData(prev => ({ ...prev, isForSale: e.target.checked }))}
                className="w-4 h-4 text-n64-purple bg-n64-dark border-n64-purple rounded focus:ring-n64-purple"
              />
              <label htmlFor="forSale" className="text-sm text-white flex items-center space-x-2">
                <DollarSign size={16} />
                <span>Ich würde dieses Item ggf. verkaufen</span>
              </label>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                <Tag size={16} className="inline mr-2" />
                Tags
              </label>
              
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="n64-input flex-1"
                  placeholder="Tag hinzufügen..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="n64-button"
                >
                  Hinzufügen
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-n64-purple/30 text-n64-light px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-n64-light/60 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-n64-purple/50 text-n64-light rounded-lg hover:bg-n64-purple/20 transition-colors duration-200"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 n64-button"
              >
                <Upload size={16} className="mr-2" />
                Hochladen
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;