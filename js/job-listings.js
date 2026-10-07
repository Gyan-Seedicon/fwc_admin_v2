/**
 * FWC Admin Portal — Job Listings Management Logic
 * Handles 21 job requisitions, multi-filtering, smart POC display, popovers, and CSV export.
 */

// Dataset: 21 Job Requisitions (9 Published, 6 Pending review, 4 Drafts, 2 Closed)
let jobListingsData = [
  // --- 6 Pending Review ---
  {
    id: '#JOB-412',
    title: 'Site Reliability & Platform Engineer',
    submitted: 'Sep 25, 2026',
    expiry: 'Nov 15, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    applicants: 0,
    poc: { name: 'Marcus Webb', initials: 'MW', dept: 'Infrastructure', email: 'm.webb@fwc.internal' },
    location: 'Remote',
    type: 'Full-time',
    views: '—',
    creator: 'Sarah Mitchell',
    department: 'Infrastructure',
    month: 'September 2026'
  },
  {
    id: '#JOB-411',
    title: 'Senior Cloud Security Architect',
    submitted: 'Sep 24, 2026',
    expiry: 'Nov 10, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    applicants: 0,
    poc: { name: 'Elena Rostova', initials: 'ER', dept: 'Security', email: 'e.rostova@fwc.internal' },
    location: 'New York, NY',
    type: 'Full-time',
    views: '—',
    creator: 'Marcus Webb',
    department: 'Security',
    month: 'September 2026'
  },
  {
    id: '#JOB-410',
    title: 'Staff Frontend Infrastructure Engineer',
    submitted: 'Sep 23, 2026',
    expiry: 'Nov 05, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    applicants: 0,
    poc: { name: 'David Kim', initials: 'DK', dept: 'Engineering', email: 'd.kim@fwc.internal' },
    location: 'San Francisco, CA',
    type: 'Full-time',
    views: '—',
    creator: 'Priya Nair',
    department: 'Engineering',
    month: 'September 2026'
  },
  {
    id: '#JOB-409',
    title: 'Lead Distributed Systems Engineer',
    submitted: 'Sep 22, 2026',
    expiry: 'Oct 30, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    applicants: 0,
    poc: { name: 'James Okafor', initials: 'JO', dept: 'Engineering', email: 'j.okafor@fwc.internal' },
    location: 'Remote',
    type: 'Full-time',
    views: '—',
    creator: 'Sarah Mitchell',
    department: 'Engineering',
    month: 'September 2026'
  },
  {
    id: '#JOB-408',
    title: 'Principal AI/ML Research Scientist',
    submitted: 'Sep 21, 2026',
    expiry: 'Oct 28, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    applicants: 0,
    poc: { name: 'Priya Nair', initials: 'PN', dept: 'AI Labs', email: 'p.nair@fwc.internal' },
    location: 'Boston, MA',
    type: 'Full-time',
    views: '—',
    creator: 'Priya Nair',
    department: 'AI Labs',
    month: 'September 2026'
  },
  {
    id: '#JOB-407',
    title: 'Senior Product Designer, Design Systems',
    submitted: 'Sep 20, 2026',
    expiry: 'Oct 25, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    applicants: 0,
    poc: { name: 'Elena Rostova', initials: 'ER', dept: 'Product Design', email: 'e.rostova@fwc.internal' },
    location: 'Remote',
    type: 'Full-time',
    views: '—',
    creator: 'Elena Rostova',
    department: 'Product Design',
    month: 'September 2026'
  },

  // --- 9 Published ---
  {
    id: '#JOB-406',
    title: 'Senior Full Stack Developer (React & Node)',
    submitted: 'Aug 28, 2026',
    expiry: 'Oct 31, 2026',
    status: 'Published',
    statusKey: 'published',
    applicants: 48,
    poc: { name: 'David Kim', initials: 'DK', dept: 'Engineering', email: 'd.kim@fwc.internal' },
    location: 'Remote',
    type: 'Full-time',
    views: '1,840',
    creator: 'David Kim',
    department: 'Engineering',
    month: 'August 2026'
  },
  {
    id: '#JOB-405',
    title: 'Enterprise Account Executive, Cloud',
    submitted: 'Aug 25, 2026',
    expiry: 'Oct 20, 2026',
    status: 'Published',
    statusKey: 'published',
    applicants: 32,
    poc: { name: 'Liam Vance', initials: 'LV', dept: 'Sales', email: 'l.vance@fwc.internal' },
    location: 'Chicago, IL',
    type: 'Full-time',
    views: '1,220',
    creator: 'Liam Vance',
    department: 'Sales',
    month: 'August 2026'
  },
  {
    id: '#JOB-404',
    title: 'DevOps & Kubernetes Specialist',
    submitted: 'Aug 20, 2026',
    expiry: 'Oct 15, 2026',
    status: 'Published',
    statusKey: 'published',
    applicants: 27,
    poc: { name: 'Marcus Webb', initials: 'MW', dept: 'DevOps', email: 'm.webb@fwc.internal' },
    location: 'Austin, TX',
    type: 'Full-time',
    views: '980',
    creator: 'Marcus Webb',
    department: 'DevOps',
    month: 'August 2026'
  },
  {
    id: '#JOB-403',
    title: 'Principal Solutions Architect',
    submitted: 'Aug 15, 2026',
    expiry: 'Oct 10, 2026',
    status: 'Published',
    statusKey: 'published',
    applicants: 19,
    poc: { name: 'James Okafor', initials: 'JO', dept: 'Solutions', email: 'j.okafor@fwc.internal' },
    location: 'London, UK',
    type: 'Full-time',
    views: '850',
    creator: 'James Okafor',
    department: 'Solutions',
    month: 'August 2026'
  },
  {
    id: '#JOB-402',
    title: 'Data Platform & Pipeline Engineer',
    submitted: 'Aug 10, 2026',
    expiry: 'Sep 30, 2026',
    status: 'Published',
    statusKey: 'published',
    applicants: 41,
    poc: { name: 'David Kim', initials: 'DK', dept: 'Data Systems', email: 'd.kim@fwc.internal' },
    location: 'Remote',
    type: 'Full-time',
    views: '1,460',
    creator: 'David Kim',
    department: 'Data Systems',
    month: 'August 2026'
  },
  {
    id: '#JOB-401',
    title: 'Product Operations Manager',
    submitted: 'Aug 05, 2026',
    expiry: 'Sep 28, 2026',
    status: 'Published',
    statusKey: 'published',
    applicants: 23,
    poc: { name: 'Sarah Mitchell', initials: 'SM', dept: 'Operations', email: 's.mitchell@fwc.internal' },
    location: 'Seattle, WA',
    type: 'Full-time',
    views: '790',
    creator: 'Sarah Mitchell',
    department: 'Operations',
    month: 'August 2026'
  },
  {
    id: '#JOB-400',
    title: 'Senior Cybersecurity Incident Responder',
    submitted: 'Jul 28, 2026',
    expiry: 'Sep 25, 2026',
    status: 'Published',
    statusKey: 'published',
    applicants: 15,
    poc: { name: 'Elena Rostova', initials: 'ER', dept: 'Security', email: 'e.rostova@fwc.internal' },
    location: 'Remote',
    type: 'Full-time',
    views: '640',
    creator: 'Elena Rostova',
    department: 'Security',
    month: 'July 2026'
  },
  {
    id: '#JOB-399',
    title: 'Quantitative Financial Analyst',
    submitted: 'Jul 20, 2026',
    expiry: 'Sep 20, 2026',
    status: 'Published',
    statusKey: 'published',
    applicants: 36,
    poc: { name: 'Liam Vance', initials: 'LV', dept: 'Finance', email: 'l.vance@fwc.internal' },
    location: 'New York, NY',
    type: 'Full-time',
    views: '1,110',
    creator: 'Liam Vance',
    department: 'Finance',
    month: 'July 2026'
  },
  {
    id: '#JOB-398',
    title: 'Technical Writer & Developer Relations',
    submitted: 'Jul 14, 2026',
    expiry: 'Sep 15, 2026',
    status: 'Published',
    statusKey: 'published',
    applicants: 54,
    poc: { name: 'Sarah Mitchell', initials: 'SM', dept: 'DevRel', email: 's.mitchell@fwc.internal' },
    location: 'Remote',
    type: 'Contract',
    views: '2,350',
    creator: 'Sarah Mitchell',
    department: 'DevRel',
    month: 'July 2026'
  },

  // --- 4 Drafts ---
  {
    id: '#JOB-397',
    title: 'Mobile iOS Engineer (Swift & SwiftUI)',
    submitted: '—',
    expiry: '—',
    status: 'Draft',
    statusKey: 'draft',
    applicants: 0,
    poc: { name: 'David Kim', initials: 'DK', dept: 'Mobile', email: 'd.kim@fwc.internal' },
    location: 'Remote',
    type: 'Full-time',
    views: '—',
    creator: 'David Kim',
    department: 'Mobile',
    month: 'September 2026'
  },
  {
    id: '#JOB-396',
    title: 'VP of Infrastructure & Platform',
    submitted: '—',
    expiry: '—',
    status: 'Draft',
    statusKey: 'draft',
    applicants: 0,
    poc: { name: 'Marcus Webb', initials: 'MW', dept: 'Leadership', email: 'm.webb@fwc.internal' },
    location: 'San Francisco, CA',
    type: 'Full-time',
    views: '—',
    creator: 'Marcus Webb',
    department: 'Leadership',
    month: 'September 2026'
  },
  {
    id: '#JOB-395',
    title: 'AI Prompt Engineer & Evaluator',
    submitted: '—',
    expiry: '—',
    status: 'Draft',
    statusKey: 'draft',
    applicants: 0,
    poc: { name: 'Priya Nair', initials: 'PN', dept: 'AI Labs', email: 'p.nair@fwc.internal' },
    location: 'Remote',
    type: 'Part-time',
    views: '—',
    creator: 'Priya Nair',
    department: 'AI Labs',
    month: 'September 2026'
  },
  {
    id: '#JOB-394',
    title: 'Compliance & Privacy Governance Counsel',
    submitted: '—',
    expiry: '—',
    status: 'Draft',
    statusKey: 'draft',
    applicants: 0,
    poc: { name: 'Elena Rostova', initials: 'ER', dept: 'Legal', email: 'e.rostova@fwc.internal' },
    location: 'Washington, DC',
    type: 'Full-time',
    views: '—',
    creator: 'Elena Rostova',
    department: 'Legal',
    month: 'September 2026'
  },

  // --- 2 Closed ---
  {
    id: '#JOB-393',
    title: 'Senior Network Security Engineer',
    submitted: 'Jun 10, 2026',
    expiry: 'Aug 30, 2026',
    status: 'Closed',
    statusKey: 'closed',
    applicants: 62,
    poc: { name: 'Marcus Webb', initials: 'MW', dept: 'Security', email: 'm.webb@fwc.internal' },
    location: 'Remote',
    type: 'Full-time',
    views: '3,120',
    creator: 'Marcus Webb',
    department: 'Security',
    month: 'Earlier'
  },
  {
    id: '#JOB-392',
    title: 'Cloud Cost Optimization Lead',
    submitted: 'May 18, 2026',
    expiry: 'Jul 31, 2026',
    status: 'Closed',
    statusKey: 'closed',
    applicants: 45,
    poc: { name: 'James Okafor', initials: 'JO', dept: 'FinOps', email: 'j.okafor@fwc.internal' },
    location: 'Austin, TX',
    type: 'Full-time',
    views: '2,480',
    creator: 'James Okafor',
    department: 'FinOps',
    month: 'Earlier'
  }
];

