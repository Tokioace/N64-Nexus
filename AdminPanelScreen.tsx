import React, { useState, useEffect } from 'react';
import './AdminPanelScreen.css';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  joinDate: string;
  isActive: boolean;
}

interface ReportedContent {
  id: string;
  type: 'post' | 'fanart' | 'trade';
  title: string;
  author: string;
  reportReason: string;
  reportDate: string;
  status: 'pending' | 'reviewed' | 'resolved';
  content: string;
}

interface AdminLog {
  id: string;
  action: string;
  target: string;
  admin: string;
  timestamp: string;
  details: string;
}

interface Fanart {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface TradeOffer {
  id: string;
  title: string;
  user: string;
  offer: string;
  want: string;
  status: 'active' | 'completed' | 'cancelled';
  date: string;
}

const AdminPanelScreen: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'reports' | 'fanarts' | 'trades' | 'logs'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [fanarts, setFanarts] = useState<Fanart[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedContent, setSelectedContent] = useState<ReportedContent | null>(null);

  // Mock data initialization
  useEffect(() => {
    // Initialize mock data
    const mockUsers: User[] = [
      { id: '1', username: 'admin_user', email: 'admin@example.com', role: 'admin', joinDate: '2024-01-15', isActive: true },
      { id: '2', username: 'mod_user', email: 'mod@example.com', role: 'moderator', joinDate: '2024-02-20', isActive: true },
      { id: '3', username: 'regular_user', email: 'user@example.com', role: 'user', joinDate: '2024-03-10', isActive: true },
      { id: '4', username: 'spam_user', email: 'spam@example.com', role: 'user', joinDate: '2024-04-05', isActive: false },
    ];

    const mockReports: ReportedContent[] = [
      { id: '1', type: 'post', title: 'Inappropriate content', author: 'user123', reportReason: 'Spam', reportDate: '2024-05-01', status: 'pending', content: 'This is spam content...' },
      { id: '2', type: 'fanart', title: 'Copyright violation', author: 'artist456', reportReason: 'Copyright', reportDate: '2024-05-02', status: 'reviewed', content: 'Fanart content...' },
      { id: '3', type: 'trade', title: 'Fake trade offer', author: 'trader789', reportReason: 'Scam', reportDate: '2024-05-03', status: 'resolved', content: 'Trade offer details...' },
    ];

    const mockFanarts: Fanart[] = [
      { id: '1', title: 'Awesome Fanart', artist: 'artist1', imageUrl: '/fanart1.jpg', uploadDate: '2024-05-01', status: 'approved' },
      { id: '2', title: 'New Fanart', artist: 'artist2', imageUrl: '/fanart2.jpg', uploadDate: '2024-05-02', status: 'pending' },
      { id: '3', title: 'Rejected Fanart', artist: 'artist3', imageUrl: '/fanart3.jpg', uploadDate: '2024-05-03', status: 'rejected' },
    ];

    const mockTrades: TradeOffer[] = [
      { id: '1', title: 'Rare Card Trade', user: 'trader1', offer: 'Rare Pokemon Card', want: 'Legendary Card', status: 'active', date: '2024-05-01' },
      { id: '2', title: 'Completed Trade', user: 'trader2', offer: 'Common Card', want: 'Another Common', status: 'completed', date: '2024-05-02' },
      { id: '3', title: 'Cancelled Trade', user: 'trader3', offer: 'Special Card', want: 'Rare Item', status: 'cancelled', date: '2024-05-03' },
    ];

    const mockLogs: AdminLog[] = [
      { id: '1', action: 'DELETE_POST', target: 'Post #123', admin: 'admin_user', timestamp: '2024-05-01 10:30:00', details: 'Deleted inappropriate content' },
      { id: '2', action: 'BAN_USER', target: 'spam_user', admin: 'mod_user', timestamp: '2024-05-02 14:20:00', details: 'User banned for spam' },
      { id: '3', action: 'APPROVE_FANART', target: 'Fanart #456', admin: 'admin_user', timestamp: '2024-05-03 09:15:00', details: 'Approved fanart submission' },
    ];

    setUsers(mockUsers);
    setReportedContent(mockReports);
    setFanarts(mockFanarts);
    setTradeOffers(mockTrades);
    setAdminLogs(mockLogs);
  }, []);

