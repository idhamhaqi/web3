// public/js/auth.js

const Auth = {
    getToken() {
        return localStorage.getItem('auth_token');
    },

    setToken(token) {
        localStorage.setItem('auth_token', token);
    },

    removeToken() {
        localStorage.removeItem('auth_token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};
class WalletAuth {
    static async handleConnection(wallet) {
        try {
            const response = await fetch('/auth/wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    walletAddress: wallet.account.address,
                    referralCode: new URLSearchParams(window.location.search).get('ref')
                })
            });

            const auth = await response.json();
            if (auth.token) {
                localStorage.setItem('token', auth.token);
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Authentication failed:', error);
        }
    }

    static async logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
}

// Update TON Connect handler
tonConnectUI.onStatusChange(wallet => {
    if (wallet) {
        WalletAuth.handleConnection(wallet);
    } else {
        WalletAuth.logout();
    }
});