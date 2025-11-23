// ===================================
// Community Page - Developer Social Media
// ===================================

let communityPosts = [];

function renderCommunityPage() {
    return `
        <div class="section animate-fade-in">
            <div class="container">
                <div class="flex items-center justify-between mb-xl" style="flex-wrap: wrap; gap: var(--spacing-md);">
                    <div>
                        <h1>💬 Community</h1>
                        <p class="text-secondary mb-0">Connect with developers, share your work, and stay updated</p>
                    </div>
                    ${AppState.currentUser ? `
                        <button class="btn btn-primary" onclick="openCreatePostModal()">
                            ➕ Create Post
                        </button>
                    ` : ''}
                </div>
                
                <!-- Community Layout (2 columns on desktop) -->
                <div class="community-layout">
                    <!-- Left Sidebar -->
                    <aside class="community-sidebar">
                        <!-- User Quick Stats -->
                        ${AppState.currentUser ? `
                            <div class="card">
                                <div class="flex items-center gap-md mb-md">
                                    <div class="avatar avatar-lg">${getInitials(AppState.currentUser.name)}</div>
                                    <div>
                                        <div class="font-semibold">${AppState.currentUser.name}</div>
                                        <div class="text-sm text-secondary">Member</div>
                                    </div>
                                </div>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <div class="stat-value">${communityPosts.filter(p => p.authorId === AppState.currentUser.id).length}</div>
                                        <div class="stat-label">Posts</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${AppState.currentUser.followers || 0}</div>
                                        <div class="stat-label">Followers</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${AppState.currentUser.following || 0}</div>
                                        <div class="stat-label">Following</div>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class="card text-center">
                                <h3 class="mb-md">Join the Community</h3>
                                <p class="text-secondary mb-lg">Connect with thousands of developers</p>
                                <button class="btn btn-primary" onclick="openModal('registerModal')">
                                    🚀 Sign Up
                                </button>
                            </div>
                        `}
                        
                        <!-- Trending Topics -->
                        <div class="card mt-lg">
                            <h3 class="text-lg mb-md">🔥 Trending Topics</h3>
                            <div class="trending-topics">
                                <div class="trending-item">#javascript</div>
                                <div class="trending-item">#react</div>
                                <div class="trending-item">#python</div>
                                <div class="trending-item">#webdev</div>
                                <div class="trending-item">#opensource</div>
                                <div class="trending-item">#ai</div>
                            </div>
                        </div>
                        
                        <!-- Suggested Developers -->
                        <div class="card mt-lg">
                            <h3 class="text-lg mb-md">👥 Suggested Developers</h3>
                            <div id="suggestedDevs">
                                <div class="suggested-dev-item">
                                    <div class="flex items-center gap-sm">
                                        <div class="avatar avatar-sm">JD</div>
                                        <div style="flex: 1;">
                                            <div class="font-medium text-sm">Jane Developer</div>
                                            <div class="text-xs text-tertiary">Full Stack Dev</div>
                                        </div>
                                    </div>
                                    <button class="btn btn-secondary btn-sm">Follow</button>
                                </div>
                                <div class="suggested-dev-item">
                                    <div class="flex items-center gap-sm">
                                        <div class="avatar avatar-sm">MJ</div>
                                        <div style="flex: 1;">
                                            <div class="font-medium text-sm">Mike Johnson</div>
                                            <div class="text-xs text-tertiary">Backend Engineer</div>
                                        </div>
                                    </div>
                                    <button class="btn btn-secondary btn-sm">Follow</button>
                                </div>
                            </div>
                        </div>
                    </aside>
                    
                    <!-- Main Feed -->
                    <main class="community-feed">
                        <!-- Feed Filter -->
                        <div class="card mb-lg">
                            <div class="feed-tabs">
                                <button class="feed-tab active" data-filter="all" onclick="filterCommunityFeed('all')">
                                    🌐 All Posts
                                </button>
                                <button class="feed-tab" data-filter="following" onclick="filterCommunityFeed('following')">
                                    👥 Following
                                </button>
                                <button class="feed-tab" data-filter="trending" onclick="filterCommunityFeed('trending')">
                                    🔥 Trending
                                </button>
                            </div>
                        </div>
                        
                        <!-- Posts Feed -->
                        <div id="communityFeed">
                            ${renderCommunityFeed()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
        
        <!-- Create Post Modal -->
        <div class="modal-backdrop" id="createPostModal">
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 class="modal-title">Create Post</h3>
                    <button class="modal-close" onclick="closeModal('createPostModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="createPostForm" onsubmit="handleCreatePost(event)">
                        <div class="form-group">
                            <textarea 
                                id="postContent" 
                                class="form-textarea" 
                                placeholder="What's on your mind? Share your thoughts, code, or questions..."
                                required
                                style="min-height: 120px;"
                            ></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Add Code (Optional)</label>
                            <div id="postCodeEditor"></div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Tags</label>
                            <input 
                                type="text" 
                                id="postTags" 
                                class="form-input" 
                                placeholder="e.g., javascript, webdev, coding (comma-separated)"
                            >
                        </div>
                        
                        <div class="post-options">
                            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('postImageInput').click()">
                                🖼️ Add Image
                            </button>
                            <input type="file" id="postImageInput" accept="image/*" style="display: none;" onchange="handlePostImageSelect(event)">
                        </div>
                        
                        <div id="imagePreview" class="mt-md"></div>
                        
                        <div id="createPostError" class="alert alert-error hidden"></div>
                        
                        <div class="flex gap-md mt-xl">
                            <button type="submit" class="btn btn-primary" id="submitPostBtn" style="flex: 1;">
                                📝 Post
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="closeModal('createPostModal')">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function renderCommunityFeed() {
    if (communityPosts.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📱</div>
                <h3 class="empty-state-title">No posts yet</h3>
                <p class="empty-state-description">Be the first to share something with the community!</p>
                ${AppState.currentUser ? `
                    <button class="btn btn-primary" onclick="openCreatePostModal()">
                        ➕ Create First Post
                    </button>
                ` : ''}
            </div>
        `;
    }

    return communityPosts.map(post => renderPostCard(post)).join('');
}