  // Helper functions
  const addAdminLog = (action: string, target: string, details: string) => {
    const newLog: AdminLog = {
      id: Date.now().toString(),
      action,
      target,
      admin: 'admin_user', // Current admin
      timestamp: new Date().toLocaleString(),
      details,
    };
    setAdminLogs(prev => [newLog, ...prev]);
  };

  const handleUserRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    addAdminLog('CHANGE_ROLE', `User ${userId}`, `Role changed to ${newRole}`);
  };

  const handleUserStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
    const user = users.find(u => u.id === userId);
    addAdminLog('TOGGLE_USER_STATUS', user?.username || userId, `User ${user?.isActive ? 'deactivated' : 'activated'}`);
  };

  const handleContentAction = (contentId: string, action: 'approve' | 'reject' | 'delete') => {
    setReportedContent(prev => prev.map(content => 
      content.id === contentId ? { ...content, status: 'resolved' } : content
    ));
    addAdminLog(action.toUpperCase(), `Content ${contentId}`, `Content ${action}d`);
  };

  const handleFanartAction = (fanartId: string, action: 'approve' | 'reject') => {
    setFanarts(prev => prev.map(fanart => 
      fanart.id === fanartId ? { ...fanart, status: action === 'approve' ? 'approved' : 'rejected' } : fanart
    ));
    addAdminLog(action.toUpperCase(), `Fanart ${fanartId}`, `Fanart ${action}d`);
  };

  const handleTradeAction = (tradeId: string, action: 'approve' | 'cancel') => {
    setTradeOffers(prev => prev.map(trade => 
      trade.id === tradeId ? { ...trade, status: action === 'approve' ? 'active' : 'cancelled' } : trade
    ));
    addAdminLog(action.toUpperCase(), `Trade ${tradeId}`, `Trade ${action}d`);
  };

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = reportedContent.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dashboard statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    pendingReports: reportedContent.filter(r => r.status === 'pending').length,
    pendingFanarts: fanarts.filter(f => f.status === 'pending').length,
    activeTrades: tradeOffers.filter(t => t.status === 'active').length,
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="admin-title">ADMIN PANEL v1.0</h1>
        <div className="admin-status">
          <span className="status-indicator">●</span>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      <div className="admin-container">
        <nav className="admin-nav">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            DASHBOARD
          </button>
          <button 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            USER MANAGEMENT
          </button>
          <button 
            className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            REPORTS ({stats.pendingReports})
          </button>
          <button 
            className={`nav-btn ${activeTab === 'fanarts' ? 'active' : ''}`}
            onClick={() => setActiveTab('fanarts')}
          >
            FANARTS ({stats.pendingFanarts})
          </button>
          <button 
            className={`nav-btn ${activeTab === 'trades' ? 'active' : ''}`}
            onClick={() => setActiveTab('trades')}
          >
            TRADES ({stats.activeTrades})
          </button>
          <button 
            className={`nav-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            ADMIN LOGS
          </button>
        </nav>

        <div className="admin-content">
          <div className="search-bar">
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {activeTab === 'dashboard' && (
            <div className="dashboard">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>USERS</h3>
                  <div className="stat-number">{stats.totalUsers}</div>
                  <div className="stat-subtitle">Active: {stats.activeUsers}</div>
                </div>
                <div className="stat-card">
                  <h3>PENDING REPORTS</h3>
                  <div className="stat-number warning">{stats.pendingReports}</div>
                  <div className="stat-subtitle">Requires attention</div>
                </div>
                <div className="stat-card">
                  <h3>PENDING FANARTS</h3>
                  <div className="stat-number warning">{stats.pendingFanarts}</div>
                  <div className="stat-subtitle">Awaiting review</div>
                </div>
                <div className="stat-card">
                  <h3>ACTIVE TRADES</h3>
                  <div className="stat-number">{stats.activeTrades}</div>
                  <div className="stat-subtitle">Currently active</div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>RECENT ADMIN ACTIVITY</h3>
                <div className="activity-list">
                  {adminLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="activity-item">
                      <span className="activity-time">[{log.timestamp}]</span>
                      <span className="activity-action">{log.action}</span>
                      <span className="activity-target">→ {log.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <h3>USER MANAGEMENT</h3>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>USERNAME</th>
                      <th>EMAIL</th>
                      <th>ROLE</th>
                      <th>JOIN DATE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <select
                            value={user.role}
                            onChange={(e) => handleUserRoleChange(user.id, e.target.value as User['role'])}
                            className="role-select"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>{user.joinDate}</td>
                        <td>
                          <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                            {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleUserStatusToggle(user.id)}
                            className={`action-btn ${user.isActive ? 'danger' : 'success'}`}
                          >
                            {user.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <h3>REPORTED CONTENT</h3>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>TITLE</th>
                      <th>AUTHOR</th>
                      <th>REASON</th>
                      <th>DATE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map(report => (
                      <tr key={report.id}>
                        <td>
                          <span className={`type-badge ${report.type}`}>
                            {report.type.toUpperCase()}
                          </span>
                        </td>
                        <td>{report.title}</td>
                        <td>{report.author}</td>
                        <td>{report.reportReason}</td>
                        <td>{report.reportDate}</td>
                        <td>
                          <span className={`status-badge ${report.status}`}>
                            {report.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleContentAction(report.id, 'approve')}
                              className="action-btn success"
                              disabled={report.status === 'resolved'}
                            >
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleContentAction(report.id, 'reject')}
                              className="action-btn warning"
                              disabled={report.status === 'resolved'}
                            >
                              REJECT
                            </button>
                            <button
                              onClick={() => handleContentAction(report.id, 'delete')}
                              className="action-btn danger"
                              disabled={report.status === 'resolved'}
                            >
                              DELETE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'fanarts' && (
            <div className="fanarts-section">
              <h3>FANART MODERATION</h3>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>TITLE</th>
                      <th>ARTIST</th>
                      <th>UPLOAD DATE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fanarts.map(fanart => (
                      <tr key={fanart.id}>
                        <td>{fanart.title}</td>
                        <td>{fanart.artist}</td>
                        <td>{fanart.uploadDate}</td>
                        <td>
                          <span className={`status-badge ${fanart.status}`}>
                            {fanart.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleFanartAction(fanart.id, 'approve')}
                              className="action-btn success"
                              disabled={fanart.status !== 'pending'}
                            >
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleFanartAction(fanart.id, 'reject')}
                              className="action-btn danger"
                              disabled={fanart.status !== 'pending'}
                            >
                              REJECT
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'trades' && (
            <div className="trades-section">
              <h3>TRADE OFFER MANAGEMENT</h3>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>TITLE</th>
                      <th>USER</th>
                      <th>OFFER</th>
                      <th>WANT</th>
                      <th>DATE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeOffers.map(trade => (
                      <tr key={trade.id}>
                        <td>{trade.title}</td>
                        <td>{trade.user}</td>
                        <td>{trade.offer}</td>
                        <td>{trade.want}</td>
                        <td>{trade.date}</td>
                        <td>
                          <span className={`status-badge ${trade.status}`}>
                            {trade.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleTradeAction(trade.id, 'approve')}
                              className="action-btn success"
                              disabled={trade.status !== 'active'}
                            >
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleTradeAction(trade.id, 'cancel')}
                              className="action-btn danger"
                              disabled={trade.status === 'cancelled'}
                            >
                              CANCEL
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="logs-section">
              <h3>ADMINISTRATIVE LOGS</h3>
              <div className="logs-container">
                {adminLogs.map(log => (
                  <div key={log.id} className="log-entry">
                    <div className="log-header">
                      <span className="log-timestamp">[{log.timestamp}]</span>
                      <span className="log-admin">{log.admin}</span>
                      <span className="log-action">{log.action}</span>
                    </div>
                    <div className="log-target">Target: {log.target}</div>
                    <div className="log-details">{log.details}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelScreen;