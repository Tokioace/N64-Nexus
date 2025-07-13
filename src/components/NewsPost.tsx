import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { NewsPost as NewsPostType } from '../types';

interface NewsPostProps {
  post: NewsPostType;
}

const NewsPost: React.FC<NewsPostProps> = ({ post }) => {
  const { likePost, addComment } = useNews();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    likePost(post.id);
    setIsLiked(true);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(post.id, newComment.trim());
      setNewComment('');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'official': return '📢';
      case 'highlight': return '🏆';
      case 'fanart': return '🖼️';
      case 'event': return '🕹️';
      case 'tip': return '💡';
      default: return '📰';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'official': return 'silver';
      case 'highlight': return 'gold';
      case 'fanart': return 'blue';
      case 'event': return 'red';
      case 'tip': return 'green';
      default: return 'gray';
    }
  };

  return (
    <article className={`news-banner ${post.type} hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}>
      {post.isNew && (
        <div className="absolute top-2 right-2">
          <span className="new-badge">NEU!</span>
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-n64-${getTypeColor(post.type)}/20 border-2 border-n64-${getTypeColor(post.type)}/50`}>
            {getTypeIcon(post.type)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-pixel text-white truncate">
              {post.title}
            </h3>
            {post.pushNotification && (
              <span className="text-n64-red text-sm">🔔</span>
            )}
          </div>
          
          <p className="text-n64-gray font-n64 mb-3 leading-relaxed">
            {post.content}
          </p>
          
          {post.image && (
            <div className="mb-4">
              <img 
                src={post.image} 
                alt="Post image" 
                className="w-full max-w-md rounded-lg border-2 border-n64-blue/30"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-n64-gray font-n64">
            <div className="flex items-center space-x-4">
              <span>👤 {post.author}</span>
              <span>🕐 {formatDistanceToNow(post.timestamp, { addSuffix: true, locale: de })}</span>
              {post.visibility !== 'global' && (
                <span className="bg-n64-blue/20 px-2 py-1 rounded text-xs">
                  {post.visibility.toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${
                  isLiked 
                    ? 'bg-n64-red/20 text-n64-red' 
                    : 'bg-n64-gray/20 hover:bg-n64-red/20 hover:text-n64-red'
                }`}
              >
                <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                <span>{post.likes}</span>
              </button>
              
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-1 px-3 py-1 rounded bg-n64-gray/20 hover:bg-n64-blue/20 hover:text-n64-blue transition-colors"
              >
                <MessageCircle size={14} />
                <span>{post.comments.length}</span>
              </button>
              
              <button className="flex items-center space-x-1 px-3 py-1 rounded bg-n64-gray/20 hover:bg-n64-green/20 hover:text-n64-green transition-colors">
                <Share2 size={14} />
                <span>Teilen</span>
              </button>
            </div>
          </div>
          
          {showComments && (
            <div className="mt-4 pt-4 border-t border-n64-gray/30">
              <h4 className="font-pixel text-n64-blue mb-3">💬 Kommentare ({post.comments.length})</h4>
              
              {post.comments.length === 0 ? (
                <p className="text-n64-gray font-n64 text-sm">Noch keine Kommentare. Sei der Erste!</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="bg-n64-dark/50 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-n64 text-n64-blue">{comment.author}</span>
                        <span className="text-xs text-n64-gray">
                          {formatDistanceToNow(comment.timestamp, { addSuffix: true, locale: de })}
                        </span>
                      </div>
                      <p className="text-sm text-white font-n64">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleComment} className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Kommentar schreiben..."
                  className="flex-1 n64-input text-sm"
                  maxLength={500}
                />
                <button type="submit" className="n64-button text-sm">
                  Senden
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsPost;