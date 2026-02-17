/**
 * AA Decorating - Main JavaScript File
 * Handles all interactive functionality
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize all modules
    initLoader();
    initMobileMenu();
    initStickyHeader();
    initScrollAnimations();
    initLazyLoading();
    initComparisonSliders();
    initGalleryFilter();
    initQuoteCalculator();
    initModal();
    initSmoothScroll();
    initTestimonialsSlider();
});

/**
 * Loading Animation
 */
function initLoader() {
    const loader = document.querySelector('.loader-wrapper');
    if (!loader) return;
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('fade-out');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (!mobileToggle || !mainNav) return;
    
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

/**
 * Sticky Header on Scroll
 */
function initStickyHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Scroll Animations (AOS replacement)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Check for delay
                const delay = entry.target.getAttribute('data-aos-delay');
                if (delay) {
                    entry.target.style.transitionDelay = delay + 'ms';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Lazy Loading Images
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if (lazyImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(image => {
        imageObserver.observe(image);
    });
}

/**
 * Before/After Comparison Sliders
 */
function initComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');
    
    sliders.forEach(slider => {
        const handle = slider.querySelector('.comparison-handle');
        const after = slider.querySelector('.comparison-after');
        
        if (!handle || !after) return;
        
        let isDragging = false;
        
        const updatePosition = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            
            after.style.setProperty('--position', percent + '%');
            handle.style.left = percent + '%';
        };
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updatePosition(e.clientX);
        });
        
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Touch support
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updatePosition(e.touches[0].clientX);
        });
        
        window.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        // Set initial position
        const start = slider.getAttribute('data-start') || 50;
        after.style.setProperty('--position', start + '%');
        handle.style.left = start + '%';
    });
}

/**
 * Gallery Filter
 */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Quote Calculator
 */
function initQuoteCalculator() {
    const propertyType = document.getElementById('propertyType');
    const workScope = document.getElementById('workScope');
    const roomCount = document.getElementById('roomCount');
    const wallpaperRemoval = document.getElementById('wallpaperRemoval');
    const estimateDisplay = document.getElementById('estimateDisplay');
    
    if (!estimateDisplay) return;
    
    function calculateEstimate() {
        let basePrice = 0;
        
        // Base price by property type
        switch(propertyType?.value) {
            case 'house':
                basePrice = 600;
                break;
            case 'flat':
                basePrice = 500;
                break;
            case 'commercial':
                basePrice = 800;
                break;
            default:
                basePrice = 600;
        }
        
        // Multiply by scope
        switch(workScope?.value) {
            case 'interior':
                basePrice *= 1;
                break;
            case 'exterior':
                basePrice *= 1.2;
                break;
            case 'both':
                basePrice *= 1.8;
                break;
        }
        
        // Add per room cost
        const rooms = parseInt(roomCount?.value) || 3;
        basePrice += rooms * 150;
        
        // Add wallpaper removal
        if (wallpaperRemoval?.checked) {
            basePrice *= 1.2;
        }
        
        // Calculate range (±15%)
        const lowPrice = Math.round(basePrice * 0.85);
        const highPrice = Math.round(basePrice * 1.15);
        
        estimateDisplay.textContent = `£${lowPrice} - £${highPrice}`;
    }
    
    // Add event listeners
    [propertyType, workScope, roomCount, wallpaperRemoval].forEach(element => {
        if (element) {
            element.addEventListener('change', calculateEstimate);
            element.addEventListener('input', calculateEstimate);
        }
    });
    
    // Initial calculation
    calculateEstimate();
}

/**
 * Modal Handling
 */
function initModal() {
    const modal = document.getElementById('quoteModal');
    const openButtons = document.querySelectorAll('a[href="#quote"], .btn-primary');
    const closeBtn = document.querySelector('.modal-close');
    
    if (!modal) return;
    
    openButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Testimonials Slider (Mobile)
 */
function initTestimonialsSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card-large');
    
    if (testimonialCards.length <= 3) return;
    
    // Simple implementation for mobile swipe
    // Can be enhanced with a proper slider library
}

/**
 * Form Validation and Submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        const inputs = this.querySelectorAll('[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        // Email validation
        const email = this.querySelector('input[type="email"]');
        if (email && email.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                isValid = false;
                email.classList.add('error');
            }
        }
        
        if (isValid) {
            // Show success message
            const formData = new FormData(this);
            
            // Simulate form submission
            fetch('/send-message', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Thank you! Your message has been sent.');
                    this.reset();
                } else {
                    alert('There was an error. Please try again.');
                }
            })
            .catch(() => {
                alert('There was an error. Please try again.');
            });
        }
    });
}

/**
 * Phone Number Click Tracking
 */
function initPhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone call in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'engagement',
                    'event_label': this.getAttribute('href')
                });
            }
        });
    });
}

/**
 * WhatsApp Click Tracking
 */
function initWhatsAppTracking() {
    const whatsappLinks = document.querySelectorAll('.floating-whatsapp');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track WhatsApp click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'engagement',
                    'event_label': 'floating_button'
                });
            }
        });
    });
}

/**
 * Header Hide/Show on Scroll
 * (Enhanced version)
 */
let lastScrollTop = 0;
const header = document.getElementById('mainHeader');

if (header) {
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Active Navigation Highlight
 */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Parallax Effect for Hero
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY;
        hero.style.backgroundPositionY = scrollPos * 0.5 + 'px';
    });
}

/**
 * Initialize all tracking and analytics
 */
function initAnalytics() {
    initPhoneTracking();
    initWhatsAppTracking();
}

// Initialize everything on load
window.addEventListener('load', function() {
    initActiveNav();
    initParallax();
    initContactForm();
    initAnalytics();
});