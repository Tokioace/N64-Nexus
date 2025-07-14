import { create } from 'zustand';
import { AdminPost, ModerationAction, Report, User, ContentItem, DashboardStats, AdminSettings } from '../types/admin';

interface AdminState {
  // Auth & User
  currentAdmin: any | null;
  isAuthenticated: boolean;
  
  // Posts
  posts: AdminPost[];
  currentPost: AdminPost | null;
  postFilters: {
    type: string;
    category: string;
    status: string;
    language: string;
  };
  
  // Moderation
  reports: Report[];
  moderationActions: ModerationAction[];
  flaggedContent: ContentItem[];
  
  // Users
  users: User[];
  selectedUser: User | null;
  
  // Dashboard
  stats: DashboardStats | null;
  settings: AdminSettings | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  activeTab: 'posts' | 'moderation' | 'users' | 'reports' | 'settings';
  
  // Actions
  setCurrentAdmin: (admin: any) => void;
  setAuthenticated: (status: boolean) => void;
  
  // Post Actions
  setPosts: (posts: AdminPost[]) => void;
  addPost: (post: AdminPost) => void;
  updatePost: (id: string, updates: Partial<AdminPost>) => void;
  deletePost: (id: string) => void;
  setCurrentPost: (post: AdminPost | null) => void;
  setPostFilters: (filters: Partial<AdminState['postFilters']>) => void;
  
  // Moderation Actions
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  setModerationActions: (actions: ModerationAction[]) => void;
  addModerationAction: (action: ModerationAction) => void;
  setFlaggedContent: (content: ContentItem[]) => void;
  
  // User Actions
  setUsers: (users: User[]) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  setSelectedUser: (user: User | null) => void;
  
  // Dashboard Actions
  setStats: (stats: DashboardStats) => void;
  setSettings: (settings: AdminSettings) => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: AdminState['activeTab']) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial State
  currentAdmin: null,
  isAuthenticated: false,
  posts: [],
  currentPost: null,
  postFilters: {
    type: '',
    category: '',
    status: '',
    language: '',
  },
  reports: [],
  moderationActions: [],
  flaggedContent: [],
  users: [],
  selectedUser: null,
  stats: null,
  settings: null,
  isLoading: false,
  error: null,
  activeTab: 'posts',
  
  // Auth Actions
  setCurrentAdmin: (admin) => set({ currentAdmin: admin }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  
  // Post Actions
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === id ? { ...post, ...updates } : post
    ),
    currentPost: state.currentPost?.id === id 
      ? { ...state.currentPost, ...updates }
      : state.currentPost
  })),
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter(post => post.id !== id),
    currentPost: state.currentPost?.id === id ? null : state.currentPost
  })),
  setCurrentPost: (post) => set({ currentPost: post }),
  setPostFilters: (filters) => set((state) => ({
    postFilters: { ...state.postFilters, ...filters }
  })),
  
  // Moderation Actions
  setReports: (reports) => set({ reports }),
  addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
  updateReport: (id, updates) => set((state) => ({
    reports: state.reports.map(report => 
      report.id === id ? { ...report, ...updates } : report
    )
  })),
  setModerationActions: (actions) => set({ moderationActions: actions }),
  addModerationAction: (action) => set((state) => ({
    moderationActions: [...state.moderationActions, action]
  })),
  setFlaggedContent: (content) => set({ flaggedContent: content }),
  
  // User Actions
  setUsers: (users) => set({ users }),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ),
    selectedUser: state.selectedUser?.id === id 
      ? { ...state.selectedUser, ...updates }
      : state.selectedUser
  })),
  setSelectedUser: (user) => set({ selectedUser: user }),
  
  // Dashboard Actions
  setStats: (stats) => set({ stats }),
  setSettings: (settings) => set({ settings }),
  
  // UI Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));