/* ==========================================================================
   K C PATEL & COMPANY (ADVOCATES & ATTORNEYS)
   Interactive Client-side Features & Local Storage Management
   BCI Rule 36 Compliant (Information Directory Format)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bar Council of India (BCI) Disclaimer Modal Setup (PRESERVED)
  initDisclaimerModal();

  // 2. Navigation & Mobile Drawer
  initNavigation();

  // 3. FAQ Accordion & Live Filter
  initFaqAccordion();

  // 4. Practice Area Scope Modals
  initPracticeAreaModals();

  // 5. Number Counter Animation for Practice Metrics
  initCounterAnimation();
});

/* --- 1. Bar Council Disclaimer Gateway Modal (PRESERVED) --- */
function initDisclaimerModal() {
  const modalOverlay = document.getElementById('bci-modal-overlay');
  const btnAgree = document.getElementById('bci-btn-agree');
  const btnDecline = document.getElementById('bci-btn-decline');

  if (!modalOverlay) return;

  const isAccepted = localStorage.getItem('kcpatel_bci_accepted');

  if (!isAccepted) {
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 400);
  }

  if (btnAgree) {
    btnAgree.addEventListener('click', () => {
      localStorage.setItem('kcpatel_bci_accepted', 'true');
      modalOverlay.classList.remove('active');
    });
  }

  if (btnDecline) {
    btnDecline.addEventListener('click', () => {
      alert('As per Bar Council of India regulations, access to firm information requires explicit acknowledgment. You will be redirected.');
      window.location.href = 'https://www.google.com';
    });
  }
}

/* --- 2. Navigation & Sticky Mobile Header --- */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      mobileToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      }
    });
  });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (link) link.classList.add('active');
      } else {
        if (link) link.classList.remove('active');
      }
    });
  });
}

/* --- 3. FAQ Accordion & Real-time Filter --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faq-search-input');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question').textContent.toLowerCase();
        const bodyText = item.querySelector('.faq-body').textContent.toLowerCase();

        if (questionText.includes(query) || bodyText.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* --- 4. Practice Area Information Modals --- */
function initPracticeAreaModals() {
  const serviceModalOverlay = document.getElementById('service-detail-modal');
  const serviceModalTitle = document.getElementById('service-modal-title');
  const serviceModalDesc = document.getElementById('service-modal-desc');
  const serviceModalItems = document.getElementById('service-modal-items');
  const closeServiceModalBtn = document.getElementById('close-service-modal');
  const closeServiceModalBtnFooter = document.getElementById('close-service-modal-btn');

  const practiceData = {
    'trademark': {
      title: 'Trademark Protection & Prosecution',
      desc: 'Trademark search, classification, filing, examination response, and opposition representation under the Trade Marks Act, 1999.',
      items: [
        'Pre-Filing IP Search & Registrability Assessment across all 45 WIPO classes.',
        'Provisional & Official Trademark Application Filing (TM-A) with Controller General.',
        'Drafting formal responses to Examination Reports (Objections under Section 9 & 11).',
        'Representation in Opposition Hearings before the Trademark Registry (TM-O).',
        'Trademark Renewal, Assignment, License Agreements, and Passing-Off Injunctions.'
      ]
    },
    'patent': {
      title: 'Patent Advisory & Drafting Services',
      desc: 'Patent prosecution and technical drafting under the Indian Patents Act, 1970.',
      items: [
        'Prior Art & Patentability Searches across Indian & WIPO Patent Databases.',
        'Drafting Provisional and Complete Specifications (Technical Claim Structuring).',
        'Filing PCT (Patent Cooperation Treaty) International Applications.',
        'Prosecution of First Examination Reports (FER) and Hearing Representation.',
        'Freedom to Operate (FTO) Opinions and Invalidity Proceedings.'
      ]
    },
    'design': {
      title: 'Industrial Design & Copyright Registration',
      desc: 'Design registration under the Designs Act, 2000, and copyright registration procedures.',
      items: [
        'Industrial Design Application Filing under the Designs Act, 2000.',
        'Locarno Classification alignment for industrial products and packaging.',
        'Copyright Registration for Commercial Artwork, Logos, Literary, & Software Code.',
        'Design Rectification and Representation before the Design Office, Kolkata.',
        'Commercial Copyright Licensing and Royalties Agreements.'
      ]
    },
    'infringement': {
      title: 'Infringement Advisory & Legal Procedures',
      desc: 'Dispute advisory, cease & desist notices, and IP court representation.',
      items: [
        'Drafting and Serving Formal Cease & Desist Legal Notices.',
        'Interim and Permanent Injunction Proceedings in Civil Courts.',
        'Counterfeit Goods Seizure Strategy and Police Coordination.',
        'Domain Name Dispute Resolution (INDRP & UDRP Proceedings).',
        'Out-of-Court Settlement Drafting and Licensing Terms.'
      ]
    }
  };

  const learnMoreBtns = document.querySelectorAll('.trigger-service-modal');

  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-service-key');
      const data = practiceData[key];

      if (data && serviceModalOverlay) {
        serviceModalTitle.textContent = data.title;
        serviceModalDesc.textContent = data.desc;
        
        serviceModalItems.innerHTML = data.items.map(item => `
          <li style="display: flex; gap: 10px; margin-bottom: 12px; font-size: 0.92rem; color: #475569;">
            <i class="fas fa-check-circle" style="color: #D4AF37; margin-top: 3px;"></i>
            <span>${item}</span>
          </li>
        `).join('');

        serviceModalOverlay.classList.add('active');
      }
    });
  });

  const closeModal = () => {
    if (serviceModalOverlay) serviceModalOverlay.classList.remove('active');
  };

  if (closeServiceModalBtn) closeServiceModalBtn.addEventListener('click', closeModal);
  if (closeServiceModalBtnFooter) closeServiceModalBtnFooter.addEventListener('click', closeModal);

  if (serviceModalOverlay) {
    serviceModalOverlay.addEventListener('click', (e) => {
      if (e.target === serviceModalOverlay) {
        closeModal();
      }
    });
  }
}

/* --- 5. Stats Counter Animation --- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const speed = 200;
      const count = +counter.innerText;
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(runCounters, 15);
      } else {
        counter.innerText = target;
      }
    });
  };

  window.addEventListener('scroll', () => {
    const trustBar = document.querySelector('.trust-bar');
    if (!trustBar || animated) return;

    const top = trustBar.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      animated = true;
      runCounters();
    }
  });
}
