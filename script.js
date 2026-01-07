document.addEventListener('DOMContentLoaded', () => {
    // Navigation functionality
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('nav');

    // Burger menu toggle
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target)) {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            }
        });
    }

    // Enhanced navigation on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scrolling with nav offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const navOffset = 80;
            const top = targetElement.getBoundingClientRect().top + window.pageYOffset - navOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // Enhanced form submission with EmailJS
    const form = document.getElementById('inquiry-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Get form data
            const formData = {
                fullName: form.querySelector('[name="fullName"]')?.value || '',
                role: form.querySelector('[name="role"]')?.value || '',
                email: form.querySelector('[name="email"]')?.value || '',
                focus: form.querySelector('[name="focus"]')?.value || '',
                message: form.querySelector('[name="message"]')?.value || ''
            };

            // Validate form
            if (!formData.fullName || !formData.email || !formData.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';

            try {
                // METHOD 1: Using EmailJS (Recommended - Free and reliable)
                // To use this method:
                // 1. Sign up at https://www.emailjs.com/
                // 2. Create an email service
                // 3. Create an email template
                // 4. Replace the IDs below with your actual IDs
                
                // Uncomment this section after setting up EmailJS:
                /*
                emailjs.init('YOUR_PUBLIC_KEY'); // Get this from EmailJS dashboard
                
                const response = await emailjs.send(
                    'YOUR_SERVICE_ID',  // Your EmailJS service ID
                    'YOUR_TEMPLATE_ID', // Your EmailJS template ID
                    {
                        from_name: formData.fullName,
                        from_email: formData.email,
                        role: formData.role,
                        focus_area: formData.focus,
                        message: formData.message,
                        to_email: 'mariam6tk@gmail.com'
                    }
                );
                */

                // METHOD 2: Using FormSubmit.co (No signup required, but less customizable)
                // This method sends directly without any setup
                const response = await fetch('https://formsubmit.co/ajax/mariam6tk@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formData.fullName,
                        email: formData.email,
                        role: formData.role,
                        focus: formData.focus,
                        message: formData.message,
                        _subject: `New Leadership Inquiry from ${formData.fullName}`,
                        _template: 'table',
                        _captcha: 'false'
                    })
                });

                if (response.ok) {
                    showFormMessage('Thank you! Your inquiry has been sent successfully. I will get back to you soon.', 'success');
                    form.reset();
                    
                    // Optional: Track form submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Contact',
                            'event_label': 'Leadership Inquiry'
                        });
                    }
                } else {
                    throw new Error('Failed to send message');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                
                // Fallback to mailto if all methods fail
                const subject = encodeURIComponent('Leadership Inquiry');
                const body = encodeURIComponent(
                    `Name: ${formData.fullName}\n` +
                    `Role/Organization: ${formData.role}\n` +
                    `Email: ${formData.email}\n` +
                    `Focus Area: ${formData.focus}\n\n` +
                    `Message:\n${formData.message}`
                );
                
                showFormMessage(
                    'There was an issue sending your message. Opening your email client as a backup...',
                    'error'
                );
                
                setTimeout(() => {
                    window.location.href = `mailto:mariam6tk@gmail.com?subject=${subject}&body=${body}`;
                }, 2000);
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.opacity = '1';
            }
        });
    }

    // Helper function to show form messages
    function showFormMessage(message, type) {
        // Remove any existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Insert message after the form
        form.appendChild(messageDiv);

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            }, 5000);
        }

        // Scroll message into view
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Add entrance animations when elements come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature, .program-card, .experience-card, .why-list li').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add active state to navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.style.color = '#ffffff';
                });
                navLink.style.color = 'var(--camel)';
            }
        });
    });
});

// Optional: Add EmailJS library dynamically if using Method 1
// Uncomment this if you choose to use EmailJS:
/*
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    document.head.appendChild(script);
})();
*/