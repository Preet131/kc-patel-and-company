/* ==========================================================================
   K C PATEL & COMPANY (ADVOCATES & ATTORNEYS)
   Interactive Client-side Features & Local Storage Management
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Bar Council of India (BCI) Disclaimer Modal Setup
  initDisclaimerModal();

  // 2. Navigation & Mobile Drawer
  initNavigation();

  // 3. FAQ Accordion & Live Filter
  initFaqAccordion();

  // 4. Consultation Form Handlers (Hero & Modal)
  initFormHandlers();

  // 5. Practice Area Modals
  initPracticeAreaModals();

  // 6. Number Counter Animation for Stats
  initCounterAnimation();
});

/* --- 1. Bar Council Disclaimer Modal --- */
function initDisclaimerModal() {
  const modalOverlay = document.getElementById('bci-modal-overlay');
  const btnAgree = document.getElementById('bci-btn-agree');
  const btnDecline = document.getElementById('bci-btn-decline');

  if (!modalOverlay) return;

  const isAccepted = localStorage.getItem('kcpatel_bci_accepted');

  if (!isAccepted) {
    // Show modal after slight delay for smooth entrance
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 400);
  }

  if (btnAgree) {
    btnAgree.addEventListener('click', () => {
      localStorage.setItem('kcpatel_bci_accepted', 'true');
      modalOverlay.classList.remove('active');
      showToast('Welcome to K C Patel & Company Advocates & Attorneys.');
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
  const siteHeader = document.querySelector('.site-header');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      mobileToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  }

  // Close menu when clicking links
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

  // Active link scroll spy
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
      
      // Close all open FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // FAQ Search functionality
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

/* --- 4. Consultation Form Handlers & Modal --- */
function initFormHandlers() {
  const heroForm = document.getElementById('hero-intake-form');
  const modalForm = document.getElementById('modal-intake-form');
  const consultModalOverlay = document.getElementById('consult-modal-overlay');
  const openModalBtns = document.querySelectorAll('.trigger-consult-modal');
  const closeModalBtn = document.getElementById('close-consult-modal');

  const handleFormSubmit = (e, formElement) => {
    e.preventDefault();
    const formData = new FormData(formElement);
    const name = formData.get('name') || 'Client';
    const phone = formData.get('phone');
    const service = formData.get('service');

    if (!phone || phone.length < 8) {
      showToast('Please enter a valid telephone number for consultation.', 'error');
      return;
    }

    // Reset Form
    formElement.reset();

    // Close Modal if open
    if (consultModalOverlay) {
      consultModalOverlay.classList.remove('active');
    }

    // Show Success Message
    showToast(`Thank you, ${name}! Your consultation request regarding ${service} has been received. Our advocates will contact you shortly.`, 'success');
  };

  if (heroForm) {
    heroForm.addEventListener('submit', (e) => handleFormSubmit(e, heroForm));
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => handleFormSubmit(e, modalForm));
  }

  // Open Consult Modal
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedService = btn.getAttribute('data-service');
      if (preselectedService && modalForm) {
        const selectElem = modalForm.querySelector('select[name="service"]');
        if (selectElem) selectElem.value = preselectedService;
      }
      if (consultModalOverlay) {
        consultModalOverlay.classList.add('active');
      }
    });
  });

  // Close Consult Modal
  if (closeModalBtn && consultModalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      consultModalOverlay.classList.remove('active');
    });

    consultModalOverlay.addEventListener('click', (e) => {
      if (e.target === consultModalOverlay) {
        consultModalOverlay.classList.remove('active');
      }
    });
  }
}

/* --- 5. Practice Area Modals --- */
function initPracticeAreaModals() {
  const serviceModalOverlay = document.getElementById('service-detail-modal');
  const serviceModalTitle = document.getElementById('service-modal-title');
  const serviceModalDesc = document.getElementById('service-modal-desc');
  const serviceModalItems = document.getElementById('service-modal-items');
  const closeServiceModalBtn = document.getElementById('close-service-modal');

  const practiceData = {
    'trademark': {
      title: 'Trademark Protection & Prosecution',
      desc: 'Comprehensive trademark registration, brand protection, and legal defense under the Trade Marks Act, 1999.',
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
      desc: 'End-to-end patent prosecution and technical drafting under the Indian Patents Act, 1970.',
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
      desc: 'Safeguarding ornamental shape, configuration, patterns, and creative expressions.',
      items: [
        'Industrial Design Application Filing under the Designs Act, 2000.',
        'Locarno Classification alignment for industrial products and packaging.',
        'Copyright Registration for Commercial Artwork, Logos, Literary, & Software Code.',
        'Design Rectification and Representation before the Design Office, Kolkata.',
        'Commercial Copyright Licensing and Royalties Agreements.'
      ]
    },
    'infringement': {
      title: 'Infringement Advisory & Litigation Support',
      desc: 'Robust legal defense, cease & desist actions, and IP dispute resolution.',
      items: [
        'Drafting and Serving Formal Cease & Desist Legal Notices.',
        'Interim and Permanent Injunction Proceedings in Civil Courts.',
        'Counterfeit Goods Seizure Strategy and Police Coordination.',
        'Domain Name Dispute Resolution (INDRP & UDRP Proceedings).',
        'Out-of-Court Settlement Drafting and Licensing Compromise Terms.'
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

  if (closeServiceModalBtn && serviceModalOverlay) {
    closeServiceModalBtn.addEventListener('click', () => {
      serviceModalOverlay.classList.remove('active');
    });

    serviceModalOverlay.addEventListener('click', (e) => {
      if (e.target === serviceModalOverlay) {
        serviceModalOverlay.classList.remove('active');
      }
    });
  }
}

/* --- 6. Stats Counter Animation --- */
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

/* --- Toast Notification Utility --- */
function showToast(message, type = 'info') {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  const icon = type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle';
  const color = type === 'error' ? '#EF4444' : '#D4AF37';

  toast.innerHTML = `
    <i class="fas ${icon}" style="color: ${color}; font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
