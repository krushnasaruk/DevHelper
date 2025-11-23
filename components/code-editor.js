// ===================================
// Code Editor Component
// ===================================

function createCodeEditor(containerId, options = {}) {
    const {
        language = 'javascript',
        initialValue = '',
        placeholder = 'Enter your code here...',
        readonly = false
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return null;

    const editorHtml = `
        <div class="code-editor-wrapper">
            <div class="code-editor-header">
                <select class="language-selector" onchange="updateLanguage(this)" ${readonly ? 'disabled' : ''}>
                    <option value="javascript" ${language === 'javascript' ? 'selected' : ''}>JavaScript</option>
                    <option value="python" ${language === 'python' ? 'selected' : ''}>Python</option>
                    <option value="java" ${language === 'java' ? 'selected' : ''}>Java</option>
                    <option value="cpp" ${language === 'cpp' ? 'selected' : ''}>C++</option>
                    <option value="csharp" ${language === 'csharp' ? 'selected' : ''}>C#</option>
                    <option value="go" ${language === 'go' ? 'selected' : ''}>Go</option>
                    <option value="rust" ${language === 'rust' ? 'selected' : ''}>Rust</option>
                    <option value="html" ${language === 'html' ? 'selected' : ''}>HTML</option>
                    <option value="css" ${language === 'css' ? 'selected' : ''}>CSS</option>
                </select>
            </div>
            <textarea 
                class="code-editor-input" 
                placeholder="${placeholder}"
                ${readonly ? 'readonly' : ''}
                spellcheck="false"
            >${initialValue}</textarea>
        </div>
    `;

    container.innerHTML = editorHtml;

    return {
        getValue: () => container.querySelector('.code-editor-input').value,
        setValue: (value) => { container.querySelector('.code-editor-input').value = value; },
        getLanguage: () => container.querySelector('.language-selector').value
    };
}

function updateLanguage(selectEl) {
    // Language is changed, could update syntax highlighting preview if needed
    console.log('Language changed to:', selectEl.value);
}

function renderCodeBlock(code, language = 'javascript') {
    const languageClass = `language-${language}`;

    return `
        <div class="code-block">
            <div class="code-block-header">
                <span>${language.toUpperCase()}</span>
                <button class="copy-btn" onclick="copyCode(this)">
                    📋 Copy
                </button>
            </div>
            <pre><code class="${languageClass}">${escapeHtml(code)}</code></pre>
        </div>
    `;
}

function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;

    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.style.backgroundColor = 'var(--color-success)';
        button.style.color = 'white';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 2000);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Apply syntax highlighting after content is loaded
function applySyntaxHighlighting() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

// CSS for code editor
const codeEditorStyles = document.createElement('style');
codeEditorStyles.textContent = `
    .code-editor-wrapper {
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        overflow: hidden;
        background-color: var(--color-surface);
    }
    
    .code-editor-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md) var(--spacing-lg);
        background-color: var(--color-surface-hover);
        border-bottom: 1px solid var(--color-border);
    }
    
    .language-selector {
        padding: 0.375rem 0.75rem;
        font-size: var(--font-size-sm);
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-family: var(--font-family-mono);
    }
    
    .code-editor-input {
        width: 100%;
        min-height: 200px;
        padding: var(--spacing-lg);
        font-family: var(--font-family-mono);
        font-size: var(--font-size-sm);
        line-height: 1.6;
        border: none;
        resize: vertical;
        background-color: var(--color-surface);
        color: var(--color-text-primary);
    }
    
    .code-editor-input:focus {
        outline: none;
    }
    
    .code-editor-input::placeholder {
        color: var(--color-text-tertiary);
    }
`;
document.head.appendChild(codeEditorStyles);
