document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Toggle between menu and X icons
        if (this.classList.contains('active')) {
            this.innerHTML = '<i class="bi bi-x-lg"></i>'; // Bootstrap X icon
        } else {
            this.innerHTML = '<i class="bi bi-list"></i>'; // Bootstrap menu icon
        }
    });
    
    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            hamburger.innerHTML = '<i class="bi bi-list"></i>'; // Reset to menu icon
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
    const worksFilter = document.querySelector('.works-filter');
    const workItems = document.querySelectorAll('.work-item');
    
    if (worksFilter) {
        const workFilterBtns = worksFilter.querySelectorAll('.filter-btn');
        
        workFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all work filter buttons only
                workFilterBtns.forEach(btn => btn.classList.remove('active'));
                
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
    }
    
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
    
    // Certification Lightbox Functionality
    // Certification filtering
    const certFilter = document.querySelector('.cert-filter');
    if (certFilter) {
        certFilter.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                // Remove active class from all buttons
                document.querySelectorAll('.cert-filter .filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Get filter value
                const filterValue = e.target.getAttribute('data-filter');
                
                // Filter items
                document.querySelectorAll('.cert-item').forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }

    // Lightbox functionality
    const certItems = document.querySelectorAll('.cert-item');
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxLink = document.getElementById('lightbox-link');
    
    let currentIndex = 0;
    const visibleCertificates = [];
    
    if (!certItems.length || !lightbox) return;
    
    // Update visible certificates array
    function updateVisibleCerts() {
        visibleCertificates.length = 0;
        document.querySelectorAll('.cert-item:not([style*="display: none"])').forEach(item => {
            visibleCertificates.push(item);
        });
    }
    
    // Open lightbox with specific certificate
    function openLightbox(certItem, index) {
        updateVisibleCerts();
        currentIndex = index;
        
        // Get data from certificate
        const imgSrc = certItem.querySelector('img').src;
        const title = certItem.querySelector('h4').textContent;
        const desc = certItem.querySelector('p').textContent;
        
        // Set lightbox content
        lightboxImg.src = imgSrc;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
        lightboxLink.href = imgSrc; // Link to full-size image
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Navigate to previous certificate
    function prevCert() {
        currentIndex = (currentIndex - 1 + visibleCertificates.length) % visibleCertificates.length;
        openLightbox(visibleCertificates[currentIndex], currentIndex);
    }
    
    // Navigate to next certificate
    function nextCert() {
        currentIndex = (currentIndex + 1) % visibleCertificates.length;
        openLightbox(visibleCertificates[currentIndex], currentIndex);
    }
    
    // Set up event listeners
    certItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            updateVisibleCerts();
            const visibleIndex = visibleCertificates.indexOf(this);
            openLightbox(this, visibleIndex);
        });
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevCert);
    lightboxNext.addEventListener('click', nextCert);
    
    // Close when clicking outside the content
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevCert();
        if (e.key === 'ArrowRight') nextCert();
    });
    
    // Project Lightbox Functionality
    const projectLinks = document.querySelectorAll('.project-preview');
    const projectLightbox = document.getElementById('project-lightbox');
    const projectClose = document.querySelector('.project-lightbox-close');
    const projectPrev = document.querySelector('.project-prev');
    const projectNext = document.querySelector('.project-next');
    
    if (!projectLightbox || projectLinks.length === 0) return;
    
    let currentProjectIndex = 0;
    const projectSlides = document.querySelectorAll('.project-slide');
    
    // Open project lightbox
    function openProjectLightbox(projectId) {
        // Hide all slides first
        projectSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Show the selected project slide
        const selectedSlide = document.querySelector(`.project-slide[data-project="${projectId}"]`);
        if (selectedSlide) {
            selectedSlide.style.display = 'flex';
            currentProjectIndex = Array.from(projectSlides).indexOf(selectedSlide);
        }
        
        // Show the lightbox
        projectLightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close project lightbox
    function closeProjectLightbox() {
        projectLightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Navigate to previous project
    function prevProject() {
        if (projectSlides.length <= 1) return;
        
        // Hide current project
        projectSlides[currentProjectIndex].style.display = 'none';
        
        // Calculate new index
        currentProjectIndex = (currentProjectIndex - 1 + projectSlides.length) % projectSlides.length;
        
        // Show new project
        projectSlides[currentProjectIndex].style.display = 'flex';
    }
    
    // Navigate to next project
    function nextProject() {
        if (projectSlides.length <= 1) return;
        
        // Hide current project
        projectSlides[currentProjectIndex].style.display = 'none';
        
        // Calculate new index
        currentProjectIndex = (currentProjectIndex + 1) % projectSlides.length;
        
        // Show new project
        projectSlides[currentProjectIndex].style.display = 'flex';
    }
    
    // Set up event listeners for project links
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            openProjectLightbox(projectId);
        });
    });
    
    // Close button event
    if (projectClose) {
        projectClose.addEventListener('click', closeProjectLightbox);
    }
    
    // Previous button
    if (projectPrev) {
        projectPrev.addEventListener('click', prevProject);
    }
    
    // Next button
    if (projectNext) {
        projectNext.addEventListener('click', nextProject);
    }
    
    // Close when clicking outside
    if (projectLightbox) {
        projectLightbox.addEventListener('click', function(e) {
            if (e.target === projectLightbox) {
                closeProjectLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!projectLightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeProjectLightbox();
        if (e.key === 'ArrowLeft') prevProject();
        if (e.key === 'ArrowRight') nextProject();
    });
    
    // Job Portal Video Thumbnail
    const jobPortalThumbnail = document.getElementById('job-portal-thumbnail');
    
    if (jobPortalThumbnail) {
        jobPortalThumbnail.addEventListener('click', function() {
            // Create video element
            const video = document.createElement('video');
            video.src = './assets/video/fortnite.mp4'; // Your video file path
            video.controls = true;
            video.autoplay = true;
            video.className = 'full-size-image';
            
            // Replace thumbnail with video
            this.innerHTML = '';
            this.appendChild(video);
        });
    }
    
    // Skill Progress Bar Animation
    // Replace both animateSkills and animateProgressBars with this single function
    function animateSkillBars() {
        // Reset all progress bars to zero width first
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When progress bar is visible
                if (entry.isIntersecting) {
                    // Get the target percentage from data attribute
                    const percentage = entry.target.getAttribute('data-percentage');
                    
                    // Stagger the animation slightly for each bar
                    const index = Array.from(progressBars).indexOf(entry.target);
                    const delay = 300 + (index * 100);
                    
                    // Set timeout for staggered animation
                    setTimeout(() => {
                        entry.target.style.width = percentage + '%';
                    }, delay);
                    
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Start observing all progress bars
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // Initialize progress bar animation
    animateSkillBars();
    
    // Reinitialize animation when navigating back to the page
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            animateSkillBars();
        }
    });
});

