/**
 * FWC Admin Portal — Enquiries Management Logic
 * Supports 3 tabs: Services Enquiries, Partnership Requests, and AI Agent Requests.
 * Multi-filtering, slide-over detail drawer, status updates, and CSV export.
 */

// Datasets for the 3 Tabs
const ENQUIRIES_DATA = {
  services: [
    {
      id: '#ENQ-701',
      name: 'Alexander Wright',
      initials: 'AW',
      email: 'a.wright@nexusenergy.com',
      company: 'Nexus Energy Corp',
      subject: 'Enterprise Multi-Cloud Infrastructure Migration',
      received: 'Today, 10:14 AM',
      dateKey: 'Today',
      status: 'New',
      statusKey: 'new',
      assignee: 'Sarah Mitchell',
      assigneeInitials: 'SM',
      serviceType: 'Cloud & Infrastructure',
      budget: '$75,000 – $120,000',
      message: 'We are seeking an enterprise cloud architecture partner to assist in migrating our on-premise SCADA and telemetry workloads to a secure multi-cloud Kubernetes environment across AWS and Azure with zero downtime.'
    },
    {
      id: '#ENQ-702',
      name: 'Claire Dubois',
      initials: 'CD',
      email: 'c.dubois@aetherfin.io',
      company: 'Aether Financial Technologies',
      subject: 'FinOps Optimization & Kubernetes Cost Audit',
      received: 'Yesterday, 4:30 PM',
      dateKey: 'September 2026',
      status: 'In Progress',
      statusKey: 'progress',
      assignee: 'James Okafor',
      assigneeInitials: 'JO',
      serviceType: 'FinOps & Cloud Economics',
      budget: '$40,000 – $60,000',
      message: 'Our monthly cloud infrastructure spend has expanded significantly over the past two quarters. We require a comprehensive unit economics audit, spot instance optimization strategy, and automated FinOps telemetry.'
    },
    {
      id: '#ENQ-703',
      name: 'Vikram Patel',
      initials: 'VP',
      email: 'v.patel@synthetichealth.org',
      company: 'Synthetic Health Systems',
      subject: 'HIPAA-Compliant Zero Trust Network Architecture',
      received: 'Sep 23, 2026',
      dateKey: 'September 2026',
      status: 'In Progress',
      statusKey: 'progress',
      assignee: 'Elena Rostova',
      assigneeInitials: 'ER',
      serviceType: 'Cybersecurity & Compliance',
      budget: '$90,000 – $150,000',
      message: 'We need to design and implement a strict Zero Trust posture across our distributed medical records processing pipeline. Must meet SOC2 Type II, HIPAA, and ISO 27001 regulatory mandates.'
    },
    {
      id: '#ENQ-704',
      name: 'Hannah Schmidt',
      initials: 'HS',
      email: 'h.schmidt@berlin-mobility.de',
      company: 'Berlin Smart Mobility GmbH',
      subject: 'IoT Edge Telemetry & Real-Time Pipeline Setup',
      received: 'Sep 21, 2026',
      dateKey: 'September 2026',
      status: 'New',
      statusKey: 'new',
      assignee: 'David Kim',
      assigneeInitials: 'DK',
      serviceType: 'Data Engineering',
      budget: '$50,000 – $80,000',
      message: 'Looking for expert assistance to ingest, process, and analyze streaming telemetry from 14,000 connected municipal transit vehicles using Kafka and ClickHouse in real-time.'
    },
    {
      id: '#ENQ-705',
      name: 'Robert Chen',
      initials: 'RC',
      email: 'r.chen@apexretail.com',
      company: 'Apex Global Retail',
      subject: 'High-Availability Postgres & Redis Clustering',
      received: 'Sep 19, 2026',
      dateKey: 'September 2026',
      status: 'Resolved',
      statusKey: 'resolved',
      assignee: 'Marcus Webb',
      assigneeInitials: 'MW',
      serviceType: 'Database Architecture',
      budget: '$35,000 – $50,000',
      message: 'Successfully deployed automated multi-region replication and failover mechanisms for our transactional database cluster ahead of peak holiday traffic.'
    },
    {
      id: '#ENQ-706',
      name: 'Sophie Laurent',
      initials: 'SL',
      email: 'sophie@novadesign.co',
      company: 'Nova Digital Agency',
      subject: 'Custom Enterprise Design System Engineering',
      received: 'Sep 15, 2026',
      dateKey: 'September 2026',
      status: 'Resolved',
      statusKey: 'resolved',
      assignee: 'Elena Rostova',
      assigneeInitials: 'ER',
      serviceType: 'UI/UX & Frontend Architecture',
      budget: '$45,000 – $70,000',
      message: 'Engaged FWC team to build accessible, token-driven web components in React/TypeScript to power 8 multi-brand enterprise web applications.'
    },
    {
      id: '#ENQ-707',
      name: 'Mateo Silva',
      initials: 'MS',
      email: 'm.silva@latamlogistics.com',
      company: 'LatAm Freight & Logistics',
      subject: 'Supply Chain Observability & Chaos Testing',
      received: 'Sep 10, 2026',
      dateKey: 'September 2026',
      status: 'Resolved',
      statusKey: 'resolved',
      assignee: 'Sarah Mitchell',
      assigneeInitials: 'SM',
      serviceType: 'SRE & Reliability',
      budget: '$60,000 – $95,000',
      message: 'Completed initial chaos engineering test suites and distributed tracing deployment across core dispatch microservices with 99.99% SLA guarantee.'
    },
    {
      id: '#ENQ-708',
      name: 'Emily Thorne',
      initials: 'ET',
      email: 'emily@thornecapital.com',
      company: 'Thorne Capital Partners',
      subject: 'Quarterly Cloud Security Penetration Test',
      received: 'Sep 04, 2026',
      dateKey: 'September 2026',
      status: 'Resolved',
      statusKey: 'resolved',
      assignee: 'Elena Rostova',
      assigneeInitials: 'ER',
      serviceType: 'Cybersecurity',
      budget: '$25,000 – $40,000',
      message: 'Comprehensive external network and web application penetration test performed with remediation documentation delivered to the board.'
    }
  ],

  partnerships: [
    {
      id: '#ENQ-801',
      name: 'Jason Sterling',
      initials: 'JS',
      email: 'j.sterling@cloudflare-partner.com',
      company: 'Cloudflare Strategic Alliances',
      subject: 'Global Co-Marketing & Edge Deployment Alliance',
      received: 'Today, 11:30 AM',
      dateKey: 'Today',
      status: 'New',
      statusKey: 'new',
      assignee: 'Liam Vance',
      assigneeInitials: 'LV',
      serviceType: 'Channel Alliance',
      budget: 'Revenue Share / Co-sell',
      message: 'Proposing a joint go-to-market partnership to package FWC specialized cloud migrations with Cloudflare One Zero Trust for enterprise clients in North America.'
    },
    {
      id: '#ENQ-802',
      name: 'Amara Okafor',
      initials: 'AO',
      email: 'amara@africafintech.net',
      company: 'Pan-African Fintech Collective',
      subject: 'Sub-Saharan Financial Infrastructure Joint Venture',
      received: 'Sep 24, 2026',
      dateKey: 'September 2026',
      status: 'In Progress',
      statusKey: 'progress',
      assignee: 'Liam Vance',
      assigneeInitials: 'LV',
      serviceType: 'Regional Reseller',
      budget: '$150,000 Annual Commitment',
      message: 'Seeking a formalized partnership to deliver high-reliability financial gateway software and engineering services across 7 African nations.'
    },
    {
      id: '#ENQ-803',
      name: 'Benjamin Hayes',
      initials: 'BH',
      email: 'b.hayes@databricks-ecosystem.com',
      company: 'Databricks Partner Network',
      subject: 'Certified Lakehouse Consulting Integration',
      received: 'Sep 22, 2026',
      dateKey: 'September 2026',
      status: 'In Progress',
      statusKey: 'progress',
      assignee: 'David Kim',
      assigneeInitials: 'DK',
      serviceType: 'Technology Alliance',
      budget: 'Tier-1 Consulting Partner',
      message: 'Inviting FWC to join the Databricks Select Partner Tier with dedicated partner engineering support and client referral incentives.'
    },
    {
      id: '#ENQ-804',
      name: 'Linda Zhao',
      initials: 'LZ',
      email: 'linda@apac-ventures.sg',
      company: 'APAC Technology Ventures',
      subject: 'APAC Strategic Expansion & GTM Collaboration',
      received: 'Sep 18, 2026',
      dateKey: 'September 2026',
      status: 'Resolved',
      statusKey: 'resolved',
      assignee: 'Liam Vance',
      assigneeInitials: 'LV',
      serviceType: 'Strategic Partner',
      budget: 'Equity / Co-Investment',
      message: 'Agreement finalized to support enterprise rollouts across Singapore, Tokyo, and Sydney with localized tier-1 customer success.'
    },
    {
      id: '#ENQ-805',
      name: 'Klaus Weber',
      initials: 'KW',
      email: 'klaus.weber@munich-tech.de',
      company: 'Munich Technology Consortium',
      subject: 'European Cloud Sovereignty Co-Innovation',
      received: 'Sep 11, 2026',
      dateKey: 'September 2026',
      status: 'Resolved',
      statusKey: 'resolved',
      assignee: 'Sarah Mitchell',
      assigneeInitials: 'SM',
      serviceType: 'Innovation Consortium',
      budget: 'EU Research Grant Consortium',
      message: 'Formalized consortium agreement on GAIA-X compliant sovereign cloud deployment architectures.'
    }
  ],

  aiAgents: [
    {
      id: '#ENQ-901',
      name: 'Dr. Aris Thorne',
      initials: 'AT',
      email: 'aris@biovance-labs.com',
      company: 'BioVance Therapeutics',
      subject: 'Autonomous Clinical Trial Data Synthesis Agent',
      received: 'Today, 9:05 AM',
      dateKey: 'Today',
      status: 'New',
      statusKey: 'new',
      assignee: 'Priya Nair',
      assigneeInitials: 'PN',
      serviceType: 'BioResearch AI Agent',
      budget: '$120,000 – $180,000',
      message: 'We require a customized autonomous LLM agent pipeline to ingest multi-center clinical trial datasets, highlight anomalous patient vitals, and generate structured FDA submission drafts.'
    },
    {
      id: '#ENQ-902',
      name: 'Melissa Morales',
      initials: 'MM',
      email: 'm.morales@omnicorp.com',
      company: 'OmniCorp Enterprise Systems',
      subject: 'Enterprise Customer Success Autonomous Agent Suite',
      received: 'Yesterday, 2:15 PM',
      dateKey: 'September 2026',
      status: 'In Progress',
      statusKey: 'progress',
      assignee: 'Priya Nair',
      assigneeInitials: 'PN',
      serviceType: 'Customer Ops AI Agent',
      budget: '$85,000 – $130,000',
      message: 'We want to deploy an autonomous conversational agent capable of resolving 70% of tier-1 support tickets, pulling real-time database diagnostics, and escalating edge cases.'
    },
    {
      id: '#ENQ-903',
      name: 'Tariq Al-Mansoor',
      initials: 'TM',
      email: 'tariq@gulflogistics.ae',
      company: 'Gulf Logistics Hub',
      subject: 'Predictive Customs Clearance & Route AI Agent',
      received: 'Sep 24, 2026',
      dateKey: 'September 2026',
      status: 'New',
      statusKey: 'new',
      assignee: 'David Kim',
      assigneeInitials: 'DK',
      serviceType: 'Logistics AI Agent',
      budget: '$95,000 – $140,000',
      message: 'Need an intelligent agent that parses bill-of-lading documents in Arabic and English, predicts port inspection delays, and optimizes truck routing.'
    },
    {
      id: '#ENQ-904',
      name: 'Jennifer Wu',
      initials: 'JW',
      email: 'j.wu@quantumlegal.com',
      company: 'Quantum Legal & Compliance',
      subject: 'Regulatory Compliance & Contract Analysis Agent',
      received: 'Sep 20, 2026',
      dateKey: 'September 2026',
      status: 'In Progress',
      statusKey: 'progress',
      assignee: 'Priya Nair',
      assigneeInitials: 'PN',
      serviceType: 'Legal AI Agent',
      budget: '$70,000 – $110,000',
      message: 'Seeking a fine-tuned legal agent that compares incoming MSA contracts against internal policy playbooks and flags non-standard liability clauses.'
    },
    {
      id: '#ENQ-905',
      name: 'Carlos Mendez',
      initials: 'CM',
      email: 'carlos@fintech-latam.io',
      company: 'LatAm Payments Gateway',
      subject: 'Real-Time Fraud Detection & Autonomous Defense Agent',
      received: 'Sep 16, 2026',
      dateKey: 'September 2026',
      status: 'Resolved',
      statusKey: 'resolved',
      assignee: 'Elena Rostova',
      assigneeInitials: 'ER',
      serviceType: 'FinTech AI Agent',
      budget: '$110,000 – $160,000',
      message: 'Autonomous fraud defense agent deployed in production, analyzing 3,500 transactions/sec with a sub-50ms latency cutoff.'
    },
    {
      id: '#ENQ-906',
      name: 'Rachel Green',
      initials: 'RG',
      email: 'rachel@greenleaf-energy.com',
      company: 'GreenLeaf Renewable Energy',
      subject: 'Grid Load Forecasting & Energy Dispatch Agent',
      received: 'Sep 08, 2026',
      dateKey: 'September 2026',
      status: 'Resolved',
      statusKey: 'resolved',
      assignee: 'James Okafor',
      assigneeInitials: 'JO',
      serviceType: 'Smart Grid AI Agent',
      budget: '$80,000 – $125,000',
      message: 'Energy dispatch agent deployed to balance battery storage and solar output predictions across 12 solar array installations.'
    }
  ]
};

