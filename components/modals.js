// ===================================
// Modal Components
// ===================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Clear any previous errors
        const errorEl = modal.querySelector('.alert-error');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }

        // Clear form fields
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Switch between login and register modals
function switchToRegister() {
    closeModal('loginModal');
    setTimeout(() => openModal('registerModal'), 200);
}

function switchToLogin() {
    closeModal('registerModal');
    setTimeout(() => openModal('loginModal'), 200);
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});
