/**
 * FWC Admin Portal — Blog Posts Management Logic
 * Handles dynamic rendering, multi-filtering, popovers, modal actions, and CSV export.
 */

// Dataset: 15 Blog Posts (7 Published, 4 Pending review, 4 Drafts)
let blogPostsData = [
  // --- 4 Pending Review ---
  {
    id: '#BLG-309',
    title: 'The Future of AI in Manufacturing Supply Chains',
    creator: 'Sarah Mitchell',
    initials: 'SM',
    createdOn: 'Sep 18, 2026',
    type: 'Article',
    category: 'Industry Insights',
    submitted: 'Sep 24, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    published: '—',
    month: 'September 2026'
  },
  {
    id: '#BLG-308',
    title: 'Scaling Distributed Kubernetes for Enterprise Microservices',
    creator: 'Sarah Mitchell',
    initials: 'SM',
    createdOn: 'Sep 14, 2026',
    type: 'Guide',
    category: 'Cloud Architecture',
    submitted: 'Sep 22, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    published: '—',
    month: 'September 2026'
  },
  {
    id: '#BLG-307',
    title: 'Next-Gen AI Workflows for Modern Enterprises',
    creator: 'Priya Nair',
    initials: 'PN',
    createdOn: 'Sep 10, 2026',
    type: 'Article',
    category: 'Artificial Intelligence',
    submitted: 'Sep 21, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    published: '—',
    month: 'September 2026'
  },
  {
    id: '#BLG-306',
    title: 'Why Digital Twins Are the Next Big Thing in Logistics',
    creator: 'Sarah Mitchell',
    initials: 'SM',
    createdOn: 'Sep 08, 2026',
    type: 'Blog post',
    category: 'Supply Chain',
    submitted: 'Sep 19, 2026',
    status: 'Pending review',
    statusKey: 'pending',
    published: '—',
    month: 'September 2026'
  },

  // --- 7 Published ---
  {
    id: '#BLG-305',
    title: 'Zero Trust Security Architecture in Modern DevOps',
    creator: 'Marcus Webb',
    initials: 'MW',
    createdOn: 'Aug 28, 2026',
    type: 'Article',
    category: 'Cybersecurity',
    submitted: 'Sep 02, 2026',
    status: 'Published',
    statusKey: 'published',
    published: 'Sep 12, 2026',
    month: 'September 2026'
  },
  {
    id: '#BLG-304',
    title: 'Optimizing Cloud Unit Economics with FinOps Practices',
    creator: 'James Okafor',
    initials: 'JO',
    createdOn: 'Aug 20, 2026',
    type: 'Guide',
    category: 'Cloud Services',
    submitted: 'Aug 28, 2026',
    status: 'Published',
    statusKey: 'published',
    published: 'Sep 05, 2026',
    month: 'September 2026'
  },
  {
    id: '#BLG-303',
    title: 'Building Resilient Edge Computing Networks in 2026',
    creator: 'David Kim',
    initials: 'DK',
    createdOn: 'Aug 12, 2026',
    type: 'Article',
    category: 'Edge Computing',
    submitted: 'Aug 20, 2026',
    status: 'Published',
    statusKey: 'published',
    published: 'Aug 29, 2026',
    month: 'August 2026'
  },
  {
    id: '#BLG-302',
    title: 'Designing Design Systems for High-Velocity Product Teams',
    creator: 'Elena Rostova',
    initials: 'ER',
    createdOn: 'Aug 05, 2026',
    type: 'Blog post',
    category: 'UI/UX Design',
    submitted: 'Aug 14, 2026',
    status: 'Published',
    statusKey: 'published',
    published: 'Aug 22, 2026',
    month: 'August 2026'
  },
  {
    id: '#BLG-301',
    title: 'Enterprise Threat Modeling: A Step-by-Step Playbook',
    creator: 'Marcus Webb',
    initials: 'MW',
    createdOn: 'Jul 24, 2026',
    type: 'Guide',
    category: 'Cybersecurity',
    submitted: 'Aug 02, 2026',
    status: 'Published',
    statusKey: 'published',
    published: 'Aug 15, 2026',
    month: 'August 2026'
  },
  {
    id: '#BLG-300',
    title: 'Navigating Multi-Cloud Governance and Compliance',
    creator: 'James Okafor',
    initials: 'JO',
    createdOn: 'Jul 15, 2026',
    type: 'Case study',
    category: 'Cloud Services',
    submitted: 'Jul 25, 2026',
    status: 'Published',
    statusKey: 'published',
    published: 'Aug 08, 2026',
    month: 'August 2026'
  },
  {
    id: '#BLG-299',
    title: 'The Evolution of GraphQL in Distributed Architectures',
    creator: 'Liam Vance',
    initials: 'LV',
    createdOn: 'Jul 02, 2026',
    type: 'Article',
    category: 'Web Engineering',
    submitted: 'Jul 12, 2026',
    status: 'Published',
    statusKey: 'published',
    published: 'Jul 28, 2026',
    month: 'July 2026'
  },

  // --- 4 Drafts ---
  {
    id: '#BLG-298',
    title: 'Implementing Event-Driven Architectures with Kafka',
    creator: 'David Kim',
    initials: 'DK',
    createdOn: 'Sep 25, 2026',
    type: 'Guide',
    category: 'Data Systems',
    submitted: '—',
    status: 'Draft',
    statusKey: 'draft',
    published: '—',
    month: 'September 2026'
  },
  {
    id: '#BLG-297',
    title: 'Human-in-the-Loop Verification for Enterprise LLMs',
    creator: 'Priya Nair',
    initials: 'PN',
    createdOn: 'Sep 23, 2026',
    type: 'Article',
    category: 'Artificial Intelligence',
    submitted: '—',
    status: 'Draft',
    statusKey: 'draft',
    published: '—',
    month: 'September 2026'
  },
  {
    id: '#BLG-296',
    title: 'Container Security Best Practices for Production Clusters',
    creator: 'Marcus Webb',
    initials: 'MW',
    createdOn: 'Sep 20, 2026',
    type: 'Guide',
    category: 'Cybersecurity',
    submitted: '—',
    status: 'Draft',
    statusKey: 'draft',
    published: '—',
    month: 'September 2026'
  },
  {
    id: '#BLG-295',
    title: 'Modern Frontend State Management in Micro-Frontends',
    creator: 'Elena Rostova',
    initials: 'ER',
    createdOn: 'Sep 17, 2026',
    type: 'Blog post',
    category: 'UI/UX Design',
    submitted: '—',
    status: 'Draft',
    statusKey: 'draft',
    published: '—',
    month: 'September 2026'
  }
];

