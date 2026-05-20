/**
 * M&N Capital Group - Corporate JavaScript
 * Professional and optimized script for corporate website
 */

// Strict mode for better error handling
'use strict';

// DOM Elements
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// Configuration
const config = {
    scrollThreshold: 100,
    animationThreshold: 0.1,
    debounceDelay: 100,
    notificationDuration: 5000
};

// Application State
const state = {
    isMenuOpen: false,
    isScrolled: false,
    animationsEnabled: true
};

/**
 * Initialize the application
 */
function init() {
    setupEventListeners();
    setupScrollAnimations();
    setupFormHandlers();
    setupLazyLoading();
    setupAccessibility();
    console.log('M&N Capital Group - Website initialized successfully');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Mobile menu toggle
    hamburger?.addEventListener('click', toggleMobileMenu);
    
    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (state.isMenuOpen) {
                closeMobileMenu();
            }
        });
    });
    
    // Scroll events with debouncing
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(handleScroll, config.debounceDelay);
    });
    
    // Resize events with debouncing
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, config.debounceDelay);
    });
    
    // Escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) {
            closeMobileMenu();
        }
    });
}

/**
 * Handle scroll events
 */
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header shadow and background
    if (scrollTop > config.scrollThreshold) {
        header?.classList.add('scrolled');
        state.isScrolled = true;
    } else {
        header?.classList.remove('scrolled');
        state.isScrolled = false;
    }
}

/**
 * Handle resize events
 */
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && state.isMenuOpen) {
        closeMobileMenu();
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    
    hamburger?.classList.toggle('active');
    navMenu?.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
    
    // Update ARIA attributes
    hamburger?.setAttribute('aria-expanded', state.isMenuOpen);
    navMenu?.setAttribute('aria-hidden', !state.isMenuOpen);
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    state.isMenuOpen = false;
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
    navMenu?.setAttribute('aria-hidden', 'true');
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Setup scroll animations
 */
function setupScrollAnimations() {
    if (!state.animationsEnabled) return;
    
    const observerOptions = {
        threshold: config.animationThreshold,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.value-card, .service-item, .filiale-card, .contact-method, .dg-message'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Setup form handlers
 */
function setupFormHandlers() {
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

/**
 * Handle contact form submission
 */
async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateContactForm(data)) {
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitButton.disabled = true;
    
    try {
        // Simulate API call (replace with actual endpoint)
        await simulateApiCall(data);
        
        showNotification('Votre demande a été envoyée avec succès! Notre équipe vous contactera dans les 24h.', 'success');
        contactForm.reset();
        
    } catch (error) {
        showNotification('Une erreur est survenue. Veuillez réessayer plus tard.', 'error');
        console.error('Form submission error:', error);
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

/**
 * Handle newsletter form submission
 */
async function handleNewsletterForm(e) {
    e.preventDefault();
    
    const formData = new FormData(newsletterForm);
    const email = formData.get('email');
    
    if (!validateEmail(email)) {
        showNotification('Veuillez entrer une adresse email valide.', 'error');
        return;
    }
    
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';
    submitButton.disabled = true;
    
    try {
        await simulateApiCall({ email, type: 'newsletter' });
        showNotification('Inscription à la newsletter réussie!', 'success');
        newsletterForm.reset();
        
    } catch (error) {
        showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

/**
 * Validate contact form
 */
function validateContactForm(data) {
    const required = ['name', 'email', 'subject', 'message'];
    
    for (const field of required) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Le champ ${field} est requis.`, 'error');
            return false;
        }
    }
    
    if (!validateEmail(data.email)) {
        showNotification('Veuillez entrer une adresse email valide.', 'error');
        return false;
    }
    
    if (data.message.length < 10) {
        showNotification('Le message doit contenir au moins 10 caractères.', 'error');
        return false;
    }
    
    return true;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Simulate API call
 */
function simulateApiCall(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                console.log('API Call Data:', data);
                resolve({ success: true });
            } else {
                reject(new Error('API Error'));
            }
        }, 1500);
    });
}

/**
 * Setup lazy loading for images
 */
function setupLazyLoading() {
    const imageOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, imageOptions);
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Setup accessibility features
 */
function setupAccessibility() {
    // Add ARIA labels dynamically
    hamburger?.setAttribute('aria-label', 'Menu');
    hamburger?.setAttribute('aria-expanded', 'false');
    navMenu?.setAttribute('aria-hidden', 'true');
    
    // Skip to main content link
    const skipLink = document.querySelector('.sr-only');
    if (skipLink) {
        skipLink.addEventListener('focus', () => {
            skipLink.style.position = 'static';
            skipLink.style.width = 'auto';
            skipLink.style.height = 'auto';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.position = 'absolute';
            skipLink.style.width = '1px';
            skipLink.style.height = '1px';
        });
    }
    
    // Keyboard navigation for menu items
    document.querySelectorAll('.nav-menu a').forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextLink = link.parentElement.nextElementSibling?.querySelector('a');
                if (nextLink) nextLink.focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevLink = link.parentElement.previousElementSibling?.querySelector('a');
                if (prevLink) prevLink.focus();
            }
        });
    });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Notification styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        fontSize: '14px'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, config.notificationDuration);
}

/**
 * Performance monitoring
 */
function setupPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        // Send to analytics if needed
        if (window.gtag) {
            gtag('event', 'page_load_time', {
                custom_parameter: loadTime
            });
        }
    });
}

/**
 * Add CSS for animations
 */
const animationCSS = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(20px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

// Add animation styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Setup smooth scrolling
setupSmoothScrolling();

// Setup performance monitoring (optional)
// setupPerformanceMonitoring();

// Export for potential external use
window.MNCapitalGroup = {
    showNotification,
    toggleMobileMenu,
    closeMobileMenu
};
