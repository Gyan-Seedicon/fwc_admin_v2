/**
 * FWC Admin Portal — Blog Review Logic (#BLG-309)
 * Handles:
 *  - Review actions (Approve confirmation popup, Reject confirmation popup with comment, Edit)
 *  - Dynamic updates to top status badge
 *  - Clean Activity History timeline (Action + Person, Date & Time on connected dots)
 *  - Copy permalink to clipboard with toast notification
 *  - Interactive toast notifications
 */

// ─── Initial Activity History Dataset ─────────────────────────────────────────
const INITIAL_BLOG_ACTIVITY_HISTORY = [
  {
    id: 'act-4',
    action: 'Blog article submitted for editorial review',
    actor: 'Sarah Mitchell',
    time: 'Sep 24, 2026 · 02:32 PM',
    itemClass: 'is-current'
  },
  {
    id: 'act-3',
    action: 'Banner image and chart assets updated',
    actor: 'Sarah Mitchell',
    time: 'Sep 22, 2026 · 11:20 AM',
    itemClass: ''
  },
  {
    id: 'act-2',
    action: 'Editorial revisions requested on AI procurement section',
    actor: 'FWC Administrator',
    time: 'Sep 19, 2026 · 04:15 PM',
    itemClass: ''
  },
  {
    id: 'act-1',
    action: 'Initial draft created in Industry Insights',
    actor: 'Sarah Mitchell',
    time: 'Sep 16, 2026 · 10:00 AM',
    itemClass: ''
  }
];

let blogTimelineEvents = [...INITIAL_BLOG_ACTIVITY_HISTORY];

// ─── DOM References ───────────────────────────────────────────────────────────
const timelineListEl = document.getElementById('timelineList');
const revisionCountEl = document.getElementById('revisionCountBadge');
const statusBadgeEl = document.getElementById('topStatusBadge');

// Top action buttons
const btnApprove = document.getElementById('btnReviewApprove');
const btnReject = document.getElementById('btnReviewReject');
const btnEdit = document.getElementById('btnReviewEdit');
const btnCopyPermalink = document.getElementById('btnCopyPermalink');

// Approve Confirmation Modal
const approveModal = document.getElementById('approveModalOverlay');
const btnCloseApprove = document.getElementById('btnCloseApproveModal');
const btnCancelApprove = document.getElementById('btnCancelApprove');
const btnConfirmApprove = document.getElementById('btnConfirmApprove');

// Reject Confirmation Modal with Comment
const rejectModal = document.getElementById('rejectModalOverlay');
const btnCloseReject = document.getElementById('btnCloseRejectModal');
const btnCancelReject = document.getElementById('btnCancelReject');
const btnConfirmReject = document.getElementById('btnConfirmReject');
const rejectReasonInput = document.getElementById('rejectReasonInput');

// ─── Render Activity Timeline ─────────────────────────────────────────────────
function renderTimeline() {
  if (!timelineListEl) return;

  if (revisionCountEl) {
    revisionCountEl.textContent = `${blogTimelineEvents.length} activities`;
  }

  timelineListEl.innerHTML = blogTimelineEvents.map(item => `
    <div class="activity-item ${item.itemClass || ''}">
      <div class="activity-dot"></div>
      <div class="activity-content">
        <p class="activity-main-text">
          ${item.action} by <strong>${item.actor}</strong>
        </p>
        <span class="activity-time">${item.time}</span>
      </div>
    </div>
  `).join('');
}

// ─── Toast Notification Helper ────────────────────────────────────────────────
function showToast(message, isDestructive = false) {
  let toast = document.getElementById('blogReviewToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'blogReviewToast';
    toast.className = 'blog-review-toast';
    document.body.appendChild(toast);
  }

  toast.className = `blog-review-toast ${isDestructive ? 'is-destructive' : ''}`;
  toast.innerHTML = isDestructive
    ? `<i class="ph ph-x-circle"></i> <span>${message}</span>`
    : `<i class="ph ph-check-circle"></i> <span>${message}</span>`;
  
  toast.classList.add('is-visible');

  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}

