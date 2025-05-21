document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Toggle hamburger to X
        if (this.classList.contains('active')) {
            this.innerHTML = '<div class="bar"></div><div class="bar"></div><div class="bar"></div>';
        } else {
            this.innerHTML = '<div class="bar"></div>';
        }
    });
    
    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            hamburger.innerHTML = '<div class="bar"></div>';
        });
    });
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const themeCheckbox = document.querySelector('.theme-checkbox');
    const html = document.documentElement;
    
    themeToggle.addEventListener('click', function() {
        toggleTheme();
    });
    
    themeCheckbox.addEventListener('change', function() {
        toggleTheme();
    });
    
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeCheckbox.checked = true;
        }
    }
    
    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Works Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            workItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Scroll Animations
    const animateElements = document.querySelectorAll('.animate');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Hide dice loader after 2.5 seconds
    setTimeout(function() {
        const loader = document.getElementById('dice-loader');
        if (loader) loader.classList.add('hide');
    }, 2500);
    
    // Contact form AJAX submit (Formspree)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);

            // Send the form data via fetch to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Show popup
                const popup = document.getElementById('form-success-popup');
                popup.classList.add('active');
                form.reset();

                // Close popup on click or after 2 seconds
                const closeBtn = document.getElementById('form-success-close');
                function closePopup() {
                    popup.classList.remove('active');
                    window.location.reload();
                }
                closeBtn.onclick = closePopup;
                popup.onclick = function(e) {
                    if (e.target === popup) closePopup();
                };
                setTimeout(closePopup, 2000);
            } else {
                alert('There was a problem submitting your form. Please try again.');
            }
        });
    }
});

