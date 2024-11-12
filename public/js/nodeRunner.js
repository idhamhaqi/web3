class NodeRunner {
    constructor() {
        this.isRunning = false;
        this.pointsInterval = null;
        this.runtimeInterval = null;
        this.startTime = null;

        // Initialize event listeners first
        this.setupEventListeners();  // Ganti nama method
        this.checkStatus();

        // Day change checker
        setInterval(() => {
            const now = new Date();
            if (this.isRunning && now.getHours() === 0 && now.getMinutes() === 0) {
                this.stopNode();
                this.updateMessage('Node stopped: New day started', 'info');
            }
        }, 60000);
    }

    setupEventListeners() {  // Ganti nama method dari initializeEventListeners ke setupEventListeners
        const runButton = document.getElementById('runNodeBtn');
        const stopButton = document.getElementById('stopNodeBtn');
        
        if (runButton) {
            runButton.addEventListener('click', () => this.startNode());
        }
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopNode());
        }

        // Wallet disconnect listener
        if (window.tonConnectUI) {
            window.tonConnectUI.onStatusChange(wallet => {
                if (!wallet && this.isRunning) {
                    this.stopNode();
                    window.location.href = '/';
                }
            });
        }

        // Internet connection listener
        window.addEventListener('offline', () => {
            if (this.isRunning) {
                this.stopNode();
                this.updateMessage('Node stopped: Internet connection lost', 'error');
            }
        });

        // Browser/tab close listener
        window.addEventListener('beforeunload', (event) => {
            if (this.isRunning) {
                event.preventDefault();
                this.stopNode();
                event.returnValue = '';
            }
        });
    }

    async checkStatus() {
        try {
            const response = await fetch('/node/status', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status && data.status.status === 'running') {
                    this.isRunning = true;
                    this.startTime = new Date(data.status.start_time);
                    this.updateUI(true);
                    this.startPointsCounter();
                    this.startRuntimeCounter();
                }
                if (data.stats) {
                    this.updateStats(data.stats);
                }
            }
        } catch (error) {
            console.error('Error checking status:', error);
        }
    }

    async startNode() {
        try {
            // Show and reset animation container
            const animationSteps = document.getElementById('animation-steps');
            if (animationSteps) {
                animationSteps.innerHTML = `
                    <div id="checking-connection" class="flex items-center space-x-2 mb-3">
                        <span class="text-gray-400">Checking Connection</span>
                    </div>
                    <div id="request-pool" class="flex items-center space-x-2 mb-3 opacity-0">
                        <span class="text-gray-400">Request to Node Pool</span>
                    </div>
                    <div id="smart-contract" class="flex items-center space-x-2 mb-3 opacity-0">
                        <span class="text-gray-400">PoC Contract Execution</span>
                    </div>
                `;
                animationSteps.classList.remove('hidden');
            }

            // Run animation sequence
            await this.showAnimationSteps();

            // Start node after animations
            const response = await fetch('/node/start', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to start node');
            }

            if (data.success) {
                this.isRunning = true;
                this.startTime = new Date();
                this.updateUI(true);
                this.startPointsCounter();
                this.startRuntimeCounter();
                this.updateMessage('Node started successfully', 'success');
                
                // Hide animation steps after success
                setTimeout(() => {
                    if (animationSteps) {
                        animationSteps.classList.add('hidden');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error starting node:', error);
            this.updateMessage(error.message, 'error');
            this.hideAnimationSteps();
        }
    }

    async showAnimationSteps() {
        const steps = [
            { id: 'checking-connection', text: 'Checking Connection' },
            { id: 'request-pool', text: 'Request to Node Pool' },
            { id: 'smart-contract', text: 'PoC Contract Execution' }
        ];

        for (const step of steps) {
            await this.animateStep(step.id);
        }
    }

    async animateStep(stepId) {
        return new Promise(resolve => {
            const stepElement = document.getElementById(stepId);
            if (!stepElement) {
                resolve();
                return;
            }

            // Show current step
            stepElement.classList.remove('opacity-0');
            stepElement.innerHTML = `
                <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-yellow-500/20 animate-pulse rounded-full"></div>
                    <span class="text-gray-400">${stepElement.textContent}</span>
                </div>
            `;

            // After 5 seconds, show checkmark
            setTimeout(() => {
                stepElement.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-green-500">${stepElement.textContent}</span>
                    </div>
                `;
                resolve();
            }, 5000);
        });
    }

    hideAnimationSteps() {
        const animationSteps = document.getElementById('animation-steps');
        if (animationSteps) {
            animationSteps.classList.add('hidden');
            animationSteps.innerHTML = '';
        }
    }

    async stopNode() {
        try {
            // Stop counters first
            this.stopPointsCounter();
            this.stopRuntimeCounter();
    
            const response = await fetch('/node/stop', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            });
    
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to stop node');
            }
    
            if (data.success) {
                this.isRunning = false;
                this.startTime = null;
                this.updateUI(false);
                this.updateMessage('Node stopped successfully', 'success');
                
                // Get final stats after successful stop
                await this.updateNodeStats();
                
                // Reset runtime display
                const runtimeElement = document.getElementById('runningTime');
                if (runtimeElement) {
                    runtimeElement.textContent = '00:00:00';
                }
    
                // Hide any remaining animation steps
                this.hideAnimationSteps();
            }
        } catch (error) {
            console.error('Error stopping node:', error);
            this.updateMessage('Failed to stop node: ' + error.message, 'error');
        }
    }

    startPointsCounter() {
        if (this.pointsInterval) clearInterval(this.pointsInterval);
        
        // Update points every minute
        this.pointsInterval = setInterval(async () => {
            try {
                // Update points first
                const updateResponse = await fetch('/node/update-points', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!updateResponse.ok) {
                    throw new Error('Failed to update points');
                }
    
                // Then get updated stats
                await this.updateNodeStats();
            } catch (error) {
                console.error('Error in points counter:', error);
            }
        }, 60000); // Run every minute
    }

    startRuntimeCounter() {
        if (this.runtimeInterval) clearInterval(this.runtimeInterval);
        const runtimeElement = document.getElementById('runningTime');
        
        if (runtimeElement && this.startTime) {
            this.runtimeInterval = setInterval(() => {
                const now = new Date();
                const diff = now - this.startTime;
                
                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                
                runtimeElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }, 1000);
        }
    }

    async updateNodeStats() {
        try {
            const response = await fetch('/node/status', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.stats) {
                    this.updateStats(data.stats);
                }
            }
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    updateStats(stats) {
        if (!stats) return;
        
        // Update today's stats
        if (stats.today) {
            const todayNodes = document.getElementById('todayNodes');
            const todayPoints = document.getElementById('todayPoints');
            const todayHours = document.getElementById('todayHours');

            if (todayNodes) todayNodes.textContent = stats.today.nodes;
            if (todayPoints) todayPoints.textContent = stats.today.points;
            if (todayHours) todayHours.textContent = `${stats.today.hours}h`;
        }

        // Update total stats
        if (stats.total) {
            const totalNodes = document.getElementById('totalNodes');
            const totalPoints = document.getElementById('totalPoints');
            const totalHours = document.getElementById('totalHours');

            if (totalNodes) totalNodes.textContent = stats.total.nodes;
            if (totalPoints) totalPoints.textContent = stats.total.points;
            if (totalHours) totalHours.textContent = `${stats.total.hours}h`;
        }
    }

    stopPointsCounter() {
        if (this.pointsInterval) {
            clearInterval(this.pointsInterval);
            this.pointsInterval = null;
        }
    }

    stopRuntimeCounter() {
        if (this.runtimeInterval) {
            clearInterval(this.runtimeInterval);
            this.runtimeInterval = null;
        }
        const runtimeElement = document.getElementById('runningTime');
        if (runtimeElement) {
            runtimeElement.textContent = '00:00:00';
        }
    }

    updateUI(isRunning) {
        const runBtn = document.getElementById('runNodeBtn');
        const stopBtn = document.getElementById('stopNodeBtn');
        const statusDiv = document.getElementById('nodeStatus');
        const animationSteps = document.getElementById('animation-steps');
    
        if (runBtn) runBtn.classList.toggle('hidden', isRunning);
        if (stopBtn) stopBtn.classList.toggle('hidden', !isRunning);
        
        if (statusDiv) {
            statusDiv.textContent = isRunning ? 'Running' : 'Not Running';
            statusDiv.className = isRunning 
                ? 'px-4 py-1 rounded-full text-sm bg-green-500/20 text-green-500'
                : 'px-4 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500';
        }
    
        if (animationSteps) {
            animationSteps.innerHTML = '';
            animationSteps.classList.add('hidden');
        }
    }

    updateMessage(message, type = 'error') {
        const messageElement = document.getElementById('nodeMessages');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `mt-2 text-sm ${type === 'error' ? 'text-red-500' : 'text-green-500'}`;
            messageElement.classList.remove('hidden');
        }
    }

    hideAnimationSteps() {
        const animationSteps = document.getElementById('animation-steps');
        if (animationSteps) {
            animationSteps.innerHTML = '';
            animationSteps.classList.add('hidden');
        }
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.nodeRunner = new NodeRunner();
    
});