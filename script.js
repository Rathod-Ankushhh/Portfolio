// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Main DOMContentLoaded event - consolidated all functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize reveal on scroll
    revealOnScroll();

    // Animate section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.classList.add('fade-in');
        observer.observe(title);
    });

    // Animate skill categories and progress bars
    document.querySelectorAll('.skill-category').forEach((category, index) => {
        category.classList.add('slide-in-left');
        category.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(category);
    });

    // Animate skill progress bars
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        const progressBar = item.querySelector('.skill-progress');
                        if (progressBar) {
                            const width = progressBar.getAttribute('data-width');
                            progressBar.style.width = width + '%';
                        }
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-category').forEach(category => {
        skillObserver.observe(category);
    });

    // Animate timeline items with enhanced effects
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        const content = item.querySelector('.timeline-content');
        const dot = item.querySelector('.timeline-dot');

        if (content && dot) {
            content.style.transitionDelay = `${index * 0.4}s`;
            dot.style.animationDelay = `${index * 0.2}s`;
            observer.observe(item);
        }
    });

    // Special observer for timeline content animation
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const content = entry.target.querySelector('.timeline-content');
                const dot = entry.target.querySelector('.timeline-dot');

                if (content && dot) {
                    setTimeout(() => {
                        content.classList.add('animate');
                        dot.style.animationPlayState = 'running';
                    }, index * 200);
                }
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });

    // Animate certification cards
    document.querySelectorAll('.cert-card').forEach((card, index) => {
        card.classList.add('scale-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Certificate View Functionality
    const viewButtons = document.querySelectorAll('.cert-view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const certImage = this.getAttribute('data-cert-image');

            if (certImage) {
                // Open certificate image in new tab directly
                window.open(certImage, '_blank');
            }
        });
    });

    // Animate project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    // Animate contact items
    document.querySelectorAll('.contact-item').forEach((item, index) => {
        item.classList.add('slide-in-left');
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Animate form
    const form = document.querySelector('.form');
    if (form) {
        form.classList.add('slide-in-right');
        observer.observe(form);
    }

    // Resume download functionality
    const downloadBtn = document.getElementById('download-resume');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Resume file path
            const resumeUrl = 'Ankush_resume.pdf';
            
            // Check if file exists before downloading
            fetch(resumeUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        // File exists, proceed with download
                        const link = document.createElement('a');
                        link.href = resumeUrl;
                        link.download = 'Ankush_resume.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        // File doesn't exist, show alert
                        alert('Resume file not found. Please contact me directly for my resume.');
                    }
                })
                .catch(error => {
                    // Network error or file not found
                    alert('Resume file not available. Please contact me directly for my resume.');
                });
        });
    }



    // Scroll Down Arrow Functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Scroll to the about section
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Hide scroll indicator when user scrolls down
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;

            if (scrollPosition > windowHeight * 0.1) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
});

// Typing animation for intro title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const introTitle = document.querySelector('.intro-title');
    if (introTitle) {
        const originalText = introTitle.textContent;
        setTimeout(() => {
            typeWriter(introTitle, originalText, 80);
        }, 500);
    }
});



// Skill items hover effect
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05) translateY(-2px)';
    });

    item.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1) translateY(0)';
    });
});

// Project cards simple zoom effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// Smooth reveal animation for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});