/**
 * EZENGABADE PRIME LOGISTICS — script.js (Rebuilt)
 * Features: Exit-intent popup | FAQ accordion | Stats counter
 *           Mobile menu | Modal | Urgency bar | Header scroll
 *           A/B test hero | Lead magnet | Analytics events
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ====================================================
       1. DYNAMIC HEADER OFFSET (accounts for urgency bar)
       ==================================================== */
    const urgencyBar = document.getElementById('urgencyBar');
    const header     = document.querySelector('.fixed-header');

    function setHeaderTop() {
        const barH = urgencyBar && !urgencyBar.classList.contains('hidden')
            ? urgencyBar.offsetHeight : 0;
        if (header) header.style.top = barH + 'px';
    }
    setHeaderTop();
    window.addEventListener('resize', setHeaderTop);

    /* ====================================================
       2. URGENCY BAR — dismiss + countdown
       ==================================================== */
    const closeUrgency = document.getElementById('closeUrgency');
    const slotsEl      = document.getElementById('slotsLeft');

    if (closeUrgency && urgencyBar) {
        closeUrgency.addEventListener('click', () => {
            urgencyBar.classList.add('hidden');
            urgencyBar.style.display = 'none';
            setHeaderTop();
            // Remember dismissal for this session
            sessionStorage.setItem('urgencyDismissed', '1');
        });
    }

    // Restore dismissed state
    if (sessionStorage.getItem('urgencyDismissed') && urgencyBar) {
        urgencyBar.style.display = 'none';
        setHeaderTop();
    }

    // Countdown slots (cosmetic urgency — change number to match real availability)
    if (slotsEl) {
        const stored = sessionStorage.getItem('slotsLeft');
        if (stored) {
            slotsEl.textContent = stored;
        } else {
            sessionStorage.setItem('slotsLeft', slotsEl.textContent);
        }
    }

    /* ====================================================
       3. HEADER SHRINK ON SCROLL
       ==================================================== */
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 80);
        });
    }

    /* ====================================================
       4. SMOOTH SCROLL (offset for fixed header)
       ==================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerH = header ? header.offsetHeight : 0;
            const barH = urgencyBar && urgencyBar.style.display !== 'none'
                ? urgencyBar.offsetHeight : 0;
            const offset = headerH + barH + 8;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: 'smooth'
            });
        });
    });

    /* ====================================================
       5. MOBILE MENU
       ==================================================== */
    const openMenuBtn  = document.getElementById('openMenu');
    const closeMenuBtn = document.getElementById('closeMenu');
    const mobileMenu   = document.getElementById('mobileMenu');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        openMenuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        openMenuBtn.setAttribute('aria-expanded', 'false');
    }

    if (openMenuBtn) openMenuBtn.addEventListener('click', openMobileMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);

    document.querySelectorAll('.mobile-nav-list a').forEach(link =>
        link.addEventListener('click', closeMobileMenu)
    );

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) closeMobileMenu();
    });

    /* ====================================================
       6. SERVICE QUOTE MODAL
       ==================================================== */
    const serviceModal   = document.getElementById('serviceModal');
    const modalTitleSpan = document.getElementById('modalServiceName');
    const serviceInput   = document.getElementById('serviceRequestedInput');
    const closeServiceBtn = document.getElementById('closeServiceModal');

    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.addEventListener('click', function () {
            const name = this.getAttribute('data-service-name') || 'Our Services';
            if (modalTitleSpan) modalTitleSpan.textContent = name;
            if (serviceInput)   serviceInput.value = name;
            serviceModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    function closeServiceModal() {
        serviceModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (closeServiceBtn) closeServiceBtn.addEventListener('click', closeServiceModal);
    serviceModal && window.addEventListener('click', e => {
        if (e.target === serviceModal) closeServiceModal();
    });

    /* ====================================================
       7. LEAD MAGNET MODAL
       ==================================================== */
    const leadMagnetModal  = document.getElementById('leadMagnetModal');
    const openLeadMagnetBtn = document.getElementById('openLeadMagnet');
    const closeLeadMagnetBtn = document.getElementById('closeLeadMagnet');

    function openLeadMagnet() {
        if (leadMagnetModal) {
            leadMagnetModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLeadMagnet() {
        if (leadMagnetModal) {
            leadMagnetModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    if (openLeadMagnetBtn) openLeadMagnetBtn.addEventListener('click', openLeadMagnet);
    if (closeLeadMagnetBtn) closeLeadMagnetBtn.addEventListener('click', closeLeadMagnet);
    leadMagnetModal && window.addEventListener('click', e => {
        if (e.target === leadMagnetModal) closeLeadMagnet();
    });

    /* ====================================================
       8. EXIT-INTENT POPUP
       ==================================================== */
    const exitPopup       = document.getElementById('exitPopup');
    const exitPopupOverlay = document.getElementById('exitPopupOverlay');
    const closeExitBtn    = document.getElementById('closeExitPopup');
    let exitShown         = sessionStorage.getItem('exitShown') || false;

    function showExitPopup() {
        if (exitShown) return;
        exitShown = true;
        sessionStorage.setItem('exitShown', '1');
        if (exitPopup)       exitPopup.style.display = 'block';
        if (exitPopupOverlay) exitPopupOverlay.style.display = 'block';
        // [GA4] Track popup impression
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_popup_shown', { event_category: 'Lead', event_label: 'ExitIntent' });
        }
    }

    function hideExitPopup() {
        if (exitPopup)       exitPopup.style.display = 'none';
        if (exitPopupOverlay) exitPopupOverlay.style.display = 'none';
    }

    // Trigger on mouse leaving viewport (desktop)
    document.addEventListener('mouseleave', e => {
        if (e.clientY < 20) showExitPopup();
    });

    // Trigger on mobile: user scrolls back up significantly
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const diff = lastScrollY - window.scrollY;
        if (diff > 150 && window.scrollY > 400) showExitPopup();
        lastScrollY = window.scrollY;
    });

    if (closeExitBtn) closeExitBtn.addEventListener('click', hideExitPopup);
    if (exitPopupOverlay) exitPopupOverlay.addEventListener('click', hideExitPopup);

    /* ====================================================
       9. FAQ ACCORDION
       ==================================================== */
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function () {
            const answer    = this.nextElementSibling;
            const isOpen    = this.getAttribute('aria-expanded') === 'true';

            // Close all others
            document.querySelectorAll('.faq-question').forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                const a = q.nextElementSibling;
                if (a) a.classList.remove('open');
            });

            // Toggle current
            if (!isOpen) {
                this.setAttribute('aria-expanded', 'true');
                if (answer) answer.classList.add('open');
            }
        });
    });

    /* ====================================================
       10. ANIMATED STATS COUNTER
       ==================================================== */
    function animateCounter(el, target, duration = 1800) {
        const start     = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(timestamp) {
            const elapsed  = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            const value    = eased * target;

            el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);

            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = isDecimal ? target.toFixed(1) : target;
        }
        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el     = entry.target;
                const target = parseFloat(el.getAttribute('data-target'));
                if (!isNaN(target)) animateCounter(el, target);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el =>
        statsObserver.observe(el)
    );

    /* ====================================================
       11. A/B TEST: HERO VARIANT
       Randomly assign variant A or B and expose class.
       Track with GA4 for 30-day comparison.
       ==================================================== */
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Check sessionStorage so the same user sees same variant
        let variant = sessionStorage.getItem('heroVariant');
        if (!variant) {
            variant = Math.random() < 0.5 ? 'A' : 'B';
            sessionStorage.setItem('heroVariant', variant);
        }

        heroContent.classList.add('hero-variant-' + variant);

        // Variant B: swap CTA text to emphasise WhatsApp
        if (variant === 'B') {
            const primaryCTA = heroContent.querySelector('.cta-primary');
            if (primaryCTA) {
                primaryCTA.innerHTML = 'WhatsApp for Instant Quote <i class="fab fa-whatsapp"></i>';
                primaryCTA.href = 'https://wa.me/27713647124?text=Hi%2C%20I%20need%20a%20logistics%20quote%20in%20KZN.';
            }
        }

        // [GA4] Report which variant this session sees
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ab_test_hero', {
                event_category: 'Experiment',
                event_label: 'Hero_Variant_' + variant
            });
        }
    }

    /* ====================================================
       12. SECTION REVEAL ANIMATION (Intersection Observer)
       ==================================================== */
    const revealEls = document.querySelectorAll(
        '.service-card, .feature-item, .review-card, .stat-item, .faq-item, .leadership-card'
    );

    // Add base style via JS to keep CSS clean
    revealEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.55s ease ${(i % 4) * 0.08}s, transform 0.55s ease ${(i % 4) * 0.08}s`;
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ====================================================
       13. FORM: PHONE NUMBER FORMATTING (ZA)
       ==================================================== */
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function () {
            // Strip non-digits
            let v = this.value.replace(/\D/g, '');
            // Format: 071 364 7124
            if (v.length > 3 && v.length <= 6)       v = v.slice(0,3) + ' ' + v.slice(3);
            else if (v.length > 6)                    v = v.slice(0,3) + ' ' + v.slice(3,6) + ' ' + v.slice(6,10);
            this.value = v;
        });
    });

    /* ====================================================
       14. SCROLL PROGRESS: Auto-trigger lead magnet
       Show lead magnet modal once user reaches 70% of page
       (only if exit popup hasn't been shown yet)
       ==================================================== */
    let leadMagnetTriggered = sessionStorage.getItem('leadMagnetTriggered') || false;

    window.addEventListener('scroll', () => {
        if (leadMagnetTriggered || exitShown) return;
        const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPct > 70) {
            leadMagnetTriggered = true;
            sessionStorage.setItem('leadMagnetTriggered', '1');
            // Small delay for UX
            setTimeout(openLeadMagnet, 1200);
        }
    });

    /* ====================================================
       15. ESCAPE KEY — close any open modal/popup
       ==================================================== */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeServiceModal();
            closeLeadMagnet();
            hideExitPopup();
        }
    });

    console.log('%cEzengabade Prime Logistics — site loaded ✓', 'color:#F5A623; font-weight:bold; font-size:14px;');

}); // end DOMContentLoaded
