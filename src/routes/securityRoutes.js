const express = require('express');
const SecurityService = require('../services/SecurityService');
const router = express.Router();

// Initialize security service
const securityService = new SecurityService();

// Middleware to ensure security service is initialized
router.use(async (req, res, next) => {
    if (!securityService.db) {
        try {
            await securityService.initialize();
        } catch (error) {
            console.error('Error initializing security service:', error);
            return res.status(500).json({ error: 'Security service unavailable' });
        }
    }
    next();
});

// Get user security settings
router.get('/settings/security/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const settings = await securityService.getUserSecuritySettings(userId);
        res.json(settings);
    } catch (error) {
        console.error('Error getting security settings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update user security settings
router.put('/settings/security/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const settings = req.body;
        const updatedSettings = await securityService.updateUserSecuritySettings(userId, settings);
        res.json(updatedSettings);
    } catch (error) {
        console.error('Error updating security settings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user privacy settings
router.get('/settings/privacy/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const settings = await securityService.getUserPrivacySettings(userId);
        res.json(settings);
    } catch (error) {
        console.error('Error getting privacy settings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update user privacy settings
router.put('/settings/privacy/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const settings = req.body;
        const updatedSettings = await securityService.updateUserPrivacySettings(userId, settings);
        res.json(updatedSettings);
    } catch (error) {
        console.error('Error updating privacy settings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Setup security questions
router.post('/security-questions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { questions } = req.body;
        
        if (!questions || !Array.isArray(questions) || questions.length !== 3) {
            return res.status(400).json({ error: 'Exactly 3 security questions are required' });
        }
        
        await securityService.setupSecurityQuestions(userId, questions);
        res.json({ success: true, message: 'Security questions set up successfully' });
    } catch (error) {
        console.error('Error setting up security questions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify security questions
router.post('/security-questions/:userId/verify', async (req, res) => {
    try {
        const { userId } = req.params;
        const { answers } = req.body;
        
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Answers are required' });
        }
        
        const isValid = await securityService.verifySecurityQuestions(userId, answers);
        res.json({ valid: isValid });
    } catch (error) {
        console.error('Error verifying security questions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get login history
router.get('/login-history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50 } = req.query;
        const history = await securityService.getLoginHistory(userId, parseInt(limit));
        res.json(history);
    } catch (error) {
        console.error('Error getting login history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add login attempt
router.post('/login-history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const loginData = req.body;
        await securityService.addLoginAttempt(userId, loginData);
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding login attempt:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get active sessions
router.get('/sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sessions = await securityService.getActiveSessions(userId);
        res.json(sessions);
    } catch (error) {
        console.error('Error getting active sessions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new session
router.post('/sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sessionData = req.body;
        const sessionToken = await securityService.createSession(userId, sessionData);
        res.json({ sessionToken });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Terminate session
router.delete('/sessions/:sessionToken', async (req, res) => {
    try {
        const { sessionToken } = req.params;
        await securityService.terminateSession(sessionToken);
        res.json({ success: true });
    } catch (error) {
        console.error('Error terminating session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update session activity
router.put('/sessions/:sessionToken/activity', async (req, res) => {
    try {
        const { sessionToken } = req.params;
        await securityService.updateSessionActivity(sessionToken);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating session activity:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create report
router.post('/reports', async (req, res) => {
    try {
        const reportData = req.body;
        const result = await securityService.createReport(reportData);
        res.json({ success: true, reportId: result.id });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user reports
router.get('/reports/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const reports = await securityService.getUserReports(userId);
        res.json(reports);
    } catch (error) {
        console.error('Error getting user reports:', error);
        res.status(500).json({ error: error.message });
    }
});

// Initiate data export
router.post('/data-export/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await securityService.initiateDataExport(userId);
        res.json({ 
            success: true, 
            exportToken: result.exportToken,
            message: 'Data export initiated. You will receive an email when ready.'
        });
    } catch (error) {
        console.error('Error initiating data export:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get data export status
router.get('/data-export/:exportToken', async (req, res) => {
    try {
        const { exportToken } = req.params;
        const exportData = await securityService.getDataExport(exportToken);
        
        if (!exportData) {
            return res.status(404).json({ error: 'Export not found or expired' });
        }
        
        res.json(exportData);
    } catch (error) {
        console.error('Error getting data export:', error);
        res.status(500).json({ error: error.message });
    }
});

// Download data export (admin only)
router.get('/data-export/:exportToken/download', async (req, res) => {
    try {
        const { exportToken } = req.params;
        const exportData = await securityService.getDataExport(exportToken);
        
        if (!exportData) {
            return res.status(404).json({ error: 'Export not found or expired' });
        }
        
        if (exportData.status !== 'completed') {
            return res.status(400).json({ error: 'Export not ready for download' });
        }
        
        // In a real implementation, you would stream the file
        res.json({ 
            success: true, 
            filePath: exportData.file_path,
            message: 'File ready for download'
        });
    } catch (error) {
        console.error('Error downloading data export:', error);
        res.status(500).json({ error: error.message });
    }
});

// Initiate account deletion
router.post('/account-deletion/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        const result = await securityService.initiateAccountDeletion(userId, reason);
        res.json({ 
            success: true, 
            message: 'Account deletion initiated. Check your email for confirmation.',
            confirmationToken: result.confirmationToken
        });
    } catch (error) {
        console.error('Error initiating account deletion:', error);
        res.status(500).json({ error: error.message });
    }
});

// Confirm account deletion
router.post('/account-deletion/confirm/:confirmationToken', async (req, res) => {
    try {
        const { confirmationToken } = req.params;
        await securityService.confirmAccountDeletion(confirmationToken);
        res.json({ 
            success: true, 
            message: 'Account deletion confirmed. Your account will be deleted in 30 days.'
        });
    } catch (error) {
        console.error('Error confirming account deletion:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get deletion request status
router.get('/account-deletion/:confirmationToken', async (req, res) => {
    try {
        const { confirmationToken } = req.params;
        const deletionRequest = await securityService.getDeletionRequest(confirmationToken);
        
        if (!deletionRequest) {
            return res.status(404).json({ error: 'Deletion request not found' });
        }
        
        res.json(deletionRequest);
    } catch (error) {
        console.error('Error getting deletion request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create privacy contact
router.post('/privacy-contact', async (req, res) => {
    try {
        const contactData = req.body;
        const result = await securityService.createPrivacyContact(contactData);
        res.json({ 
            success: true, 
            contactId: result.id,
            message: 'Privacy contact request submitted successfully'
        });
    } catch (error) {
        console.error('Error creating privacy contact:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get privacy contacts
router.get('/privacy-contact/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const contacts = await securityService.getPrivacyContacts(userId);
        res.json(contacts);
    } catch (error) {
        console.error('Error getting privacy contacts:', error);
        res.status(500).json({ error: error.message });
    }
});

// Perform security scan
router.post('/security-scan/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const scanResults = await securityService.performSecurityScan(userId);
        res.json(scanResults);
    } catch (error) {
        console.error('Error performing security scan:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate security report
router.get('/security-report/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const report = await securityService.generateSecurityReport(userId);
        res.json(report);
    } catch (error) {
        console.error('Error generating security report:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
router.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'Security & Privacy Center',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;