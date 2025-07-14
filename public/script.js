// Battle64 Security & Privacy Center - JavaScript

class SecurityPrivacyCenter {
    constructor() {
        this.currentUser = null;
        this.settings = {};
        this.init();
    }

    init() {
        this.updateTime();
        this.setupEventListeners();
        this.loadUserSettings();
        this.setupToggleListeners();
        
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('de-DE');
        document.getElementById('currentTime').textContent = timeString;
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Terminal controls
        document.querySelectorAll('.control').forEach(control => {
            control.addEventListener('click', (e) => {
                this.handleTerminalControl(e.target.textContent);
            });
        });
    }

    setupToggleListeners() {
        // Setup toggle switch listeners
        const toggles = document.querySelectorAll('.toggle input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.updateToggleStatus(e.target);
            });
        });
    }

    updateToggleStatus(toggle) {
        const statusElement = toggle.parentElement.nextElementSibling;
        if (toggle.checked) {
            statusElement.textContent = 'Aktiviert';
            statusElement.className = 'status success';
        } else {
            statusElement.textContent = 'Deaktiviert';
            statusElement.className = 'status';
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    handleTerminalControl(control) {
        switch(control) {
            case '[X]':
                this.showModal('Beenden', 'Möchten Sie das Sicherheitscenter wirklich beenden?', () => {
                    window.close();
                });
                break;
            case '[_]':
                // Minimize effect
                document.querySelector('.terminal-container').style.transform = 'scale(0.8)';
                setTimeout(() => {
                    document.querySelector('.terminal-container').style.transform = 'scale(1)';
                }, 200);
                break;
            case '[□]':
                // Maximize effect
                document.querySelector('.terminal-container').style.transform = 'scale(1.1)';
                setTimeout(() => {
                    document.querySelector('.terminal-container').style.transform = 'scale(1)';
                }, 200);
                break;
        }
    }

    startCenter() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('mainInterface').style.display = 'flex';
        this.updateStatus('Sicherheitscenter gestartet');
    }

    updateStatus(message) {
        document.querySelector('.status-line').textContent = message;
    }

    // Security Functions
    setupSecurityQuestions() {
        const questions = [
            'Wie hieß Ihr erstes Haustier?',
            'In welcher Stadt sind Sie geboren?',
            'Wie hieß Ihre erste Schule?',
            'Was ist Ihr Lieblingsfilm?',
            'Wie hieß Ihr erster Lehrer?'
        ];

        let html = '<h3>Sicherheitsfragen einrichten</h3>';
        html += '<p>Wählen Sie drei Fragen und geben Sie Ihre Antworten ein:</p>';
        
        for (let i = 0; i < 3; i++) {
            html += `<div style="margin: 15px 0;">
                <select class="retro-select" id="question${i}">
                    ${questions.map(q => `<option value="${q}">${q}</option>`).join('')}
                </select>
                <input type="text" class="retro-input" id="answer${i}" placeholder="Ihre Antwort" style="margin-top: 5px;">
            </div>`;
        }
        
        html += '<button class="retro-btn" onclick="securityCenter.saveSecurityQuestions()">Speichern</button>';
        
        this.showModal('Sicherheitsfragen einrichten', html);
    }

    saveSecurityQuestions() {
        const questions = [];
        for (let i = 0; i < 3; i++) {
            const question = document.getElementById(`question${i}`).value;
            const answer = document.getElementById(`answer${i}`).value;
            if (answer.trim()) {
                questions.push({ question, answer: answer.toLowerCase() });
            }
        }
        
        if (questions.length === 3) {
            this.settings.securityQuestions = questions;
            this.closeModal();
            this.updateStatus('Sicherheitsfragen gespeichert');
            this.showNotification('Sicherheitsfragen erfolgreich eingerichtet', 'success');
        } else {
            this.showNotification('Bitte beantworten Sie alle drei Fragen', 'error');
        }
    }

    showLoginHistory() {
        const mockHistory = [
            { date: '2024-01-15 14:30', location: 'Berlin, Deutschland', device: 'Chrome - Windows', status: 'Erfolgreich' },
            { date: '2024-01-14 09:15', location: 'München, Deutschland', device: 'Safari - iPhone', status: 'Erfolgreich' },
            { date: '2024-01-13 22:45', location: 'Hamburg, Deutschland', device: 'Firefox - Mac', status: 'Erfolgreich' },
            { date: '2024-01-12 16:20', location: 'Unbekannt', device: 'Unbekannt', status: 'Fehlgeschlagen' }
        ];

        let html = '<h3>Login-Verlauf</h3>';
        html += '<div style="max-height: 300px; overflow-y: auto;">';
        mockHistory.forEach(login => {
            const statusClass = login.status === 'Erfolgreich' ? 'success' : 'error';
            html += `<div style="border: 1px solid #003300; padding: 10px; margin: 5px 0; background: rgba(0,17,0,0.2);">
                <div><strong>Datum:</strong> ${login.date}</div>
                <div><strong>Standort:</strong> ${login.location}</div>
                <div><strong>Gerät:</strong> ${login.device}</div>
                <div class="${statusClass}"><strong>Status:</strong> ${login.status}</div>
            </div>`;
        });
        html += '</div>';
        
        this.showModal('Login-Verlauf', html);
    }

    manageDevices() {
        const mockDevices = [
            { name: 'Chrome - Windows', location: 'Berlin, Deutschland', lastActive: '2024-01-15 14:30', current: true },
            { name: 'Safari - iPhone', location: 'München, Deutschland', lastActive: '2024-01-14 09:15', current: false },
            { name: 'Firefox - Mac', location: 'Hamburg, Deutschland', lastActive: '2024-01-13 22:45', current: false }
        ];

        let html = '<h3>Aktive Geräte</h3>';
        html += '<div style="max-height: 300px; overflow-y: auto;">';
        mockDevices.forEach(device => {
            const currentBadge = device.current ? '<span class="success">[AKTUELL]</span>' : '';
            html += `<div style="border: 1px solid #003300; padding: 10px; margin: 5px 0; background: rgba(0,17,0,0.2);">
                <div><strong>${device.name}</strong> ${currentBadge}</div>
                <div>Standort: ${device.location}</div>
                <div>Letzte Aktivität: ${device.lastActive}</div>
                ${!device.current ? '<button class="retro-btn small danger" onclick="securityCenter.terminateDevice(\'' + device.name + '\')">Beenden</button>' : ''}
            </div>`;
        });
        html += '</div>';
        
        this.showModal('Geräteverwaltung', html);
    }

    terminateDevice(deviceName) {
        this.showNotification(`Gerät "${deviceName}" wurde abgemeldet`, 'success');
        this.closeModal();
        this.updateStatus('Gerät abgemeldet');
    }

    reportSystem() {
        let html = '<h3>Verdächtigen Inhalt melden</h3>';
        html += '<p>Wählen Sie den Typ der Meldung:</p>';
        html += '<select class="retro-select" id="reportType">';
        html += '<option value="profile">Verdächtiges Profil</option>';
        html += '<option value="content">Unangemessener Inhalt</option>';
        html += '<option value="spam">Spam</option>';
        html += '<option value="harassment">Belästigung</option>';
        html += '<option value="other">Sonstiges</option>';
        html += '</select>';
        html += '<textarea class="retro-textarea" id="reportDescription" placeholder="Beschreiben Sie das Problem..." rows="4"></textarea>';
        html += '<button class="retro-btn" onclick="securityCenter.submitReport()">Meldung senden</button>';
        
        this.showModal('Inhalt melden', html);
    }

    submitReport() {
        const type = document.getElementById('reportType').value;
        const description = document.getElementById('reportDescription').value;
        
        if (description.trim()) {
            this.closeModal();
            this.showNotification('Meldung erfolgreich gesendet. Wir werden das Problem überprüfen.', 'success');
            this.updateStatus('Meldung gesendet');
        } else {
            this.showNotification('Bitte geben Sie eine Beschreibung ein', 'error');
        }
    }

    parentalControls() {
        let html = '<h3>Elternbereich einrichten</h3>';
        html += '<p>Richten Sie ein Passwort für den Elternbereich ein:</p>';
        html += '<input type="password" class="retro-input" id="parentPassword" placeholder="Eltern-Passwort">';
        html += '<input type="password" class="retro-input" id="parentPasswordConfirm" placeholder="Passwort bestätigen">';
        html += '<button class="retro-btn" onclick="securityCenter.saveParentalControls()">Speichern</button>';
        
        this.showModal('Elternbereich', html);
    }

    saveParentalControls() {
        const password = document.getElementById('parentPassword').value;
        const confirm = document.getElementById('parentPasswordConfirm').value;
        
        if (password && password === confirm) {
            this.settings.parentalPassword = password;
            this.closeModal();
            this.showNotification('Elternbereich erfolgreich eingerichtet', 'success');
            this.updateStatus('Elternbereich aktiviert');
        } else {
            this.showNotification('Passwörter stimmen nicht überein', 'error');
        }
    }

    // Privacy Functions
    downloadData() {
        this.showModal('Daten-Download', `
            <h3>Persönliche Daten herunterladen</h3>
            <p>Ihre Daten werden vorbereitet...</p>
            <div class="loading">Lade...</div>
            <p>Dies kann einige Minuten dauern.</p>
        `);
        
        // Simulate download process
        setTimeout(() => {
            this.closeModal();
            this.showNotification('Daten-Download gestartet. Sie erhalten eine E-Mail mit dem Download-Link.', 'success');
            this.updateStatus('Download vorbereitet');
        }, 3000);
    }

    deleteAccount() {
        this.showModal('Account löschen', `
            <h3 class="error">⚠️ WARNUNG: Account-Löschung</h3>
            <p>Diese Aktion ist <strong>unwiderruflich</strong>!</p>
            <p>Alle Ihre Daten werden permanent gelöscht:</p>
            <ul>
                <li>Profil und Einstellungen</li>
                <li>Spielstand und Highscores</li>
                <li>Fanart und Sammlung</li>
                <li>Chat-Verlauf</li>
                <li>Alle anderen Daten</li>
            </ul>
            <p>Geben Sie "LÖSCHEN" ein, um zu bestätigen:</p>
            <input type="text" class="retro-input" id="deleteConfirm" placeholder="LÖSCHEN eingeben">
            <button class="retro-btn danger" onclick="securityCenter.confirmDeleteAccount()">Account unwiderruflich löschen</button>
        `);
    }

    confirmDeleteAccount() {
        const confirm = document.getElementById('deleteConfirm').value;
        if (confirm === 'LÖSCHEN') {
            this.closeModal();
            this.showNotification('Account wird gelöscht...', 'warning');
            this.updateStatus('Account-Löschung eingeleitet');
            
            // Simulate account deletion
            setTimeout(() => {
                this.showNotification('Account erfolgreich gelöscht', 'success');
                this.updateStatus('Account gelöscht');
            }, 2000);
        } else {
            this.showNotification('Bitte geben Sie "LÖSCHEN" ein', 'error');
        }
    }

    showPrivacyPolicy() {
        const policy = `
            <h3>Datenschutzerklärung Battle64</h3>
            <div style="max-height: 400px; overflow-y: auto;">
                <h4>1. Welche Daten sammeln wir?</h4>
                <p>Wir sammeln nur die Daten, die für den Betrieb von Battle64 notwendig sind:</p>
                <ul>
                    <li>Profilinformationen (Benutzername, E-Mail)</li>
                    <li>Spielstand und Highscores</li>
                    <li>Chat-Nachrichten (nur während der Sitzung)</li>
                    <li>Technische Daten (IP-Adresse, Browser-Info)</li>
                </ul>
                
                <h4>2. Wie verwenden wir Ihre Daten?</h4>
                <p>Ihre Daten werden verwendet für:</p>
                <ul>
                    <li>Bereitstellung der Battle64-Services</li>
                    <li>Matchmaking und Spielvorschläge</li>
                    <li>Community-Statistiken (anonym)</li>
                    <li>Sicherheit und Betrugsbekämpfung</li>
                </ul>
                
                <h4>3. Ihre Rechte</h4>
                <p>Sie haben das Recht auf:</p>
                <ul>
                    <li>Auskunft über Ihre gespeicherten Daten</li>
                    <li>Berichtigung falscher Daten</li>
                    <li>Löschung Ihrer Daten</li>
                    <li>Einschränkung der Datenverarbeitung</li>
                    <li>Datenübertragbarkeit</li>
                </ul>
                
                <h4>4. Kontakt</h4>
                <p>Bei Fragen zum Datenschutz kontaktieren Sie uns:</p>
                <p>E-Mail: datenschutz@battle64.com</p>
                <p>Telefon: +49 30 12345678</p>
            </div>
        `;
        
        this.showModal('Datenschutzerklärung', policy);
    }

    showMyRights() {
        const rights = `
            <h3>Ihre DSGVO-Rechte</h3>
            <div style="max-height: 400px; overflow-y: auto;">
                <h4>🔍 Auskunftsrecht</h4>
                <p>Sie können jederzeit erfahren, welche Daten wir über Sie speichern.</p>
                
                <h4>✏️ Berichtigungsrecht</h4>
                <p>Falsche oder unvollständige Daten können Sie korrigieren lassen.</p>
                
                <h4>🗑️ Löschungsrecht</h4>
                <p>Sie können die Löschung Ihrer Daten verlangen ("Recht auf Vergessenwerden").</p>
                
                <h4>⏸️ Einschränkungsrecht</h4>
                <p>Sie können die Verarbeitung Ihrer Daten einschränken lassen.</p>
                
                <h4>📤 Datenübertragbarkeit</h4>
                <p>Sie können Ihre Daten in einem strukturierten Format erhalten.</p>
                
                <h4>🚫 Widerspruchsrecht</h4>
                <p>Sie können der Datenverarbeitung widersprechen.</p>
                
                <h4>🤖 Automatisierte Entscheidungen</h4>
                <p>Sie haben das Recht auf menschliche Überprüfung automatischer Entscheidungen.</p>
                
                <h4>📞 Beschwerderecht</h4>
                <p>Sie können sich bei der Datenschutzbehörde beschweren.</p>
            </div>
        `;
        
        this.showModal('Meine DSGVO-Rechte', rights);
    }

    contactPrivacy() {
        const contact = `
            <h3>Kontakt Datenschutzbeauftragter</h3>
            <p>Unser Datenschutzbeauftragter steht Ihnen gerne zur Verfügung:</p>
            
            <div style="border: 1px solid #003300; padding: 15px; margin: 15px 0; background: rgba(0,17,0,0.2);">
                <h4>📧 E-Mail</h4>
                <p>datenschutz@battle64.com</p>
                <p>Antwort innerhalb von 24 Stunden</p>
            </div>
            
            <div style="border: 1px solid #003300; padding: 15px; margin: 15px 0; background: rgba(0,17,0,0.2);">
                <h4>📞 Telefon</h4>
                <p>+49 30 12345678</p>
                <p>Mo-Fr 9:00-17:00 Uhr</p>
            </div>
            
            <div style="border: 1px solid #003300; padding: 15px; margin: 15px 0; background: rgba(0,17,0,0.2);">
                <h4>📮 Post</h4>
                <p>Battle64 GmbH<br>
                Datenschutzbeauftragter<br>
                Musterstraße 123<br>
                10115 Berlin</p>
            </div>
            
            <button class="retro-btn" onclick="securityCenter.sendPrivacyContact()">Kontaktanfrage senden</button>
        `;
        
        this.showModal('Kontakt Datenschutz', contact);
    }

    sendPrivacyContact() {
        this.closeModal();
        this.showNotification('Kontaktanfrage gesendet. Sie erhalten innerhalb von 24 Stunden eine Antwort.', 'success');
        this.updateStatus('Kontaktanfrage gesendet');
    }

    // Action Bar Functions
    securityScan() {
        this.showModal('Sicherheits-Scan', `
            <h3>🔍 Sicherheits-Scan läuft...</h3>
            <div class="loading">Scanne System...</div>
            <p>Überprüfe alle Sicherheitseinstellungen...</p>
        `);
        
        // Simulate security scan
        setTimeout(() => {
            const results = this.performSecurityScan();
            this.showSecurityScanResults(results);
        }, 3000);
    }

    performSecurityScan() {
        const results = {
            score: 85,
            issues: [],
            recommendations: []
        };

        // Check 2FA
        if (!document.getElementById('twoFactorAuth').checked) {
            results.issues.push('Zwei-Faktor-Authentifizierung ist deaktiviert');
            results.recommendations.push('Aktivieren Sie 2FA für zusätzlichen Schutz');
        }

        // Check auto-logout
        const autoLogout = document.getElementById('autoLogout').value;
        if (autoLogout === '0') {
            results.issues.push('Auto-Logout ist deaktiviert');
            results.recommendations.push('Aktivieren Sie Auto-Logout für bessere Sicherheit');
        }

        // Check profile visibility
        const profileVisibility = document.getElementById('profileVisibility').value;
        if (profileVisibility === 'public') {
            results.issues.push('Profil ist öffentlich sichtbar');
            results.recommendations.push('Erwägen Sie, das Profil auf "Nur Freunde" zu setzen');
        }

        return results;
    }

    showSecurityScanResults(results) {
        let html = `<h3>🔍 Sicherheits-Scan abgeschlossen</h3>`;
        html += `<div style="text-align: center; margin: 20px 0;">
            <div style="font-size: 3em; color: ${results.score >= 80 ? '#00ff00' : results.score >= 60 ? '#ffff00' : '#ff0000'};">${results.score}%</div>
            <p>Sicherheits-Score</p>
        </div>`;
        
        if (results.issues.length > 0) {
            html += `<h4>⚠️ Gefundene Probleme:</h4><ul>`;
            results.issues.forEach(issue => {
                html += `<li>${issue}</li>`;
            });
            html += `</ul>`;
        }
        
        if (results.recommendations.length > 0) {
            html += `<h4>💡 Empfehlungen:</h4><ul>`;
            results.recommendations.forEach(rec => {
                html += `<li>${rec}</li>`;
            });
            html += `</ul>`;
        }
        
        if (results.issues.length === 0) {
            html += `<p class="success">🎉 Ihr Konto ist gut geschützt!</p>`;
        }
        
        html += `<button class="retro-btn" onclick="securityCenter.closeModal()">Schließen</button>`;
        
        document.getElementById('modalTitle').textContent = 'Sicherheits-Scan Ergebnisse';
        document.getElementById('modalBody').innerHTML = html;
    }

    exportReport() {
        const report = this.generateSecurityReport();
        
        // Create downloadable file
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `battle64-sicherheitsbericht-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Sicherheitsbericht heruntergeladen', 'success');
        this.updateStatus('Bericht exportiert');
    }

    generateSecurityReport() {
        const now = new Date();
        let report = `BATTLE64 SICHERHEITSBERICHT
Generiert am: ${now.toLocaleString('de-DE')}
===============================================

SICHERHEITSEINSTELLUNGEN:
- 2FA: ${document.getElementById('twoFactorAuth').checked ? 'Aktiviert' : 'Deaktiviert'}
- Auto-Logout: ${document.getElementById('autoLogout').value} Minuten
- Sichere Handelsmechanik: ${document.getElementById('secureTrading').checked ? 'Aktiviert' : 'Deaktiviert'}
- E-Mail Benachrichtigungen: ${document.getElementById('emailNotifications').checked ? 'Aktiviert' : 'Deaktiviert'}

DATENSCHUTZEINSTELLUNGEN:
- Profil-Sichtbarkeit: ${document.getElementById('profileVisibility').value}
- Fanart-Sichtbarkeit: ${document.getElementById('fanartVisibility').value}
- Sammlung-Sichtbarkeit: ${document.getElementById('collectionVisibility').value}
- Highscores-Sichtbarkeit: ${document.getElementById('highscoresVisibility').value}
- Profil auffindbar: ${document.getElementById('searchableProfile').checked ? 'Ja' : 'Nein'}

DATENNUTZUNG:
- Matchmaking-Daten: ${document.getElementById('matchmakingData').checked ? 'Erlaubt' : 'Nicht erlaubt'}
- Community-Statistiken: ${document.getElementById('communityStats').checked ? 'Erlaubt' : 'Nicht erlaubt'}

KINDERSICHERUNG:
- Inhalte filtern: ${document.getElementById('contentFilter').checked ? 'Aktiviert' : 'Deaktiviert'}
- Zeitlimits: ${document.getElementById('timeLimit').value} Minuten

EMPFEHLUNGEN:
- Aktivieren Sie 2FA für maximalen Schutz
- Überprüfen Sie regelmäßig Ihren Login-Verlauf
- Nutzen Sie sichere Passwörter
- Halten Sie Ihre Geräte aktuell

===============================================
Battle64 Sicherheits- & Datenschutzcenter v1.0
        `;
        
        return report;
    }

    saveSettings() {
        // Collect all settings
        const settings = {
            security: {
                twoFactorAuth: document.getElementById('twoFactorAuth').checked,
                autoLogout: document.getElementById('autoLogout').value,
                secureTrading: document.getElementById('secureTrading').checked,
                emailNotifications: document.getElementById('emailNotifications').checked,
                smsNotifications: document.getElementById('smsNotifications').checked,
                contentFilter: document.getElementById('contentFilter').checked,
                timeLimit: document.getElementById('timeLimit').value
            },
            privacy: {
                profileVisibility: document.getElementById('profileVisibility').value,
                fanartVisibility: document.getElementById('fanartVisibility').value,
                collectionVisibility: document.getElementById('collectionVisibility').value,
                highscoresVisibility: document.getElementById('highscoresVisibility').value,
                searchableProfile: document.getElementById('searchableProfile').checked,
                matchmakingData: document.getElementById('matchmakingData').checked,
                communityStats: document.getElementById('communityStats').checked
            },
            timestamp: new Date().toISOString()
        };

        // Save to localStorage (in real app, this would go to server)
        localStorage.setItem('battle64SecuritySettings', JSON.stringify(settings));
        
        this.showNotification('Einstellungen erfolgreich gespeichert', 'success');
        this.updateStatus('Einstellungen gespeichert');
    }

    loadUserSettings() {
        const saved = localStorage.getItem('battle64SecuritySettings');
        if (saved) {
            try {
                this.settings = JSON.parse(saved);
                this.applySettings();
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }

    applySettings() {
        if (this.settings.security) {
            document.getElementById('twoFactorAuth').checked = this.settings.security.twoFactorAuth;
            document.getElementById('autoLogout').value = this.settings.security.autoLogout;
            document.getElementById('secureTrading').checked = this.settings.security.secureTrading;
            document.getElementById('emailNotifications').checked = this.settings.security.emailNotifications;
            document.getElementById('smsNotifications').checked = this.settings.security.smsNotifications;
            document.getElementById('contentFilter').checked = this.settings.security.contentFilter;
            document.getElementById('timeLimit').value = this.settings.security.timeLimit;
        }
        
        if (this.settings.privacy) {
            document.getElementById('profileVisibility').value = this.settings.privacy.profileVisibility;
            document.getElementById('fanartVisibility').value = this.settings.privacy.fanartVisibility;
            document.getElementById('collectionVisibility').value = this.settings.privacy.collectionVisibility;
            document.getElementById('highscoresVisibility').value = this.settings.privacy.highscoresVisibility;
            document.getElementById('searchableProfile').checked = this.settings.privacy.searchableProfile;
            document.getElementById('matchmakingData').checked = this.settings.privacy.matchmakingData;
            document.getElementById('communityStats').checked = this.settings.privacy.communityStats;
        }
        
        // Update all toggle statuses
        document.querySelectorAll('.toggle input').forEach(toggle => {
            this.updateToggleStatus(toggle);
        });
    }

    // Modal Functions
    showModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border: 2px solid ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : type === 'warning' ? '#ffff00' : '#00ff00'};
            background: #000;
            color: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : type === 'warning' ? '#ffff00' : '#00ff00'};
            font-family: 'VT323', monospace;
            font-size: 16px;
            z-index: 1001;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the security center
const securityCenter = new SecurityPrivacyCenter();

// Global functions for onclick handlers
function startCenter() { securityCenter.startCenter(); }
function setupSecurityQuestions() { securityCenter.setupSecurityQuestions(); }
function showLoginHistory() { securityCenter.showLoginHistory(); }
function manageDevices() { securityCenter.manageDevices(); }
function reportSystem() { securityCenter.reportSystem(); }
function parentalControls() { securityCenter.parentalControls(); }
function downloadData() { securityCenter.downloadData(); }
function deleteAccount() { securityCenter.deleteAccount(); }
function showPrivacyPolicy() { securityCenter.showPrivacyPolicy(); }
function showMyRights() { securityCenter.showMyRights(); }
function contactPrivacy() { securityCenter.contactPrivacy(); }
function securityScan() { securityCenter.securityScan(); }
function exportReport() { securityCenter.exportReport(); }
function saveSettings() { securityCenter.saveSettings(); }
function closeModal() { securityCenter.closeModal(); }

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);