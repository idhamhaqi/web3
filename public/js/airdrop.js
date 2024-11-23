class AirdropManager {
    constructor() {
        // Cek token saat inisialisasi
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/';
            return;
        }
        
        this.setupEventListeners();
        this.checkAirdropStatus();
    }

    setupEventListeners() {
        // Setup event listeners if needed
        const airdropSection = document.getElementById('airdropSection');
        if (airdropSection) {
            // Any click handlers or other events
        }

        // Tambahkan listener untuk wallet disconnect
        if (window.tonConnectUI) {
            window.tonConnectUI.onStatusChange(wallet => {
                if (!wallet) {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/';
                }
            });
        }
    }

    async checkAirdropStatus() {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                window.location.href = '/';
                return;
            }

            const response = await fetch('/api/airdrop/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                window.location.href = '/';
                return;
            }

            if (response.ok) {
                const settings = await response.json();
                this.updateAirdropUI(settings);
                if (settings.is_active) {
                    await this.checkEligibility();
                }
            }
        } catch (error) {
            console.error('Error checking airdrop status:', error);
        }
    }

    async checkEligibility() {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                window.location.href = '/';
                return;
            }

            const response = await fetch('/api/airdrop/eligibility', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                window.location.href = '/';
                return;
            }

            if (response.ok) {
                const data = await response.json();
                this.updateEligibilityUI(data);
            }
        } catch (error) {
            console.error('Error checking eligibility:', error);
        }
    }


    updateAirdropUI(settings) {
        const airdropSection = document.getElementById('airdropSection');
        if (!airdropSection) return;

        if (settings.is_active) {
            airdropSection.classList.remove('hidden');
        } else {
            airdropSection.classList.add('hidden');
        }
    }

    updateEligibilityUI(data) {
        try {
            // Debug log
            console.log('Eligibility data:', data);
    
            // Convert points to number if needed
            const points = Number(data.points) || 0;
            const required = Number(data.required) || 0;
    
            // Update status badge
            const statusBadge = document.getElementById('eligibilityStatus');
            if (statusBadge) {
                statusBadge.className = data.eligible 
                    ? 'px-4 py-1 rounded-full text-sm bg-green-500/20 text-green-500'
                    : 'px-4 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500';
                statusBadge.textContent = data.eligible ? 'Eligible' : 'Not Eligible';
            }
    
            // Update points display
            const pointsDisplay = document.getElementById('airdropTotalPoints');
            if (pointsDisplay) {
                pointsDisplay.textContent = points.toFixed(2);
            }
    
            // Update required points
            const requiredDisplay = document.getElementById('requiredPoints');
            if (requiredDisplay) {
                requiredDisplay.textContent = required.toFixed(2);
            }
    
            // Update progress bar
            const progressBar = document.getElementById('eligibilityProgress');
            if (progressBar) {
                const progress = Math.min((points / required) * 100, 100);
                progressBar.style.width = `${progress}%`;
            }
    
            // Update message
            const message = document.getElementById('eligibilityMessage');
            if (message) {
                if (data.eligible) {
                    message.textContent = 'Congratulations! You are eligible for the Zuxton airdrop.';
                    message.className = 'text-center text-sm text-[#29A5F8]';
                } else {
                    const remaining = (required - points).toFixed(2);
                    message.textContent = `You need ${remaining} more points to become eligible.`;
                    message.className = 'text-center text-sm text-gray-400';
                }
            }
        } catch (error) {
            console.error('Error updating eligibility UI:', error);
        }
    
    }

    // Update status every minute
    startUpdateInterval() {
        setInterval(() => {
            this.checkEligibility();
        }, 60000);
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.airdropManager = new AirdropManager();
});