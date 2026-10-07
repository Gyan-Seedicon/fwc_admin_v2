/**
 * FWC Admin Portal — Approval Requests Logic
 * Handles:
 *  - Filtering by search query, request type, and status
 *  - Live summary count updates
 *  - Interactive Review Modal with Approve, Request Changes, and Reject actions
 *  - Toast notifications and table pagination
 */

// ─── Initial Dataset (15 Realistic Approval Requests) ─────────────────────────
const APPROVAL_REQUESTS_DATA = [
  {
    id: '#BLG-309',
    type: 'blog',
    typeLabel: 'Blog',
    title: 'The Future of AI in Manufacturing Supply Chains',
    submittedBy: 'Sarah Mitchell',
    initials: 'SM',
    submittedOn: 'Sep 24, 2026',
    time: '14:32',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Comprehensive 1,800-word analysis exploring generative AI applications in automated procurement, digital inventory management, and supplier risk scoring.',
    category: 'Industry Insights'
  },
  {
    id: '#JOB-412',
    type: 'job',
    typeLabel: 'Job',
    title: 'Lead DevOps Engineer (Fintech & Cloud Platforms)',
    submittedBy: 'James Okafor',
    initials: 'JO',
    submittedOn: 'Sep 23, 2026',
    time: '11:15',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Full-time senior opening for Infrastructure Engineering team in London/Hybrid. Salary range: £85k - £105k + equity package.',
    category: 'Engineering'
  },
  {
    id: '#UND-108',
    type: 'undo',
    typeLabel: 'Undo',
    title: 'Revert deletion: Senior Backend Developer listing',
    submittedBy: 'Marcus Webb',
    initials: 'MW',
    submittedOn: 'Sep 23, 2026',
    time: '09:40',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Accidental archiving of active candidate listing #JOB-388. Requesting restoration to active portal job board.',
    category: 'System Operation'
  },
  {
    id: '#BLG-308',
    type: 'blog',
    typeLabel: 'Blog',
    title: 'Scaling Distributed Kubernetes for Enterprise Microservices',
    submittedBy: 'Sarah Mitchell',
    initials: 'SM',
    submittedOn: 'Sep 22, 2026',
    time: '16:50',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Technical guide on cluster autoscaling, service mesh topology with Istio, and multi-region failover strategies.',
    category: 'Cloud Architecture'
  },
  {
    id: '#JOB-411',
    type: 'job',
    typeLabel: 'Job',
    title: 'Site Reliability & Platform Engineer',
    submittedBy: 'Sarah Mitchell',
    initials: 'SM',
    submittedOn: 'Sep 22, 2026',
    time: '10:20',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Mid-Senior SRE opening focusing on observability, Prometheus/Grafana metrics, and incident response automation.',
    category: 'Engineering'
  },
  {
    id: '#BLG-307',
    type: 'blog',
    typeLabel: 'Blog',
    title: 'Next-Gen AI Workflows for Modern Enterprises',
    submittedBy: 'Priya Nair',
    initials: 'PN',
    submittedOn: 'Sep 21, 2026',
    time: '15:10',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Overview of enterprise LLM orchestration. Previous feedback noted requirement for expanded citation section and updated chart assets.',
    category: 'Artificial Intelligence'
  },
  {
    id: '#JOB-410',
    type: 'job',
    typeLabel: 'Job',
    title: 'Senior Cloud Infrastructure Architect',
    submittedBy: 'James Okafor',
    initials: 'JO',
    submittedOn: 'Sep 20, 2026',
    time: '13:05',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Lead architectural opening for AWS & Azure multi-cloud hybrid migration project. Reporting directly to VP Technology.',
    category: 'Architecture'
  },
  {
    id: '#UND-107',
    type: 'undo',
    typeLabel: 'Undo',
    title: 'Restore candidate application #APP-9921',
    submittedBy: 'James Okafor',
    initials: 'JO',
    submittedOn: 'Sep 20, 2026',
    time: '08:45',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Candidate was mistakenly marked as Withdrawn during bulk status sync. Profile should be reinstated to Technical Interview stage.',
    category: 'Candidate Pipeline'
  },
  {
    id: '#BLG-306',
    type: 'blog',
    typeLabel: 'Blog',
    title: 'Why Digital Twins Are the Next Big Thing in Logistics',
    submittedBy: 'Sarah Mitchell',
    initials: 'SM',
    submittedOn: 'Sep 19, 2026',
    time: '17:30',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Explores real-time 3D simulation in warehouse operations, freight tracking, and IoT sensor telemetry.',
    category: 'Supply Chain'
  },
  {
    id: '#JOB-409',
    type: 'job',
    typeLabel: 'Job',
    title: 'Principal Product Designer (Design Systems)',
    submittedBy: 'James Okafor',
    initials: 'JO',
    submittedOn: 'Sep 19, 2026',
    time: '11:55',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Design leadership position creating enterprise UI component frameworks, tokens, and cross-platform UX guidelines.',
    category: 'Product Design'
  },
  {
    id: '#UND-106',
    type: 'undo',
    typeLabel: 'Undo',
    title: 'Revert salary range update for Data Platform Lead',
    submittedBy: 'Marcus Webb',
    initials: 'MW',
    submittedOn: 'Sep 18, 2026',
    time: '14:15',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Salary band adjustment was submitted with incorrect currency symbol ($ instead of £). Reverting to original £95k band.',
    category: 'Job Listings'
  },
  {
    id: '#JOB-408',
    type: 'job',
    typeLabel: 'Job',
    title: 'Senior Full-Stack Engineer (React / Node)',
    submittedBy: 'Marcus Webb',
    initials: 'MW',
    submittedOn: 'Sep 17, 2026',
    time: '16:00',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Full-stack engineering role for client portal core services. TypeScript, React 19, Node.js, and PostgreSQL stack.',
    category: 'Engineering'
  },
  {
    id: '#UND-105',
    type: 'undo',
    typeLabel: 'Undo',
    title: 'Rollback blog post publish state #BLG-299',
    submittedBy: 'Priya Nair',
    initials: 'PN',
    submittedOn: 'Sep 17, 2026',
    time: '10:10',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Article was published prematurely before final PR department embargo date. Requesting temporary return to Draft status.',
    category: 'Content Publishing'
  },
  {
    id: '#JOB-407',
    type: 'job',
    typeLabel: 'Job',
    title: 'Staff Systems & Networking Architect',
    submittedBy: 'Marcus Webb',
    initials: 'MW',
    submittedOn: 'Sep 16, 2026',
    time: '13:40',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'High-availability low-latency networking design, BGP routing, SDN infrastructure, and DDoS mitigation architecture.',
    category: 'Systems'
  },
  {
    id: '#JOB-406',
    type: 'job',
    typeLabel: 'Job',
    title: 'Frontend Team Lead (Core Platform)',
    submittedBy: 'Marcus Webb',
    initials: 'MW',
    submittedOn: 'Sep 15, 2026',
    time: '09:20',
    status: 'Pending Review',
    statusKey: 'pending',
    summary: 'Team lead role managing 6 frontend software engineers, architecture reviews, CI/CD pipelines, and performance budgets.',
    category: 'Engineering'
  }
];

