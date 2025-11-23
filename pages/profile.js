// ===================================
// Enhanced Profile Page with Settings & Ratings
// ===================================

function renderProfilePage() {
    const user = AppState.currentUser;

    if (!user) {
        return `
            <div class="section">
                <div class="container">
                    <div class="empty-state">
                        <div class="empty-state-icon">👤</div>
                        <h3 class="empty-state-title">Profile Not Found</h3>
                        <p class="empty-state-description">Please login to view your profile</p>
                        <button class="btn btn-primary" onclick="openModal('loginModal')">Login</button>
                    </div>
                </div>
            </div>
        `;
    }

    const stats = {
        reputation: user.reputation || 0,
        questions: user.questionsCount || 0,
        answers: user.answersCount || 0,
        posts: user.postsCount || 0,
        followers: user.followers || 0,
        following: user.following || 0
    };

    return `
        <div class="profile-page animate-fade-in">
            <!-- Cover Photo -->
            <div class="profile-cover" style="background-image: url('${user.coverPhoto || ''}');" id="profileCover">
                <div class="profile-cover-overlay">
                    <button class="btn btn-secondary btn-sm cover-upload-btn" onclick="selectCoverPhoto()">
                        📷 Change Cover
                    </button>
                </div>
                <input type="file" id="coverPhotoInput" accept="image/*" style="display: none;" onchange="handleCoverPhotoUpload(event)">
            </div>
            
            <div class="container">
                <!-- Profile Header -->
                <div class="profile-header">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar-wrapper">
                            ${user.profilePhoto ?
            `<img src="${user.profilePhoto}" alt="${user.name}" class="profile-avatar">` :
            `<div class="profile-avatar profile-avatar-placeholder">${getInitials(user.name)}</div>`
        }
                            <button class="avatar-upload-btn" onclick="selectProfilePhoto()" title="Change profile picture">
                                <span>📷</span>
                            </button>
                            <input type="file" id="profilePhotoInput" accept="image/*" style="display: none;" onchange="handleProfilePhotoUpload(event)">
                        </div>
                        
                        <div class="profile-info">
                            <h1 class="profile-name">${user.name}</h1>
                            <p class="profile-email">${user.email}</p>
                            ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
                            <div class="profile-meta">
                                <span class="profile-meta-item">
                                    📅 Joined ${formatDate(user.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button class="btn btn-primary" onclick="openEditProfileModal()">
                            ✏️ Edit Profile
                        </button>
                        <button class="btn btn-secondary" onclick="openSettingsModal()">
                            ⚙️ Settings
                        </button>
                    </div>
                </div>
                
                <!-- Reputation & Stats -->
                <div class="profile-stats-section">
                    <div class="reputation-card">
                        <div class="reputation-score">
                            <div class="reputation-number">${stats.reputation}</div>
                            <div class="reputation-label">Reputation</div>
                        </div>
                        <div class="reputation-level">
                            ${getReputationBadge(stats.reputation)}
                        </div>
                    </div>
                    
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-icon">❓</div>
                            <div class="stat-value">${stats.questions}</div>
                            <div class="stat-label">Questions</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">✅</div>
                            <div class="stat-value">${stats.answers}</div>
                            <div class="stat-label">Answers</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">📝</div>
                            <div class="stat-value">${stats.posts}</div>
                            <div class="stat-label">Posts</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-value">${stats.followers}</div>
                            <div class="stat-label">Followers</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">👤</div>
                            <div class="stat-value">${stats.following}</div>
                            <div class="stat-label">Following</div>
                        </div>
                    </div>
                </div>
                
                <!-- Profile Tabs -->
                <div class="profile-tabs">
                    <button class="profile-tab active" data-tab="activity" onclick="switchProfileTab('activity')">
                        📊 Activity
                    </button>
                    <button class="profile-tab" data-tab="questions" onclick="switchProfileTab('questions')">
                        ❓ Questions
                    </button>
                    <button class="profile-tab" data-tab="posts" onclick="switchProfileTab('posts')">
                        📝 Posts
                    </button>
                    <button class="profile-tab" data-tab="badges" onclick="switchProfileTab('badges')">
                        🏆 Badges & Achievements
                    </button>
                </div>
                
                <!-- Tab Content -->
                <div class="profile-tab-content">
                    <div class="tab-pane active" id="tab-activity">
                        ${renderActivityTab()}
                    </div>
                    <div class="tab-pane" id="tab-questions">
                        ${renderQuestionsTab()}
                    </div>
                    <div class="tab-pane" id="tab-posts">
                        ${renderPostsTab()}
                    </div>
                    <div class="tab-pane" id="tab-badges">
                        ${renderBadgesTab(stats.reputation)}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Edit Profile Modal -->
        <div class="modal-backdrop" id="editProfileModal">
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 class="modal-title">Edit Profile</h3>
                    <button class="modal-close" onclick="closeModal('editProfileModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editProfileForm" onsubmit="handleEditProfile(event)">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" id="editName" class="form-input" value="${user.name}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Bio</label>
                            <textarea id="editBio" class="form-textarea" placeholder="Tell us about yourself..." style="min-height: 100px;">${user.bio || ''}</textarea>
                            <span class="form-helper">Maximum 500 characters</span>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Location</label>
                            <input type="text" id="editLocation" class="form-input" value="${user.location || ''}" placeholder="City, Country">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Website</label>
                            <input type="url" id="editWebsite" class="form-input" value="${user.website || ''}" placeholder="https://yourwebsite.com">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">GitHub Username</label>
                            <input type="text" id="editGithub" class="form-input" value="${user.github || ''}" placeholder="username">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Twitter Username</label>
                            <input type="text" id="editTwitter" class="form-input" value="${user.twitter || ''}" placeholder="@username">
                        </div>
                        
                        <div id="editProfileError" class="alert alert-error hidden"></div>
                        
                        <div class="flex gap-md mt-xl">
                            <button type="submit" class="btn btn-primary" style="flex: 1;" id="saveProfileBtn">
                                💾 Save Changes
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="closeModal('editProfileModal')">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <!-- Settings Modal -->
        <div class="modal-backdrop" id="settingsModal">
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 class="modal-title">Account Settings</h3>
                    <button class="modal-close" onclick="closeModal('settingsModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="settings-section">
                        <h4 class="settings-section-title">Privacy</h4>
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-name">Profile Visibility</div>
                                <div class="setting-description">Make your profile visible to everyone</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="publicProfile" ${user.publicProfile !== false ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-name">Show Email</div>
                                <div class="setting-description">Display email on your profile</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="showEmail" ${user.showEmail ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h4 class="settings-section-title">Notifications</h4>
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-name">Email Notifications</div>
                                <div class="setting-description">Receive email updates</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="emailNotifications" ${user.emailNotifications !== false ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-name">New Followers</div>
                                <div class="setting-description">Get notified when someone follows you</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="followerNotifications" ${user.followerNotifications !== false ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h4 class="settings-section-title">Security</h4>
                        <button class="btn btn-secondary" onclick="openChangePasswordModal()">
                            🔒 Change Password
                        </button>
                    </div>
                    
                    <div class="settings-section">
                        <h4 class="settings-section-title">Danger Zone</h4>
                        <button class="btn btn-secondary" style="color: var(--color-error); border-color: var(--color-error);" onclick="confirmDeleteAccount()">
                            🗑️ Delete Account
                        </button>
                    </div>
                    
                    <div class="flex gap-md mt-xl">
                        <button class="btn btn-primary" onclick="saveSettings()" style="flex: 1;">
                            💾 Save Settings
                        </button>
                        <button class="btn btn-secondary" onclick="closeModal('settingsModal')">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderActivityTab() {
    return `
        <div class="activity-timeline">
            <div class="timeline-item">
                <div class="timeline-icon">📝</div>
                <div class="timeline-content">
                    <div class="timeline-title">Posted a question</div>
                    <div class="timeline-description">How to optimize React performance?</div>
                    <div class="timeline-time">2 hours ago</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-icon">✅</div>
                <div class="timeline-content">
                    <div class="timeline-title">Answered a question</div>
                    <div class="timeline-description">Best practices for API design</div>
                    <div class="timeline-time">1 day ago</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-icon">🏆</div>
                <div class="timeline-content">
                    <div class="timeline-title">Earned a badge</div>
                    <div class="timeline-description">Helpful Contributor Badge</div>
                    <div class="timeline-time">3 days ago</div>
                </div>
            </div>
        </div>
    `;
}

function renderQuestionsTab() {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">❓</div>
            <h3 class="empty-state-title">No Questions Yet</h3>
            <p class="empty-state-description">Ask your first question to get started</p>
            <button class="btn btn-primary" onclick="navigateTo('ask-question')">
                Ask a Question
            </button>
        </div>
    `;
}

