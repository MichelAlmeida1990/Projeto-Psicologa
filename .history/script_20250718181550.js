// Modern Interactive JavaScript for Psychologist Website
// ================================================

// Global variables
let isLoaded = false;
let scrollProgress = 0;
let ticking = false;

// Global functions for scroll handling
function updateScrollProgress() {
    try {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (!scrollProgress) return;
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    } catch (error) {
        console.warn('Erro em updateScrollProgress:', error);
    }
}

function updateActiveNav() {
    try {
        const navLinks = document.querySelectorAll('.nav-menu a');
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
    } catch (error) {
        console.warn('Erro em updateActiveNav:', error);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ==================== ERROR HANDLING & CONSOLE FIXES ====================

// Tratar erros de console e melhorar performance
function setupErrorHandling() {
    // Suprimir erros de extensões do navegador e listeners
    const originalError = console.error;
    console.error = function(...args) {
        // Filtrar erros de extensões e listeners
        const errorMessage = args.join(' ');
        if (errorMessage.includes('Extension context invalidated') ||
            errorMessage.includes('message channel closed') ||
            errorMessage.includes('favicon.ico') ||
            errorMessage.includes('listener indicated an asynchronous response') ||
            errorMessage.includes('A listener indicated an asynchronous response')) {
            return;
        }
        originalError.apply(console, args);
    };
    
    // Suprimir warnings relacionados a listeners
    const originalWarn = console.warn;
    console.warn = function(...args) {
        const warningMessage = args.join(' ');
        if (warningMessage.includes('listener indicated an asynchronous response') ||
            warningMessage.includes('message channel closed')) {
            return;
        }
        originalWarn.apply(console, args);
    };
    
    // Melhorar performance de animações
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Inicializar animações em idle time
            setupAnimations();
        });
    } else {
        setTimeout(setupAnimations, 100);
    }
    
    // Tratar erros de Promise
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && 
            (event.reason.message.includes('listener indicated an asynchronous response') ||
             event.reason.message.includes('message channel closed'))) {
            event.preventDefault();
            return;
        }
    });
}

// Configurar animações de forma otimizada
function setupAnimations() {
    // Usar Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que precisam de animação
    document.querySelectorAll('.service-card, .step, .faq-item, .contact-method').forEach(el => {
        observer.observe(el);
    });
}

// Melhorar performance de scroll
function setupScrollPerformance() {
    let ticking = false;
    
    function updateScrollElements() {
        // Atualizar progress bar
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }
        
        // Atualizar header
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }, { passive: true });
}

