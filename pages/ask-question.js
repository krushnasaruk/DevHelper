// ===================================
// Ask Question Page
// ===================================

let questionCodeEditor = null;

function renderAskQuestionPage() {
    return `
        <div class="section animate-fade-in">
            <div class="container container-sm">
                <h1 class="mb-md">Ask a Question</h1>
                <p class="text-secondary mb-xl">
                    Get help from AI and the community. The more details you provide, the better answers you'll receive.
                </p>
                
                <div class="card">
                    <form id="askQuestionForm" onsubmit="handleAskQuestion(event)">
                        <!-- Title -->
                        <div class="form-group">
                            <label class="form-label">Question Title</label>
                            <input 
                                type="text" 
                                id="questionTitle" 
                                class="form-input" 
                                placeholder="e.g., How do I center a div in CSS?"
                                required
                            >
                            <span class="form-helper">Be specific and concise</span>
                        </div>
                        
                        <!-- Content -->
                        <div class="form-group">
                            <label class="form-label">Question Details</label>
                            <textarea 
                                id="questionContent" 
                                class="form-textarea" 
                                placeholder="Provide more context about your question. What have you tried? What specific problem are you facing?"
                                required
                                style="min-height: 180px;"
                            ></textarea>
                            <span class="form-helper">Include what you've tried and what error messages you're seeing</span>
                        </div>
                        
                        <!-- Code Editor -->
                        <div class="form-group">
                 <label class="form-label">Code (Optional)</label>
                            <div id="questionCodeEditor"></div>
                            <span class="form-helper">Add relevant code to help others understand your problem</span>
                        </div>
                        
                        <!-- Tags -->
                        <div class="form-group">
                            <label class="form-label">Tags</label>
                            <input 
                                type="text" 
                                id="questionTags" 
                                class="form-input" 
                                placeholder="e.g., javascript, react, css (comma-separated)"
                                required
                            >
                            <span class="form-helper">Add up to 5 tags to help categorize your question</span>
                        </div>
                        
                        <!-- AI Answer Option -->
                        <div class="form-group">
                            <label class="flex items-center gap-sm" style="cursor: pointer;">
                                <input 
                                    type="checkbox" 
                                    id="getAIAnswer" 
                                    checked
                                    style="width: 18px; height: 18px; cursor: pointer;"
                                >
                                <span class="form-label mb-0">Get instant AI answer</span>
                            </label>
                            <span class="form-helper">AI will attempt to answer your question immediately</span>
                        </div>
                        
                        <div id="askQuestionError" class="alert alert-error hidden"></div>
                        
                        <div class="flex gap-md mt-xl">
                            <button type="submit" class="btn btn-primary" id="submitQuestionBtn">
                                🚀 Post Question
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="navigateTo('questions')">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Tips Card -->
                <div class="card mt-xl" style="background-color: var(--color-surface-hover);">
                    <h3 class="mb-md">💡 Tips for asking good questions:</h3>
                    <ul style="margin-left: var(--spacing-lg); color: var(--color-text-secondary); line-height: var(--line-height-relaxed);">
                        <li>Be specific and clear in your title</li>
                        <li>Provide relevant context and background</li>
                        <li>Include code examples when applicable</li>
                        <li>Mention what you've already tried</li>
                        <li>Use proper tags to categorize your question</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function attachAskQuestionHandlers() {
    // Initialize code editor
    setTimeout(() => {
        if (document.getElementById('questionCodeEditor')) {
            questionCodeEditor = createCodeEditor('questionCodeEditor', {
                placeholder: 'Paste your code here (optional)...'
            });
        }
    }, 100);
}

async function handleAskQuestion(event) {
    event.preventDefault();

    if (!AppState.currentUser) {
        showNotification('Please login to ask a question', 'warning');
        openModal('loginModal');
        return;
    }

    const submitBtn = document.getElementById('submitQuestionBtn');
    const errorEl = document.getElementById('askQuestionError');

    // Get form data
    const title = document.getElementById('questionTitle').value.trim();
    const content = document.getElementById('questionContent').value.trim();
    const tagsInput = document.getElementById('questionTags').value.trim();
    const getAIAnswer = document.getElementById('getAIAnswer').checked;

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    if (tags.length === 0) {
        errorEl.textContent = 'Please add at least one tag';
        errorEl.classList.remove('hidden');
        return;
    }

    if (tags.length > 5) {
        errorEl.textContent = 'Maximum 5 tags allowed';
        errorEl.classList.remove('hidden');
        return;
    }

    const questionData = {
        title,
        content,
        tags,
        getAIAnswer,
        code: questionCodeEditor ? questionCodeEditor.getValue() : '',
        language: questionCodeEditor ? questionCodeEditor.getLanguage() : 'javascript'
    };

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Posting...';
        errorEl.classList.add('hidden');

        const response = await fetch(`${API_URL}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(questionData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Question posted successfully!', 'success');

            // Reload questions
            await loadQuestions();

            // Navigate to the new question
            navigateTo('question-detail', { id: data.question.id });
        } else {
            errorEl.textContent = data.message || 'Failed to post question';
            errorEl.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '🚀 Post Question';
        }
    } catch (error) {
        console.error('Error posting question:', error);
        errorEl.textContent = 'Connection error. Please try again.';
        errorEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🚀 Post Question';
    }
}
