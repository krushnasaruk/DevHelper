// ===================================
// Questions Page
// ===================================

let currentFilter = 'all';
let currentSort = 'newest';
let searchQuery = '';

function renderQuestionsPage() {
    const filteredQuestions = filterAndSortQuestions();

    return `
        <div class="section animate-fade-in">
            <div class="container">
                <div class="flex items-center justify-between mb-xl" style="flex-wrap: wrap; gap: var(--spacing-md);">
                    <div>
                        <h1>Questions</h1>
                        <p class="text-secondary mb-0">Browse and discover questions from the community</p>
                    </div>
                    <button class="btn btn-primary" onclick="navigateTo('ask-question')">
                        ❓ Ask Question
                    </button>
                </div>
                
                <!-- Search and Filters -->
                <div class="card mb-lg">
                    <div class="grid grid-cols-3 gap-md">
                        <input 
                            type="text" 
                            id="searchInput"
                            class="form-input" 
                            placeholder="🔍 Search questions..."
                            value="${searchQuery}"
                            oninput="handleSearch(this.value)"
                        >
                        
                        <select class="form-select" id="filterSelect" onchange="handleFilter(this.value)">
                            <option value="all" ${currentFilter === 'all' ? 'selected' : ''}>All Questions</option>
                            <option value="answered" ${currentFilter === 'answered' ? 'selected' : ''}>Answered</option>
                            <option value="unanswered" ${currentFilter === 'unanswered' ? 'selected' : ''}>Unanswered</option>
                            <option value="ai-answered" ${currentFilter === 'ai-answered' ? 'selected' : ''}>AI Answered</option>
                        </select>
                        
                        <select class="form-select" id="sortSelect" onchange="handleSort(this.value)">
                            <option value="newest" ${currentSort === 'newest' ? 'selected' : ''}>Newest First</option>
                            <option value="oldest" ${currentSort === 'oldest' ? 'selected' : ''}>Oldest First</option>
                            <option value="most-answers" ${currentSort === 'most-answers' ? 'selected' : ''}>Most Answers</option>
                            <option value="most-views" ${currentSort === 'most-views' ? 'selected' : ''}>Most Views</option>
                        </select>
                    </div>
                </div>
                
                <!-- Questions List -->
                <div id="questionsList">
                    ${filteredQuestions.length === 0 ? renderEmptyState() : renderQuestionsList(filteredQuestions)}
                </div>
            </div>
        </div>
    `;
}

function renderQuestionsList(questions) {
    return questions.map(q => `
        <div class="card card-interactive mb-lg" style="cursor: pointer;" data-question-id="${q.id}">
            <div class="flex items-center gap-md mb-md">
                <div class="avatar">${getInitials(q.author)}</div>
                <div style="flex: 1;">
                    <div class="font-semibold">${q.author}</div>
                    <div class="text-sm text-tertiary">${formatDate(q.createdAt)}</div>
                </div>
                <div class="flex gap-sm">
                    ${q.hasAIAnswer ? '<span class="badge badge-primary">🤖 AI</span>' : ''}
                    ${q.answers.length > 0 ? '<span class="badge badge-success">✓ Answered</span>' : '<span class="badge badge-warning">Unanswered</span>'}
                </div>
            </div>
            
            <h3 class="card-title" style="cursor: pointer;">${q.title}</h3>
            <p class="card-body">${truncate(q.content, 200)}</p>
            
            ${q.code ? `
                <div style="margin: var(--spacing-md) 0;">
                    ${renderCodeBlock(q.code.substring(0, 150) + '...', q.language)}
                </div>
            ` : ''}
            
            <div class="flex gap-sm" style="margin-top: var(--spacing-md); flex-wrap: wrap;">
                ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <div class="card-footer">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-lg text-sm text-secondary">
                        <span>💬 ${q.answers.length} Answer${q.answers.length !== 1 ? 's' : ''}</span>
                        <span>👁️ ${q.views} View${q.views !== 1 ? 's' : ''}</span>
                        <span>👍 ${q.upvotes} Upvote${q.upvotes !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderEmptyState() {
    let message = 'No questions found';
    let description = 'Be the first to ask a question!';

    if (searchQuery) {
        message = 'No matching questions';
        description = `No questions found for "${searchQuery}". Try a different search term.`;
    } else if (currentFilter !== 'all') {
        description = 'Try changing the filter to see more questions.';
    }

    return `
        <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <h3 class="empty-state-title">${message}</h3>
            <p class="empty-state-description">${description}</p>
            <button class="btn btn-primary" onclick="navigateTo('ask-question')">
                ❓ Ask a Question
            </button>
        </div>
    `;
}

function filterAndSortQuestions() {
    let questions = [...AppState.questions];

    // Apply search filter
    if (searchQuery) {
        questions = questions.filter(q =>
            q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }

    // Apply category filter
    switch (currentFilter) {
        case 'answered':
            questions = questions.filter(q => q.answers.length > 0);
            break;
        case 'unanswered':
            questions = questions.filter(q => q.answers.length === 0);
            break;
        case 'ai-answered':
            questions = questions.filter(q => q.hasAIAnswer);
            break;
    }

    // Apply sorting
    switch (currentSort) {
        case 'newest':
            questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            questions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'most-answers':
            questions.sort((a, b) => b.answers.length - a.answers.length);
            break;
        case 'most-views':
            questions.sort((a, b) => b.views - a.views);
            break;
    }

    return questions;
}

function handleSearch(value) {
    searchQuery = value;
    updateQuestionsList();
}

function handleFilter(value) {
    currentFilter = value;
    updateQuestionsList();
}

function handleSort(value) {
    currentSort = value;
    updateQuestionsList();
}

function updateQuestionsList() {
    const questionsListEl = document.getElementById('questionsList');
    if (questionsListEl) {
        const filteredQuestions = filterAndSortQuestions();
        questionsListEl.innerHTML = filteredQuestions.length === 0
            ? renderEmptyState()
            : renderQuestionsList(filteredQuestions);

        // Reattach event handlers
        attachQuestionHandlers();
        applySyntaxHighlighting();
    }
}

function attachQuestionHandlers() {
    document.querySelectorAll('[data-question-id]').forEach(card => {
        card.addEventListener('click', () => {
            const questionId = card.getAttribute('data-question-id');
            navigateTo('question-detail', { id: questionId });
        });
    });
}