// Current State
let currentTabKey = 'services';
let filterSearch = '';
let filterStatus = 'all';
let filterAssignee = 'all';
let filterDate = 'all';

let selectedEnquiryForDrawer = null;

// DOM Elements
const dom = {};

function cacheDom() {
  dom.tabBtns = document.querySelectorAll('.tab-nav-btn');
  dom.badgeServices = document.getElementById('badgeCountServices');
  dom.badgePartnerships = document.getElementById('badgeCountPartnerships');
  dom.badgeAiAgents = document.getElementById('badgeCountAiAgents');

  dom.cardTotal = document.getElementById('cardCountTotal');
  dom.cardNew = document.getElementById('cardCountNew');
  dom.cardProgress = document.getElementById('cardCountProgress');
  dom.cardResolved = document.getElementById('cardCountResolved');

  dom.searchInput = document.getElementById('enquirySearchInput');
  dom.countText = document.getElementById('enquiryCountText');
  dom.footerCount = document.getElementById('enquiryFooterCount');
  dom.tableBody = document.getElementById('enquiriesTableBody');

  dom.statusFilterTrigger = document.getElementById('statusFilterTrigger');
  dom.statusFilterLabel = document.getElementById('statusFilterLabel');
  dom.statusFilterMenu = document.getElementById('statusFilterMenu');

  dom.assigneeFilterTrigger = document.getElementById('assigneeFilterTrigger');
  dom.assigneeFilterLabel = document.getElementById('assigneeFilterLabel');
  dom.assigneeFilterMenu = document.getElementById('assigneeFilterMenu');

  dom.dateFilterTrigger = document.getElementById('dateFilterTrigger');
  dom.dateFilterLabel = document.getElementById('dateFilterLabel');
  dom.dateFilterMenu = document.getElementById('dateFilterMenu');

  dom.btnExportCsv = document.getElementById('btnExportCsv');
  dom.btnNewEnquiry = document.getElementById('btnNewEnquiry');

  // Drawer
  dom.drawerOverlay = document.getElementById('drawerOverlay');
  dom.btnCloseDrawer = document.getElementById('btnCloseDrawer');
  dom.btnDrawerCloseBottom = document.getElementById('btnDrawerCloseBottom');
  dom.drawerContactName = document.getElementById('drawerContactName');
  dom.drawerSubject = document.getElementById('drawerSubject');
  dom.drawerId = document.getElementById('drawerId');
  dom.drawerEmail = document.getElementById('drawerEmail');
  dom.drawerCompany = document.getElementById('drawerCompany');
  dom.drawerServiceType = document.getElementById('drawerServiceType');
  dom.drawerBudget = document.getElementById('drawerBudget');
  dom.drawerReceived = document.getElementById('drawerReceived');
  dom.drawerStatusSelect = document.getElementById('drawerStatusSelect');
  dom.drawerAssigneeSelect = document.getElementById('drawerAssigneeSelect');
  dom.drawerMessageBody = document.getElementById('drawerMessageBody');
  dom.btnSaveDrawerNotes = document.getElementById('btnSaveDrawerNotes');

  // Toast
  dom.toast = document.getElementById('enquiriesToast');
  dom.toastMsg = document.getElementById('enquiriesToastMsg');
}

