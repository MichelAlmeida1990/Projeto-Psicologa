// Modern Interactive JavaScript for Psychologist Website
// ================================================

// Global variables
let isLoaded = false;
let scrollProgress = 0;
let ticking = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main initialization function
function initializeWebsite() {
    setupLoadingScreen();
    setupScrollProgress();
    setupSmoothScrolling();
    setupParallaxEffects();
    setupIntersectionObserver();
    setupNavigationEffects();
    setupServiceCardEffects();
    setupFormEnhancements();
    setupMobileMenu();
    setupScrollIndicator();
    setupBackToTop();
    
    // Adicionar inicialização mobile
    initializeMobileFeatures();
    
    // Start loading sequence
    simulateLoading();
}

// ==================== LOADING SCREEN ====================
function setupLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    if (!loadingScreen || !loadingProgress) return;
    
    // Simulate loading progress - slower for better visualization
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 8; // Reduced from 15 to 8 for slower progress
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                hideLoadingScreen();
            }, 1000); // Increased from 500 to 1000ms
        }
    }, 150); // Increased from 100 to 150ms for slower updates
}

function simulateLoading() {
    // Simulate actual loading time - increased to 5 seconds for better visualization
    setTimeout(() => {
        document.body.classList.add('loaded');
        isLoaded = true;
    }, 5000);
}

function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }
}

// ==================== SCROLL PROGRESS ====================
function setupScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollProgress);
            ticking = true;
            setTimeout(() => { ticking = false; }, 10);
        }
    });
}

// ==================== SMOOTH SCROLLING ====================
function setupSmoothScrolling() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== PARALLAX EFFECTS ====================
function setupParallaxEffects() {
    const hero = document.querySelector('.hero');
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Hero parallax
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Custom parallax elements
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// ==================== INTERSECTION OBSERVER ====================
function setupIntersectionObserver() {
    // Animate elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for children
                const children = entry.target.querySelectorAll('.service-card, .step, .faq-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe individual elements
    document.querySelectorAll('.service-card, .step, .faq-item').forEach(element => {
        observer.observe(element);
    });
}

// ==================== NAVIGATION EFFECTS ====================
function setupNavigationEffects() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 500) {
            header.classList.add('nav-up');
        } else {
            header.classList.remove('nav-up');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
}

// ==================== SERVICE CARD EFFECTS ====================
function setupServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // 3D tilt effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Pulsing icon effect
        const icon = card.querySelector('.icon');
        if (icon) {
            card.addEventListener('mouseenter', function() {
                icon.classList.add('pulse');
            });
            
            card.addEventListener('mouseleave', function() {
                icon.classList.remove('pulse');
            });
        }
    });
}

