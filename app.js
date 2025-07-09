// CloudMatrix Security Platform - Main Application
class CloudMatrixApp {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.currentTheme = 'light';
        this.activeTab = 'dashboard';
        this.charts = {};
        this.securityData = {
            securityScore: {
                current: 785,
                maximum: 1000,
                trend: "+12",
                lastUpdate: "2025-07-03T16:04:00Z"
            },
            threats: {
                blocked: 1247,
                suspicious: 23,
                critical: 3,
                trends: [650, 720, 890, 1100, 1247]
            },
            compliance: {
                nist: { score: 85, status: "compliant" },
                iso27001: { score: 78, status: "in-progress" },
                cisControls: { score: 92, status: "compliant" },
                soc2: { score: 88, status: "compliant" }
            },
            zeroTrust: {
                identity: 85,
                devices: 78,
                data: 82,
                applications: 75,
                infrastructure: 80,
                networks: 73
            },
            incidents: [
                {
                    id: "INC-2025-0703-001",
                    title: "Suspicious login attempts from unusual location",
                    severity: "medium",
                    status: "investigating",
                    time: "2025-07-03T15:45:00Z"
                },
                {
                    id: "INC-2025-0703-002", 
                    title: "Potential malware detected on endpoint",
                    severity: "high",
                    status: "contained",
                    time: "2025-07-03T14:30:00Z"
                }
            ],
            devices: {
                total: 1250,
                compliant: 1187,
                nonCompliant: 45,
                unknown: 18
            },
            users: {
                total: 875,
                mfaEnabled: 832,
                privileged: 23,
                risky: 4
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAuth();
        this.setupTheme();
    }

    setupEventListeners() {
        // Authentication
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // User menu
        document.getElementById('user-menu-btn').addEventListener('click', () => this.toggleUserMenu());
        
        // AI Chat
        document.getElementById('ai-chat-toggle').addEventListener('click', () => this.toggleAIChat());
        document.getElementById('ai-chat-close').addEventListener('click', () => this.closeAIChat());
        document.getElementById('ai-send').addEventListener('click', () => this.sendAIMessage());
        document.getElementById('ai-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendAIMessage();
        });
        
        // Close dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.getElementById('user-dropdown').classList.add('hidden');
            }
        });
    }

    initializeAuth() {
        // Simulate authentication check
        setTimeout(() => {
            this.hideAuthLoading();
            this.showLoginScreen();
        }, 2000);
    }

    hideAuthLoading() {
        document.getElementById('auth-loading').classList.add('hidden');
    }

    showLoginScreen() {
        document.getElementById('login-screen').classList.remove('hidden');
    }

    async login() {
        try {
            // Simulate Microsoft authentication
            document.getElementById('login-btn').disabled = true;
            document.getElementById('login-btn').textContent = 'Signing in...';
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock user data
            this.currentUser = {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@cloudmatrix.com',
                role: 'CISO',
                avatar: '👩‍💼'
            };
            
            this.isAuthenticated = true;
            this.showApp();
            this.updateUserInterface();
            this.initializeCharts();
            this.renderIncidents();
            this.startRealTimeUpdates();
            
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
            document.getElementById('login-btn').disabled = false;
            document.getElementById('login-btn').textContent = 'Sign in with Microsoft';
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.stopRealTimeUpdates();
        this.showLoginScreen();
        document.getElementById('app').classList.add('hidden');
        document.getElementById('login-btn').disabled = false;
        document.getElementById('login-btn').textContent = 'Sign in with Microsoft';
    }

    showApp() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        document.getElementById('app').classList.add('fade-in');
    }

    updateUserInterface() {
        if (this.currentUser) {
            document.getElementById('user-name').textContent = this.currentUser.name;
            document.getElementById('user-email').textContent = this.currentUser.email;
            document.getElementById('user-role').textContent = this.currentUser.role;
            document.querySelector('.user-avatar').textContent = this.currentUser.avatar;
        }
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('nav-tab--active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('nav-tab--active');
        
        // Show tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('tab-content--active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('tab-content--active');
        
        this.activeTab = tabName;
        
        // Initialize charts for specific tabs
        if (tabName === 'threats' && !this.charts.threats) {
            this.initializeThreatsChart();
        }
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        
        // Update charts colors based on theme
        this.updateChartsTheme();
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        dropdown.classList.toggle('hidden');
    }

    toggleAIChat() {
        const aiChat = document.getElementById('ai-chat');
        aiChat.classList.toggle('hidden');
    }

    closeAIChat() {
        document.getElementById('ai-chat').classList.add('hidden');
    }

    sendAIMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessageToChat(message, 'user');
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addMessageToChat(response, 'ai');
        }, 1000);
    }

    addMessageToChat(message, sender) {
        const messagesContainer = document.getElementById('ai-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `ai-message ${sender === 'user' ? 'user-message' : ''}`;
        
        messageElement.innerHTML = `
            <div class="ai-message__avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="ai-message__content">
                <p>${message}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const responses = {
            'security': 'Based on current threat intelligence, your security posture is strong with a score of 785/1000. I recommend focusing on the 3 critical threats currently being investigated.',
            'compliance': 'Your compliance status shows excellent progress: NIST (85%), CIS Controls (92%), and SOC 2 (88%) are all compliant. ISO 27001 is at 78% and in progress.',
            'threats': 'Today we\'ve blocked 1,247 threats with 23 suspicious activities flagged. The 3 critical threats are being actively monitored by our SOC team.',
            'recommendations': 'Key recommendations: 1) Complete MFA rollout for remaining 43 users, 2) Address 45 non-compliant devices, 3) Investigate 4 risky user accounts, 4) Strengthen network security (currently 73% maturity).',
            'zero trust': 'Your Zero Trust maturity assessment shows strong identity (85%) and data protection (82%). Focus areas: Networks (73%) and Applications (75%) need improvement.',
            'incidents': 'Current incidents: 1 high-severity malware detection (contained), 1 medium-severity suspicious login (investigating). Both are being actively managed.',
            'default': 'I can help you with security analysis, threat intelligence, compliance status, and recommendations. What specific area would you like to explore?'
        };
        
        const lowerMessage = userMessage.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }

    initializeCharts() {
        this.initializeSecurityScoreChart();
        this.updateDashboardData();
    }

    initializeSecurityScoreChart() {
        const ctx = document.getElementById('securityScoreChart').getContext('2d');
        
        this.charts.securityScore = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Security Score',
                    data: [720, 735, 750, 765, 773, 779, 785],
                    borderColor: '#21808D',
                    backgroundColor: 'rgba(33, 128, 141, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 650,
                        max: 850,
                        grid: {
                            color: 'rgba(94, 82, 64, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    initializeThreatsChart() {
        const ctx = document.getElementById('threatsChart').getContext('2d');
        
        this.charts.threats = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Threats Blocked',
                    data: [156, 189, 234, 198, 267, 145, 167],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(94, 82, 64, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateChartsTheme() {
        // Update chart colors based on theme
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                const isDark = this.currentTheme === 'dark';
                const gridColor = isDark ? 'rgba(119, 124, 124, 0.2)' : 'rgba(94, 82, 64, 0.1)';
                const textColor = isDark ? 'rgba(245, 245, 245, 1)' : 'rgba(19, 52, 59, 1)';
                
                chart.options.scales.y.grid.color = gridColor;
                chart.options.scales.y.ticks = { color: textColor };
                chart.options.scales.x.ticks = { color: textColor };
                
                chart.update();
            }
        });
    }

    updateDashboardData() {
        // Update security score
        document.getElementById('security-score').textContent = this.securityData.securityScore.current;
        
        // Update threats blocked
        document.getElementById('threats-blocked').textContent = this.securityData.threats.blocked.toLocaleString();
        
        // Update active incidents
        document.getElementById('incidents-active').textContent = this.securityData.threats.critical;
        
        // Update compliance score
        const avgCompliance = Math.round(
            (this.securityData.compliance.nist.score + 
             this.securityData.compliance.iso27001.score + 
             this.securityData.compliance.cisControls.score + 
             this.securityData.compliance.soc2.score) / 4
        );
        document.getElementById('compliance-score').textContent = `${avgCompliance}%`;
    }

    renderIncidents() {
        const incidentsList = document.getElementById('incidents-list');
        incidentsList.innerHTML = '';
        
        this.securityData.incidents.forEach(incident => {
            const incidentElement = document.createElement('div');
            incidentElement.className = 'incident-item';
            incidentElement.innerHTML = `
                <div class="incident-header">
                    <div class="incident-id">${incident.id}</div>
                    <div class="status status--${incident.severity}">${incident.severity.toUpperCase()}</div>
                </div>
                <div class="incident-title">${incident.title}</div>
                <div class="incident-meta">
                    <span>Status: ${incident.status}</span>
                    <span>•</span>
                    <span>${this.formatTime(incident.time)}</span>
                </div>
            `;
            incidentsList.appendChild(incidentElement);
        });
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        this.updateInterval = setInterval(() => {
            this.simulateDataUpdates();
        }, 30000); // Update every 30 seconds
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    simulateDataUpdates() {
        // Simulate small changes in security data
        const oldScore = this.securityData.securityScore.current;
        this.securityData.securityScore.current += Math.floor(Math.random() * 3) - 1; // -1 to 1
        this.securityData.securityScore.current = Math.max(750, Math.min(850, this.securityData.securityScore.current));
        
        const scoreChange = this.securityData.securityScore.current - oldScore;
        this.securityData.securityScore.trend = scoreChange >= 0 ? `+${scoreChange}` : `${scoreChange}`;
        
        // Update threats blocked
        this.securityData.threats.blocked += Math.floor(Math.random() * 5) + 1;
        
        // Update UI
        this.updateDashboardData();
        
        // Update charts
        if (this.charts.securityScore) {
            const newData = [...this.charts.securityScore.data.datasets[0].data];
            newData.push(this.securityData.securityScore.current);
            newData.shift();
            this.charts.securityScore.data.datasets[0].data = newData;
            this.charts.securityScore.update();
        }
    }

    // Utility methods
    formatNumber(num) {
        return num.toLocaleString();
    }

    formatPercent(num) {
        return `${num}%`;
    }

    getSeverityClass(severity) {
        const classes = {
            'critical': 'status--error',
            'high': 'status--warning',
            'medium': 'status--info',
            'low': 'status--success'
        };
        return classes[severity] || 'status--info';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cloudMatrixApp = new CloudMatrixApp();
});

// Handle window resize for charts
window.addEventListener('resize', () => {
    if (window.cloudMatrixApp && window.cloudMatrixApp.charts) {
        Object.values(window.cloudMatrixApp.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudMatrixApp;
}