import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { NewsPost, FilterOptions, AdminPostData, User } from '../types';

interface NewsState {
  posts: NewsPost[];
  currentUser: User;
  filters: FilterOptions;
  isLoading: boolean;
}

type NewsAction =
  | { type: 'SET_POSTS'; payload: NewsPost[] }
  | { type: 'ADD_POST'; payload: NewsPost }
  | { type: 'UPDATE_POST'; payload: NewsPost }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'LIKE_POST'; payload: { postId: string; userId: string } }
  | { type: 'ADD_COMMENT'; payload: { postId: string; comment: any } }
  | { type: 'SET_FILTERS'; payload: Partial<FilterOptions> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User };

const initialState: NewsState = {
  posts: [],
  currentUser: {
    id: '1',
    username: 'Sergio',
    role: 'player',
    groups: ['Speedrunners', 'Fanart'],
    region: 'EU'
  },
  filters: {
    showOfficial: true,
    showHighlights: true,
    showFanart: true,
    showEvents: true,
    showTips: true,
    showOwnGroups: false,
    showAdminOnly: false,
  },
  isLoading: false,
};

function newsReducer(state: NewsState, action: NewsAction): NewsState {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
      };
    case 'LIKE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? { ...post, likes: post.likes + 1 }
            : post
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? { ...post, comments: [...post.comments, action.payload.comment] }
            : post
        ),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
}

interface NewsContextType {
  state: NewsState;
  dispatch: React.Dispatch<NewsAction>;
  createPost: (postData: AdminPostData) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  getFilteredPosts: () => NewsPost[];
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  const createPost = (postData: AdminPostData) => {
    const newPost: NewsPost = {
      id: Date.now().toString(),
      ...postData,
      author: state.currentUser.username,
      authorRole: state.currentUser.role,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      isNew: true,
    };
    dispatch({ type: 'ADD_POST', payload: newPost });
  };

  const likePost = (postId: string) => {
    dispatch({ type: 'LIKE_POST', payload: { postId, userId: state.currentUser.id } });
  };

  const addComment = (postId: string, content: string) => {
    const comment = {
      id: Date.now().toString(),
      author: state.currentUser.username,
      content,
      timestamp: new Date(),
      likes: 0,
    };
    dispatch({ type: 'ADD_COMMENT', payload: { postId, comment } });
  };

  const getFilteredPosts = (): NewsPost[] => {
    return state.posts.filter(post => {
      if (!state.filters.showOfficial && post.type === 'official') return false;
      if (!state.filters.showHighlights && post.type === 'highlight') return false;
      if (!state.filters.showFanart && post.type === 'fanart') return false;
      if (!state.filters.showEvents && post.type === 'event') return false;
      if (!state.filters.showTips && post.type === 'tip') return false;
      if (state.filters.showAdminOnly && post.authorRole !== 'admin') return false;
      if (state.filters.showOwnGroups && post.visibility === 'group') {
        return post.targetGroups?.some(group => state.currentUser.groups.includes(group));
      }
      return true;
    });
  };

  const value: NewsContextType = {
    state,
    dispatch,
    createPost,
    likePost,
    addComment,
    getFilteredPosts,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}