// ==================== FORM ENHANCEMENTS ====================
function setupFormEnhancements() {
    const form = document.querySelector('.contact-form');
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    if (!form) return;
    
    // Floating labels effect
    formInputs.forEach(input => {
        // Check if input has value on load
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    
    // Form submission with animation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Animate button
        submitBtn.innerHTML = `
            <div class="loading-spinner"></div>
            Enviando...
        `;
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '✓ Enviado!';
            submitBtn.style.background = '#10b981';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
                formInputs.forEach(input => {
                    input.classList.remove('has-value');
                    input.parentElement.classList.remove('focused');
                });
            }, 2000);
        }, 2000);
    });
}

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    // Função para fechar o menu
    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        body.classList.remove('nav-open');
        
        // Reativar scroll
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
    }
    
    // Função para abrir o menu
    function openMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        body.classList.add('nav-open');
        
        // Prevenir scroll do body
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
    }
    
    // Toggle do menu
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Aguardar um pouco para a animação de scroll
            setTimeout(() => {
                closeMenu();
            }, 100);
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navToggle.contains(e.target) && 
            !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Melhorar acessibilidade
    navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('role', 'button');
    navToggle.setAttribute('tabindex', '0');
    
    // Atualizar aria-expanded
    navToggle.addEventListener('click', function() {
        const isExpanded = navMenu.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded.toString());
        this.setAttribute('aria-label', isExpanded ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });
    
    // Navegação por teclado
    navToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Fechar menu ao redimensionar a tela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Melhorar performance em dispositivos móveis
    let touchStartY = 0;
    let touchEndY = 0;
    
    navMenu.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    navMenu.addEventListener('touchmove', function(e) {
        touchEndY = e.touches[0].clientY;
    });
    
    navMenu.addEventListener('touchend', function(e) {
        const touchDiff = touchStartY - touchEndY;
        
        // Se o usuário deslizar para baixo no menu, fechar
        if (touchDiff < -50 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ==================== SCROLL INDICATOR ====================
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
    
    scrollIndicator.addEventListener('click', function() {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}

// ==================== BACK TO TOP ====================
function setupBackToTop() {
    // Create back to top button if it doesn't exist
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m18 15-6-6-6 6"/>
            </svg>
        `;
        document.body.appendChild(backToTopBtn);
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== FAQ FUNCTIONALITY ====================
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = this.querySelector('.faq-icon');
        
        faqItem.classList.toggle('active');
        
        if (faqItem.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.textContent = '−';
        } else {
            answer.style.maxHeight = '0';
            icon.textContent = '+';
        }
    });
});

// ==================== PERFORMANCE OPTIMIZATIONS ====================
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ==================== ADDITIONAL STYLES INJECTION ====================
// Inject additional CSS for animations and effects
const additionalStyles = `
<style>
/* Enhanced Navigation */
.header.scrolled {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header.nav-up {
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out;
}

.nav-menu a.active {
    color: var(--primary-color);
}

.nav-menu a.active::after {
    width: 100%;
}

/* Animation Classes */
.animate-in {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.6s ease;
}

section {
    opacity: 0;
    transform: translateY(50px);
}

.service-card {
    transition: all 0.4s ease;
}

.service-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.icon.pulse {
    animation: iconPulse 0.6s ease;
}

@keyframes iconPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

/* Form Enhancements */
.form-group {
    position: relative;
    margin-bottom: 1.5rem;
}

.form-group.focused input,
.form-group.focused textarea {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 8px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Back to Top Button */
.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #d946ef, #a855f7);
    color: white;
    border: 2px solid #d946ef;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(217, 70, 239, 0.3);
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(217, 70, 239, 0.5);
    background: linear-gradient(135deg, #a855f7, #7c3aed);
    color: white;
}

/* Mobile Menu Enhancements */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 300px;
        height: 100vh;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: right 0.3s ease;
        z-index: 1000;
    }
    
    .nav-menu.active {
        right: 0;
    }
    
    .nav-menu a {
        color: white;
        font-size: 1.2rem;
        margin: 1rem 0;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    body.nav-open {
        overflow: hidden;
    }
}

/* Responsive Enhancements */
@media (max-width: 768px) {
    .loading-content {
        padding: 0 20px;
    }
    
    .particles-container {
        display: none;
    }
    
    .scroll-indicator {
        bottom: 20px;
    }
    
    .back-to-top {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
    }
}
</style>
`;

// Inject the styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// ==================== INITIALIZATION COMPLETE ====================
console.log('🚀 Modern Interactive Website Loaded Successfully!'); 

// ==================== MOBILE-SPECIFIC FUNCTIONS ====================

// Detectar se é dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
}

// Melhorar performance em dispositivos móveis
function setupMobileOptimizations() {
    if (!isMobileDevice()) return;
    
    // Reduzir animações em dispositivos móveis
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .particle {
                animation-duration: 15s !important;
            }
            .floating-element {
                animation-duration: 20s !important;
            }
            .hero-cta:hover {
                transform: none !important;
            }
            .service-card:hover {
                transform: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Otimizar scroll para mobile
    let ticking = false;
    function updateScrollOptimized() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateScrollOptimized, { passive: true });
}

// Gestos touch para mobile
function setupTouchGestures() {
    if (!isMobileDevice()) return;
    
    // Swipe para fechar menu
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Swipe horizontal para fechar menu
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }
    }, { passive: true });
}

// Melhorar acessibilidade para mobile
function setupMobileAccessibility() {
    if (!isMobileDevice()) return;
    
    // Aumentar área de toque para links
    const links = document.querySelectorAll('a, button, .nav-toggle');
    links.forEach(link => {
        link.style.minHeight = '44px';
        link.style.minWidth = '44px';
    });
    
    // Melhorar focus states
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Otimizar imagens para mobile
function setupMobileImageOptimization() {
    if (!isMobileDevice()) return;
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Lazy loading para imagens
        img.loading = 'lazy';
        
        // Reduzir qualidade em mobile se necessário
        if (img.src.includes('assets/image/')) {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        }
    });
}

// Melhorar formulário para mobile
function setupMobileFormEnhancements() {
    if (!isMobileDevice()) return;
    
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Prevenir zoom no iOS
        if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
            input.style.fontSize = '16px';
        }
        
        // Melhorar UX do formulário
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Melhorar submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Feedback visual
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simular envio (substitua por sua lógica real)
        setTimeout(() => {
            submitBtn.textContent = 'Mensagem enviada!';
            submitBtn.style.background = 'var(--accent-color)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// Melhorar performance de scroll
function setupMobileScrollOptimization() {
    if (!isMobileDevice()) return;
    
    let scrollTimeout;
    
    function handleScroll() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Atualizar elementos que dependem do scroll
            updateScrollProgress();
            updateActiveNav();
        }, 100);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Melhorar carregamento para mobile
function setupMobileLoadingOptimization() {
    if (!isMobileDevice()) return;
    
    // Reduzir tempo de loading em mobile
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            hideLoadingScreen();
        }, 3000); // Reduzido de 5s para 3s em mobile
    }
    
    // Preload de recursos críticos
    const criticalResources = [
        'assets/image/logo.png',
        'assets/image/WhatsApp Image 2025-07-14 at 19.04.00.jpeg',
        'assets/image/WhatsApp Image 2025-07-14 at 19.06.52.jpeg'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Melhorar navegação para mobile
function setupMobileNavigation() {
    if (!isMobileDevice()) return;
    
    // Melhorar scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20; // Margem extra
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            }
        });
    });
}

// Função para fechar menu (usada em outras funções)
function closeMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const body = document.body;
    
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
    if (body) body.classList.remove('nav-open');
    
    // Reativar scroll
    body.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
}

// ==================== INITIALIZATION FOR MOBILE ====================

// Adicionar inicialização mobile à função principal
function initializeMobileFeatures() {
    setupMobileOptimizations();
    setupTouchGestures();
    setupMobileAccessibility();
    setupMobileImageOptimization();
    setupMobileFormEnhancements();
    setupMobileScrollOptimization();
    setupMobileLoadingOptimization();
    setupMobileNavigation();
} 