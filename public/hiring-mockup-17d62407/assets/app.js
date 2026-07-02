// Shared mock app: fake auth state in localStorage, nav, toasts, modal.

const STATE_KEYS = {
  authed: 'ow_mock_hm_authed',
  paid: 'ow_mock_hm_paid',
  email: 'ow_mock_hm_email',
  company: 'ow_mock_hm_company',
  interested: 'ow_mock_hm_interested',
  postedJobs: 'ow_mock_hm_posted',
};

// Demo helper: ?demo=authed | pro | out — seeds auth state before page scripts run.
(function () {
  const demo = new URLSearchParams(location.search).get('demo');
  if (!demo) return;
  if (demo === 'out') {
    Object.values(STATE_KEYS).forEach(k => localStorage.removeItem(k));
  } else {
    localStorage.setItem(STATE_KEYS.authed, '1');
    localStorage.setItem(STATE_KEYS.email, 'jordan@acmerobotics.com');
    localStorage.setItem(STATE_KEYS.company, 'Acme Robotics');
    if (demo === 'pro') localStorage.setItem(STATE_KEYS.paid, '1');
    else localStorage.removeItem(STATE_KEYS.paid);
  }
})();

const app = {
  isAuthed: () => localStorage.getItem(STATE_KEYS.authed) === '1',
  isPaid: () => localStorage.getItem(STATE_KEYS.paid) === '1',
  email: () => localStorage.getItem(STATE_KEYS.email) || '',
  company: () => localStorage.getItem(STATE_KEYS.company) || 'Acme Robotics',
  signIn(email, company) {
    localStorage.setItem(STATE_KEYS.authed, '1');
    if (email) localStorage.setItem(STATE_KEYS.email, email);
    if (company) localStorage.setItem(STATE_KEYS.company, company);
  },
  signOut() {
    Object.values(STATE_KEYS).forEach(k => localStorage.removeItem(k));
  },
  upgrade() { localStorage.setItem(STATE_KEYS.paid, '1'); },
  markInterested(id) {
    const set = new Set(JSON.parse(localStorage.getItem(STATE_KEYS.interested) || '[]'));
    set.add(id);
    localStorage.setItem(STATE_KEYS.interested, JSON.stringify([...set]));
  },
  hasInterested(id) {
    const set = new Set(JSON.parse(localStorage.getItem(STATE_KEYS.interested) || '[]'));
    return set.has(id);
  },
  interestedCount() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.interested) || '[]').length;
  },
  postedJobs() {
    return JSON.parse(localStorage.getItem(STATE_KEYS.postedJobs) || '[]');
  },
  addPostedJob(job) {
    const jobs = app.postedJobs();
    jobs.unshift(job);
    localStorage.setItem(STATE_KEYS.postedJobs, JSON.stringify(jobs));
  },
};

window.app = app;

// ============ ICONS ============
function checkIcon() { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`; }
function searchIcon() { return `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`; }
function shieldIcon() { return `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z"/></svg>`; }
function arrowIcon() { return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`; }
window.icons = { check: checkIcon, search: searchIcon, shield: shieldIcon, arrow: arrowIcon };

// ============ NAV ============
function renderNav(active) {
  const authed = app.isAuthed();
  const paid = app.isPaid();
  const initial = (app.email() || 'U').charAt(0).toUpperCase();
  const html = `
    <header class="site-header" id="site-header">
      <nav class="site-nav">
        <div class="nav-inner">
          <a href="index.html" class="nav-brand">
            <img src="assets/logo.png" alt="OnlyWorks" class="nav-logo" />
            <span class="nav-wordmark">OnlyWorks</span>
            <span class="nav-tag">Hire</span>
          </a>
          <div class="nav-links">
            <a href="search.html" class="nav-link ${active === 'search' ? 'active' : ''}">Search</a>
            <a href="pricing.html" class="nav-link ${active === 'pricing' ? 'active' : ''}">Pricing</a>
            ${authed ? `<a href="dashboard.html" class="nav-link ${active === 'dashboard' ? 'active' : ''}">Dashboard</a>` : ''}
          </div>
          <div class="nav-right">
            ${authed
              ? `<span class="nav-plan ${paid ? 'pro' : 'free'}">${paid ? 'Pro' : 'Free'}</span>
                 ${paid ? '' : `<a href="pricing.html" class="btn btn-primary btn-sm">Upgrade</a>`}
                 <button class="nav-user" onclick="app.signOut(); location.href='index.html'" title="Sign out">
                   <span class="nav-avatar">${initial}</span>
                   <span>Sign out</span>
                 </button>`
              : `<a href="signup.html" class="nav-link">Sign in</a>
                 <a href="signup.html" class="btn btn-primary btn-sm">Get started</a>`
            }
          </div>
        </div>
      </nav>
    </header>
  `;
  const mount = document.getElementById('nav-mount');
  if (mount) mount.innerHTML = html;

  // Floating glass nav on scroll, like only-works.com
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
window.renderNav = renderNav;

// ============ FOOTER ============
function renderFooter() {
  const mount = document.getElementById('footer-mount');
  if (mount) mount.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="assets/logo.png" alt="" />
          <span class="footer-tag">OnlyWorks Hire — verified work, not promises</span>
        </div>
        <div class="footer-links">
          <a class="footer-link" href="search.html">Search</a>
          <a class="footer-link" href="pricing.html">Pricing</a>
          <a class="footer-link" href="https://www.only-works.com" target="_blank" rel="noopener">only-works.com</a>
          <span class="footer-link">© 2026</span>
        </div>
      </div>
    </footer>
  `;
}
window.renderFooter = renderFooter;

// ============ TOAST ============
function ensureToastContainer() {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}
function toast(message, variant = 'default') {
  const c = ensureToastContainer();
  const el = document.createElement('div');
  el.className = `toast ${variant}`;
  el.innerHTML = `${checkIcon()}<span>${message}</span>`;
  c.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px)';
    setTimeout(() => el.remove(), 250);
  }, 2800);
}
window.toast = toast;

// ============ MODAL ============
function showModal({ title, body, primaryLabel = 'Continue', primaryHref, secondaryLabel = 'Cancel', onPrimary }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-title">${title}</div>
      <div class="modal-body">${body}</div>
      <div class="modal-actions">
        <button class="btn btn-ghost" data-action="close">${secondaryLabel}</button>
        ${primaryHref
          ? `<a class="btn btn-primary" href="${primaryHref}">${primaryLabel}</a>`
          : `<button class="btn btn-primary" data-action="primary">${primaryLabel}</button>`}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('[data-action="close"]')) overlay.remove();
    if (e.target.closest('[data-action="primary"]')) {
      onPrimary?.();
      overlay.remove();
    }
  });
}
window.showModal = showModal;

// ============ URL helpers ============
window.getQueryParam = (key) => new URLSearchParams(location.search).get(key);
