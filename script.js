/**
 * Portfolio Website - Main JavaScript File
 * Features:
 * - Typing animation for hero text
 * - Dark mode toggle with localStorage persistence
 * - Responsive mobile menu
 * - Smooth scrolling navigation
 * - Scroll animations
 * - Form validation
 * - Dynamic copyright year
 */

class Portfolio {
  constructor() {
    this.init();
  }

  init() {
    // DOM Elements
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.darkModeToggle = document.querySelector('.dark-mode-toggle');
    this.contactForm = document.getElementById('contact-form');
    this.yearElement = document.getElementById('year');

    // Initialize components
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.setCopyrightYear();
    this.initDarkMode();
    
    // Run typing effect if element exists
    if (document.querySelector('.typing-text')) {
      this.typeEffect();
    }
  }

  setupEventListeners() {
    // Mobile menu toggle
    this.hamburger?.addEventListener('click', () => this.toggleMobileMenu());

    // Dark mode toggle
    this.darkModeToggle?.addEventListener('click', () => this.toggleDarkMode());

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => this.handleSmoothScroll(e, anchor));
    });

    // Form submission
    this.contactForm?.addEventListener('submit', e => this.handleFormSubmit(e));

    // Sticky navbar on scroll
    window.addEventListener('scroll', () => this.handleNavbarScroll());
  }

  // Typing animation effect
  typeEffect() {
    const typingText = document.querySelector('.typing-text');
    const text = typingText.textContent;
    typingText.textContent = '';
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        typingText.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
  }

  // Mobile menu functionality
  toggleMobileMenu() {
    this.mobileMenu.classList.toggle('active');
    this.hamburger.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    const isExpanded = this.hamburger.getAttribute('aria-expanded') === 'true';
    this.hamburger.setAttribute('aria-expanded', !isExpanded);
  }

  // Dark mode functionality
  initDarkMode() {
    // Check for saved preference or use system preference
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode === 'dark' || (!savedMode && systemPrefersDark)) {
      document.body.classList.add('dark-mode');
      this.updateDarkModeIcon(true);
    }
  }

  toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    this.updateDarkModeIcon(isDarkMode);
    localStorage.setItem('darkMode', isDarkMode ? 'dark' : 'light');
  }

  updateDarkModeIcon(isDarkMode) {
    const icon = this.darkModeToggle.querySelector('i');
    icon.classList.toggle('fa-moon', !isDarkMode);
    icon.classList.toggle('fa-sun', isDarkMode);
  }

  // Smooth scrolling for navigation
  handleSmoothScroll(e, anchor) {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      if (this.mobileMenu?.classList.contains('active')) {
        this.toggleMobileMenu();
      }
    }
  }

  // Sticky navbar on scroll
  handleNavbarScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  // Scroll animations
  setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      fadeElements.forEach((element, index) => {
        // Add staggered delay for animation
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
      });
    }
  }

  // Form handling
  handleFormSubmit(e) {
    e.preventDefault();
    
    let isValid = true;
    const formData = {};
    const successMessage = document.getElementById('form-success');
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
    });
    
    // Validate each field
    ['name', 'email', 'message'].forEach(field => {
      const input = document.getElementById(field);
      formData[field] = input.value.trim();
      
      if (!formData[field]) {
        this.showError(input, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        isValid = false;
      } else if (field === 'email' && !this.validateEmail(formData.email)) {
        this.showError(input, 'Please enter a valid email');
        isValid = false;
      }
    });
    
    if (isValid) {
      this.showSuccessMessage(successMessage);
      this.contactForm.reset();
    }
  }

  showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    input.classList.add('error');
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showSuccessMessage(element) {
    element.textContent = 'Thank you for your message! I will get back to you soon.';
    element.style.display = 'block';
    
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }

  // Utility functions
  setCopyrightYear() {
    if (this.yearElement) {
      this.yearElement.textContent = new Date().getFullYear();
    }
  }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});