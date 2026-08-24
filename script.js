/**
 * SHABD JEET SINGH - PORTFOLIO INTERACTIVITY SCRIPT
 * High-tech UI, Cyber Canvas Particles, Typewriter Effect, Project Filtering & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive Background Particle Canvas
    initParticleCanvas();

    // 2. Typewriter Effect for Hero
    initTypewriter();

    // 3. Navigation Bar Scroll & Active Links
    initNavigation();

    // 4. Project Category Filter
    initProjectFilters();

    // 5. Scroll Animations (Fade-in on scroll)
    initScrollAnimations();

    // 6. Contact Form Simulation & Toast Feedback
    initContactForm();

    // 7. Dynamic Year in Footer
    const yearElem = document.getElementById('current-year');
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }
});

/* --------------------------------------------------------------------------
   1. Interactive Background Particle Canvas
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 1.8 + 0.6;
            this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(0, 119, 255, ';
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00f0ff';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 16000), 75);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const lineAlpha = (1 - dist / 120) * 0.18;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   2. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
    const typewriterElem = document.getElementById('typewriter');
    if (!typewriterElem) return;

    const words = [
        "Frontend Developer",
        "AIML Undergrad @ GLA",
        "5x Hackathon Contender",
        "VP, Volleyball Club",
        "Creative Problem Solver"
    ];

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let speed = 100;

    function type() {
        const currentWord = words[wordIdx];

        if (isDeleting) {
            typewriterElem.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            speed = 50;
        } else {
            typewriterElem.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            speed = 100;
        }

        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            speed = 1800; // Pause at full word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            speed = 400; // Pause before typing next word
        }

        setTimeout(type, speed);
    }

    type();
}

/* --------------------------------------------------------------------------
   3. Navigation, Mobile Menu & Active Section Observer
   -------------------------------------------------------------------------- */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Active Link Highlighting with IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${currentId}`
                    );
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
}

/* --------------------------------------------------------------------------
   4. Project Category Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   5. Scroll Animation Observer
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
    const animElements = document.querySelectorAll('.glass-panel, .timeline-item, .hero-content, .hero-visual');

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    animElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        animObserver.observe(el);
    });
}

/* --------------------------------------------------------------------------
   6. Contact Form Simulation & Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Simulate Loading State
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
        feedback.className = 'form-feedback';
        feedback.style.display = 'none';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            feedback.className = 'form-feedback success';
            feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${form.name.value}</strong>! Your message has been sent successfully. Shabd will get back to you soon.`;
            feedback.style.display = 'block';

            form.reset();

            setTimeout(() => {
                feedback.style.display = 'none';
            }, 6000);
        }, 1200);
    });
}
