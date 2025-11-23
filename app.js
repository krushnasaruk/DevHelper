// ===================================
// DevConnect - Main Application
// ===================================

// API Configuration
const API_URL = 'http://localhost:3000/api';

// Application State
const AppState = {
    currentUser: null,
    currentRoute: 'home',
    questions: [],
    codeSnippets: []
};

// ===================================
// Authentication
// ===================================

// Check if user is logged in on page load
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
        AppState.currentUser = JSON.parse(user);
        updateNavbar();
    } else {
        updateNavbar();
    }
}

// Login Handler
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            AppState.currentUser = data.user;

            closeModal('loginModal');
            updateNavbar();
            showNotification('Welcome back, ' + data.user.name + '!', 'success');
        } else {
            errorEl.textContent = data.message || 'Login failed';
            errorEl.classList.remove('hidden');
        }
    } catch (error) {
        errorEl.textContent = 'Connection error. Please try again.';
        errorEl.classList.remove('hidden');
    }
}

// Register Handler
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorEl = document.getElementById('registerError');

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            AppState.currentUser = data.user;

            closeModal('registerModal');
            updateNavbar();
            showNotification('Account created successfully!', 'success');
        } else {
            errorEl.textContent = data.message || 'Registration failed';
            errorEl.classList.remove('hidden');
        }
    } catch (error) {
        errorEl.textContent = 'Connection error. Please try again.';
        errorEl.classList.remove('hidden');
    }
}

// Logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    AppState.currentUser = null;
    updateNavbar();
    navigateTo('home');
    showNotification('Logged out successfully', 'info');
}

// Update navbar based on auth state
function updateNavbar() {
    const actionsEl = document.getElementById('navbarActions');

    if (AppState.currentUser) {
        const avatarHtml = AppState.currentUser.profilePhoto
            ? `<img src="${AppState.currentUser.profilePhoto}" alt="${AppState.currentUser.name}" class="avatar avatar-sm" style="object-fit: cover;">`
            : `<div class="avatar avatar-sm">${getInitials(AppState.currentUser.name)}</div>`;

        actionsEl.innerHTML = `
            <div class="flex items-center gap-md">
                <a href="#profile" class="nav-link" data-route="profile" id="nav-profile">
                    ${avatarHtml}
                </a>
                <button class="btn btn-secondary btn-sm" onclick="logout()">Logout</button>
            </div>
        `;

        // Add profile navigation
        const profileLink = document.getElementById('nav-profile');
        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('profile');
            });
        }
    } else {
        actionsEl.innerHTML = `
            <div class="flex gap-sm">
                <button class="btn btn-secondary btn-sm" onclick="openModal('loginModal')">Login</button>
                <button class="btn btn-primary btn-sm" onclick="openModal('registerModal')">Register</button>
            </div>
        `;
    }
}

// Get user initials for avatar
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// ===================================
// Routing
// ===================================

function navigateTo(route, params = {}) {
    AppState.currentRoute = route;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.getElementById(`nav-${route}`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Close mobile menu if open
    const navbarNav = document.getElementById('navbarNav');
    navbarNav.classList.remove('active');

    // Render appropriate page
    const contentEl = document.getElementById('content');

    switch (route) {
        case 'home':
            contentEl.innerHTML = renderHomePage();
            break;
        case 'questions':
            loadQuestions().then(() => {
                contentEl.innerHTML = renderQuestionsPage();
                attachQuestionHandlers();
            });
            break;
        case 'question-detail':
            contentEl.innerHTML = renderQuestionDetailPage(params.id);
            break;
        case 'ask-question':
            if (!AppState.currentUser) {
                showNotification('Please login to ask a question', 'warning');
                openModal('loginModal');
                return;
            }
            contentEl.innerHTML = renderAskQuestionPage();
            attachAskQuestionHandlers();
            break;
        case 'community':
            contentEl.innerHTML = renderCommunityPage();
            break;
        case 'upload-code':
            if (!AppState.currentUser) {
                showNotification('Please login to upload code', 'warning');
                openModal('loginModal');
                return;
            }
            contentEl.innerHTML = renderUploadCodePage();
            attachUploadCodeHandlers();
            break;
        case 'profile':
            if (!AppState.currentUser) {
                showNotification('Please login to view profile', 'warning');
                openModal('loginModal');
                return;
            }
            contentEl.innerHTML = renderProfilePage();
            break;
        default:
            contentEl.innerHTML = renderHomePage();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'home';
    navigateTo(hash);
});

// ===================================
// Data Loading
// ===================================

async function loadQuestions() {
    try {
        const response = await fetch(`${API_URL}/questions`);
        const data = await response.json();

        if (response.ok) {
            AppState.questions = data.questions || [];
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        AppState.questions = [];
    }
}

async function loadQuestion(id) {
    try {
        const response = await fetch(`${API_URL}/questions/${id}`);
        const data = await response.json();

        if (response.ok) {
            return data.question;
        }
    } catch (error) {
        console.error('Error loading question:', error);
        return null;
    }
}

// ===================================
// Utility Functions
// ===================================

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} animate-fade-in`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.style.maxWidth = '400px';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}

// Truncate text
function truncate(text, length = 150) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// ===================================
// Event Handlers
// ===================================

// Mobile menu toggle
document.getElementById('mobileMenuToggle').addEventListener('click', () => {
    const navbarNav = document.getElementById('navbarNav');
    navbarNav.classList.toggle('active');
});

// Navigation links
document.querySelectorAll('[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = e.currentTarget.getAttribute('data-route');
        window.location.hash = route;
        navigateTo(route);
    });
});

// ===================================
// Initialize App
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Load initial route
    const initialRoute = window.location.hash.substring(1) || 'home';
    navigateTo(initialRoute);
});