function renderPostCard(post) {
    const isLiked = post.likes.includes(AppState.currentUser?.id);

    return `
        <div class="card post-card mb-lg" data-post-id="${post.id}">
            <!-- Post Header -->
            <div class="post-header">
                <div class="flex items-center gap-md">
                    <div class="avatar">${getInitials(post.author)}</div>
                    <div style="flex: 1;">
                        <div class="font-semibold">${post.author}</div>
                        <div class="text-sm text-tertiary">${formatDate(post.createdAt)}</div>
                    </div>
                    ${AppState.currentUser?.id === post.authorId ? `
                        <button class="btn btn-secondary btn-sm" onclick="deletePost('${post.id}')">🗑️</button>
                    ` : ''}
                </div>
            </div>
            
            <!-- Post Content -->
            <div class="post-content">
                <p class="post-text">${post.content}</p>
                
                ${post.code ? `
                    <div class="mt-md">
                        ${renderCodeBlock(post.code, post.language)}
                    </div>
                ` : ''}
                
                ${post.image ? `
                    <div class="post-image mt-md">
                        <img src="${post.image}" alt="Post image" style="width: 100%; border-radius: var(--radius-lg);">
                    </div>
                ` : ''}
                
                ${post.tags && post.tags.length > 0 ? `
                    <div class="flex gap-sm mt-md" style="flex-wrap: wrap;">
                        ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            
            <!-- Post Actions -->
            <div class="post-actions">
                <button class="post-action-btn ${isLiked ? 'active' : ''}" onclick="toggleLike('${post.id}')">
                    ${isLiked ? '❤️' : '🤍'} ${post.likes.length} Like${post.likes.length !== 1 ? 's' : ''}
                </button>
                <button class="post-action-btn" onclick="toggleComments('${post.id}')">
                    💬 ${post.comments.length} Comment${post.comments.length !== 1 ? 's' : ''}
                </button>
                <button class="post-action-btn" onclick="sharePost('${post.id}')">
                    🔗 Share
                </button>
            </div>
            
            <!-- Comments Section -->
            <div class="comments-section" id="comments-${post.id}" style="display: none;">
                <div class="comments-list">
                    ${post.comments.map(comment => `
                        <div class="comment-item">
                            <div class="flex gap-sm">
                                <div class="avatar avatar-sm">${getInitials(comment.author)}</div>
                                <div style="flex: 1;">
                                    <div class="font-semibold text-sm">${comment.author}</div>
                                    <p class="text-sm mb-0">${comment.content}</p>
                                    <div class="text-xs text-tertiary mt-xs">${formatDate(comment.createdAt)}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${AppState.currentUser ? `
                    <div class="comment-input-wrapper">
                        <form onsubmit="addComment(event, '${post.id}')" class="flex gap-sm">
                            <input 
                                type="text" 
                                class="form-input" 
                                placeholder="Write a comment..."
                                required
                                id="comment-input-${post.id}"
                            >
                            <button type="submit" class="btn btn-primary btn-sm">Send</button>
                        </form>
                    </div>
                ` : `
                    <div class="text-center text-secondary text-sm mt-md">
                        <a href="#" onclick="openModal('loginModal')">Login</a> to comment
                    </div>
                `}
            </div>
        </div>
    `;
}

// Initialize community page
setTimeout(async () => {
    if (AppState.currentRoute === 'community') {
        await loadCommunityPosts();
        updateCommunityFeed();
    }
}, 500);

async function loadCommunityPosts() {
    try {
        const response = await fetch(`${API_URL}/community/posts`);
        const data = await response.json();

        if (response.ok) {
            communityPosts = data.posts || [];
        }
    } catch (error) {
        console.error('Error loading community posts:', error);
        communityPosts = [];
    }
}

function updateCommunityFeed() {
    const feedEl = document.getElementById('communityFeed');
    if (feedEl) {
        feedEl.innerHTML = renderCommunityFeed();
        applySyntaxHighlighting();
    }
}

function openCreatePostModal() {
    if (!AppState.currentUser) {
        showNotification('Please login to create a post', 'warning');
        openModal('loginModal');
        return;
    }

    openModal('createPostModal');

    // Initialize code editor after modal opens
    setTimeout(() => {
        if (document.getElementById('postCodeEditor')) {
            createCodeEditor('postCodeEditor', {
                placeholder: 'Paste code here (optional)...'
            });
        }
    }, 200);
}

let selectedPostImage = null;

function handlePostImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        selectedPostImage = e.target.result;
        document.getElementById('imagePreview').innerHTML = `
            <div style="position: relative; display: inline-block;">
                <img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: var(--radius-lg);">
                <button type="button" class="btn btn-secondary btn-sm" style="position: absolute; top: 8px; right: 8px;" onclick="removePostImage()">
                    ✕
                </button>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

function removePostImage() {
    selectedPostImage = null;
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('postImageInput').value = '';
}

async function handleCreatePost(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submitPostBtn');
    const errorEl = document.getElementById('createPostError');

    const content = document.getElementById('postContent').value.trim();
    const tagsInput = document.getElementById('postTags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

    const codeEditorEl = document.querySelector('#postCodeEditor .code-editor-input');
    const languageEl = document.querySelector('#postCodeEditor .language-selector');

    const postData = {
        content,
        code: codeEditorEl ? codeEditorEl.value : '',
        language: languageEl ? languageEl.value : 'javascript',
        tags,
        image: selectedPostImage
    };

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Posting...';
        errorEl.classList.add('hidden');

        const response = await fetch(`${API_URL}/community/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(postData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Post created successfully!', 'success');
            closeModal('createPostModal');

            // Reset form
            document.getElementById('createPostForm').reset();
            removePostImage();

            // Reload posts
            await loadCommunityPosts();
            updateCommunityFeed();
        } else {
            errorEl.textContent = data.message || 'Failed to create post';
            errorEl.classList.remove('hidden');
        }
    } catch (error) {
        errorEl.textContent = 'Connection error. Please try again.';
        errorEl.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '📝 Post';
    }
}