/**
 * Updates Tab Counter Badges and Summary Cards
 */
function updateMetrics() {
  const sCount = ENQUIRIES_DATA.services.length;
  const pCount = ENQUIRIES_DATA.partnerships.length;
  const aCount = ENQUIRIES_DATA.aiAgents.length;

  if (dom.badgeServices) dom.badgeServices.textContent = sCount;
  if (dom.badgePartnerships) dom.badgePartnerships.textContent = pCount;
  if (dom.badgeAiAgents) dom.badgeAiAgents.textContent = aCount;

  // Active Tab Metrics
  const currentList = ENQUIRIES_DATA[currentTabKey] || [];
  const newCount = currentList.filter(e => e.statusKey === 'new').length;
  const progressCount = currentList.filter(e => e.statusKey === 'progress').length;
  const resolvedCount = currentList.filter(e => e.statusKey === 'resolved').length;
  const totalCount = currentList.length;

  if (dom.cardTotal) dom.cardTotal.textContent = totalCount;
  if (dom.cardNew) dom.cardNew.textContent = newCount;
  if (dom.cardProgress) dom.cardProgress.textContent = progressCount;
  if (dom.cardResolved) dom.cardResolved.textContent = resolvedCount;
}

/**
 * Filters and Renders the 7-Column Table
 */
