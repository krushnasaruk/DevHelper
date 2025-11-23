// pages/login.js

// Render the login page
function renderLoginPage() {
    return `
        <div class="login-page animate-fade-in">
            <div class="login-card">
                <h2 class="login-title">Welcome Back</h2>
                <form id="loginForm" class="login-form">
                    <div class="form-group">
                        <label for="loginEmail" class="form-label">Email</label>
                        <input type="email" id="loginEmail" class="form-input" placeholder="you@example.com" required />
                    </div>
                    <div class="form-group">
                        <label for="loginPassword" class="form-label">Password</label>
                        <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" required />
                    </div>
                    <div id="loginError" class="alert alert-error hidden"></div>
                    <button type="submit" class="btn btn-primary btn-block" id="loginBtn">Login</button>
                </form>
            </div>
        </div>
    `;
}

function attachLoginHandlers() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLoginSubmit);
    }
}

// Show inline error messages
function showLoginError(message) {
    const errEl = document.getElementById('loginError');
    errEl.textContent = message;
    errEl.classList.remove('hidden');
}

// Handle form submission
async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Logging in...';
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            AppState.currentUser = data.user;
            showNotification('Login successful!', 'success');
            // Redirect to profile or home
            navigateTo('profile');
        } else {
            showLoginError(data.message || 'Login failed');
        }
    } catch (err) {
        console.error('Login request error:', err);
        showLoginError('Network error. Please try again.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Login';
    }
}

// Export for router if needed
window.renderLoginPage = renderLoginPage;