// State variables for filtering
let filterJobSearch = '';
let filterJobStatus = 'all';
let filterJobCreator = 'all';
let filterJobDate = 'all';

// Item marked for deletion or edit
let selectedJobIdForDelete = null;

// DOM Elements
const jobElements = {};

function cacheDomElements() {
  jobElements.cardPublished = document.getElementById('cardCountPublished');
  jobElements.cardPending = document.getElementById('cardCountPending');
  jobElements.cardDrafts = document.getElementById('cardCountDrafts');
  jobElements.cardTotal = document.getElementById('cardCountTotal');
  
  jobElements.searchInput = document.getElementById('jobSearchInput');
  jobElements.countText = document.getElementById('jobCountText');
  jobElements.footerCountText = document.getElementById('jobFooterCount');
  jobElements.tableBody = document.getElementById('jobsTableBody');

  // Filter triggers & dropdowns
  jobElements.statusFilterTrigger = document.getElementById('statusFilterTrigger');
  jobElements.statusFilterLabel = document.getElementById('statusFilterLabel');
  jobElements.statusFilterMenu = document.getElementById('statusFilterMenu');

  jobElements.creatorFilterTrigger = document.getElementById('creatorFilterTrigger');
  jobElements.creatorFilterLabel = document.getElementById('creatorFilterLabel');
  jobElements.creatorFilterMenu = document.getElementById('creatorFilterMenu');

  jobElements.dateFilterTrigger = document.getElementById('dateFilterTrigger');
  jobElements.dateFilterLabel = document.getElementById('dateFilterLabel');
  jobElements.dateFilterMenu = document.getElementById('dateFilterMenu');

  // Modals & Buttons
  jobElements.btnAddJob = document.getElementById('btnAddJob');
  jobElements.btnExportCsv = document.getElementById('btnExportCsv');
  jobElements.modalAddJob = document.getElementById('modalAddJob');
  jobElements.modalDelete = document.getElementById('modalDelete');
  jobElements.toast = document.getElementById('jobsToast');
  jobElements.toastMsg = document.getElementById('jobsToastMsg');
}

