const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class SecurityDatabase {
    constructor() {
        this.dbPath = path.join(__dirname, '../../data/security.db');
        this.db = null;
    }

    async initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening security database:', err);
                    reject(err);
                } else {
                    console.log('✅ Security database connected');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const tables = [
            // User security settings
            `CREATE TABLE IF NOT EXISTS user_security (
                user_id TEXT PRIMARY KEY,
                two_factor_auth BOOLEAN DEFAULT FALSE,
                two_factor_method TEXT DEFAULT 'app',
                auto_logout_minutes INTEGER DEFAULT 30,
                secure_trading BOOLEAN DEFAULT TRUE,
                email_notifications BOOLEAN DEFAULT TRUE,
                sms_notifications BOOLEAN DEFAULT FALSE,
                content_filter BOOLEAN DEFAULT FALSE,
                time_limit_minutes INTEGER DEFAULT 60,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // User privacy settings
            `CREATE TABLE IF NOT EXISTS user_privacy (
                user_id TEXT PRIMARY KEY,
                profile_visibility TEXT DEFAULT 'friends',
                fanart_visibility TEXT DEFAULT 'friends',
                collection_visibility TEXT DEFAULT 'friends',
                highscores_visibility TEXT DEFAULT 'friends',
                searchable_profile BOOLEAN DEFAULT TRUE,
                matchmaking_data BOOLEAN DEFAULT TRUE,
                community_stats BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Security questions
            `CREATE TABLE IF NOT EXISTS security_questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                question TEXT NOT NULL,
                answer_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user_security(user_id)
            )`,

            // Login history
            `CREATE TABLE IF NOT EXISTS login_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                ip_address TEXT,
                user_agent TEXT,
                location TEXT,
                device_info TEXT,
                status TEXT DEFAULT 'success',
                FOREIGN KEY (user_id) REFERENCES user_security(user_id)
            )`,

            // Active sessions
            `CREATE TABLE IF NOT EXISTS active_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                ip_address TEXT,
                user_agent TEXT,
                location TEXT,
                device_info TEXT,
                last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user_security(user_id)
            )`,

            // Reports
            `CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reporter_id TEXT NOT NULL,
                report_type TEXT NOT NULL,
                target_id TEXT,
                description TEXT,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                resolved_at DATETIME,
                FOREIGN KEY (reporter_id) REFERENCES user_security(user_id)
            )`,

            // Data export requests
            `CREATE TABLE IF NOT EXISTS data_exports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                export_token TEXT UNIQUE NOT NULL,
                status TEXT DEFAULT 'pending',
                file_path TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                completed_at DATETIME,
                expires_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES user_security(user_id)
            )`,

            // Account deletion requests
            `CREATE TABLE IF NOT EXISTS deletion_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                reason TEXT,
                confirmation_token TEXT UNIQUE NOT NULL,
                status TEXT DEFAULT 'pending',
                scheduled_deletion DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user_security(user_id)
            )`,

            // Privacy contacts
            `CREATE TABLE IF NOT EXISTS privacy_contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                contact_type TEXT NOT NULL,
                subject TEXT,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                responded_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES user_security(user_id)
            )`
        ];

        for (const table of tables) {
            await this.run(table);
        }
    }

    // Generic database operations
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // User Security Methods
    async getUserSecurity(userId) {
        return await this.get(
            'SELECT * FROM user_security WHERE user_id = ?',
            [userId]
        );
    }

    async createUserSecurity(userId, settings = {}) {
        const defaultSettings = {
            two_factor_auth: false,
            two_factor_method: 'app',
            auto_logout_minutes: 30,
            secure_trading: true,
            email_notifications: true,
            sms_notifications: false,
            content_filter: false,
            time_limit_minutes: 60
        };

        const finalSettings = { ...defaultSettings, ...settings };
        
        return await this.run(
            `INSERT INTO user_security (
                user_id, two_factor_auth, two_factor_method, auto_logout_minutes,
                secure_trading, email_notifications, sms_notifications,
                content_filter, time_limit_minutes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                finalSettings.two_factor_auth,
                finalSettings.two_factor_method,
                finalSettings.auto_logout_minutes,
                finalSettings.secure_trading,
                finalSettings.email_notifications,
                finalSettings.sms_notifications,
                finalSettings.content_filter,
                finalSettings.time_limit_minutes
            ]
        );
    }

    async updateUserSecurity(userId, settings) {
        const fields = Object.keys(settings).map(key => `${key} = ?`).join(', ');
        const values = Object.values(settings);
        values.push(userId);

        return await this.run(
            `UPDATE user_security SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
            values
        );
    }

    // User Privacy Methods
    async getUserPrivacy(userId) {
        return await this.get(
            'SELECT * FROM user_privacy WHERE user_id = ?',
            [userId]
        );
    }

    async createUserPrivacy(userId, settings = {}) {
        const defaultSettings = {
            profile_visibility: 'friends',
            fanart_visibility: 'friends',
            collection_visibility: 'friends',
            highscores_visibility: 'friends',
            searchable_profile: true,
            matchmaking_data: true,
            community_stats: true
        };

        const finalSettings = { ...defaultSettings, ...settings };
        
        return await this.run(
            `INSERT INTO user_privacy (
                user_id, profile_visibility, fanart_visibility, collection_visibility,
                highscores_visibility, searchable_profile, matchmaking_data, community_stats
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                finalSettings.profile_visibility,
                finalSettings.fanart_visibility,
                finalSettings.collection_visibility,
                finalSettings.highscores_visibility,
                finalSettings.searchable_profile,
                finalSettings.matchmaking_data,
                finalSettings.community_stats
            ]
        );
    }

    async updateUserPrivacy(userId, settings) {
        const fields = Object.keys(settings).map(key => `${key} = ?`).join(', ');
        const values = Object.values(settings);
        values.push(userId);

        return await this.run(
            `UPDATE user_privacy SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
            values
        );
    }

    // Security Questions Methods
    async getSecurityQuestions(userId) {
        return await this.all(
            'SELECT * FROM security_questions WHERE user_id = ?',
            [userId]
        );
    }

    async saveSecurityQuestions(userId, questions) {
        // Delete existing questions
        await this.run('DELETE FROM security_questions WHERE user_id = ?', [userId]);
        
        // Insert new questions
        for (const question of questions) {
            await this.run(
                'INSERT INTO security_questions (user_id, question, answer_hash) VALUES (?, ?, ?)',
                [userId, question.question, question.answer_hash]
            );
        }
    }

    // Login History Methods
    async addLoginHistory(userId, loginData) {
        return await this.run(
            `INSERT INTO login_history (
                user_id, ip_address, user_agent, location, device_info, status
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
                loginData.ip_address,
                loginData.user_agent,
                loginData.location,
                loginData.device_info,
                loginData.status || 'success'
            ]
        );
    }

    async getLoginHistory(userId, limit = 50) {
        return await this.all(
            'SELECT * FROM login_history WHERE user_id = ? ORDER BY login_time DESC LIMIT ?',
            [userId, limit]
        );
    }

    // Active Sessions Methods
    async addActiveSession(userId, sessionData) {
        return await this.run(
            `INSERT INTO active_sessions (
                user_id, session_token, ip_address, user_agent, location, device_info
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
                sessionData.session_token,
                sessionData.ip_address,
                sessionData.user_agent,
                sessionData.location,
                sessionData.device_info
            ]
        );
    }

    async getActiveSessions(userId) {
        return await this.all(
            'SELECT * FROM active_sessions WHERE user_id = ? ORDER BY last_activity DESC',
            [userId]
        );
    }

    async terminateSession(sessionToken) {
        return await this.run(
            'DELETE FROM active_sessions WHERE session_token = ?',
            [sessionToken]
        );
    }

    async updateSessionActivity(sessionToken) {
        return await this.run(
            'UPDATE active_sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_token = ?',
            [sessionToken]
        );
    }

    // Reports Methods
    async createReport(reportData) {
        return await this.run(
            `INSERT INTO reports (
                reporter_id, report_type, target_id, description
            ) VALUES (?, ?, ?, ?)`,
            [
                reportData.reporter_id,
                reportData.report_type,
                reportData.target_id,
                reportData.description
            ]
        );
    }

    async getReports(userId) {
        return await this.all(
            'SELECT * FROM reports WHERE reporter_id = ? ORDER BY created_at DESC',
            [userId]
        );
    }

    // Data Export Methods
    async createDataExport(userId) {
        const exportToken = require('crypto').randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        return await this.run(
            `INSERT INTO data_exports (
                user_id, export_token, expires_at
            ) VALUES (?, ?, ?)`,
            [userId, exportToken, expiresAt.toISOString()]
        );
    }

    async getDataExport(exportToken) {
        return await this.get(
            'SELECT * FROM data_exports WHERE export_token = ? AND expires_at > CURRENT_TIMESTAMP',
            [exportToken]
        );
    }

    async updateDataExportStatus(exportToken, status, filePath = null) {
        const updates = ['status = ?'];
        const values = [status];

        if (filePath) {
            updates.push('file_path = ?');
            values.push(filePath);
        }

        if (status === 'completed') {
            updates.push('completed_at = CURRENT_TIMESTAMP');
        }

        values.push(exportToken);

        return await this.run(
            `UPDATE data_exports SET ${updates.join(', ')} WHERE export_token = ?`,
            values
        );
    }

    // Account Deletion Methods
    async createDeletionRequest(userId, reason) {
        const confirmationToken = require('crypto').randomBytes(32).toString('hex');
        const scheduledDeletion = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        return await this.run(
            `INSERT INTO deletion_requests (
                user_id, reason, confirmation_token, scheduled_deletion
            ) VALUES (?, ?, ?, ?)`,
            [userId, reason, confirmationToken, scheduledDeletion.toISOString()]
        );
    }

    async getDeletionRequest(confirmationToken) {
        return await this.get(
            'SELECT * FROM deletion_requests WHERE confirmation_token = ?',
            [confirmationToken]
        );
    }

    async confirmDeletion(confirmationToken) {
        return await this.run(
            'UPDATE deletion_requests SET status = "confirmed" WHERE confirmation_token = ?',
            [confirmationToken]
        );
    }

    // Privacy Contact Methods
    async createPrivacyContact(contactData) {
        return await this.run(
            `INSERT INTO privacy_contacts (
                user_id, contact_type, subject, message
            ) VALUES (?, ?, ?, ?)`,
            [
                contactData.user_id,
                contactData.contact_type,
                contactData.subject,
                contactData.message
            ]
        );
    }

    async getPrivacyContacts(userId) {
        return await this.all(
            'SELECT * FROM privacy_contacts WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
    }

    // Utility Methods
    async close() {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err);
                    } else {
                        console.log('✅ Security database closed');
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = SecurityDatabase;