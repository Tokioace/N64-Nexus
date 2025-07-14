const SecurityDatabase = require('../database/SecurityDatabase');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class SecurityService {
    constructor() {
        this.db = new SecurityDatabase();
    }

    async initialize() {
        await this.db.initialize();
    }

    // Security Settings Management
    async getUserSecuritySettings(userId) {
        try {
            let security = await this.db.getUserSecurity(userId);
            
            if (!security) {
                // Create default security settings
                await this.db.createUserSecurity(userId);
                security = await this.db.getUserSecurity(userId);
            }
            
            return security;
        } catch (error) {
            console.error('Error getting user security settings:', error);
            throw error;
        }
    }

    async updateUserSecuritySettings(userId, settings) {
        try {
            const existing = await this.db.getUserSecurity(userId);
            
            if (!existing) {
                await this.db.createUserSecurity(userId, settings);
            } else {
                await this.db.updateUserSecurity(userId, settings);
            }
            
            return await this.db.getUserSecurity(userId);
        } catch (error) {
            console.error('Error updating user security settings:', error);
            throw error;
        }
    }

    // Privacy Settings Management
    async getUserPrivacySettings(userId) {
        try {
            let privacy = await this.db.getUserPrivacy(userId);
            
            if (!privacy) {
                // Create default privacy settings
                await this.db.createUserPrivacy(userId);
                privacy = await this.db.getUserPrivacy(userId);
            }
            
            return privacy;
        } catch (error) {
            console.error('Error getting user privacy settings:', error);
            throw error;
        }
    }

    async updateUserPrivacySettings(userId, settings) {
        try {
            const existing = await this.db.getUserPrivacy(userId);
            
            if (!existing) {
                await this.db.createUserPrivacy(userId, settings);
            } else {
                await this.db.updateUserPrivacy(userId, settings);
            }
            
            return await this.db.getUserPrivacy(userId);
        } catch (error) {
            console.error('Error updating user privacy settings:', error);
            throw error;
        }
    }

    // Security Questions
    async setupSecurityQuestions(userId, questions) {
        try {
            // Hash the answers for security
            const hashedQuestions = questions.map(q => ({
                question: q.question,
                answer_hash: this.hashAnswer(q.answer)
            }));
            
            await this.db.saveSecurityQuestions(userId, hashedQuestions);
            return true;
        } catch (error) {
            console.error('Error setting up security questions:', error);
            throw error;
        }
    }

    async verifySecurityQuestions(userId, answers) {
        try {
            const storedQuestions = await this.db.getSecurityQuestions(userId);
            
            if (storedQuestions.length === 0) {
                return false;
            }
            
            // Check if all answers match
            for (let i = 0; i < answers.length && i < storedQuestions.length; i++) {
                const hashedAnswer = this.hashAnswer(answers[i]);
                if (hashedAnswer !== storedQuestions[i].answer_hash) {
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error verifying security questions:', error);
            throw error;
        }
    }

    hashAnswer(answer) {
        return crypto.createHash('sha256').update(answer.toLowerCase().trim()).digest('hex');
    }

    // Login History
    async addLoginAttempt(userId, loginData) {
        try {
            await this.db.addLoginHistory(userId, loginData);
        } catch (error) {
            console.error('Error adding login attempt:', error);
            throw error;
        }
    }

    async getLoginHistory(userId, limit = 50) {
        try {
            return await this.db.getLoginHistory(userId, limit);
        } catch (error) {
            console.error('Error getting login history:', error);
            throw error;
        }
    }

    // Session Management
    async createSession(userId, sessionData) {
        try {
            const sessionToken = crypto.randomBytes(32).toString('hex');
            await this.db.addActiveSession(userId, {
                ...sessionData,
                session_token: sessionToken
            });
            return sessionToken;
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    async getActiveSessions(userId) {
        try {
            return await this.db.getActiveSessions(userId);
        } catch (error) {
            console.error('Error getting active sessions:', error);
            throw error;
        }
    }

    async terminateSession(sessionToken) {
        try {
            await this.db.terminateSession(sessionToken);
            return true;
        } catch (error) {
            console.error('Error terminating session:', error);
            throw error;
        }
    }

    async updateSessionActivity(sessionToken) {
        try {
            await this.db.updateSessionActivity(sessionToken);
        } catch (error) {
            console.error('Error updating session activity:', error);
            throw error;
        }
    }

    // Reporting System
    async createReport(reportData) {
        try {
            const result = await this.db.createReport(reportData);
            return result;
        } catch (error) {
            console.error('Error creating report:', error);
            throw error;
        }
    }

    async getUserReports(userId) {
        try {
            return await this.db.getReports(userId);
        } catch (error) {
            console.error('Error getting user reports:', error);
            throw error;
        }
    }

    // Data Export
    async initiateDataExport(userId) {
        try {
            const result = await this.db.createDataExport(userId);
            return result;
        } catch (error) {
            console.error('Error initiating data export:', error);
            throw error;
        }
    }

    async generateUserDataExport(userId) {
        try {
            // Get all user data
            const security = await this.getUserSecuritySettings(userId);
            const privacy = await this.getUserPrivacySettings(userId);
            const loginHistory = await this.getLoginHistory(userId);
            const reports = await this.getUserReports(userId);
            const privacyContacts = await this.getPrivacyContacts(userId);
            
            const userData = {
                export_date: new Date().toISOString(),
                user_id: userId,
                security_settings: security,
                privacy_settings: privacy,
                login_history: loginHistory,
                reports: reports,
                privacy_contacts: privacyContacts
            };
            
            // Create export directory if it doesn't exist
            const exportDir = path.join(__dirname, '../../exports');
            await fs.mkdir(exportDir, { recursive: true });
            
            // Generate filename
            const filename = `user_data_${userId}_${Date.now()}.json`;
            const filepath = path.join(exportDir, filename);
            
            // Write data to file
            await fs.writeFile(filepath, JSON.stringify(userData, null, 2));
            
            return { filename, filepath };
        } catch (error) {
            console.error('Error generating user data export:', error);
            throw error;
        }
    }

    async getDataExport(exportToken) {
        try {
            return await this.db.getDataExport(exportToken);
        } catch (error) {
            console.error('Error getting data export:', error);
            throw error;
        }
    }

    async updateDataExportStatus(exportToken, status, filePath = null) {
        try {
            await this.db.updateDataExportStatus(exportToken, status, filePath);
        } catch (error) {
            console.error('Error updating data export status:', error);
            throw error;
        }
    }

    // Account Deletion
    async initiateAccountDeletion(userId, reason) {
        try {
            const result = await this.db.createDeletionRequest(userId, reason);
            return result;
        } catch (error) {
            console.error('Error initiating account deletion:', error);
            throw error;
        }
    }

    async confirmAccountDeletion(confirmationToken) {
        try {
            await this.db.confirmDeletion(confirmationToken);
            return true;
        } catch (error) {
            console.error('Error confirming account deletion:', error);
            throw error;
        }
    }

    async getDeletionRequest(confirmationToken) {
        try {
            return await this.db.getDeletionRequest(confirmationToken);
        } catch (error) {
            console.error('Error getting deletion request:', error);
            throw error;
        }
    }

    // Privacy Contacts
    async createPrivacyContact(contactData) {
        try {
            const result = await this.db.createPrivacyContact(contactData);
            return result;
        } catch (error) {
            console.error('Error creating privacy contact:', error);
            throw error;
        }
    }

    async getPrivacyContacts(userId) {
        try {
            return await this.db.getPrivacyContacts(userId);
        } catch (error) {
            console.error('Error getting privacy contacts:', error);
            throw error;
        }
    }

    // Security Scan
    async performSecurityScan(userId) {
        try {
            const security = await this.getUserSecuritySettings(userId);
            const privacy = await this.getUserPrivacySettings(userId);
            
            const scanResults = {
                score: 100,
                issues: [],
                recommendations: [],
                timestamp: new Date().toISOString()
            };
            
            // Check 2FA
            if (!security.two_factor_auth) {
                scanResults.score -= 20;
                scanResults.issues.push('Zwei-Faktor-Authentifizierung ist deaktiviert');
                scanResults.recommendations.push('Aktivieren Sie 2FA für zusätzlichen Schutz');
            }
            
            // Check auto-logout
            if (security.auto_logout_minutes === 0) {
                scanResults.score -= 15;
                scanResults.issues.push('Auto-Logout ist deaktiviert');
                scanResults.recommendations.push('Aktivieren Sie Auto-Logout für bessere Sicherheit');
            }
            
            // Check profile visibility
            if (privacy.profile_visibility === 'public') {
                scanResults.score -= 10;
                scanResults.issues.push('Profil ist öffentlich sichtbar');
                scanResults.recommendations.push('Erwägen Sie, das Profil auf "Nur Freunde" zu setzen');
            }
            
            // Check content filter
            if (!security.content_filter) {
                scanResults.score -= 5;
                scanResults.recommendations.push('Aktivieren Sie Inhaltsfilterung für besseren Schutz');
            }
            
            // Ensure score doesn't go below 0
            scanResults.score = Math.max(0, scanResults.score);
            
            return scanResults;
        } catch (error) {
            console.error('Error performing security scan:', error);
            throw error;
        }
    }

    // Generate Security Report
    async generateSecurityReport(userId) {
        try {
            const security = await this.getUserSecuritySettings(userId);
            const privacy = await this.getUserPrivacySettings(userId);
            const scanResults = await this.performSecurityScan(userId);
            const loginHistory = await this.getLoginHistory(userId, 10);
            
            const report = {
                generated_at: new Date().toISOString(),
                user_id: userId,
                security_score: scanResults.score,
                security_settings: {
                    two_factor_auth: security.two_factor_auth,
                    two_factor_method: security.two_factor_method,
                    auto_logout_minutes: security.auto_logout_minutes,
                    secure_trading: security.secure_trading,
                    email_notifications: security.email_notifications,
                    sms_notifications: security.sms_notifications,
                    content_filter: security.content_filter,
                    time_limit_minutes: security.time_limit_minutes
                },
                privacy_settings: {
                    profile_visibility: privacy.profile_visibility,
                    fanart_visibility: privacy.fanart_visibility,
                    collection_visibility: privacy.collection_visibility,
                    highscores_visibility: privacy.highscores_visibility,
                    searchable_profile: privacy.searchable_profile,
                    matchmaking_data: privacy.matchmaking_data,
                    community_stats: privacy.community_stats
                },
                recent_login_activity: loginHistory,
                security_issues: scanResults.issues,
                recommendations: scanResults.recommendations
            };
            
            return report;
        } catch (error) {
            console.error('Error generating security report:', error);
            throw error;
        }
    }

    // Utility Methods
    async close() {
        await this.db.close();
    }
}

module.exports = SecurityService;