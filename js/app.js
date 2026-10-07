/**
 * FWC Admin Portal - App Global Logic
 * Handles global interactions like ⌘K search palette, ⌘B sidebar toggle, and profile popups.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearchPalette();
  initNotificationToast();
  initProfileMenu();
  initGlobalShortcuts();
});

/**
 * Keyboard shortcuts (⌘K for search, ⌘B for sidebar toggle)
 */
function initGlobalShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      if (typeof toggleSidebarState === 'function') {
        toggleSidebarState();
      }
    }
  });
}

/**
 * Quick Search Palette (⌘K) with Phosphor Icons
 */
function initSearchPalette() {
  if (!document.getElementById('searchPaletteModal')) {
    const modalHtml = `
      <div class="modal-overlay" id="searchPaletteModal" aria-hidden="true">
        <div class="search-palette-modal" role="dialog" aria-modal="true">
          <div class="search-palette-header">
            <i class="ph ph-magnifying-glass search-icon"></i>
            <input type="text" id="paletteSearchInput" class="search-palette-input" placeholder="Type to search portal sections or records..." autofocus />
            <span class="search-shortcut">ESC</span>
          </div>
          <div class="search-palette-results" id="paletteResults">
            <a href="dashboard.html" class="palette-item">
              <div class="palette-item-left">
                <i class="ph ph-squares-four" style="color:var(--fwc-blue);"></i>
                <span class="text-blue font-medium">Dashboard</span>
              </div>
              <span class="palette-category-badge">Main</span>
            </a>
            <a href="approval-requests.html" class="palette-item">
              <div class="palette-item-left">
                <i class="ph ph-checks"></i>
                <span>Approval Requests (4 pending)</span>
              </div>
              <span class="palette-category-badge">Operations</span>
            </a>
            <a href="blog-posts.html" class="palette-item">
              <div class="palette-item-left">
                <i class="ph ph-article"></i>
                <span>Blog Posts</span>
              </div>
              <span class="palette-category-badge">Content</span>
            </a>
            <a href="job-listings.html" class="palette-item">
              <div class="palette-item-left">
                <i class="ph ph-briefcase"></i>
                <span>Job Listings</span>
              </div>
              <span class="palette-category-badge">Talent</span>
            </a>
            <a href="enquiries.html" class="palette-item">
              <div class="palette-item-left">
                <i class="ph ph-chat-circle-dots"></i>
                <span>Enquiries (12 unread)</span>
              </div>
              <span class="palette-category-badge">Messages</span>
            </a>
            <a href="admin-management.html" class="palette-item">
              <div class="palette-item-left">
                <i class="ph ph-user-gear"></i>
                <span>Admin Management</span>
              </div>
              <span class="palette-category-badge">Settings</span>
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  const modal = document.getElementById('searchPaletteModal');
  const input = document.getElementById('paletteSearchInput');

  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => input && input.focus(), 50);
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (input) input.value = '';
    filterResults('');
  };

  // Keyboard shortcut: Cmd+K or Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('is-open')) {
        closeModal();
      } else {
        openModal();
      }
    } else if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Clicking search box trigger in header
  document.addEventListener('click', (e) => {
    if (e.target.closest('#headerSearchTrigger')) {
      openModal();
    } else if (e.target === modal) {
      closeModal();
    }
  });

  const filterResults = (query) => {
    const q = query.toLowerCase().trim();
    const items = modal.querySelectorAll('.palette-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  };

  if (input) {
    input.addEventListener('input', (e) => {
      filterResults(e.target.value);
    });
  }
}

/**
 * Toast notifications
 */
function initNotificationToast() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('#btnNotifications')) {
      showToast('You have 4 pending approval requests and 12 unread enquiries.');
    }
  });
}

function showToast(msg) {
  let toast = document.getElementById('fwcGlobalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fwcGlobalToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--color-white);
      color: var(--text-primary);
      border: 1px solid var(--border-slate);
      border-left: 4px solid var(--fwc-blue);
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      padding: 10px 16px;
      border-radius: var(--radius-md);
      font-size: var(--font-size-12);
      font-family: 'DM Sans', sans-serif;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 180ms ease;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color:var(--fwc-blue);font-weight:600;">FWC Admin</span> <span>${msg}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3200);
}

/**
 * Profile options popover
 */
function initProfileMenu() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebarProfileCard')) {
      showToast('Logged in as FWC Administrator (admin@fwc.org)');
    }
  });
}