/**
 * Updates the 4 Summary Cards based on current dataset.
 */
function updateSummaryCards() {
  const publishedCount = jobListingsData.filter(j => j.statusKey === 'published').length;
  const pendingCount = jobListingsData.filter(j => j.statusKey === 'pending').length;
  const draftsCount = jobListingsData.filter(j => j.statusKey === 'draft').length;
  const totalCount = jobListingsData.length;

  if (jobElements.cardPublished) jobElements.cardPublished.textContent = publishedCount;
  if (jobElements.cardPending) jobElements.cardPending.textContent = pendingCount;
  if (jobElements.cardDrafts) jobElements.cardDrafts.textContent = draftsCount;
  if (jobElements.cardTotal) jobElements.cardTotal.textContent = totalCount;
}

/**
 * Filters and renders the 11-column jobs table.
 */
function renderJobsTable() {
  if (!jobElements.tableBody) return;

  const query = filterJobSearch.toLowerCase().trim();

  const filtered = jobListingsData.filter(item => {
    // Search matching title, ID, department, location, poc, creator
    const matchesSearch = !query ||
      item.title.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.department.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.poc.name.toLowerCase().includes(query) ||
      item.creator.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query);

    // Status filter
    const matchesStatus = filterJobStatus === 'all' || item.statusKey === filterJobStatus;

    // Creator filter
    const matchesCreator = filterJobCreator === 'all' || item.creator === filterJobCreator;

    // Date filter
    const matchesDate = filterJobDate === 'all' || item.month === filterJobDate;

    return matchesSearch && matchesStatus && matchesCreator && matchesDate;
  });

  // Update counter text
  const totalItems = jobListingsData.length;
  const filteredCount = filtered.length;
  
  if (jobElements.countText) {
    jobElements.countText.innerHTML = `Showing <strong>${filteredCount}</strong> of ${totalItems} jobs`;
  }
  if (jobElements.footerCountText) {
    jobElements.footerCountText.textContent = `Showing 1–${filteredCount} of ${totalItems} jobs`;
  }

  // Handle empty state
  if (filtered.length === 0) {
    jobElements.tableBody.innerHTML = `
      <tr>
        <td colspan="11" style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <i class="ph ph-magnifying-glass" style="font-size: 28px; color: var(--text-subtle);"></i>
            <span style="font-size: 14px; font-weight: 500; color: var(--text-secondary);">No job requisitions found</span>
            <span style="font-size: 12px; color: var(--text-muted);">Try adjusting your search keywords or filter criteria.</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  // Render 11-column rows in exact order
  jobElements.tableBody.innerHTML = filtered.map(item => {
    // Square-rounded status badge classes
    let statusClass = 'status-badge-sq--published';
    if (item.statusKey === 'pending') {
      statusClass = 'status-badge-sq--pending';
    } else if (item.statusKey === 'draft') {
      statusClass = 'status-badge-sq--draft';
    } else if (item.statusKey === 'closed') {
      statusClass = 'status-badge-sq--closed';
    }

    const applicantsBadge = item.applicants > 0
      ? `<span class="applicants-count-badge">${item.applicants}</span>`
      : `<span class="applicants-count-badge is-zero">0</span>`;

    return `
      <tr data-id="${item.id}">
        <!-- 1. Job ID -->
        <td>
          <span class="col-job-id">${item.id}</span>
        </td>

        <!-- 2. Title -->
        <td>
          <a href="approval-review-job.html?id=${encodeURIComponent(item.id)}" class="col-job-title-link" title="${item.title}">
            ${item.title}
          </a>
        </td>

        <!-- 3. Submitted -->
        <td>
          <span class="col-date-text">${item.submitted}</span>
        </td>

        <!-- 4. Expiry -->
        <td>
          <span class="col-date-text">${item.expiry}</span>
        </td>

        <!-- 5. Status (Subtle Square-Rounded Badge) -->
        <td>
          <span class="status-badge-sq ${statusClass}">
            ${item.status}
          </span>
        </td>

        <!-- 6. Applicants -->
        <td>
          <div class="applicants-count-cell">
            ${applicantsBadge}
          </div>
        </td>

        <!-- 7. POC (Smart Point of Contact Display) -->
        <td>
          <div class="smart-poc-wrap" title="${item.poc.name} · ${item.poc.dept} (${item.poc.email})">
            <span class="smart-poc-avatar">${item.poc.initials}</span>
            <div class="smart-poc-info">
              <span class="smart-poc-name">${item.poc.name}</span>
              <span class="smart-poc-dept">${item.poc.dept}</span>
            </div>
          </div>
        </td>

        <!-- 8. Location -->
        <td>
          <span class="col-location-cell">
            <i class="ph ph-map-pin"></i>
            <span>${item.location}</span>
          </span>
        </td>

        <!-- 9. Type -->
        <td>
          <span class="col-type-tag">${item.type}</span>
        </td>

        <!-- 10. Views -->
        <td>
          <span class="col-views-text">${item.views}</span>
        </td>

        <!-- 11. Actions (Three Dots Menu) -->
        <td style="text-align: right; position: relative;">
          <button
            type="button"
            class="btn-action-dots"
            data-job-id="${item.id}"
            title="More actions"
            aria-label="Actions for ${item.id}"
          >
            <i class="ph ph-dots-three-vertical"></i>
          </button>

          <!-- Popover Menu -->
          <div class="row-action-popover" id="popover-${item.id.replace('#', '')}">
            <a href="approval-review-job.html?id=${encodeURIComponent(item.id)}" class="row-action-btn" style="text-decoration: none;">
              <i class="ph ph-eye"></i> ${item.statusKey === 'pending' ? 'Review posting' : 'View requisition'}
            </a>
            <button type="button" class="row-action-btn action-edit" data-id="${item.id}">
              <i class="ph ph-pencil-simple"></i> Edit job
            </button>
            <div class="row-action-divider"></div>
            <button type="button" class="row-action-btn row-action-btn--delete action-delete" data-id="${item.id}">
              <i class="ph ph-trash"></i> Delete job
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  attachRowActionListeners();
}