async function toggleLike(postId) {
    if (!AppState.currentUser) {
        showNotification('Please login to like posts', 'warning');
        openModal('loginModal');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/community/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            await loadCommunityPosts();
            updateCommunityFeed();
        }
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection) {
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }
}

async function addComment(event, postId) {
    event.preventDefault();

    if (!AppState.currentUser) {
        showNotification('Please login to comment', 'warning');
        openModal('loginModal');
        return;
    }

    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();

    if (!content) return;

    try {
        const response = await fetch(`${API_URL}/community/posts/${postId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            input.value = '';
            await loadCommunityPosts();
            updateCommunityFeed();
            // Reopen comments section
            setTimeout(() => toggleComments(postId), 100);
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const response = await fetch(`${API_URL}/community/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            showNotification('Post deleted successfully', 'success');
            await loadCommunityPosts();
            updateCommunityFeed();
        }
    } catch (error) {
        showNotification('Failed to delete post', 'error');
    }
}

function sharePost(postId) {
    const post = communityPosts.find(p => p.id === postId);
    if (!post) return;

    const shareUrl = `${window.location.origin}/#community?post=${postId}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
        showNotification('Link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy link', 'error');
    });
}

function filterCommunityFeed(filter) {
    // Update active tab
    document.querySelectorAll('.feed-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

    // Filter logic would go here
    // For now, just showing all posts
    showNotification(`Showing ${filter} posts`, 'info');
}

// CSS for community page
const communityStyles = document.createElement('style');
communityStyles.textContent = `
    .community-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: var(--spacing-xl);
        align-items: start;
    }
    
    @media (max-width: 1024px) {
        .community-layout {
            grid-template-columns: 1fr;
        }
        
        .community-sidebar {
            display: none;
        }
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-md);
        margin-top: var(--spacing-md);
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-value {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-primary);
    }
    
    .stat-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        margin-top: var(--spacing-xs);
    }
    
    .trending-topics {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    
    .trending-item {
        padding: var(--spacing-sm) var(--spacing-md);
        background-color: var(--color-surface-hover);
        border-radius: var(--radius-lg);
        color: var(--color-primary);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .trending-item:hover {
        background-color: var(--color-primary);
        color: white;
    }
    
    .suggested-dev-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md) 0;
        border-bottom: 1px solid var(--color-border-light);
    }
    
    .suggested-dev-item:last-child {
        border-bottom: none;
    }
    
    .feed-tabs {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
    }
    
    .feed-tab {
        padding: var(--spacing-sm) var(--spacing-lg);
        background: none;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .feed-tab:hover {
        background-color: var(--color-surface-hover);
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
    
    .feed-tab.active {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
    }
    
    .post-card {
        background-color: var(--color-surface);
    }
    
    .post-header {
        margin-bottom: var(--spacing-md);
    }
    
    .post-content {
        margin-bottom: var(--spacing-lg);
    }
    
    .post-text {
        white-space: pre-wrap;
        line-height: var(--line-height-relaxed);
        color: var(--color-text-primary);
    }
    
    .post-actions {
        display: flex;
        gap: var(--spacing-md);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--color-border-light);
    }
    
    .post-action-btn {
        flex: 1;
        padding: var(--spacing-sm) var(--spacing-md);
        background: none;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-size: var(--font-size-sm);
    }
    
    .post-action-btn:hover {
        background-color: var(--color-surface-hover);
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
    
    .post-action-btn.active {
        background-color: rgba(var(--color-primary-rgb), 0.1);
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
    
    .comments-section {
        margin-top: var(--spacing-lg);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--color-border-light);
    }
    
    .comments-list {
        max-height: 400px;
        overflow-y: auto;
        margin-bottom: var(--spacing-md);
    }
    
    .comment-item {
        padding: var(--spacing-md);
        background-color: var(--color-surface-hover);
        border-radius: var(--radius-lg);
        margin-bottom: var(--spacing-sm);
    }
    
    .comment-input-wrapper {
        margin-top: var(--spacing-md);
    }
    
    .post-options {
        display: flex;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-md);
    }
`;
document.head.appendChild(communityStyles);
