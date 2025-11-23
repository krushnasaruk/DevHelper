// ===================================
// Home Page
// ===================================

function renderHomePage() {
    return `
        <div class="section-lg animate-fade-in">
            <!-- Hero Section -->
            <div class="container">
                <div class="text-center" style="max-width: 800px; margin: 0 auto;">
                    <h1 style="font-size: var(--font-size-5xl); margin-bottom: var(--spacing-lg); background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        Welcome to DevConnect
                    </h1>
                    <p class="text-lg text-secondary mb-xl" style="line-height: var(--line-height-relaxed);">
                        The modern developer community where you can ask questions, upload code, get AI-powered answers, 
                        and receive help from fellow developers around the world.
                    </p>
                    <div class="flex gap-md justify-center" style="flex-wrap: wrap;">
                        <button class="btn btn-primary btn-lg" onclick="navigateTo('ask-question')">
                            ❓ Ask a Question
                        </button>
                        <button class="btn btn-accent btn-lg" onclick="navigateTo('upload-code')">
                            📤 Upload Code
                        </button>
                        <button class="btn btn-secondary btn-lg" onclick="navigateTo('questions')">
                            💬 Browse Questions
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Features Section -->
            <div class="container section">
                <h2 class="text-center mb-xl">Why Choose DevConnect?</h2>
                <div class="grid grid-cols-3 gap-lg">
                    <div class="card text-center">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-lg);">🤖</div>
                        <h3 class="card-title">AI-Powered Answers</h3>
                        <p class="card-body">
                            Get instant, intelligent answers to your coding questions powered by advanced AI technology.
                        </p>
                    </div>
                    
                    <div class="card text-center">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-lg);">👥</div>
                        <h3 class="card-title">Community Driven</h3>
                        <p class="card-body">
                            Connect with fellow developers who can provide insights, tips, and alternative solutions.
                        </p>
                    </div>
                    
                    <div class="card text-center">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-lg);">💻</div>
                        <h3 class="card-title">Code Sharing</h3>
                        <p class="card-body">
                            Upload and share your code snippets with syntax highlighting and easy collaboration.
                        </p>
                    </div>
                    
                    <div class="card text-center">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-lg);">⚡</div>
                        <h3 class="card-title">Lightning Fast</h3>
                        <p class="card-body">
                            Get answers in seconds, not hours. Our AI responds instantly to help you stay productive.
                        </p>
                    </div>
                    
                    <div class="card text-center">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-lg);">🎯</div>
                        <h3 class="card-title">Accurate Solutions</h3>
                        <p class="card-body">
                            Benefit from both AI precision and human expertise for the most accurate solutions.
                        </p>
                    </div>
                    
                    <div class="card text-center">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-lg);">🌟</div>
                        <h3 class="card-title">Build Reputation</h3>
                        <p class="card-body">
                            Help others and earn reputation points. Become a recognized expert in your field.
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Stats Section -->
            <div class="container section">
                <div class="card" style="background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); color: white; padding: var(--spacing-3xl);">
                    <div class="grid grid-cols-3 gap-lg text-center">
                        <div>
                            <div style="font-size: var(--font-size-4xl); font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-sm);">
                                10K+
                            </div>
                            <div style="font-size: var(--font-size-lg); opacity: 0.9;">
                                Questions Answered
                            </div>
                        </div>
                        <div>
                            <div style="font-size: var(--font-size-4xl); font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-sm);">
                                5K+
                            </div>
                            <div style="font-size: var(--font-size-lg); opacity: 0.9;">
                                Active Developers
                            </div>
                        </div>
                        <div>
                            <div style="font-size: var(--font-size-4xl); font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-sm);">
                                95%
                            </div>
                            <div style="font-size: var(--font-size-lg); opacity: 0.9;">
                                Success Rate
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Questions Section -->
            <div class="container section">
                <div class="flex items-center justify-between mb-lg">
                    <h2>Recent Questions</h2>
                    <button class="btn btn-secondary" onclick="navigateTo('questions')">
                        View All →
                    </button>
                </div>
                <div id="recentQuestions">
                    <div class="spinner" style="margin: var(--spacing-3xl) auto; display: block;"></div>
                </div>
            </div>
            
            <!-- CTA Section -->
            <div class="container section">
                <div class="card text-center" style="padding: var(--spacing-3xl); background: var(--color-surface-hover);">
                    <h2 style="margin-bottom: var(--spacing-md);">Ready to Get Started?</h2>
                    <p class="text-lg text-secondary mb-xl">
                        Join thousands of developers who are already getting their questions answered faster.
                    </p>
                    <button class="btn btn-primary btn-lg" onclick="openModal('registerModal')">
                        🚀 Create Free Account
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load recent questions on homepage
setTimeout(async () => {
    if (AppState.currentRoute === 'home') {
        await loadQuestions();
        const recentQuestionsEl = document.getElementById('recentQuestions');

        if (recentQuestionsEl) {
            const recentQuestions = AppState.questions.slice(0, 3);

            if (recentQuestions.length === 0) {
                recentQuestionsEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">💬</div>
                        <h3 class="empty-state-title">No questions yet</h3>
                        <p class="empty-state-description">Be the first to ask a question!</p>
                        <button class="btn btn-primary" onclick="navigateTo('ask-question')">
                            Ask Question
                        </button>
                    </div>
                `;
            } else {
                recentQuestionsEl.innerHTML = recentQuestions.map(q => `
                    <div class="card card-interactive" onclick="navigateTo('question-detail', {id: '${q.id}'})">
                        <div class="flex items-center gap-md mb-md">
                            <div class="avatar avatar-sm">${getInitials(q.author)}</div>
                            <div>
                                <div class="font-semibold text-sm">${q.author}</div>
                                <div class="text-xs text-tertiary">${formatDate(q.createdAt)}</div>
                            </div>
                            ${q.hasAIAnswer ? '<span class="badge badge-primary">🤖 AI Answered</span>' : ''}
                        </div>
                        <h3 class="card-title">${q.title}</h3>
                        <p class="card-body">${truncate(q.content, 120)}</p>
                        <div class="flex gap-sm" style="margin-top: var(--spacing-md);">
                            ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="card-footer">
                            <div class="flex items-center gap-lg text-sm text-secondary">
                                <span>💬 ${q.answers.length} Answers</span>
                                <span>👁️ ${q.views} Views</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
}, 500);