/**
 * Attaches event listeners to Three-Dots action menus in the table.
 */
function attachRowActionListeners() {
  const dotButtons = jobElements.tableBody.querySelectorAll('.btn-action-dots');
  
  dotButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const jobId = btn.getAttribute('data-job-id').replace('#', '');
      const popover = document.getElementById(`popover-${jobId}`);
      
      closeAllPopovers();

      if (popover) {
        popover.classList.toggle('is-open');
        btn.classList.toggle('is-active', popover.classList.contains('is-open'));
      }
    });
  });

  // Edit button
  const editButtons = jobElements.tableBody.querySelectorAll('.action-edit');
  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopovers();
      const id = btn.getAttribute('data-id');
      const item = jobListingsData.find(j => j.id === id);
      if (item) {
        openAddOrEditModal(item);
      }
    });
  });

  // Delete button
  const deleteButtons = jobElements.tableBody.querySelectorAll('.action-delete');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopovers();
      const id = btn.getAttribute('data-id');
      selectedJobIdForDelete = id;
      openDeleteModal(id);
    });
  });
}

/**
 * Closes all open popover menus.
 */
function closeAllPopovers() {
  document.querySelectorAll('.row-action-popover.is-open').forEach(el => {
    el.classList.remove('is-open');
  });
  document.querySelectorAll('.btn-action-dots.is-active').forEach(el => {
    el.classList.remove('is-active');
  });
}