// State variables for filtering
let filterSearch = '';
let filterStatus = 'all';
let filterCreator = 'all';
let filterType = 'all';
let filterDate = 'all';

// Item marked for deletion or edit
let selectedPostIdForDelete = null;

// DOM Elements
const elements = {};

function cacheDomElements() {
  elements.cardPublished = document.getElementById('cardCountPublished');
  elements.cardPending = document.getElementById('cardCountPending');
  elements.cardDrafts = document.getElementById('cardCountDrafts');
  elements.cardTotal = document.getElementById('cardCountTotal');
  
  elements.searchInput = document.getElementById('blogSearchInput');
  elements.countText = document.getElementById('blogCountText');
  elements.footerCountText = document.getElementById('blogFooterCount');
  elements.tableBody = document.getElementById('blogTableBody');

  // Filter triggers & dropdowns
  elements.statusFilterTrigger = document.getElementById('statusFilterTrigger');
  elements.statusFilterLabel = document.getElementById('statusFilterLabel');
  elements.statusFilterMenu = document.getElementById('statusFilterMenu');

  elements.creatorFilterTrigger = document.getElementById('creatorFilterTrigger');
  elements.creatorFilterLabel = document.getElementById('creatorFilterLabel');
  elements.creatorFilterMenu = document.getElementById('creatorFilterMenu');

  elements.typeFilterTrigger = document.getElementById('typeFilterTrigger');
  elements.typeFilterLabel = document.getElementById('typeFilterLabel');
  elements.typeFilterMenu = document.getElementById('typeFilterMenu');

  elements.dateFilterTrigger = document.getElementById('dateFilterTrigger');
  elements.dateFilterLabel = document.getElementById('dateFilterLabel');
  elements.dateFilterMenu = document.getElementById('dateFilterMenu');

  // Modals & Buttons
  elements.btnAddPost = document.getElementById('btnAddBlogPost');
  elements.btnExportCsv = document.getElementById('btnExportCsv');
  elements.modalAddPost = document.getElementById('modalAddPost');
  elements.modalDelete = document.getElementById('modalDelete');
  elements.toast = document.getElementById('blogToast');
  elements.toastMsg = document.getElementById('blogToastMsg');
}

/**
 * Updates the 4 Summary Cards based on current dataset.
 */
