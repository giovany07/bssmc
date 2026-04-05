document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadPartial('header.html', 'header-placeholder'),
    loadPartial('footer.html', 'footer-placeholder')
  ]);

  initNavigation();
  initActiveNavLink();
  initForms();
  initApplicationReference();
  initNetlifyMultiForms();
  initHeaderEffects();
  initRevealAnimations();
});

async function loadPartial(file, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to load ${file}`);
    target.innerHTML = await response.text();
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}

function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  const closeMobileNav = () => {
    navLinks.classList.remove('active');
    document.body.classList.remove('nav-open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');

    document.querySelectorAll('.dropdown').forEach((item) => {
      item.classList.remove('active');
    });
  };

  const openMobileNav = () => {
    navLinks.classList.add('active');
    document.body.classList.add('nav-open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('active');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  document.querySelectorAll('.dropdown > a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (window.innerWidth > 900) return;

      event.preventDefault();

      const dropdown = link.parentElement;
      const isActive = dropdown.classList.contains('active');

      document.querySelectorAll('.dropdown').forEach((item) => {
        item.classList.remove('active');
      });

      if (!isActive) {
        dropdown.classList.add('active');
      }
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideNavbar = event.target.closest('.navbar');

    if (!clickedInsideNavbar && window.innerWidth <= 900) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMobileNav();
    }
  });
}

function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const matchingLink = document.querySelector(`.nav-links a[data-page="${currentPage}"]`);

  if (!matchingLink) return;

  matchingLink.classList.add('active-link');

  const parentDropdown = matchingLink.closest('.dropdown');
  if (parentDropdown) {
    parentDropdown.classList.add('has-active-child');

    const parentAnchor = parentDropdown.querySelector(':scope > a');
    if (parentAnchor) {
      parentAnchor.classList.add('active-link');
    }
  }
}

function initForms() {
  const contactForm = document.getElementById('contactForm');
  const civilStatus = document.getElementById('civil_status');
  const civilStatusOtherGroup = document.getElementById('civil_status_other_group');
  const civilStatusOther = document.getElementById('civil_status_other');
  const preferredMailingOptions = document.querySelectorAll('input[name="preferred_mailing"]');
  const preferredMailingOther = document.getElementById('preferred_mailing_other');

  if (civilStatus && civilStatusOtherGroup && civilStatusOther) {
    const toggleCivilStatusOther = () => {
      const show = civilStatus.value === 'others';
      civilStatusOtherGroup.style.display = show ? 'flex' : 'none';
      civilStatusOther.required = show;

      if (!show) {
        civilStatusOther.value = '';
      }
    };

    toggleCivilStatusOther();
    civilStatus.addEventListener('change', toggleCivilStatusOther);
  }

  if (preferredMailingOther && preferredMailingOptions.length) {
    const preferredMailingOtherGroup = preferredMailingOther.closest('.form-group');

    const togglePreferredMailingOther = () => {
      const selected = document.querySelector('input[name="preferred_mailing"]:checked');
      const show = selected && selected.value === 'others';

      if (preferredMailingOtherGroup) {
        preferredMailingOtherGroup.style.display = show ? 'flex' : 'none';
      }

      preferredMailingOther.required = show;

      if (!show) {
        preferredMailingOther.value = '';
      }
    };

    togglePreferredMailingOther();
    preferredMailingOptions.forEach((option) => {
      option.addEventListener('change', togglePreferredMailingOther);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Thank you for your message. This contact form is still being finalized. Please reach out through the listed phone number or email for now.');
    });
  }
}

function initHeaderEffects() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const updateHeaderState = () => {
    if (window.scrollY > 18) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

function initRevealAnimations() {
  const selectors = [
    '.hero-copy',
    '.hero-visual',
    '.section-heading',
    '.feature-card',
    '.home-split',
    '.cta-banner',
    '.page-hero-box',
    '.about-story-card',
    '.mission-vision-card',
    '.about-values',
    '.value-card',
    '.membership-info-banner',
    '.membership-form-card',
    '.important-notice-card',
    '.membership-notes-card',
    '.contact-card',
    '.contact-form-card',
    '.hours-card',
    '.faq-card',
    '.map-card',
    '.event-card',
    '.calendar-panel',
    '.event-highlight',
    '.featured-news',
    '.news-card',
    '.news-sidebar',
    '.office-featured',
    '.branch-card',
    '.map-panel',
    '.hours-panel',
    '.message-card',
    '.team-card',
    '.staff-panel',
    '.product-card',
    '.products-cta',
    '.service-card',
    '.services-cta',
    '.legal-card',
    '.coop-footer'
  ];

  const elements = document.querySelectorAll(selectors.join(','));
  if (!elements.length) return;

  const revealImmediately = () => {
    elements.forEach((element) => {
      element.classList.add('revealed');
      element.style.transitionDelay = '0ms';
    });
  };

  elements.forEach((element, index) => {
    element.classList.add('reveal-on-scroll');
    element.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  });

  if (window.innerWidth <= 900 || !('IntersectionObserver' in window)) {
    revealImmediately();
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((element) => observer.observe(element));
}

function generateSixDigitReference() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function initApplicationReference() {
  const storageKey = 'bssmc_application_reference';

  let reference = localStorage.getItem(storageKey);

  if (!reference || !/^\d{6}$/.test(reference)) {
    reference = generateSixDigitReference();
    localStorage.setItem(storageKey, reference);
  }

  const referenceInputs = [
    document.getElementById('application_reference_main'),
    document.getElementById('application_reference_gov'),
    document.getElementById('application_reference_psa'),
    document.getElementById('application_reference_barangay'),
    document.getElementById('application_reference_photo')
  ].filter(Boolean);

  referenceInputs.forEach((input) => {
    input.value = reference;
    input.readOnly = true;
    input.setAttribute('readonly', 'readonly');
  });
}

function initNetlifyMultiForms() {
  const mainForm = document.getElementById('memberMainForm');

  const uploadForms = [
    {
      formId: 'memberGovIdForm',
      errorId: 'memberGovIdFormError'
    },
    {
      formId: 'memberPsaForm',
      errorId: 'memberPsaFormError'
    },
    {
      formId: 'memberBarangayForm',
      errorId: 'memberBarangayFormError'
    },
    {
      formId: 'memberPhotosSignatureForm',
      errorId: 'memberPhotosSignatureFormError'
    }
  ];

  const MAX_TOTAL_BYTES = 8 * 1024 * 1024;

  if (mainForm) {
    mainForm.addEventListener('submit', () => {
      clearError('memberMainFormError');
    });
  }

  uploadForms.forEach(({ formId, errorId }) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (event) => {
      clearError(errorId);

      const fileInputs = form.querySelectorAll('input[type="file"]');
      let totalBytes = 0;

      fileInputs.forEach((input) => {
        Array.from(input.files).forEach((file) => {
          totalBytes += file.size;
        });
      });

      if (totalBytes > MAX_TOTAL_BYTES) {
        event.preventDefault();
        showError(
          errorId,
          'This upload section is over 8MB total. Please reduce the file sizes and try again.'
        );

        window.scrollTo({
          top: form.offsetTop - 120,
          behavior: 'smooth'
        });
      }
    });
  });
}

function showError(errorId, message) {
  const errorBox = document.getElementById(errorId);
  if (!errorBox) {
    alert(message);
    return;
  }

  errorBox.textContent = message;
  errorBox.style.display = 'block';
}

function clearError(errorId) {
  const errorBox = document.getElementById(errorId);
  if (!errorBox) return;

  errorBox.textContent = '';
  errorBox.style.display = 'none';
}