// ─── State ────────────────────────────────────────────────────────────────────
let currentTypeFilter = 'all';
let currentSearchQuery = '';
let currentReviewItem = null;
let requestsList = [...APPROVAL_REQUESTS_DATA];

// ─── DOM References ───────────────────────────────────────────────────────────
const tableBody = document.getElementById('approvalsTableBody');
const searchInput = document.getElementById('approvalsSearchInput');
const typeTrigger = document.getElementById('typeFilterTrigger');
const typeDropdown = document.getElementById('typeFilterDropdown');
const typeLabel = document.getElementById('typeFilterLabel');
const countText = document.getElementById('queueCountText');
const reviewModal = document.getElementById('reviewModalOverlay');

// Summary Card Elements
const countTotalPending = document.getElementById('countTotalPending');
const countPendingJobs = document.getElementById('countPendingJobs');
const countPendingBlogs = document.getElementById('countPendingBlogs');
const countUndoRequests = document.getElementById('countUndoRequests');

// ─── Summary Count Calculation ────────────────────────────────────────────────
function updateSummaryCounts() {
  const pendingItems = requestsList.filter(item => item.statusKey === 'pending' || item.statusKey === 'in-review');
  const pendingJobs = requestsList.filter(item => item.type === 'job' && (item.statusKey === 'pending' || item.statusKey === 'in-review'));
  const pendingBlogs = requestsList.filter(item => item.type === 'blog' && (item.statusKey === 'pending' || item.statusKey === 'in-review'));
  const undoRequests = requestsList.filter(item => item.type === 'undo' && (item.statusKey === 'pending' || item.statusKey === 'in-review'));

  if (countTotalPending) countTotalPending.textContent = pendingItems.length;
  if (countPendingJobs) countPendingJobs.textContent = pendingJobs.length;
  if (countPendingBlogs) countPendingBlogs.textContent = pendingBlogs.length;
  if (countUndoRequests) countUndoRequests.textContent = undoRequests.length;

  // Update filter badge counts
  const badgeAll = document.getElementById('filterBadgeAll');
  const badgeJobs = document.getElementById('filterBadgeJobs');
  const badgeBlogs = document.getElementById('filterBadgeBlogs');
  const badgeUndo = document.getElementById('filterBadgeUndo');

  if (badgeAll) badgeAll.textContent = requestsList.length;
  if (badgeJobs) badgeJobs.textContent = requestsList.filter(i => i.type === 'job').length;
  if (badgeBlogs) badgeBlogs.textContent = requestsList.filter(i => i.type === 'blog').length;
  if (badgeUndo) badgeUndo.textContent = requestsList.filter(i => i.type === 'undo').length;
}