function renderPostsTab() {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <h3 class="empty-state-title">No Posts Yet</h3>
            <p class="empty-state-description">Share your thoughts with the community</p>
            <button class="btn btn-primary" onclick="navigateTo('community')">
                Create a Post
            </button>
        </div>
    `;
}

function renderBadgesTab(reputation) {
    const badges = getBadgesForReputation(reputation);

    return `
        <div class="badges-grid">
            ${badges.map(badge => `
                <div class="badge-card ${badge.earned ? 'earned' : 'locked'}">
                    <div class="badge-icon">${badge.icon}</div>
                    <div class="badge-name">${badge.name}</div>
                    <div class="badge-description">${badge.description}</div>
                    ${badge.earned ?
            `<div class="badge-earned">✓ Earned</div>` :
            `<div class="badge-requirement">${badge.requirement} reputation needed</div>`
        }
                </div>
            `).join('')}
        </div>
    `;
}

function getReputationBadge(reputation) {
    if (reputation >= 10000) return '<div class="rep-badge rep-legend">🌟 Legend</div>';
    if (reputation >= 5000) return '<div class="rep-badge rep-expert">💎 Expert</div>';
    if (reputation >= 1000) return '<div class="rep-badge rep-pro">⭐ Pro</div>';
    if (reputation >= 500) return '<div class="rep-badge rep-advanced">🔥 Advanced</div>';
    if (reputation >= 100) return '<div class="rep-badge rep-intermediate">📈 Intermediate</div>';
    return '<div class="rep-badge rep-beginner">🌱 Beginner</div>';
}

function getBadgesForReputation(reputation) {
    return [
        { icon: '🌱', name: 'Newcomer', description: 'Joined the community', requirement: 0, earned: true },
        { icon: '👋', name: 'First Post', description: 'Made your first post', requirement: 10, earned: reputation >= 10 },
        { icon: '💬', name: 'Conversationalist', description: '10 helpful answers', requirement: 100, earned: reputation >= 100 },
        { icon: '🔥', name: 'Hot Contributor', description: 'Very active member', requirement: 500, earned: reputation >= 500 },
        { icon: '⭐', name: 'Rising Star', description: 'Recognized expert', requirement: 1000, earned: reputation >= 1000 },
        { icon: '💎', name: 'Diamond', description: 'Top contributor', requirement: 5000, earned: reputation >= 5000 },
        { icon: '🌟', name: 'Legend', description: 'Platform legend', requirement: 10000, earned: reputation >= 10000 },
        { icon: '🏆', name: 'Teacher', description: 'Helped 100+ people', requirement: 2000, earned: reputation >= 2000 }
    ];
}

function switchProfileTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

function selectProfilePhoto() {
    document.getElementById('profilePhotoInput').click();
}

function selectCoverPhoto() {
    document.getElementById('coverPhotoInput').click();
}

async function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
    }

    showNotification('Uploading profile photo...', 'info');

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            console.log('Uploading profile photo...');
            const response = await fetch(`${API_URL}/profile/photo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ photo: e.target.result })
            });

            const data = await response.json();
            console.log('Upload response:', data);

            if (response.ok) {
                AppState.currentUser.profilePhoto = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
                showNotification('Profile photo updated!', 'success');
                navigateTo('profile'); // Refresh
            } else {
                console.error('Upload failed:', data);
                showNotification(data.message || 'Failed to update photo', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Error uploading photo: ' + error.message, 'error');
        }
    };
    reader.onerror = () => {
        showNotification('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
}

async function handleCoverPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
    }

    showNotification('Uploading cover photo...', 'info');

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            console.log('Uploading cover photo...');
            const response = await fetch(`${API_URL}/profile/cover`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ cover: e.target.result })
            });

            const data = await response.json();
            console.log('Upload response:', data);

            if (response.ok) {
                AppState.currentUser.coverPhoto = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
                showNotification('Cover photo updated!', 'success');
                navigateTo('profile'); // Refresh
            } else {
                console.error('Upload failed:', data);
                showNotification(data.message || 'Failed to update cover', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Error uploading cover photo: ' + error.message, 'error');
        }
    };
    reader.onerror = () => {
        showNotification('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
}

function openEditProfileModal() {
    openModal('editProfileModal');
}

function openSettingsModal() {
    openModal('settingsModal');
}

async function handleEditProfile(event) {
    event.preventDefault();

    const saveBtn = document.getElementById('saveProfileBtn');
    const errorEl = document.getElementById('editProfileError');

    const profileData = {
        name: document.getElementById('editName').value,
        bio: document.getElementById('editBio').value,
        location: document.getElementById('editLocation').value,
        website: document.getElementById('editWebsite').value,
        github: document.getElementById('editGithub').value,
        twitter: document.getElementById('editTwitter').value
    };

    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="spinner"></span> Saving...';
        errorEl.classList.add('hidden');

        const response = await fetch(`${API_URL}/profile/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (response.ok) {
            Object.assign(AppState.currentUser, profileData);
            localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
            closeModal('editProfileModal');
            showNotification('Profile updated successfully!', 'success');
            navigateTo('profile'); // Refresh
        } else {
            errorEl.textContent = data.message || 'Failed to update profile';
            errorEl.classList.remove('hidden');
        }
    } catch (error) {
        errorEl.textContent = 'Connection error. Please try again.';
        errorEl.classList.remove('hidden');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '💾 Save Changes';
    }
}

async function saveSettings() {
    const settings = {
        publicProfile: document.getElementById('publicProfile').checked,
        showEmail: document.getElementById('showEmail').checked,
        emailNotifications: document.getElementById('emailNotifications').checked,
        followerNotifications: document.getElementById('followerNotifications').checked
    };

    try {
        const response = await fetch(`${API_URL}/profile/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(settings)
        });

        if (response.ok) {
            Object.assign(AppState.currentUser, settings);
            localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
            showNotification('Settings saved successfully!', 'success');
            closeModal('settingsModal');
        } else {
            showNotification('Failed to save settings', 'error');
        }
    } catch (error) {
        showNotification('Connection error', 'error');
    }
}