// ─── Review Actions & Interactions ────────────────────────────────────────────
function initReviewActions() {
  // 1. Copy Permalink
  if (btnCopyPermalink) {
    btnCopyPermalink.addEventListener('click', () => {
      const url = 'https://fwc.org/blog/future-of-ai-manufacturing-supply-chains';
      navigator.clipboard ? navigator.clipboard.writeText(url) : null;
      showToast('Permalink copied to clipboard: ' + url);
    });
  }

  // 2. Approve & Publish Popup Confirmation
  if (btnApprove && approveModal) {
    btnApprove.addEventListener('click', () => {
      approveModal.classList.add('is-open');
    });

    const closeApproveModal = () => {
      approveModal.classList.remove('is-open');
    };

    if (btnCloseApprove) btnCloseApprove.addEventListener('click', closeApproveModal);
    if (btnCancelApprove) btnCancelApprove.addEventListener('click', closeApproveModal);

    approveModal.addEventListener('click', (e) => {
      if (e.target === approveModal) closeApproveModal();
    });

    if (btnConfirmApprove) {
      btnConfirmApprove.addEventListener('click', () => {
        closeApproveModal();

        // Update top status badge
        if (statusBadgeEl) {
          statusBadgeEl.textContent = 'Approved & Published';
          statusBadgeEl.className = 'blog-status-badge is-approved';
        }

        // Add timeline event
        const now = new Date();
        const timeString = `Today · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        
        blogTimelineEvents.unshift({
          id: 'act-' + Date.now(),
          action: 'Blog article approved & published',
          actor: 'FWC Administrator',
          time: timeString,
          itemClass: 'is-approved'
        });

        renderTimeline();
        showToast('Blog article #BLG-309 successfully approved & published!');
        
        // Disable action buttons
        btnApprove.disabled = true;
        btnApprove.style.opacity = '0.6';
        btnApprove.style.cursor = 'not-allowed';
        if (btnReject) btnReject.style.display = 'none';
      });
    }
  }

  // 3. Reject Popup Confirmation with Comment
  if (btnReject && rejectModal) {
    btnReject.addEventListener('click', () => {
      rejectModal.classList.add('is-open');
      if (rejectReasonInput) rejectReasonInput.focus();
    });

    const closeRejectModal = () => {
      rejectModal.classList.remove('is-open');
      if (rejectReasonInput) rejectReasonInput.value = '';
    };

    if (btnCloseReject) btnCloseReject.addEventListener('click', closeRejectModal);
    if (btnCancelReject) btnCancelReject.addEventListener('click', closeRejectModal);

    rejectModal.addEventListener('click', (e) => {
      if (e.target === rejectModal) closeRejectModal();
    });

    if (btnConfirmReject) {
      btnConfirmReject.addEventListener('click', () => {
        const reason = rejectReasonInput && rejectReasonInput.value.trim()
          ? rejectReasonInput.value.trim()
          : 'Content requires editorial updates prior to publication.';

        closeRejectModal();

        if (statusBadgeEl) {
          statusBadgeEl.textContent = 'Rejected';
          statusBadgeEl.className = 'blog-status-badge is-rejected';
        }

        const now = new Date();
        const timeString = `Today · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        blogTimelineEvents.unshift({
          id: 'act-' + Date.now(),
          action: 'Blog article rejected',
          actor: 'FWC Administrator',
          time: timeString,
          itemClass: 'is-rejected'
        });

        renderTimeline();
        showToast('Blog article #BLG-309 marked as Rejected', true);

        if (btnApprove) btnApprove.style.display = 'none';
        btnReject.disabled = true;
        btnReject.style.opacity = '0.6';
      });
    }
  }

  // 4. Edit Action
  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      showToast('Opening rich content editor for #BLG-309…');
    });
  }
}

// ─── Initialize ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();
  initReviewActions();
});