// ─── Render Table Rows ────────────────────────────────────────────────────────
function renderTable() {
  if (!tableBody) return;

  const q = currentSearchQuery.toLowerCase().trim();
  const filtered = requestsList.filter(item => {
    const matchesType = currentTypeFilter === 'all' || item.type === currentTypeFilter;
    const matchesSearch = !q ||
      item.title.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.submittedBy.toLowerCase().includes(q) ||
      item.typeLabel.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  if (countText) {
    countText.innerHTML = `Showing <strong>${filtered.length}</strong> of ${requestsList.length} requests`;
  }

  const footerCount = document.getElementById('footerCountInfo');
  if (footerCount) {
    footerCount.textContent = `Showing 1–${filtered.length} of ${filtered.length} requests`;
  }

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr class="table-empty-row">
        <td colspan="7">
          <div class="table-empty-message">
            <i class="ph ph-magnifying-glass"></i>
            <span>No approval requests match your search or filter.</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(item => {
    const typeBadgeClass = item.type === 'job' ? 'appr-type-badge--job'
                         : item.type === 'blog' ? 'appr-type-badge--blog'
                         : 'appr-type-badge--undo';

    const typeIcon = item.type === 'job' ? '<i class="ph ph-briefcase"></i>'
                   : item.type === 'blog' ? '<i class="ph ph-article"></i>'
                   : '<i class="ph ph-arrow-counter-clockwise"></i>';

    const statusBadgeClass = item.statusKey === 'pending' ? 'appr-status-badge--pending'
                           : item.statusKey === 'in-review' ? 'appr-status-badge--in-review'
                           : item.statusKey === 'changes' ? 'appr-status-badge--changes'
                           : item.statusKey === 'rejected' ? 'appr-status-badge--rejected'
                           : 'appr-status-badge--approved';

    return `
      <tr data-id="${item.id}">
        <!-- 1. Type -->
        <td>
          <span class="appr-type-badge ${typeBadgeClass}">
            ${typeIcon}
            ${item.typeLabel}
          </span>
        </td>

        <!-- 2. Title -->
        <td class="appr-title-cell">
          <a href="${item.type === 'job' ? 'approval-review-job.html?id=' + encodeURIComponent(item.id) : item.type === 'blog' ? 'approval-review-blog.html?id=' + encodeURIComponent(item.id) : 'javascript:void(0)'}" class="appr-title-link" data-action="review" data-id="${item.id}" title="${item.title}">
            ${item.title}
          </a>
        </td>

        <!-- 3. ID -->
        <td class="appr-id-cell">${item.id}</td>

        <!-- 4. Submitted By -->
        <td>
          <div class="appr-submitter-cell">
            <span class="appr-avatar">${item.initials}</span>
            <span class="appr-submitter-name">${item.submittedBy}</span>
          </div>
        </td>

        <!-- 5. Submitted On -->
        <td class="appr-date-cell">${item.submittedOn}</td>

        <!-- 6. Status (Subtle Square-Rounded, Text Only) -->
        <td>
          <span class="appr-status-badge ${statusBadgeClass}">${item.status}</span>
        </td>

        <!-- 7. Action -->
        <td>
          <button class="btn-review-action" type="button" data-action="review" data-id="${item.id}">
            Review <i class="ph ph-arrow-right"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ─── Filter & Search Handlers ─────────────────────────────────────────────────
function initFilters() {
  // Live Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderTable();
    });
  }

  // Type Dropdown Toggle
  if (typeTrigger && typeDropdown) {
    typeTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = typeDropdown.classList.contains('is-open');
      typeDropdown.classList.toggle('is-open', !isOpen);
      typeTrigger.classList.toggle('is-open', !isOpen);
    });

    typeDropdown.querySelectorAll('.filter-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = option.dataset.type;
        currentTypeFilter = type;

        typeDropdown.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('is-selected'));
        option.classList.add('is-selected');

        if (typeLabel) {
          typeLabel.textContent = type === 'all' ? 'All Types'
                                : type === 'job' ? 'Jobs'
                                : type === 'blog' ? 'Blog Posts'
                                : 'Undo Requests';
        }

        typeDropdown.classList.remove('is-open');
        typeTrigger.classList.remove('is-open');
        renderTable();
      });
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', () => {
    if (typeDropdown) typeDropdown.classList.remove('is-open');
    if (typeTrigger) typeTrigger.classList.remove('is-open');
  });

  // Table row click delegation for Review action
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="review"]');
      if (!btn) return;
      e.preventDefault();
      const id = btn.dataset.id;
      const item = requestsList.find(r => r.id === id);
      
      // If it's a job posting or blog article, navigate to their dedicated review pages
      if (item && item.type === 'job') {
        window.location.href = 'approval-review-job.html?id=' + encodeURIComponent(id);
      } else if (item && item.type === 'blog') {
        window.location.href = 'approval-review-blog.html?id=' + encodeURIComponent(id);
      } else {
        openReviewModal(id);
      }
    });
  }
}

// ─── Review Modal Functions ───────────────────────────────────────────────────
function openReviewModal(id) {
  const item = requestsList.find(r => r.id === id);
  if (!item || !reviewModal) return;

  currentReviewItem = item;

  const titleEl = document.getElementById('modalItemTitle');
  const idEl = document.getElementById('modalItemId');
  const typeEl = document.getElementById('modalItemType');
  const submitterEl = document.getElementById('modalItemSubmitter');
  const dateEl = document.getElementById('modalItemDate');
  const statusEl = document.getElementById('modalItemStatus');
  const summaryEl = document.getElementById('modalItemSummary');

  if (titleEl) titleEl.textContent = item.title;
  if (idEl) idEl.textContent = item.id;
  if (typeEl) typeEl.textContent = `${item.typeLabel} (${item.category})`;
  if (submitterEl) submitterEl.textContent = item.submittedBy;
  if (dateEl) dateEl.textContent = `${item.submittedOn} at ${item.time}`;
  if (statusEl) statusEl.textContent = item.status;
  if (summaryEl) summaryEl.textContent = item.summary;

  reviewModal.classList.add('is-open');
  reviewModal.setAttribute('aria-hidden', 'false');
}

function closeReviewModal() {
  if (!reviewModal) return;
  reviewModal.classList.remove('is-open');
  reviewModal.setAttribute('aria-hidden', 'true');
  currentReviewItem = null;
}

function initModalActions() {
  const btnClose = document.getElementById('btnModalClose');
  const btnApprove = document.getElementById('btnModalApprove');
  const btnChanges = document.getElementById('btnModalChanges');
  const btnReject = document.getElementById('btnModalReject');

  if (btnClose) btnClose.addEventListener('click', closeReviewModal);

  // Close on backdrop click
  if (reviewModal) {
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) closeReviewModal();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reviewModal && reviewModal.classList.contains('is-open')) {
      closeReviewModal();
    }
  });

  // Action: Approve & Publish
  if (btnApprove) {
    btnApprove.addEventListener('click', () => {
      if (!currentReviewItem) return;
      currentReviewItem.status = 'Approved';
      currentReviewItem.statusKey = 'approved';
      showToast(`Approved & Published: ${currentReviewItem.id}`);
      closeReviewModal();
      updateSummaryCounts();
      renderTable();
    });
  }

  // Action: Request Changes
  if (btnChanges) {
    btnChanges.addEventListener('click', () => {
      if (!currentReviewItem) return;
      currentReviewItem.status = 'Changes Requested';
      currentReviewItem.statusKey = 'changes';
      showToast(`Changes requested for ${currentReviewItem.id}`);
      closeReviewModal();
      updateSummaryCounts();
      renderTable();
    });
  }

  // Action: Reject
  if (btnReject) {
    btnReject.addEventListener('click', () => {
      if (!currentReviewItem) return;
      currentReviewItem.status = 'Rejected';
      currentReviewItem.statusKey = 'rejected';
      showToast(`Rejected request ${currentReviewItem.id}`);
      closeReviewModal();
      updateSummaryCounts();
      renderTable();
    });
  }
}

// ─── Toast Notification Helper ────────────────────────────────────────────────
function showToast(message) {
  let toast = document.getElementById('apprToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'apprToast';
    toast.className = 'appr-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="ph ph-check-circle"></i> <span>${message}</span>`;
  toast.classList.add('is-visible');

  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2800);
}

// ─── Initialization ───────────────────────────────────────────────────────────
function initApprovalsPage() {
  updateSummaryCounts();
  initFilters();
  initModalActions();
  renderTable();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApprovalsPage);
} else {
  initApprovalsPage();
}
