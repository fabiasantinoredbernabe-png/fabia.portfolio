// ========================================
// APP NAMESPACE & CONFIGURATION
// ========================================
const App = {
  config: {
    theme: localStorage.getItem('theme') || 'dark',
    scrollProgressBar: '.scroll-progress',
    tabSelector: '.tab-btn',
    navLinks: '.nav-link',
    cards: '.card',
  },

  // ========================================
  // INITIALIZATION
  // ========================================
  init() {
    this.setTheme(this.config.theme);
    this.setupNavigation();
    this.setupTabs();
    this.setupIntersectionObserver();
    this.setupSmoothScroll();
    this.setupScrollProgress();
    this.setupFormHandler();
    this.setupCodeBlocks();
    this.setupThemeToggle();
    this.setupSearch();
    this.setupAssignmentUploads();
    console.log('🚀 E-Portfolio initialized successfully');
  },

  // ========================================
  // THEME MANAGEMENT
  // ========================================
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.config.theme = theme;
  },

  setupThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const newTheme = this.config.theme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      this.updateThemeIcon(newTheme);
    });

    this.updateThemeIcon(this.config.theme);
  },

  updateThemeIcon(theme) {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  },

  // ========================================
  // NAVIGATION SETUP
  // ========================================
  setupNavigation() {
    const hamburger = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll(this.config.navLinks);

    if (!hamburger || !navMenu) return;

    // Toggle hamburger menu
    hamburger.addEventListener('click', () => {
      this.toggleMenu(hamburger, navMenu);
    });

    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu(hamburger, navMenu);
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (event) => {
      const isClickInsideNav = navMenu.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);

      if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
        this.closeMenu(hamburger, navMenu);
      }
    });

    // Update active link on scroll
    this.updateActiveNavLink();
    window.addEventListener('scroll', () => this.updateActiveNavLink());
  },

  toggleMenu(hamburger, navMenu) {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  },

  closeMenu(hamburger, navMenu) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  },

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll(this.config.navLinks).forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  },

  // ========================================
  // TAB SYSTEM
  // ========================================
  setupTabs() {
    const tabButtons = document.querySelectorAll(this.config.tabSelector);
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => {
          content.classList.remove('active');
          content.style.opacity = '0';
        });

        // Add active class to clicked button
        button.classList.add('active');

        // Show selected tab with fade-in animation
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
          selectedTab.classList.add('active');
          this.fadeIn(selectedTab);
        }
      });
    });
  },

  fadeIn(element) {
    element.style.animation = 'none';
    setTimeout(() => {
      element.style.animation = 'fadeInUp 0.4s ease forwards';
      element.style.opacity = '1';
    }, 10);
  },

  // ========================================
  // ASSIGNMENT UPLOAD HANDLING
  // ========================================
  setupAssignmentUploads() {
    this.setupImageUpload();
    this.setupFileUpload();
  },

  setupImageUpload() {
    const imageInput = document.querySelector('.assignment-image-input');
    const label = document.querySelector('label[for="assignment-image"]');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeBtn = document.getElementById('removeImageBtn');
    const replaceBtn = document.getElementById('replaceImageBtn');

    if (!imageInput) return;

    // Handle image selection from input
    imageInput.addEventListener('change', (e) => {
      this.handleImageUpload(e, imagePreview, previewContainer, label);
    });

    // Handle click on label to trigger input
    if (label) {
      label.addEventListener('click', () => {
        imageInput.click();
      });
    }

    // Remove image button
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.removeImage(imageInput, previewContainer, label);
      });
    }

    // Replace image button
    if (replaceBtn) {
      replaceBtn.addEventListener('click', () => {
        imageInput.click();
      });
    }

    // Drag and drop support
    if (label) {
      label.addEventListener('dragover', (e) => {
        e.preventDefault();
        label.style.background = 'rgba(99, 102, 241, 0.2)';
        label.style.borderColor = 'var(--color-primary)';
      });

      label.addEventListener('dragleave', () => {
        label.style.background = '';
        label.style.borderColor = '';
      });

      label.addEventListener('drop', (e) => {
        e.preventDefault();
        label.style.background = '';
        label.style.borderColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
          imageInput.files = files;
          const event = new Event('change', { bubbles: true });
          imageInput.dispatchEvent(event);
        } else {
          this.showNotification('Please drop a valid image file', 'error');
        }
      });
    }
  },

  handleImageUpload(e, imagePreview, previewContainer, label) {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showNotification('Image size must be less than 5MB', 'error');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.src = event.target.result;
      previewContainer.style.display = 'flex';
      if (label) label.style.display = 'none';
      this.showNotification(`Image "${file.name}" uploaded successfully`, 'success');
    };
    reader.readAsDataURL(file);
  },

  removeImage(imageInput, previewContainer, label) {
    imageInput.value = '';
    previewContainer.style.display = 'none';
    if (label) label.style.display = 'flex';
    this.showNotification('Image removed', 'info');
  },

  setupFileUpload() {
    const fileInput = document.querySelector('.assignment-file-input');
    const label = document.querySelector('label[for="assignment-file"]');
    const statusContainer = document.getElementById('fileStatusContainer');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeBtn = document.getElementById('removeFileBtn');

    if (!fileInput) return;

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
      this.handleFileUpload(e, fileName, fileSize, statusContainer, label);
    });

    // Click on label to trigger input
    if (label) {
      label.addEventListener('click', () => {
        fileInput.click();
      });
    }

    // Remove file button
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.removeFile(fileInput, statusContainer, label);
      });
    }

    // Drag and drop support
    if (label) {
      label.addEventListener('dragover', (e) => {
        e.preventDefault();
        label.style.background = 'rgba(99, 102, 241, 0.2)';
        label.style.borderColor = 'var(--color-primary)';
      });

      label.addEventListener('dragleave', () => {
        label.style.background = '';
        label.style.borderColor = '';
      });

      label.addEventListener('drop', (e) => {
        e.preventDefault();
        label.style.background = '';
        label.style.borderColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
          const fileExt = '.' + files[0].name.split('.').pop().toLowerCase();
          
          if (validExtensions.includes(fileExt)) {
            fileInput.files = files;
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
          } else {
            this.showNotification('Please drop a valid document file (PDF, Word, or Text)', 'error');
          }
        }
      });
    }
  },

  handleFileUpload(e, fileName, fileSize, statusContainer, label) {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExt)) {
      this.showNotification('Please upload a valid document file (PDF, Word, or Text)', 'error');
      e.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showNotification('File size must be less than 10MB', 'error');
      e.target.value = '';
      return;
    }

    // Display file info
    fileName.textContent = file.name;
    fileSize.textContent = this.formatFileSize(file.size);
    statusContainer.style.display = 'flex';
    if (label) label.style.display = 'none';
    
    this.showNotification(`Document "${file.name}" uploaded successfully`, 'success');
  },

  removeFile(fileInput, statusContainer, label) {
    fileInput.value = '';
    statusContainer.style.display = 'none';
    if (label) label.style.display = 'flex';
    this.showNotification('Document removed', 'info');
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  // ========================================
  // SCROLL PROGRESS BAR
  // ========================================
  setupScrollProgress() {
    const progressBar = document.querySelector(this.config.scrollProgressBar);
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.pageYOffset / totalHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    });
  },

  // ========================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ========================================
  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe cards and activity items
    document.querySelectorAll('.card, .activity-card, .quiz-card, .seatwork-card').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  },

  // ========================================
  // SMOOTH SCROLL
  // ========================================
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  },

  // ========================================
  // CODE BLOCKS ENHANCEMENT
  // ========================================
  setupCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach(block => {
      block.style.position = 'relative';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = '<span class="copy-text">Copy</span>';
      copyBtn.setAttribute('aria-label', 'Copy code');

      copyBtn.addEventListener('click', () => this.copyToClipboard(block, copyBtn));
      block.appendChild(copyBtn);

      this.highlightCode(block);
    });
  },

  highlightCode(block) {
    const code = block.querySelector('code');
    if (!code) return;

    const keywords = [
      'public', 'private', 'protected', 'static', 'final', 'abstract',
      'class', 'interface', 'extends', 'implements', 'new', 'return',
      'int', 'double', 'String', 'boolean', 'void', 'long', 'float',
      'if', 'else', 'for', 'while', 'switch', 'case', 'default', 'break',
      'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package',
      'super', 'this', 'null', 'true', 'false',
    ];

    const dataTypes = ['String', 'int', 'double', 'boolean', 'long', 'float', 'char', 'byte'];
    const comments = /\/\/.*/g;
    const strings = /"[^"]*"|'[^']*'/g;

    let html = code.innerHTML;

    // Replace comments
    html = html.replace(comments, '<span class="comment">$&</span>');

    // Replace strings
    html = html.replace(strings, '<span class="string">$&</span>');

    // Replace keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
    });

    code.innerHTML = html;
  },

  copyToClipboard(block, btn) {
    const code = block.textContent.replace(btn.textContent, '').trim();
    navigator.clipboard.writeText(code).then(() => {
      const originalContent = btn.innerHTML;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Copied!</span>
      `;
      btn.classList.add('copied');

      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(err => console.error('Copy failed:', err));
  },

  // ========================================
  // FORM HANDLER
  // ========================================
  setupFormHandler() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('input[type="text"]').value.trim();
      const email = form.querySelector('input[type="email"]').value.trim();
      const message = form.querySelector('textarea').value.trim();

      if (!this.validateForm(name, email, message)) {
        this.showNotification('Please fill in all fields correctly', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = form.querySelector('.btn-primary');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        this.showNotification(`Thank you, ${name}! I'll get back to you soon.`, 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  },

  validateForm(name, email, message) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return name.length > 0 && emailRegex.test(email) && message.length > 0;
  },

  showNotification(text, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = text;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      z-index: 1000;
      animation: slideInUp 0.3s ease;
      max-width: 90vw;
    `;

    const bgColor = type === 'success' ? 'rgba(16, 185, 129, 0.9)' :
                    type === 'error' ? 'rgba(239, 68, 68, 0.9)' :
                    'rgba(59, 130, 246, 0.9)';
    notification.style.backgroundColor = bgColor;
    notification.style.color = 'white';

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutDown 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  // ========================================
  // SEARCH & FILTER
  // ========================================
  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      this.filterContent(query);
    });
  },

  filterContent(query) {
    const cards = document.querySelectorAll('.card, .activity-card, .quiz-card');
    
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const matches = text.includes(query);
      
      card.style.opacity = matches ? '1' : '0.3';
      card.style.pointerEvents = matches ? 'auto' : 'none';
      
      if (!matches) {
        card.style.filter = 'grayscale(100%)';
      } else {
        card.style.filter = 'grayscale(0%)';
      }
    });

    // Show "no results" message if needed
    const visibleCards = Array.from(cards).filter(card => card.style.opacity !== '0.3');
    if (visibleCards.length === 0 && query.length > 0) {
      this.showNotification(`No results found for "${query}"`, 'info');
    }
  },
};

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + / for search
  if ((e.ctrlKey || e.metaKey) && e.key === '/') {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.focus();
  }

  // Ctrl/Cmd + . for theme toggle
  if ((e.ctrlKey || e.metaKey) && e.key === '.') {
    e.preventDefault();
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) toggle.click();
  }
});

// ========================================
// PERFORMANCE MONITORING
// ========================================
window.addEventListener('load', () => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
});

// ========================================
// APP STARTUP
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});