function updateSummaryCards() {
  const publishedCount = blogPostsData.filter(p => p.statusKey === 'published').length;
  const pendingCount = blogPostsData.filter(p => p.statusKey === 'pending').length;
  const draftsCount = blogPostsData.filter(p => p.statusKey === 'draft').length;
  const totalCount = blogPostsData.length;

  if (elements.cardPublished) elements.cardPublished.textContent = publishedCount;
  if (elements.cardPending) elements.cardPending.textContent = pendingCount;
  if (elements.cardDrafts) elements.cardDrafts.textContent = draftsCount;
  if (elements.cardTotal) elements.cardTotal.textContent = totalCount;
}

/**
 * Filters and renders the blog posts table.
 */
function renderTable() {
  if (!elements.tableBody) return;

  const query = filterSearch.toLowerCase().trim();

  const filtered = blogPostsData.filter(item => {
    // Search matching
    const matchesSearch = !query ||
      item.title.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.creator.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query);

    // Status filter
    const matchesStatus = filterStatus === 'all' || item.statusKey === filterStatus;

    // Creator filter
    const matchesCreator = filterCreator === 'all' || item.creator === filterCreator;

    // Type filter
    const matchesType = filterType === 'all' || item.type === filterType;

    // Date filter
    const matchesDate = filterDate === 'all' || item.month === filterDate;

    return matchesSearch && matchesStatus && matchesCreator && matchesType && matchesDate;
  });

  // Update counter text
  const totalItems = blogPostsData.length;
  const filteredCount = filtered.length;
  
  if (elements.countText) {
    elements.countText.innerHTML = `Showing <strong>${filteredCount}</strong> of ${totalItems} posts`;
  }
  if (elements.footerCountText) {
    elements.footerCountText.textContent = `Showing 1–${filteredCount} of ${totalItems} posts`;
  }

  // Handle empty state
  if (filtered.length === 0) {
    elements.tableBody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <i class="ph ph-magnifying-glass" style="font-size: 28px; color: var(--text-subtle);"></i>
            <span style="font-size: 14px; font-weight: 500; color: var(--text-secondary);">No blog posts found</span>
            <span style="font-size: 12px; color: var(--text-muted);">Try adjusting your search keywords or filter criteria.</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  // Render rows
  elements.tableBody.innerHTML = filtered.map(item => {
    // Square rounded status badge classes
    let statusClass = 'status-badge-sq--published';
    if (item.statusKey === 'pending') {
      statusClass = 'status-badge-sq--pending';
    } else if (item.statusKey === 'draft') {
      statusClass = 'status-badge-sq--draft';
    }

    return `
      <tr data-id="${item.id}">
        <!-- 1. Post ID -->
        <td>
          <span class="col-post-id">${item.id}</span>
        </td>

        <!-- 2. Title -->
        <td>
          <a href="approval-review-blog.html?id=${encodeURIComponent(item.id)}" class="col-title-link" title="${item.title}">
            ${item.title}
          </a>
        </td>

        <!-- 3. Created by -->
        <td>
          <div class="col-creator-wrap">
            <span class="creator-avatar-dot">${item.initials}</span>
            <span class="creator-name">${item.creator}</span>
          </div>
        </td>

        <!-- 4. Created on -->
        <td>
          <span class="col-date-text">${item.createdOn}</span>
        </td>

        <!-- 5. Type -->
        <td>
          <span class="col-type-text">${item.type}</span>
        </td>

        <!-- 6. Category -->
        <td>
          <span class="col-category-text">${item.category}</span>
        </td>

        <!-- 7. Submitted -->
        <td>
          <span class="col-date-text">${item.submitted}</span>
        </td>

        <!-- 8. Status (Subtle Square-Rounded Badge, text-only) -->
        <td>
          <span class="status-badge-sq ${statusClass}">
            ${item.status}
          </span>
        </td>

        <!-- 9. Published -->
        <td>
          <span class="col-date-text">${item.published}</span>
        </td>

        <!-- 10. Actions (Three Dots Menu) -->
        <td style="text-align: right; position: relative;">
          <button
            type="button"
            class="btn-action-dots"
            data-post-id="${item.id}"
            title="More actions"
            aria-label="Actions for ${item.id}"
          >
            <i class="ph ph-dots-three-vertical"></i>
          </button>

          <!-- Popover Menu -->
          <div class="row-action-popover" id="popover-${item.id.replace('#', '')}">
            <button type="button" class="row-action-btn action-edit" data-id="${item.id}">
              <i class="ph ph-pencil-simple"></i> Edit post
            </button>
            <a href="approval-review-blog.html?id=${encodeURIComponent(item.id)}" class="row-action-btn" style="text-decoration: none;">
              <i class="ph ph-eye"></i> ${item.statusKey === 'pending' ? 'Review submission' : 'View article'}
            </a>
            <div class="row-action-divider"></div>
            <button type="button" class="row-action-btn row-action-btn--delete action-delete" data-id="${item.id}">
              <i class="ph ph-trash"></i> Delete post
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
  const dotButtons = elements.tableBody.querySelectorAll('.btn-action-dots');
  
  dotButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const postId = btn.getAttribute('data-post-id').replace('#', '');
      const popover = document.getElementById(`popover-${postId}`);
      
      // Close any other open popovers
      closeAllPopovers();

      if (popover) {
        popover.classList.toggle('is-open');
        btn.classList.toggle('is-active', popover.classList.contains('is-open'));
      }
    });
  });

  // Edit button click inside popover
  const editButtons = elements.tableBody.querySelectorAll('.action-edit');
  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopovers();
      const id = btn.getAttribute('data-id');
      const item = blogPostsData.find(p => p.id === id);
      if (item) {
        openAddOrEditModal(item);
      }
    });
  });

  // Delete button click inside popover
  const deleteButtons = elements.tableBody.querySelectorAll('.action-delete');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopovers();
      const id = btn.getAttribute('data-id');
      selectedPostIdForDelete = id;
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
  if (!elements.toast || !elements.toastMsg) return;
  elements.toastMsg.textContent = message;
  elements.toast.classList.add('is-visible');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove('is-visible');
  }, 3200);
}

/**
 * Modals Management.
 */
function openAddOrEditModal(itemToEdit = null) {
  if (!elements.modalAddPost) return;

  const modalTitle = document.getElementById('modalAddPostTitle');
  const inputTitle = document.getElementById('inputPostTitle');
  const selectType = document.getElementById('selectPostType');
  const selectCategory = document.getElementById('selectPostCategory');
  const inputAuthor = document.getElementById('inputPostAuthor');
  const editIdField = document.getElementById('editPostIdField');

  if (itemToEdit) {
    if (modalTitle) modalTitle.textContent = 'Edit Blog Post';
    if (inputTitle) inputTitle.value = itemToEdit.title;
    if (selectType) selectType.value = itemToEdit.type;
    if (selectCategory) selectCategory.value = itemToEdit.category;
    if (inputAuthor) inputAuthor.value = itemToEdit.creator;
    if (editIdField) editIdField.value = itemToEdit.id;
  } else {
    if (modalTitle) modalTitle.textContent = 'Add New Blog Post';
    if (inputTitle) inputTitle.value = '';
    if (selectType) selectType.value = 'Article';
    if (selectCategory) selectCategory.value = 'Industry Insights';
    if (inputAuthor) inputAuthor.value = 'Sarah Mitchell';
    if (editIdField) editIdField.value = '';
  }

  elements.modalAddPost.classList.add('is-open');
}

function closeAddModal() {
  if (elements.modalAddPost) {
    elements.modalAddPost.classList.remove('is-open');
  }
}

function openDeleteModal(postId) {
  if (!elements.modalDelete) return;
  const deleteTargetId = document.getElementById('deleteTargetId');
  if (deleteTargetId) deleteTargetId.textContent = postId;
  elements.modalDelete.classList.add('is-open');
}

function closeDeleteModal() {
  if (elements.modalDelete) {
    elements.modalDelete.classList.remove('is-open');
  }
  selectedPostIdForDelete = null;
}

/**
 * CSV Export Functionality.
 */
function exportToCsv() {
  const headers = ['Post ID', 'Title', 'Created By', 'Created On', 'Type', 'Category', 'Submitted', 'Status', 'Published'];
  const rows = blogPostsData.map(p => [
    `"${p.id}"`,
    `"${p.title.replace(/"/g, '""')}"`,
    `"${p.creator}"`,
    `"${p.createdOn}"`,
    `"${p.type}"`,
    `"${p.category}"`,
    `"${p.submitted}"`,
    `"${p.status}"`,
    `"${p.published}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `fwc_blog_posts_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Successfully exported ${blogPostsData.length} blog posts to CSV`);
}

/**
 * Initializer.
 */
function initBlogPostsPage() {
  cacheDomElements();
  updateSummaryCards();
  renderTable();

  // Search input event
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      filterSearch = e.target.value;
      renderTable();
    });
  }

  // Setup the 4 Filter Dropdowns
  setupDropdown(elements.statusFilterTrigger, elements.statusFilterMenu, elements.statusFilterLabel, (val) => {
    filterStatus = val;
    renderTable();
  });

  setupDropdown(elements.creatorFilterTrigger, elements.creatorFilterMenu, elements.creatorFilterLabel, (val) => {
    filterCreator = val;
    renderTable();
  });

  setupDropdown(elements.typeFilterTrigger, elements.typeFilterMenu, elements.typeFilterLabel, (val) => {
    filterType = val;
    renderTable();
  });

  setupDropdown(elements.dateFilterTrigger, elements.dateFilterMenu, elements.dateFilterLabel, (val) => {
    filterDate = val;
    renderTable();
  });

  // Export CSV button
  if (elements.btnExportCsv) {
    elements.btnExportCsv.addEventListener('click', () => {
      exportToCsv();
    });
  }

  // Add Blog Post button
  if (elements.btnAddPost) {
    elements.btnAddPost.addEventListener('click', (e) => {
      // Navigates directly to the Medium-style blog editor page
      window.location.href = 'blog-editor.html';
    });
  }

  // Modal Close & Form Buttons
  const btnCloseAddModal = document.getElementById('btnCloseAddModal');
  const btnCancelAddModal = document.getElementById('btnCancelAddModal');
  const btnSaveDraft = document.getElementById('btnSaveDraft');
  const btnSubmitPost = document.getElementById('btnSubmitPost');

  if (btnCloseAddModal) btnCloseAddModal.addEventListener('click', closeAddModal);
  if (btnCancelAddModal) btnCancelAddModal.addEventListener('click', closeAddModal);

  // Handle Save Draft or Submit Review
  function handlePostSave(asDraft = false) {
    const inputTitle = document.getElementById('inputPostTitle');
    const selectType = document.getElementById('selectPostType');
    const selectCategory = document.getElementById('selectPostCategory');
    const inputAuthor = document.getElementById('inputPostAuthor');
    const editIdField = document.getElementById('editPostIdField');

    const title = inputTitle ? inputTitle.value.trim() : '';
    if (!title) {
      alert('Please enter a post title.');
      return;
    }

    const creator = inputAuthor ? inputAuthor.value.trim() : 'Admin';
    const type = selectType ? selectType.value : 'Article';
    const category = selectCategory ? selectCategory.value : 'Industry Insights';
    const editId = editIdField ? editIdField.value : '';

    const initials = creator.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    if (editId) {
      // Editing existing post
      const item = blogPostsData.find(p => p.id === editId);
      if (item) {
        item.title = title;
        item.type = type;
        item.category = category;
        item.creator = creator;
        item.initials = initials;
        showToast(`Post ${editId} updated successfully`);
      }
    } else {
      // Adding new post
      const newNum = 310 + Math.floor(Math.random() * 80);
      const newId = `#BLG-${newNum}`;
      const newPost = {
        id: newId,
        title: title,
        creator: creator,
        initials: initials,
        createdOn: currentDate,
        type: type,
        category: category,
        submitted: asDraft ? '—' : currentDate,
        status: asDraft ? 'Draft' : 'Pending review',
        statusKey: asDraft ? 'draft' : 'pending',
        published: '—',
        month: 'September 2026'
      };

      blogPostsData.unshift(newPost);
      showToast(asDraft ? `Post ${newId} saved as draft` : `Post ${newId} submitted for review`);
    }

    closeAddModal();
    updateSummaryCards();
    renderTable();
  }

  if (btnSaveDraft) btnSaveDraft.addEventListener('click', () => handlePostSave(true));
  if (btnSubmitPost) btnSubmitPost.addEventListener('click', () => handlePostSave(false));

  // Delete Modal Buttons
  const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');

  if (btnCloseDeleteModal) btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
  if (btnCancelDelete) btnCancelDelete.addEventListener('click', closeDeleteModal);

  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', () => {
      if (selectedPostIdForDelete) {
        const delId = selectedPostIdForDelete;
        blogPostsData = blogPostsData.filter(p => p.id !== delId);
        showToast(`Blog post ${delId} deleted successfully`);
        closeDeleteModal();
        updateSummaryCards();
        renderTable();
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
document.addEventListener('DOMContentLoaded', initBlogPostsPage);
