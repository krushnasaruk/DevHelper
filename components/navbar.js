// ===================================
// Navbar Component
// ===================================

// Navbar functionality is mostly handled in app.js
// This file contains additional navbar-specific utilities

function highlightActiveRoute(route) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[data-route="${route}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Handle navbar scroll behavior
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'var(--shadow-sm)';
        return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = 'var(--shadow-md)';
    }

    lastScroll = currentScroll;
});
