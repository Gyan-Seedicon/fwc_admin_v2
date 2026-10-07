/**
 * FWC Admin Portal — Reusable Custom Elements
 * <fwc-header> and <fwc-sidebar>
 * Header carries brand logo + Admin tag, and sidebar collapse toggle near the end of the sidebar column.
 * Sidebar features spaced nav items with (count) text, and bottom Admin + Profile section.
 * Phosphor Icons.
 */

const PhIcons = {
  dashboard:   `<i class="ph ph-squares-four sidebar-item-icon"></i>`,
  approval:    `<i class="ph ph-checks sidebar-item-icon"></i>`,
  blog:        `<i class="ph ph-article sidebar-item-icon"></i>`,
  jobs:        `<i class="ph ph-briefcase sidebar-item-icon"></i>`,
  enquiries:   `<i class="ph ph-chats sidebar-item-icon"></i>`,
  adminMgmt:   `<i class="ph ph-sliders sidebar-item-icon"></i>`,
  search:      `<i class="ph ph-magnifying-glass"></i>`,
  bell:        `<i class="ph ph-bell"></i>`,
  dotsV:       `<i class="ph ph-dots-three-vertical"></i>`,
  collapse:    `<i class="ph ph-sidebar-simple"></i>`,
};

/**
 * <fwc-header>
 * Layout:  [Logo + subtle Admin tag --- Collapse Toggle] --- [Search + Bell]
 */
class FwcHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="header-inner">

        <!-- LEFT: Logo + subtle Admin tag & Sidebar Collapse Toggle near sidebar end -->
        <div class="header-left">
          <a href="dashboard.html" class="brand-link" title="FWC Admin Portal">
            <img src="navy-logo.webp" alt="FWC" class="brand-logo-img" />
            <span class="brand-admin-tag">Admin</span>
          </a>

          <button class="btn-sidebar-toggle-header" id="btnSidebarToggle"
                  type="button" title="Collapse sidebar (⌘B)" aria-label="Toggle sidebar">
            ${PhIcons.collapse}
          </button>
        </div>

        <!-- RIGHT: Search + Bell -->
        <div class="header-right">
          <div class="header-search-wrap">
            <div class="header-search-box" id="headerSearchTrigger"
                 role="button" tabindex="0" title="Search portal (⌘K)">
              ${PhIcons.search}
              <input class="search-input" type="text"
                     placeholder="Search portal…" readonly />
              <kbd class="search-shortcut">⌘K</kbd>
            </div>
          </div>

          <button class="btn-icon-header" id="btnNotifications"
                  title="Notifications" type="button">
            ${PhIcons.bell}
            <span class="notify-dot"></span>
          </button>
        </div>
      </div>
    `;

    // Apply saved collapse state to header button tooltip
    const collapsed = localStorage.getItem('fwc_sidebar_collapsed') === 'true';
    this.updateCollapseTooltip(collapsed);

    // Wire the toggle button
    const btn = this.querySelector('#btnSidebarToggle');
    btn && btn.addEventListener('click', () => toggleSidebarState());
  }

  updateCollapseTooltip(isCollapsed) {
    const btn = this.querySelector('#btnSidebarToggle');
    if (btn) {
      btn.setAttribute('title', isCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)');
      btn.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
      btn.classList.toggle('is-collapsed', isCollapsed);
    }
  }
}

/**
 * <fwc-sidebar active="dashboard">
 * Main nav with comfortable item spacing and (count) normal text.
 * Bottom area: Admin Management and Profile card.
 */
class FwcSidebar extends HTMLElement {
  connectedCallback() {
    const activeKey = (this.getAttribute('active') || 'dashboard').toLowerCase();

    const navItems = [
      { key: 'dashboard',        label: 'Dashboard',        href: 'dashboard.html',        icon: PhIcons.dashboard },
      { key: 'approval-requests',label: 'Approval Requests',href: 'approval-requests.html',icon: PhIcons.approval, count: '4' },
      { key: 'blog-posts',       label: 'Blog Posts',       href: 'blog-posts.html',       icon: PhIcons.blog },
      { key: 'job-listings',     label: 'Job Listings',     href: 'job-listings.html',     icon: PhIcons.jobs },
      { key: 'enquiries',        label: 'Enquiries',        href: 'enquiries.html',        icon: PhIcons.enquiries, count: '12' },
    ];

    const isAdminActive = activeKey === 'admin-management';

    const itemsHtml = navItems.map(item => {
      const active    = activeKey === item.key ? 'is-active' : '';
      const countHtml = item.count
        ? `<span class="sidebar-item-count">(${item.count})</span>` : '';
      return `
        <a href="${item.href}"
           class="sidebar-item-link ${active}"
           data-key="${item.key}"
           data-label="${item.label}">
          <div class="sidebar-item-content">
            ${item.icon}
            <span class="sidebar-item-label">${item.label}</span>
          </div>
          ${countHtml}
        </a>`;
    }).join('');

    this.innerHTML = `
      <div class="sidebar-container">

        <!-- Main Nav items with generous spacing and padding -->
        <nav class="sidebar-nav-list" aria-label="Main Navigation">
          ${itemsHtml}
        </nav>

        <!-- Bottom area (below the divider): Admin Management & Profile -->
        <div class="sidebar-bottom-area">
          <a href="admin-management.html"
             class="sidebar-item-link ${isAdminActive ? 'is-active' : ''}"
             data-key="admin-management"
             data-label="Admin Management">
            <div class="sidebar-item-content">
              ${PhIcons.adminMgmt}
              <span class="sidebar-item-label">Admin Management</span>
            </div>
          </a>

          <div class="sidebar-profile-card" id="sidebarProfileCard"
               title="FWC Administrator · admin@fwc.org"
               data-label="FWC Administrator">
            <div class="profile-main-info">
              <div class="profile-avatar">FW</div>
              <div class="profile-text-group">
                <span class="profile-name">FWC Administrator</span>
                <span class="profile-email">admin@fwc.org</span>
              </div>
            </div>
            <span class="profile-dots">${PhIcons.dotsV}</span>
          </div>
        </div>
      </div>
    `;

    // Apply saved collapse state
    const collapsed = localStorage.getItem('fwc_sidebar_collapsed') === 'true';
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
      this.classList.add('is-collapsed');
    }
  }
}

function toggleSidebarState() {
  const collapsed = document.body.classList.toggle('sidebar-collapsed');
  const sidebar   = document.querySelector('fwc-sidebar');
  const header    = document.querySelector('fwc-header');
  if (sidebar) {
    sidebar.classList.toggle('is-collapsed', collapsed);
  }
  if (header && typeof header.updateCollapseTooltip === 'function') {
    header.updateCollapseTooltip(collapsed);
  }
  localStorage.setItem('fwc_sidebar_collapsed', collapsed ? 'true' : 'false');
}

customElements.define('fwc-header',  FwcHeader);
customElements.define('fwc-sidebar', FwcSidebar);