// Melhorar carregamento de recursos
function setupResourceLoading() {
    // Preload de imagens críticas
    const criticalImages = [
        'assets/image/logo.png',
        'assets/image/WhatsApp Image 2025-07-14 at 19.04.00.jpeg',
        'assets/image/WhatsApp Image 2025-07-14 at 19.06.52.jpeg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Melhorar carregamento de fontes
    if ('fonts' in document) {
        Promise.all([
            document.fonts.load('300 1em Poppins'),
            document.fonts.load('400 1em Poppins'),
            document.fonts.load('500 1em Poppins'),
            document.fonts.load('600 1em Poppins'),
            document.fonts.load('400 1em Playfair Display'),
            document.fonts.load('500 1em Playfair Display'),
            document.fonts.load('600 1em Playfair Display'),
            document.fonts.load('700 1em Playfair Display')
        ]).then(() => {
            document.body.classList.add('fonts-loaded');
        });
    }
}

// Melhorar inicialização geral
function setupGeneralOptimizations() {
    // Melhorar performance de DOM
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .fonts-loaded {
            font-display: swap;
        }
        
        /* Melhorar performance de animações */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Melhorar acessibilidade
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Modificar a função de inicialização principal para incluir as melhorias
function initializeWebsite() {
    // Configurar tratamento de erros primeiro
    setupErrorHandling();
    setupGeneralOptimizations();
    setupResourceLoading();
    setupScrollPerformance();
    
    // Inicializar funcionalidades principais
    setupLoadingScreen();
    setupScrollProgress();
    setupSmoothScrolling();
    setupParallaxEffects();
    setupIntersectionObserver();
    setupNavigationEffects();
    setupServiceCardEffects();
    setupFormEnhancements();
    setupScrollIndicator();
    setupBackToTop();
    
    // Adicionar inicialização mobile
    initializeMobileFeatures();
    
    // Garantir que o menu mobile seja inicializado corretamente
    setTimeout(() => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            // Remover classes que possam estar causando problemas
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            
            console.log('✅ Menu mobile inicializado corretamente');
        }
        
        // Configurar partículas
        setupMobileParticles();
        
    }, 1000);
    
    // Start loading sequence
    simulateLoading();
    
    // Log de sucesso
    console.log('🚀 Website carregado com sucesso!');
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

// ==================== MOBILE MENU CORRIGIDO ====================
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;
    const header = document.querySelector('.header');
    
    if (!navToggle || !navMenu) {
        console.warn('Menu mobile não encontrado');
        return;
    }
    
    console.log('Configurando menu mobile...');
    
    // Função para abrir o menu
    function openMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        body.classList.add('nav-open');
        
        // Prevenir scroll do body
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
        
        // Aumentar z-index do header quando menu está aberto
        if (header) {
            header.style.zIndex = '1002';
        }
        
        // Atualizar aria
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Fechar menu de navegação');
        
        console.log('Menu aberto');
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
    try {
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navToggle.contains(e.target) && 
                !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
    } catch (error) {
        console.warn('Erro ao configurar click outside:', error);
    }
    
    // Fechar menu ao pressionar ESC
    try {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    } catch (error) {
        console.warn('Erro ao configurar ESC key:', error);
    }
    
    // Melhorar acessibilidade
    navToggle.setAttribute('role', 'button');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    navToggle.setAttribute('tabindex', '0');
    
    // Suporte a teclado para o toggle
    navToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }
    });
    
    // Garantir que o menu esteja fechado inicialmente
    closeMenu();
    
    console.log('Menu mobile configurado com sucesso');
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
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: white;
    border: 2px solid #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
    background: linear-gradient(135deg, #2563eb, #3b82f6);
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
        background: linear-gradient(135deg, #3b82f6, #60a5fa);
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
                try {
                    updateScrollProgress();
                } catch (error) {
                    console.warn('Erro ao atualizar scroll otimizado:', error);
                }
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
            try {
                updateScrollProgress();
                updateActiveNav();
            } catch (error) {
                console.warn('Erro ao atualizar scroll:', error);
            }
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

// Função global para fechar menu (usada em outras funções)
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
    
    // Resetar z-index do header
    const header = document.querySelector('.header');
    if (header) {
        header.style.zIndex = '1000';
    }
    
    // Atualizar aria
    if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    }
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
    setupMobileParticles();
}

// ==================== MOBILE PARTICLES CORRIGIDO ====================
function setupMobileParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    const particles = document.querySelectorAll('.particle');
    
    if (!particlesContainer || !particles.length) {
        console.log('Partículas não encontradas');
        return;
    }
    
    console.log('Configurando partículas para mobile...');
    
    // Verificar se é dispositivo móvel
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Dispositivo móvel detectado, configurando partículas...');
        
        // Garantir que o container esteja visível
        particlesContainer.style.display = 'block';
        particlesContainer.style.opacity = '0.4';
        
        // Configurar partículas para mobile
        particles.forEach((particle, index) => {
            if (index >= 3) {
                particle.style.display = 'none';
            } else {
                // Ajustar animação para mobile
                particle.style.display = 'block';
                particle.style.animationDuration = (8 + index * 2) + 's';
                particle.style.animationDelay = (index * 1) + 's';
                particle.style.opacity = '0.6';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.willChange = 'transform';
                particle.style.transform = 'translateZ(0)';
                
                // Garantir que a animação esteja rodando
                particle.style.animationPlayState = 'running';
            }
        });
        
        // Desabilitar partículas em dispositivos com preferência por movimento reduzido
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('Movimento reduzido detectado, desabilitando partículas');
            particlesContainer.style.display = 'none';
        }
    } else {
        console.log('Dispositivo desktop, mantendo partículas padrão');
        // Garantir que todas as partículas estejam visíveis em desktop
        particles.forEach((particle, index) => {
            particle.style.display = 'block';
            particle.style.opacity = '0.7';
            particle.style.width = '6px';
            particle.style.height = '6px';
        });
    }
    
    // Pausar animações quando a página não está visível
    try {
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                particles.forEach(particle => {
                    particle.style.animationPlayState = 'paused';
                });
            } else {
                particles.forEach(particle => {
                    particle.style.animationPlayState = 'running';
                });
            }
        });
    } catch (error) {
        console.warn('Erro ao configurar visibility change:', error);
    }
    
    // Reconfigurar partículas quando a tela é redimensionada
    window.addEventListener('resize', function() {
        setTimeout(() => {
            setupMobileParticles();
        }, 100);
    });
    
    console.log('Partículas configuradas com sucesso');
} 