function renderTable() {
  if (!dom.tableBody) return;

  const currentList = ENQUIRIES_DATA[currentTabKey] || [];
  const query = filterSearch.toLowerCase().trim();

  const filtered = currentList.filter(item => {
    const matchesSearch = !query ||
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query) ||
      item.company.toLowerCase().includes(query) ||
      item.assignee.toLowerCase().includes(query);

    const matchesStatus = filterStatus === 'all' || item.statusKey === filterStatus;
    const matchesAssignee = filterAssignee === 'all' || item.assignee === filterAssignee;
    const matchesDate = filterDate === 'all' || item.dateKey === filterDate;

    return matchesSearch && matchesStatus && matchesAssignee && matchesDate;
  });

  // Update counter text
  const totalItems = currentList.length;
  const filteredCount = filtered.length;

  if (dom.countText) {
    dom.countText.innerHTML = `Showing <strong>${filteredCount}</strong> of ${totalItems} enquiries`;
  }
  if (dom.footerCount) {
    dom.footerCount.textContent = `Showing 1–${filteredCount} of ${totalItems} enquiries`;
  }

  // Handle empty state
  if (filtered.length === 0) {
    dom.tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <i class="ph ph-magnifying-glass" style="font-size: 28px; color: var(--text-subtle);"></i>
            <span style="font-size: 14px; font-weight: 500; color: var(--text-secondary);">No enquiries found</span>
            <span style="font-size: 12px; color: var(--text-muted);">Try adjusting your search keywords or filter criteria.</span>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  // Render 7 columns: Name, Email, Subject, Received, Status, Assignee, Action
  dom.tableBody.innerHTML = filtered.map(item => {
    let statusClass = 'status-badge-sq--new';
    if (item.statusKey === 'progress') statusClass = 'status-badge-sq--progress';
    else if (item.statusKey === 'resolved') statusClass = 'status-badge-sq--resolved';
    else if (item.statusKey === 'closed') statusClass = 'status-badge-sq--closed';

    return `
      <tr data-id="${item.id}">
        <!-- 1. Name -->
        <td>
          <div class="col-name-wrap">
            <span class="col-avatar">${item.initials}</span>
            <span class="col-name-text">${item.name}</span>
          </div>
        </td>

        <!-- 2. Email -->
        <td>
          <a href="mailto:${item.email}" class="col-email-text" title="Send email to ${item.email}" style="color: inherit; text-decoration: none;">
            ${item.email}
          </a>
        </td>

        <!-- 3. Subject -->
        <td>
          <span class="col-subject-link open-drawer-btn" data-id="${item.id}" title="${item.subject}">
            ${item.subject}
          </span>
        </td>

        <!-- 4. Received -->
        <td>
          <span class="col-date-text">${item.received}</span>
        </td>

        <!-- 5. Status (Square-Rounded Badge) -->
        <td>
          <span class="status-badge-sq ${statusClass}">
            ${item.status}
          </span>
        </td>

        <!-- 6. Assignee -->
        <td>
          <div class="assignee-cell-wrap">
            <span class="assignee-dot">${item.assigneeInitials}</span>
            <span class="assignee-name">${item.assignee}</span>
          </div>
        </td>

        <!-- 7. Action -->
        <td style="text-align: right; position: relative;">
          <button
            type="button"
            class="btn-action-dots"
            data-enq-id="${item.id}"
            title="Enquiry actions"
            aria-label="Actions for ${item.id}"
          >
            <i class="ph ph-dots-three-vertical"></i>
          </button>

          <!-- Popover Menu -->
          <div class="row-action-popover" id="popover-${item.id.replace('#', '')}">
            <button type="button" class="row-action-btn action-view-drawer" data-id="${item.id}">
              <i class="ph ph-eye"></i> View details
            </button>
            <button type="button" class="row-action-btn action-mark-progress" data-id="${item.id}">
              <i class="ph ph-clock-countdown"></i> In Progress
            </button>
            <button type="button" class="row-action-btn action-mark-resolved" data-id="${item.id}">
              <i class="ph ph-check-circle"></i> Mark Resolved
            </button>
            <div class="row-action-divider"></div>
            <button type="button" class="row-action-btn row-action-btn--delete action-delete-enq" data-id="${item.id}">
              <i class="ph ph-trash"></i> Delete enquiry
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  attachTableEventListeners();
}

/**
 * Event Listeners for Table Rows & Popovers
 */
function attachTableEventListeners() {
  // Clicking Subject opens detail drawer
  dom.tableBody.querySelectorAll('.open-drawer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openDrawerById(id);
    });
  });

  // Action Dots
  dom.tableBody.querySelectorAll('.btn-action-dots').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const enqId = btn.getAttribute('data-enq-id').replace('#', '');
      const popover = document.getElementById(`popover-${enqId}`);
      closeAllPopovers();
      if (popover) {
        popover.classList.toggle('is-open');
        btn.classList.toggle('is-active', popover.classList.contains('is-open'));
      }
    });
  });

  // Action Menu: View Details
  dom.tableBody.querySelectorAll('.action-view-drawer').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopovers();
      const id = btn.getAttribute('data-id');
      openDrawerById(id);
    });
  });

  // Action Menu: Mark Progress
  dom.tableBody.querySelectorAll('.action-mark-progress').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopovers();
      const id = btn.getAttribute('data-id');
      updateEnquiryStatus(id, 'In Progress', 'progress');
    });
  });

  // Action Menu: Mark Resolved
  dom.tableBody.querySelectorAll('.action-mark-resolved').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopovers();
      const id = btn.getAttribute('data-id');
      updateEnquiryStatus(id, 'Resolved', 'resolved');
    });
  });

  // Action Menu: Delete
  dom.tableBody.querySelectorAll('.action-delete-enq').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopovers();
      const id = btn.getAttribute('data-id');
      deleteEnquiry(id);
    });
  });
}

function closeAllPopovers() {
  document.querySelectorAll('.row-action-popover.is-open').forEach(el => el.classList.remove('is-open'));
  document.querySelectorAll('.btn-action-dots.is-active').forEach(el => el.classList.remove('is-active'));
}

/**
 * Slide-Over Detail Drawer
 */
function openDrawerById(id) {
  const currentList = ENQUIRIES_DATA[currentTabKey] || [];
  const item = currentList.find(e => e.id === id);
  if (!item) return;

  selectedEnquiryForDrawer = item;

  if (dom.drawerContactName) dom.drawerContactName.textContent = item.name;
  if (dom.drawerSubject) dom.drawerSubject.textContent = item.subject;
  if (dom.drawerId) dom.drawerId.textContent = item.id;
  if (dom.drawerEmail) dom.drawerEmail.textContent = item.email;
  if (dom.drawerCompany) dom.drawerCompany.textContent = item.company;
  if (dom.drawerServiceType) dom.drawerServiceType.textContent = item.serviceType;
  if (dom.drawerBudget) dom.drawerBudget.textContent = item.budget;
  if (dom.drawerReceived) dom.drawerReceived.textContent = item.received;
  if (dom.drawerStatusSelect) dom.drawerStatusSelect.value = item.statusKey;
  if (dom.drawerAssigneeSelect) dom.drawerAssigneeSelect.value = item.assignee;
  if (dom.drawerMessageBody) dom.drawerMessageBody.textContent = item.message;

  if (dom.drawerOverlay) dom.drawerOverlay.classList.add('is-open');
}

function closeDrawer() {
  if (dom.drawerOverlay) dom.drawerOverlay.classList.remove('is-open');
  selectedEnquiryForDrawer = null;
}

function updateEnquiryStatus(id, newStatus, newStatusKey) {
  const currentList = ENQUIRIES_DATA[currentTabKey] || [];
  const item = currentList.find(e => e.id === id);
  if (item) {
    item.status = newStatus;
    item.statusKey = newStatusKey;
    showToast(`Enquiry ${id} marked as ${newStatus}`);
    updateMetrics();
    renderTable();
  }
}

function deleteEnquiry(id) {
  if (confirm(`Are you sure you want to delete enquiry ${id}?`)) {
    ENQUIRIES_DATA[currentTabKey] = ENQUIRIES_DATA[currentTabKey].filter(e => e.id !== id);
    showToast(`Enquiry ${id} deleted successfully`);
    updateMetrics();
    renderTable();
  }
}

/**
 * Dropdown Filters
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
  document.querySelectorAll('.filter-menu-popover.is-open').forEach(menu => menu.classList.remove('is-open'));
  document.querySelectorAll('.filter-trigger-btn.is-open').forEach(btn => {
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toast
 */
let toastTimeout;
function showToast(msg) {
  if (!dom.toast || !dom.toastMsg) return;
  dom.toastMsg.textContent = msg;
  dom.toast.classList.add('is-visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    dom.toast.classList.remove('is-visible');
  }, 3000);
}

/**
 * CSV Export
 */
function exportCsv() {
  const currentList = ENQUIRIES_DATA[currentTabKey] || [];
  const headers = ['Enquiry ID', 'Name', 'Email', 'Company', 'Subject', 'Received', 'Status', 'Assignee', 'Category/Service', 'Budget'];
  const rows = currentList.map(e => [
    `"${e.id}"`,
    `"${e.name}"`,
    `"${e.email}"`,
    `"${e.company}"`,
    `"${e.subject.replace(/"/g, '""')}"`,
    `"${e.received}"`,
    `"${e.status}"`,
    `"${e.assignee}"`,
    `"${e.serviceType}"`,
    `"${e.budget}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `fwc_${currentTabKey}_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported ${currentList.length} enquiries to CSV`);
}

/**
 * Initialization
 */
function initEnquiriesPage() {
  cacheDom();
  updateMetrics();
  renderTable();

  // Tab Navigation Switching
  dom.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');
      dom.tabBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      currentTabKey = tabKey;
      filterSearch = '';
      if (dom.searchInput) dom.searchInput.value = '';

      updateMetrics();
      renderTable();
    });
  });

  // Search input
  if (dom.searchInput) {
    dom.searchInput.addEventListener('input', (e) => {
      filterSearch = e.target.value;
      renderTable();
    });
  }

  // 3 Filter Dropdowns
  setupDropdown(dom.statusFilterTrigger, dom.statusFilterMenu, dom.statusFilterLabel, (val) => {
    filterStatus = val;
    renderTable();
  });

  setupDropdown(dom.assigneeFilterTrigger, dom.assigneeFilterMenu, dom.assigneeFilterLabel, (val) => {
    filterAssignee = val;
    renderTable();
  });

  setupDropdown(dom.dateFilterTrigger, dom.dateFilterMenu, dom.dateFilterLabel, (val) => {
    filterDate = val;
    renderTable();
  });

  // CSV Export
  if (dom.btnExportCsv) {
    dom.btnExportCsv.addEventListener('click', exportCsv);
  }

  // Drawer events
  if (dom.btnCloseDrawer) dom.btnCloseDrawer.addEventListener('click', closeDrawer);
  if (dom.btnDrawerCloseBottom) dom.btnDrawerCloseBottom.addEventListener('click', closeDrawer);

  if (dom.btnSaveDrawerNotes) {
    dom.btnSaveDrawerNotes.addEventListener('click', () => {
      if (selectedEnquiryForDrawer) {
        const newStatusKey = dom.drawerStatusSelect.value;
        const newAssignee = dom.drawerAssigneeSelect.value;
        
        let newStatusLabel = 'New';
        if (newStatusKey === 'progress') newStatusLabel = 'In Progress';
        else if (newStatusKey === 'resolved') newStatusLabel = 'Resolved';
        else if (newStatusKey === 'closed') newStatusLabel = 'Closed';

        selectedEnquiryForDrawer.status = newStatusLabel;
        selectedEnquiryForDrawer.statusKey = newStatusKey;
        selectedEnquiryForDrawer.assignee = newAssignee;
        selectedEnquiryForDrawer.assigneeInitials = newAssignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

        showToast(`Updated ${selectedEnquiryForDrawer.id} successfully`);
        closeDrawer();
        updateMetrics();
        renderTable();
      }
    });
  }

  // New Enquiry button
  if (dom.btnNewEnquiry) {
    dom.btnNewEnquiry.addEventListener('click', () => {
      showToast('Opening inbound enquiry logger...');
    });
  }

  // Global click & Escape
  document.addEventListener('click', () => {
    closeAllPopovers();
    closeAllFilterMenus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopovers();
      closeAllFilterMenus();
      closeDrawer();
    }
  });
}

document.addEventListener('DOMContentLoaded', initEnquiriesPage);
