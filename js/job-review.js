/**
 * FWC Admin Portal — Job Review Logic (#JOB-412 / #JOB-000006)
 * Handles:
 *  - Review actions (Approve confirmation popup, Reject confirmation popup with comment, Edit)
 *  - Dynamic updates to top status badge
 *  - Clean Activity History timeline (Action + Person, Date & Time on connected dots)
 *  - Document preview modal and simulated downloads
 *  - Interactive toast notifications
 */

// ─── Initial Activity History Dataset ─────────────────────────────────────────
const INITIAL_ACTIVITY_HISTORY = [
  {
    id: 'act-4',
    action: 'Job submitted for approval',
    actor: 'Sarah Mitchell',
    time: 'Sep 23, 2026 · 11:15 AM',
    itemClass: 'is-current'
  },
  {
    id: 'act-3',
    action: 'Job requirements updated',
    actor: 'Sarah Mitchell',
    time: 'Sep 20, 2026 · 04:40 PM',
    itemClass: ''
  },
  {
    id: 'act-2',
    action: 'Clarification requested',
    actor: 'FWC Administrator',
    time: 'Sep 18, 2026 · 02:10 PM',
    itemClass: ''
  },
  {
    id: 'act-1',
    action: 'Job draft created',
    actor: 'Sarah Mitchell',
    time: 'Sep 15, 2026 · 09:30 AM',
    itemClass: ''
  }
];

let timelineEvents = [...INITIAL_ACTIVITY_HISTORY];

// ─── DOM References ───────────────────────────────────────────────────────────
const timelineListEl = document.getElementById('timelineList');
const revisionCountEl = document.getElementById('revisionCountBadge');
const statusBadgeEl = document.getElementById('topStatusBadge');

// Top action buttons
const btnApprove = document.getElementById('btnReviewApprove');
const btnReject = document.getElementById('btnReviewReject');
const btnEdit = document.getElementById('btnReviewEdit');

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

// Document Preview Modal
const docPreviewModal = document.getElementById('docPreviewModalOverlay');
const btnCloseDocModal = document.getElementById('btnCloseDocModal');
const btnCloseDocFooter = document.getElementById('btnCloseDocFooter');
const btnPreviewDoc = document.getElementById('btnPreviewDoc');
const btnDownloadDoc = document.getElementById('btnDownloadDoc');

// ─── Render Activity Timeline ─────────────────────────────────────────────────
function renderTimeline() {
  if (!timelineListEl) return;

  if (revisionCountEl) {
    revisionCountEl.textContent = `${timelineEvents.length} activities`;
  }

  timelineListEl.innerHTML = timelineEvents.map(item => `
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
  let toast = document.getElementById('jobReviewToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'jobReviewToast';
    toast.className = 'job-review-toast';
    document.body.appendChild(toast);
  }

  toast.className = `job-review-toast ${isDestructive ? 'is-destructive' : ''}`;
  toast.innerHTML = isDestructive
    ? `<i class="ph ph-x-circle"></i> <span>${message}</span>`
    : `<i class="ph ph-check-circle"></i> <span>${message}</span>`;
  
  toast.classList.add('is-visible');

  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}

// ─── Review Actions ───────────────────────────────────────────────────────────
function initReviewActions() {
  // 1. Approve & Publish Popup Confirmation
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
          statusBadgeEl.className = 'job-status-badge is-approved';
        }

        // Add timeline event
        const now = new Date();
        const timeString = `Today · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        
        timelineEvents.unshift({
          id: 'act-' + Date.now(),
          action: 'Job approved & published',
          actor: 'FWC Administrator',
          time: timeString,
          itemClass: 'is-approved'
        });

        renderTimeline();
        showToast('Requisition #JOB-412 successfully approved and published!');
        
        // Disable action buttons
        btnApprove.disabled = true;
        btnApprove.style.opacity = '0.6';
        btnApprove.style.cursor = 'not-allowed';
        if (btnReject) btnReject.style.display = 'none';
      });
    }
  }

  // 2. Reject Popup Confirmation with Comment
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
          : 'Job specification requires revisions before publication.';

        closeRejectModal();

        if (statusBadgeEl) {
          statusBadgeEl.textContent = 'Rejected';
          statusBadgeEl.className = 'job-status-badge is-rejected';
        }

        const now = new Date();
        const timeString = `Today · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        timelineEvents.unshift({
          id: 'act-' + Date.now(),
          action: 'Job rejected',
          actor: 'FWC Administrator',
          time: timeString,
          itemClass: 'is-rejected'
        });

        renderTimeline();
        showToast('Requisition #JOB-412 marked as Rejected', true);

        if (btnApprove) btnApprove.style.display = 'none';
        btnReject.disabled = true;
        btnReject.style.opacity = '0.6';
      });
    }
  }

  // 3. Edit Action
  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      showToast('Opening job editor for #JOB-000006…');
    });
  }

  // 4. Document Preview & Download
  if (btnPreviewDoc && docPreviewModal) {
    btnPreviewDoc.addEventListener('click', () => {
      docPreviewModal.classList.add('is-open');
    });

    const closeDocModal = () => {
      docPreviewModal.classList.remove('is-open');
    };

    if (btnCloseDocModal) btnCloseDocModal.addEventListener('click', closeDocModal);
    if (btnCloseDocFooter) btnCloseDocFooter.addEventListener('click', closeDocModal);

    docPreviewModal.addEventListener('click', (e) => {
      if (e.target === docPreviewModal) closeDocModal();
    });
  }

  if (btnDownloadDoc) {
    btnDownloadDoc.addEventListener('click', () => {
      showToast('Downloading JD_Site_Reliability_Platform_Engineer_v2.pdf…');
    });
  }
}

// ─── Initialize ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();
  initReviewActions();
});