function openChangePasswordModal() {
    showNotification('Password change feature coming soon!', 'info');
}

function confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        showNotification('Account deletion feature coming soon!', 'info');
    }
}

// Add profile styles
const profileStyles = document.createElement('style');
profileStyles.textContent = `
    .profile-page {
        min-height: 100vh;
    }
    
    .profile-cover {
        width: 100%;
        height: 300px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        background-size: cover;
        background-position: center;
        position: relative;
    }
    
    .profile-cover-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: var(--spacing-lg);
        opacity: 0;
        transition: opacity var(--transition-base);
    }
    
    .profile-cover:hover .profile-cover-overlay {
        opacity: 1;
    }
    
    .cover-upload-btn {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.9) !important;
    }
    
    .profile-header {
        margin-top: -80px;
        margin-bottom: var(--spacing-2xl);
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: wrap;
        gap: var(--spacing-lg);
        position: relative;
        z-index: 10;
    }
    
    .profile-avatar-section {
        display: flex;
        gap: var(--spacing-lg);
        align-items: flex-end;
    }
    
    .profile-avatar-wrapper {
        position: relative;
    }
    
    .profile-avatar {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        border: 6px solid var(--color-surface);
        box-shadow: var(--shadow-xl);
        object-fit: cover;
    }
    
    .profile-avatar-placeholder {
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: bold;
    }
    
    .avatar-upload-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--color-primary);
        border: 3px solid var(--color-surface);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all var(--transition-fast);
    }
    
    .avatar-upload-btn:hover {
        transform: scale(1.1);
        background: var(--color-primary-dark);
    }
    
    .profile-info {
        padding-bottom: var(--spacing-md);
    }
    
    .profile-name {
        font-size: var(--font-size-3xl);
        margin-bottom: var(--spacing-xs);
    }
    
    .profile-email {
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-sm);
    }
    
    .profile-bio {
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-sm);
        max-width: 600px;
    }
    
    .profile-meta {
        display: flex;
        gap: var(--spacing-lg);
        flex-wrap: wrap;
    }
    
    .profile-meta-item {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
    }
    
    .profile-actions {
        display: flex;
        gap: var(--spacing-sm);
    }
    
    .profile-stats-section {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: var(--spacing-xl);
        margin-bottom: var(--spacing-2xl);
    }
    
    @media (max-width: 768px) {
        .profile-stats-section {
            grid-template-columns: 1fr;
        }
    }
    
    .reputation-card {
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: white;
        padding: var(--spacing-xl);
        border-radius: var(--radius-xl);
        text-align: center;
        box-shadow: var(--shadow-lg);
    }
    
    .reputation-score {
        margin-bottom: var(--spacing-lg);
    }
    
    .reputation-number {
        font-size: 4rem;
        font-weight: bold;
        line-height: 1;
    }
    
    .reputation-label {
        opacity: 0.9;
        margin-top: var(--spacing-sm);
    }
    
    .reputation-level {
        padding: var(--spacing-md);
        background: rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-lg);
        backdrop-filter: blur(10px);
    }
    
    .rep-badge {
        font-size: var(--font-size-xl);
        font-weight: bold;
    }
    
    .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--spacing-md);
    }
    
    .stat-card {
        background: var(--color-surface);
        padding: var(--spacing-lg);
        border-radius: var(--radius-xl);
        text-align: center;
        border: 1px solid var(--color-border);
        transition: all var(--transition-base);
    }
    
    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--color-primary);
    }
    
    .stat-icon {
        font-size: 2rem;
        margin-bottom: var(--spacing-sm);
    }
    
    .stat-value {
        font-size: var(--font-size-2xl);
        font-weight: bold;
        color: var(--color-primary);
        margin-bottom: var(--spacing-xs);
    }
    
    .stat-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }
    
    .profile-tabs {
        display: flex;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-xl);
        border-bottom: 2px solid var(--color-border);
        overflow-x: auto;
    }
    
    .profile-tab {
        padding: var(--spacing-md) var(--spacing-lg);
        background: none;
        border: none;
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all var(--transition-fast);
        white-space: nowrap;
    }
    
    .profile-tab:hover {
        color: var(--color-primary);
    }
    
    .profile-tab.active {
        color: var(--color-primary);
        border-bottom-color: var(--color-primary);
    }
    
    .tab-pane {
        display: none;
        animation: fadeIn var(--transition-base);
    }
    
    .tab-pane.active {
        display: block;
    }
    
    .activity-timeline {
        max-width: 800px;
    }
    
    .timeline-item {
        display: flex;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-border);
        margin-bottom: var(--spacing-md);
    }
    
    .timeline-icon {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        background: var(--color-surface-hover);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }
    
    .timeline-title {
        font-weight: var(--font-weight-semibold);
        margin-bottom: var(--spacing-xs);
    }
    
    .timeline-description {
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-xs);
    }
    
    .timeline-time {
        font-size: var(--font-size-xs);
        color: var(--color-text-tertiary);
    }
    
    .badges-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--spacing-lg);
    }
    
    .badge-card {
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-xl);
        padding: var(--spacing-xl);
        text-align: center;
        transition: all var(--transition-base);
    }
    
    .badge-card.earned {
        border-color: var(--color-primary);
        background: linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1), rgba(var(--color-primary-rgb), 0.05));
    }
    
    .badge-card.locked {
        opacity: 0.5;
    }
    
    .badge-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing-md);
    }
    
    .badge-name {
        font-weight: var(--font-weight-semibold);
        margin-bottom: var(--spacing-sm);
    }
    
    .badge-description {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-md);
    }
    
    .badge-earned {
        color: var(--color-success);
        font-weight: var(--font-weight-medium);
    }
    
    .badge-requirement {
        color: var(--color-text-tertiary);
        font-size: var(--font-size-xs);
    }
    
    .settings-section {
        margin-bottom: var(--spacing-2xl);
        padding-bottom: var(--spacing-xl);
        border-bottom: 1px solid var(--color-border);
    }
    
    .settings-section:last-child {
        border-bottom: none;
    }
    
    .settings-section-title {
        margin-bottom: var(--spacing-lg);
    }
    
    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-lg);
        background: var(--color-surface-hover);
        border-radius: var(--radius-lg);
        margin-bottom: var(--spacing-md);
    }
    
    .setting-name {
        font-weight: var(--font-weight-medium);
        margin-bottom: var(--spacing-xs);
    }
    
    .setting-description {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
    }
    
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
    }
    
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--color-border);
        transition: var(--transition-base);
        border-radius: 26px;
    }
    
    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: var(--transition-base);
        border-radius: 50%;
    }
    
    input:checked + .toggle-slider {
        background-color: var(--color-primary);
    }
    
    input:checked + .toggle-slider:before {
        transform: translateX(24px);
    }
`;
document.head.appendChild(profileStyles);