/**
 * Sets up custom dropdown filter menus.
 */
function setupDropdown(trigger, menu, label, onSelect) {
  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('is-open');
    closeAllFilterMenus();
    if (!isOpen) {
      menu.classList.add('is-open');
      trigger.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  menu.querySelectorAll('.filter-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = item.getAttribute('data-value');
      const text = item.textContent.trim();
      
      menu.querySelectorAll('.filter-menu-item').forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      
      if (label) label.textContent = text;
      
      menu.classList.remove('is-open');
      trigger.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');

      onSelect(value);
    });
  });
}

function closeAllFilterMenus() {
  document.querySelectorAll('.filter-menu-popover.is-open').forEach(menu => {
    menu.classList.remove('is-open');
  });
  document.querySelectorAll('.filter-trigger-btn.is-open').forEach(btn => {
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toast notifications.
 */
let toastTimeout;
function showToast(message) {
  if (!jobElements.toast || !jobElements.toastMsg) return;
  jobElements.toastMsg.textContent = message;
  jobElements.toast.classList.add('is-visible');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    jobElements.toast.classList.remove('is-visible');
  }, 3200);
}

/**
 * Modals Management.
 */
function openAddOrEditModal(itemToEdit = null) {
  if (!jobElements.modalAddJob) return;

  const modalTitle = document.getElementById('modalAddJobTitle');
  const inputTitle = document.getElementById('inputJobTitle');
  const selectDept = document.getElementById('selectJobDept');
  const selectType = document.getElementById('selectJobType');
  const inputLocation = document.getElementById('inputJobLocation');
  const selectPoc = document.getElementById('selectJobPoc');
  const editIdField = document.getElementById('editJobIdField');

  if (itemToEdit) {
    if (modalTitle) modalTitle.textContent = 'Edit Job Requisition';
    if (inputTitle) inputTitle.value = itemToEdit.title;
    if (selectDept) selectDept.value = itemToEdit.department;
    if (selectType) selectType.value = itemToEdit.type;
    if (inputLocation) inputLocation.value = itemToEdit.location;
    if (selectPoc) selectPoc.value = itemToEdit.poc.name;
    if (editIdField) editIdField.value = itemToEdit.id;
  } else {
    if (modalTitle) modalTitle.textContent = 'Post a New Job';
    if (inputTitle) inputTitle.value = '';
    if (selectDept) selectDept.value = 'Engineering';
    if (selectType) selectType.value = 'Full-time';
    if (inputLocation) inputLocation.value = 'Remote';
    if (selectPoc) selectPoc.value = 'Sarah Mitchell';
    if (editIdField) editIdField.value = '';
  }

  jobElements.modalAddJob.classList.add('is-open');
}

function closeAddModal() {
  if (jobElements.modalAddJob) {
    jobElements.modalAddJob.classList.remove('is-open');
  }
}

function openDeleteModal(jobId) {
  if (!jobElements.modalDelete) return;
  const deleteTargetId = document.getElementById('deleteTargetId');
  if (deleteTargetId) deleteTargetId.textContent = jobId;
  jobElements.modalDelete.classList.add('is-open');
}

function closeDeleteModal() {
  if (jobElements.modalDelete) {
    jobElements.modalDelete.classList.remove('is-open');
  }
  selectedJobIdForDelete = null;
}

/**
 * CSV Export Functionality.
 */
function exportToCsv() {
  const headers = ['Job ID', 'Title', 'Submitted', 'Expiry', 'Status', 'Applicants', 'POC Name', 'POC Dept', 'Location', 'Type', 'Views'];
  const rows = jobListingsData.map(j => [
    `"${j.id}"`,
    `"${j.title.replace(/"/g, '""')}"`,
    `"${j.submitted}"`,
    `"${j.expiry}"`,
    `"${j.status}"`,
    `"${j.applicants}"`,
    `"${j.poc.name}"`,
    `"${j.poc.dept}"`,
    `"${j.location}"`,
    `"${j.type}"`,
    `"${j.views}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `fwc_job_listings_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Successfully exported ${jobListingsData.length} job requisitions to CSV`);
}

/**
 * Initializer.
 */
function initJobListingsPage() {
  cacheDomElements();
  updateSummaryCards();
  renderJobsTable();

  // Search input event
  if (jobElements.searchInput) {
    jobElements.searchInput.addEventListener('input', (e) => {
      filterJobSearch = e.target.value;
      renderJobsTable();
    });
  }

  // Setup the 3 Filter Dropdowns
  setupDropdown(jobElements.statusFilterTrigger, jobElements.statusFilterMenu, jobElements.statusFilterLabel, (val) => {
    filterJobStatus = val;
    renderJobsTable();
  });

  setupDropdown(jobElements.creatorFilterTrigger, jobElements.creatorFilterMenu, jobElements.creatorFilterLabel, (val) => {
    filterJobCreator = val;
    renderJobsTable();
  });

  setupDropdown(jobElements.dateFilterTrigger, jobElements.dateFilterMenu, jobElements.dateFilterLabel, (val) => {
    filterJobDate = val;
    renderJobsTable();
  });

  // Export CSV button
  if (jobElements.btnExportCsv) {
    jobElements.btnExportCsv.addEventListener('click', () => {
      exportToCsv();
    });
  }

  // Add Job button
  if (jobElements.btnAddJob) {
    jobElements.btnAddJob.addEventListener('click', () => {
      openAddOrEditModal();
    });
  }

  // Modal Close & Form Buttons
  const btnCloseAddModal = document.getElementById('btnCloseAddModal');
  const btnCancelAddModal = document.getElementById('btnCancelAddModal');
  const btnSaveDraft = document.getElementById('btnSaveDraft');
  const btnSubmitJob = document.getElementById('btnSubmitJob');

  if (btnCloseAddModal) btnCloseAddModal.addEventListener('click', closeAddModal);
  if (btnCancelAddModal) btnCancelAddModal.addEventListener('click', closeAddModal);

  // Handle Save Draft or Submit Review
  function handleJobSave(asDraft = false) {
    const inputTitle = document.getElementById('inputJobTitle');
    const selectDept = document.getElementById('selectJobDept');
    const selectType = document.getElementById('selectJobType');
    const inputLocation = document.getElementById('inputJobLocation');
    const selectPoc = document.getElementById('selectJobPoc');
    const editIdField = document.getElementById('editJobIdField');

    const title = inputTitle ? inputTitle.value.trim() : '';
    if (!title) {
      alert('Please enter a job title.');
      return;
    }

    const dept = selectDept ? selectDept.value : 'Engineering';
    const type = selectType ? selectType.value : 'Full-time';
    const location = inputLocation ? inputLocation.value.trim() || 'Remote' : 'Remote';
    const pocName = selectPoc ? selectPoc.value : 'Sarah Mitchell';
    const editId = editIdField ? editIdField.value : '';

    const initials = pocName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    if (editId) {
      // Editing existing job
      const item = jobListingsData.find(j => j.id === editId);
      if (item) {
        item.title = title;
        item.department = dept;
        item.type = type;
        item.location = location;
        item.poc = { name: pocName, initials: initials, dept: dept, email: `${pocName.toLowerCase().replace(' ', '.')}@fwc.internal` };
        showToast(`Job requisition ${editId} updated successfully`);
      }
    } else {
      // Adding new job
      const newNum = 413 + Math.floor(Math.random() * 80);
      const newId = `#JOB-${newNum}`;
      const newJob = {
        id: newId,
        title: title,
        submitted: asDraft ? '—' : currentDate,
        expiry: asDraft ? '—' : 'Nov 30, 2026',
        status: asDraft ? 'Draft' : 'Pending review',
        statusKey: asDraft ? 'draft' : 'pending',
        applicants: 0,
        poc: { name: pocName, initials: initials, dept: dept, email: `${pocName.toLowerCase().replace(' ', '.')}@fwc.internal` },
        location: location,
        type: type,
        views: '—',
        creator: 'Sarah Mitchell',
        department: dept,
        month: 'September 2026'
      };

      jobListingsData.unshift(newJob);
      showToast(asDraft ? `Requisition ${newId} saved as draft` : `Requisition ${newId} submitted for review`);
    }

    closeAddModal();
    updateSummaryCards();
    renderJobsTable();
  }

  if (btnSaveDraft) btnSaveDraft.addEventListener('click', () => handleJobSave(true));
  if (btnSubmitJob) btnSubmitJob.addEventListener('click', () => handleJobSave(false));

  // Delete Modal Buttons
  const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');

  if (btnCloseDeleteModal) btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
  if (btnCancelDelete) btnCancelDelete.addEventListener('click', closeDeleteModal);

  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', () => {
      if (selectedJobIdForDelete) {
        const delId = selectedJobIdForDelete;
        jobListingsData = jobListingsData.filter(j => j.id !== delId);
        showToast(`Job requisition ${delId} deleted successfully`);
        closeDeleteModal();
        updateSummaryCards();
        renderJobsTable();
      }
    });
  }

  // Global click outside to close popovers and filter menus
  document.addEventListener('click', () => {
    closeAllPopovers();
    closeAllFilterMenus();
  });

  // Global keydown (Escape closes open dialogs/popovers)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopovers();
      closeAllFilterMenus();
      closeAddModal();
      closeDeleteModal();
    }
  });
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', initJobListingsPage);
