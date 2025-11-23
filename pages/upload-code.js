// ===================================
// Upload Code Page
// ===================================

let uploadCodeEditor = null;

function renderUploadCodePage() {
    return `
        <div class="section animate-fade-in">
            <div class="container container-sm">
                <h1 class="mb-md">Upload Code</h1>
                <p class="text-secondary mb-xl">
                    Share your code snippets with the community. Get feedback, showcase your work, or share useful solutions.
                </p>
                
                <div class="card">
                    <form id="uploadCodeForm" onsubmit="handleUploadCode(event)">
                        <!-- Title -->
                        <div class="form-group">
                            <label class="form-label">Code Title</label>
                            <input 
                                type="text" 
                                id="codeTitle" 
                                class="form-input" 
                                placeholder="e.g., React Custom Hook for API Calls"
                                required
                            >
                            <span class="form-helper">Give your code a descriptive title</span>
                        </div>
                        
                        <!-- Description -->
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea 
                                id="codeDescription" 
                                class="form-textarea" 
                                placeholder="Explain what this code does, how to use it, and any important notes..."
                                required
                                style="min-height: 120px;"
                            ></textarea>
                        </div>
                        
                        <!-- Code Editor -->
                        <div class="form-group">
                            <label class="form-label">Your Code</label>
                            <div id="uploadCodeEditor"></div>
                        </div>
                        
                        <!-- File Upload Option -->
                        <div class="form-group">
                            <label class="form-label">Or Upload File</label>
                            <div class="file-upload-area" id="fileUploadArea">
                                <input 
                                    type="file" 
                                    id="codeFileInput" 
                                    accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.go,.rs,.html,.css,.json,.xml"
                                    style="display: none;"
                                    onchange="handleFileSelect(event)"
                                >
                                <div class="file-upload-content" onclick="document.getElementById('codeFileInput').click()">
                                    <div style="font-size: 3rem; margin-bottom: var(--spacing-sm);">📁</div>
                                    <p class="font-semibold mb-sm">Click to upload or drag and drop</p>
                                    <p class="text-sm text-tertiary">Supports: .js, .py, .java, .cpp, .cs, .go, .rs, .html, .css</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tags -->
                        <div class="form-group">
                            <label class="form-label">Tags</label>
                            <input 
                                type="text" 
                                id="codeTags" 
                                class="form-input" 
                                placeholder="e.g., javascript, react, hooks (comma-separated)"
                                required
                            >
                            <span class="form-helper">Add tags to categorize your code</span>
                        </div>
                        
                        <!-- Visibility -->
                        <div class="form-group">
                            <label class="form-label">Visibility</label>
                            <select id="codeVisibility" class="form-select">
                                <option value="public">🌐 Public - Anyone can view</option>
                                <option value="private">🔒 Private - Only you can view</option>
                            </select>
                        </div>
                        
                        <!-- AI Code Review Option -->
                        <div class="form-group">
                            <label class="flex items-center gap-sm" style="cursor: pointer;">
                                <input 
                                    type="checkbox" 
                                    id="getAIReview" 
                                    style="width: 18px; height: 18px; cursor: pointer;"
                                >
                                <span class="form-label mb-0">Get AI code review</span>
                            </label>
                            <span class="form-helper">AI will analyze your code and provide feedback</span>
                        </div>
                        
                        <div id="uploadCodeError" class="alert alert-error hidden"></div>
                        
                        <div class="flex gap-md mt-xl">
                            <button type="submit" class="btn btn-primary" id="submitCodeBtn">
                                📤 Upload Code
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="navigateTo('profile')">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Tips Card -->
                <div class="card mt-xl" style="background-color: var(--color-surface-hover);">
                    <h3 class="mb-md">💡 Tips for sharing code:</h3>
                    <ul style="margin-left: var(--spacing-lg); color: var(--color-text-secondary); line-height: var(--line-height-relaxed);">
                        <li>Include comments to explain complex logic</li>
                        <li>Remove sensitive information (API keys, passwords, etc.)</li>
                        <li>Provide context in the description</li>
                        <li>Use descriptive variable and function names</li>
                        <li>Format your code properly for readability</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function attachUploadCodeHandlers() {
    // Initialize code editor
    setTimeout(() => {
        if (document.getElementById('uploadCodeEditor')) {
            uploadCodeEditor = createCodeEditor('uploadCodeEditor', {
                placeholder: 'Paste or type your code here...'
            });
        }

        // Setup drag and drop
        const dropArea = document.getElementById('fileUploadArea');
        if (dropArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, () => {
                    dropArea.style.borderColor = 'var(--color-primary)';
                    dropArea.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.05)';
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, () => {
                    dropArea.style.borderColor = '';
                    dropArea.style.backgroundColor = '';
                }, false);
            });

            dropArea.addEventListener('drop', handleDrop, false);
        }
    }, 100);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        handleFileSelect({ target: { files } });
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;

        if (uploadCodeEditor) {
            uploadCodeEditor.setValue(content);
        }

        // Try to detect language from file extension
        const ext = file.name.split('.').pop().toLowerCase();
        const languageMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'javascript',
            'tsx': 'javascript',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'cpp',
            'cs': 'csharp',
            'go': 'go',
            'rs': 'rust',
            'html': 'html',
            'css': 'css'
        };

        const language = languageMap[ext] || 'javascript';
        const langSelector = document.querySelector('#uploadCodeEditor .language-selector');
        if (langSelector) {
            langSelector.value = language;
        }

        showNotification(`File "${file.name}" loaded successfully!`, 'success');
    };

    reader.readAsText(file);
}

async function handleUploadCode(event) {
    event.preventDefault();

    if (!AppState.currentUser) {
        showNotification('Please login to upload code', 'warning');
        openModal('loginModal');
        return;
    }

    const submitBtn = document.getElementById('submitCodeBtn');
    const errorEl = document.getElementById('uploadCodeError');

    // Get form data
    const title = document.getElementById('codeTitle').value.trim();
    const description = document.getElementById('codeDescription').value.trim();
    const tagsInput = document.getElementById('codeTags').value.trim();
    const visibility = document.getElementById('codeVisibility').value;
    const getAIReview = document.getElementById('getAIReview').checked;

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    if (!uploadCodeEditor || !uploadCodeEditor.getValue().trim()) {
        errorEl.textContent = 'Please enter some code';
        errorEl.classList.remove('hidden');
        return;
    }

    if (tags.length === 0) {
        errorEl.textContent = 'Please add at least one tag';
        errorEl.classList.remove('hidden');
        return;
    }

    const codeData = {
        title,
        description,
        code: uploadCodeEditor.getValue(),
        language: uploadCodeEditor.getLanguage(),
        tags,
        visibility,
        getAIReview
    };

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Uploading...';
        errorEl.classList.add('hidden');

        const response = await fetch(`${API_URL}/code/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(codeData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Code uploaded successfully!', 'success');

            // Navigate to profile
            navigateTo('profile');
        } else {
            errorEl.textContent = data.message || 'Failed to upload code';
            errorEl.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '📤 Upload Code';
        }
    } catch (error) {
        console.error('Error uploading code:', error);
        errorEl.textContent = 'Connection error. Please try again.';
        errorEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '📤 Upload Code';
    }
}

// CSS for file upload area
const fileUploadStyles = document.createElement('style');
fileUploadStyles.textContent = `
    .file-upload-area {
        border: 2px dashed var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        text-align: center;
        transition: all var(--transition-base);
        cursor: pointer;
    }
    
    .file-upload-area:hover {
        border-color: var(--color-primary);
        background-color: rgba(var(--color-primary-rgb), 0.05);
    }
    
    .file-upload-content {
        color: var(--color-text-secondary);
    }
`;
document.head.appendChild(fileUploadStyles);
