/**
 * FWC Admin Portal — Dashboard Page Logic
 * Handles:
 *  - Website Performance: Traffic & Applications line/area chart with 7d/30d/90d filters, Traffic sources donut chart.
 *  - Employee Performance: Separate Role and Employee dropdowns in header bar, default All Roles & All Employees,
 *    live search, dynamic heading, summary cards, candidate pipeline donut chart, 3-metric smooth line/area trend chart
 *    (Jobs, Blogs, New Assignments) with expanded height, submissions list with "Submitted on {date}", and activity timeline.
 *  - Tab switching with chart redraw & resize fixes.
 */

// ─── Greeting Date ────────────────────────────────────────────────────────────
(function setGreetingDate() {
  const el = document.getElementById('greetingDate');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
})();

// ─── Website Performance: Traffic & Applications Line / Area Chart ─────────────
let lineChart = null;

function generateDailyData(days, baseVisitors, baseApps) {
  const labels = [];
  const visitors = [];
  const applications = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    const labelStep = days <= 7 ? 1 : days <= 30 ? 3 : 7;
    const showLabel = i % labelStep === 0 || i === 0;
    labels.push(showLabel ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '');

    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendFactor = isWeekend ? 0.65 : 1.1;

    const seed = (d.getDate() * 13 + d.getMonth() * 37 + (days - i) * 7);
    const wave = Math.sin((days - i) / 2.5) * 6;
    const jitter = ((seed % 19) - 9);

    const avgDailyVisitors = baseVisitors / days;
    const visitorCount = Math.max(4, Math.round((avgDailyVisitors + wave + jitter) * weekendFactor));
    visitors.push(visitorCount);

    const appJitter = ((seed * 3) % 5) - 2;
    const appCount = Math.max(0, Math.min(4, Math.round(((baseApps / days) * 2.8 + appJitter * 0.4) * (isWeekend ? 0.4 : 1.2))));
    applications.push(appCount);
  }
  return { labels, visitors, applications };
}

function updateLineChart(days) {
  if (typeof ApexCharts === 'undefined') return;

  const el = document.getElementById('trafficChart');
  if (!el) return;

  const { labels, visitors, applications } = generateDailyData(days, 526, 10);

  const opts = {
    chart: {
      type: 'area',
      height: 250,
      fontFamily: "'DM Sans', sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 350,
        animateGradually: { enabled: true, delay: 50 },
        dynamicAnimation: { enabled: true, speed: 250 }
      },
      parentHeightOffset: 0,
    },
    series: [
      { name: 'Visitors',     data: visitors },
      { name: 'Applications', data: applications },
    ],
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: '11px',
          fontFamily: "'DM Sans', sans-serif",
          colors: '#64748b',
          fontWeight: 500,
        },
        rotate: 0,
        hideOverlappingLabels: false,
      },
      tooltip: { enabled: false },
    },
    yaxis: [
      {
        title: { text: undefined },
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: "'DM Sans', sans-serif",
            colors: '#64748b',
            fontWeight: 500,
          },
          formatter: (val) => Math.round(val),
        },
        min: 0,
        forceNiceScale: true,
      },
      {
        opposite: true,
        title: { text: undefined },
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: "'DM Sans', sans-serif",
            colors: '#64748b',
            fontWeight: 500,
          },
          formatter: (val) => Math.round(val),
        },
        min: 0,
        max: 4,
        tickAmount: 4,
      }
    ],
    colors: ['#133484', '#3b82f6'],
    stroke: {
      curve: 'smooth',
      width: [2.5, 2],
      lineCap: 'round',
    },
    markers: {
      size: 0,
      strokeWidth: 2,
      strokeColors: '#ffffff',
      hover: {
        size: 5,
        sizeOffset: 2,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: [0.22, 0.12],
        opacityTo: [0.01, 0.00],
        stops: [0, 95, 100],
      },
    },
    grid: {
      borderColor: '#edf2f7',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        left: 12,
        right: 12,
        top: 0,
        bottom: 0,
      },
    },
    legend: { show: false },
    tooltip: {
      theme: 'light',
      shared: true,
      intersect: false,
      style: {
        fontSize: '12px',
        fontFamily: "'DM Sans', sans-serif",
      },
      x: { show: true },
      marker: { show: true },
      y: {
        formatter: (val) => `${val}`,
      },
    },
    dataLabels: { enabled: false },
  };

  if (lineChart) {
    lineChart.updateOptions({
      xaxis: { categories: labels },
      series: [
        { name: 'Visitors',     data: visitors },
        { name: 'Applications', data: applications },
      ]
    }, true, true);
  } else {
    lineChart = new ApexCharts(el, opts);
    lineChart.render();
  }
}

// ─── Website Performance: Traffic Sources Donut Chart ─────────────────────────
let donutChart = null;

function initDonutChart() {
  if (typeof ApexCharts === 'undefined') return;

  const donutEl = document.getElementById('donutChart');
  if (!donutEl) return;

  const sources = [
    { name: 'Direct',              count: 395, pct: 75, color: '#133484' },
    { name: 'google.com',          count: 92,  pct: 17, color: '#2563eb' },
    { name: 'bing.com',            count: 8,   pct: 2,  color: '#3b82f6' },
    { name: 'l.wl.co',             count: 5,   pct: 1,  color: '#60a5fa' },
    { name: 'com.google.andr…',    count: 4,   pct: 1,  color: '#93c5fd' },
    { name: 'Other',               count: 22,  pct: 4,  color: '#cbd5e1' },
  ];

  const opts = {
    chart: {
      type: 'donut',
      height: 165,
      fontFamily: "'DM Sans', sans-serif",
      toolbar: { show: false },
      sparkline: { enabled: false },
      animations: { enabled: true, speed: 350 },
    },
    series: sources.map(s => s.count),
    labels: sources.map(s => s.name),
    colors: sources.map(s => s.color),
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Visitors',
              fontSize: '11px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#64748b',
              formatter: () => '526',
              fontWeight: 700,
            },
            value: {
              fontSize: '18px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              color: '#121721',
              offsetY: 3,
            },
            name: {
              fontSize: '11px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#64748b',
              offsetY: -3,
            },
          },
        },
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['#ffffff'] },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px', fontFamily: "'DM Sans', sans-serif" },
      y: {
        formatter: (val) => `${val} visitors`,
      },
    },
  };

  if (!donutChart) {
    donutChart = new ApexCharts(donutEl, opts);
    donutChart.render();
  }

  // Populate the sources list
  const list = document.getElementById('trafficSourcesList');
  if (list) {
    list.innerHTML = sources.map(s => `
      <div class="traffic-source-row">
        <span class="traffic-source-name">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${s.color};margin-right:7px;vertical-align:middle;flex-shrink:0;"></span>${s.name}
        </span>
        <span class="traffic-source-count">${s.count.toLocaleString()}</span>
        <span class="traffic-source-pct">${s.pct}%</span>
      </div>
    `).join('');
  }
}

// ─── Employee Performance Data Store ──────────────────────────────────────────
const EMPLOYEES_DATA = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    initials: 'SM',
    role: 'Content Writer',
    status: 'Active',
    statusClass: 'ep-badge--green',
    period: '1 Sep – 30 Sep 2026',
    cards: {
      jobs: 2,
      blogs: 1,
      candidates: 6,
      newAssignments: 7,
      jobsMeta: 'This period',
      blogsMeta: 'This period',
      candidatesMeta: 'Total active',
      newAssignMeta: 'This period'
    },
    pipeline: [
      { label: 'Reference Check', count: 2, color: '#133484' },
      { label: 'Unresponsive',    count: 1, color: '#64748b' },
      { label: 'Offer Declined',  count: 1, color: '#ef4444' },
      { label: 'Withdrawn',       count: 1, color: '#f59e0b' },
      { label: 'Screening',       count: 1, color: '#10b981' },
    ],
    contentWeekly: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      jobs: [1, 0, 1, 0],
      blogs: [0, 1, 0, 0],
      newAssignments: [2, 3, 1, 1]
    },
    submissions: [
      { title: 'The Future of AI in Manufacturing Supply Chains', type: 'blog', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Scaling Distributed Kubernetes for Enterprise Microservices', type: 'blog', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Site Reliability & Platform Engineer', type: 'job', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Why Digital Twins Are the Next Big Thing', type: 'blog', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
      { title: '5 Ways Predictive Maintenance Cuts Downtime', type: 'blog', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
    ],
    activities: [
      { title: 'Approval requested', desc: 'Content is ready for review', time: '9/24/2026', color: 'blue' },
      { title: 'Submission approved', desc: 'Your submission is now published.', time: '9/18/2026', color: 'green' },
      { title: 'Submission needs changes', desc: 'Requires additional reference sources', time: '9/17/2026', color: 'amber' },
    ]
  },
  {
    id: 'james-okafor',
    name: 'James Okafor',
    initials: 'JO',
    role: 'Recruiter',
    status: 'Active',
    statusClass: 'ep-badge--green',
    period: '1 Sep – 30 Sep 2026',
    cards: {
      jobs: 5,
      blogs: 0,
      candidates: 14,
      newAssignments: 11,
      jobsMeta: '5 published',
      blogsMeta: '0 published',
      candidatesMeta: '14 pipeline',
      newAssignMeta: 'This period'
    },
    pipeline: [
      { label: 'Screening',           count: 5, color: '#10b981' },
      { label: 'Technical Interview', count: 4, color: '#3b82f6' },
      { label: 'Reference Check',     count: 3, color: '#133484' },
      { label: 'Offer Extended',      count: 2, color: '#8b5cf6' },
    ],
    contentWeekly: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      jobs: [2, 1, 1, 1],
      blogs: [0, 0, 0, 0],
      newAssignments: [3, 4, 2, 2]
    },
    submissions: [
      { title: 'Senior Cloud Infrastructure Architect', type: 'job', date: '9/20/2026', status: 'Approved', statusType: 'approved' },
      { title: 'Lead DevOps Engineer (Fintech)', type: 'job', date: '9/18/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Principal Product Designer', type: 'job', date: '9/15/2026', status: 'Approved', statusType: 'approved' },
      { title: 'Enterprise Cybersecurity Specialist', type: 'job', date: '9/10/2026', status: 'Approved', statusType: 'approved' },
    ],
    activities: [
      { title: 'Job listing approved', desc: 'Senior Cloud Architect is now live', time: '9/21/2026', color: 'green' },
      { title: 'Shortlist submitted', desc: '5 candidates forwarded for review', time: '9/19/2026', color: 'blue' },
      { title: 'Offer extended', desc: 'DevOps Lead candidate offer letter dispatched', time: '9/16/2026', color: 'purple' },
    ]
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    initials: 'PN',
    role: 'Content Writer',
    status: 'Active',
    statusClass: 'ep-badge--green',
    period: '1 Sep – 30 Sep 2026',
    cards: {
      jobs: 1,
      blogs: 4,
      candidates: 3,
      newAssignments: 4,
      jobsMeta: '1 published',
      blogsMeta: '4 published',
      candidatesMeta: '3 assigned',
      newAssignMeta: 'This period'
    },
    pipeline: [
      { label: 'Screening',       count: 2, color: '#10b981' },
      { label: 'Reference Check', count: 1, color: '#133484' },
    ],
    contentWeekly: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      jobs: [0, 0, 1, 0],
      blogs: [1, 1, 1, 1],
      newAssignments: [1, 1, 1, 1]
    },
    submissions: [
      { title: 'Next-Gen AI Workflows for Modern Enterprises', type: 'blog', date: '9/22/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Navigating Compliance in Cloud Native Migrations', type: 'blog', date: '9/19/2026', status: 'Approved', statusType: 'approved' },
      { title: 'Data Engineering Principles for 2027', type: 'blog', date: '9/14/2026', status: 'Approved', statusType: 'approved' },
      { title: 'Senior Data Platform Engineer', type: 'job', date: '9/10/2026', status: 'Approved', statusType: 'approved' },
    ],
    activities: [
      { title: 'Approval requested', desc: 'AI Workflows article in queue', time: '9/22/2026', color: 'blue' },
      { title: 'Submission approved', desc: 'Compliance article published', time: '9/20/2026', color: 'green' },
      { title: 'Submission approved', desc: 'Data Engineering Principles live', time: '9/15/2026', color: 'green' },
    ]
  },
  {
    id: 'marcus-webb',
    name: 'Marcus Webb',
    initials: 'MW',
    role: 'Recruiter',
    status: 'On Leave',
    statusClass: '',
    period: '1 Sep – 30 Sep 2026 (On Leave)',
    cards: {
      jobs: 3,
      blogs: 0,
      candidates: 8,
      newAssignments: 5,
      jobsMeta: '3 published',
      blogsMeta: '0 published',
      candidatesMeta: '8 assigned',
      newAssignMeta: 'This period'
    },
    pipeline: [
      { label: 'Screening',      count: 3, color: '#10b981' },
      { label: 'Offer Extended', count: 2, color: '#8b5cf6' },
      { label: 'Unresponsive',   count: 2, color: '#64748b' },
      { label: 'Offer Declined', count: 1, color: '#ef4444' },
    ],
    contentWeekly: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      jobs: [1, 2, 0, 0],
      blogs: [0, 0, 0, 0],
      newAssignments: [2, 2, 1, 0]
    },
    submissions: [
      { title: 'Senior Full-Stack Engineer (React/Node)', type: 'job', date: '9/11/2026', status: 'Approved', statusType: 'approved' },
      { title: 'Staff Systems Architect', type: 'job', date: '9/09/2026', status: 'Approved', statusType: 'approved' },
      { title: 'Frontend Team Lead', type: 'job', date: '9/05/2026', status: 'Approved', statusType: 'approved' },
    ],
    activities: [
      { title: 'Leave status active', desc: 'Marcus is on approved medical leave', time: '9/20/2026', color: 'amber' },
      { title: 'Offer accepted', desc: 'Full-Stack Engineer candidate accepted', time: '9/14/2026', color: 'green' },
      { title: 'Job listing approved', desc: 'Systems Architect role published', time: '9/10/2026', color: 'blue' },
    ]
  }
];

// ─── Aggregated Role Views Data ───────────────────────────────────────────────
const ROLE_AGGREGATES = {
  'Content Writer': {
    name: 'Content Writers',
    initials: 'CW',
    role: 'Role Overview',
    status: '2 Members',
    period: '1 Sep – 30 Sep 2026',
    cards: {
      jobs: 3,
      blogs: 5,
      candidates: 9,
      newAssignments: 11,
      jobsMeta: 'Across 2 writers',
      blogsMeta: 'Across 2 writers',
      candidatesMeta: 'Total assigned',
      newAssignMeta: 'This period'
    },
    pipeline: [
      { label: 'Reference Check', count: 3, color: '#133484' },
      { label: 'Screening',       count: 3, color: '#10b981' },
      { label: 'Unresponsive',    count: 1, color: '#64748b' },
      { label: 'Offer Declined',  count: 1, color: '#ef4444' },
      { label: 'Withdrawn',       count: 1, color: '#f59e0b' },
    ],
    contentWeekly: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      jobs: [1, 0, 2, 0],
      blogs: [1, 2, 1, 1],
      newAssignments: [3, 4, 2, 2]
    },
    submissions: [
      { title: 'The Future of AI in Manufacturing Supply Chains', type: 'blog', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Next-Gen AI Workflows for Modern Enterprises', type: 'blog', date: '9/22/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Scaling Distributed Kubernetes for Enterprise Microservices', type: 'blog', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Navigating Compliance in Cloud Native Migrations', type: 'blog', date: '9/19/2026', status: 'Approved', statusType: 'approved' },
      { title: '5 Ways Predictive Maintenance Cuts Downtime', type: 'blog', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
    ],
    activities: [
      { title: 'Approval requested', desc: 'AI Workflows in queue (Priya)', time: '9/22/2026', color: 'blue' },
      { title: 'Approval requested', desc: 'Supply Chain piece in queue (Sarah)', time: '9/24/2026', color: 'blue' },
      { title: 'Submission approved', desc: 'Compliance article published', time: '9/20/2026', color: 'green' },
    ]
  },
  'Recruiter': {
    name: 'Recruiters',
    initials: 'RC',
    role: 'Role Overview',
    status: '2 Members',
    period: '1 Sep – 30 Sep 2026',
    cards: {
      jobs: 8,
      blogs: 0,
      candidates: 22,
      newAssignments: 16,
      jobsMeta: 'Across 2 recruiters',
      blogsMeta: 'No blog quota',
      candidatesMeta: 'Total assigned',
      newAssignMeta: 'This period'
    },
    pipeline: [
      { label: 'Screening',           count: 8, color: '#10b981' },
      { label: 'Technical Interview', count: 4, color: '#3b82f6' },
      { label: 'Offer Extended',      count: 4, color: '#8b5cf6' },
      { label: 'Reference Check',     count: 3, color: '#133484' },
      { label: 'Unresponsive',        count: 2, color: '#64748b' },
      { label: 'Offer Declined',      count: 1, color: '#ef4444' },
    ],
    contentWeekly: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      jobs: [3, 3, 1, 1],
      blogs: [0, 0, 0, 0],
      newAssignments: [5, 6, 3, 2]
    },
    submissions: [
      { title: 'Senior Cloud Infrastructure Architect', type: 'job', date: '9/20/2026', status: 'Approved', statusType: 'approved' },
      { title: 'Lead DevOps Engineer (Fintech)', type: 'job', date: '9/18/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Principal Product Designer', type: 'job', date: '9/15/2026', status: 'Approved', statusType: 'approved' },
      { title: 'Senior Full-Stack Engineer (React/Node)', type: 'job', date: '9/11/2026', status: 'Approved', statusType: 'approved' },
    ],
    activities: [
      { title: 'Job listing approved', desc: 'Senior Cloud Architect is now live', time: '9/21/2026', color: 'green' },
      { title: 'Shortlist submitted', desc: '5 candidates forwarded for review', time: '9/19/2026', color: 'blue' },
      { title: 'Offer accepted', desc: 'Full-Stack Engineer signed offer', time: '9/14/2026', color: 'purple' },
    ]
  },
  'all': {
    name: 'All Employees',
    initials: 'ALL',
    role: 'Company-Wide',
    status: '4 Members',
    period: '1 Sep – 30 Sep 2026',
    cards: {
      jobs: 11,
      blogs: 5,
      candidates: 31,
      newAssignments: 27,
      jobsMeta: 'All team posts',
      blogsMeta: 'All team posts',
      candidatesMeta: 'Total in pipeline',
      newAssignMeta: 'This period'
    },
    pipeline: [
      { label: 'Screening',           count: 11, color: '#10b981' },
      { label: 'Reference Check',     count: 6,  color: '#133484' },
      { label: 'Offer Extended',      count: 4,  color: '#8b5cf6' },
      { label: 'Technical Interview', count: 4,  color: '#3b82f6' },
      { label: 'Unresponsive',        count: 3,  color: '#64748b' },
      { label: 'Offer Declined',      count: 2,  color: '#ef4444' },
      { label: 'Withdrawn',           count: 1,  color: '#f59e0b' },
    ],
    contentWeekly: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      jobs: [4, 3, 3, 1],
      blogs: [1, 2, 1, 1],
      newAssignments: [8, 10, 5, 4]
    },
    submissions: [
      { title: 'The Future of AI in Manufacturing Supply Chains', type: 'blog', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Senior Cloud Infrastructure Architect', type: 'job', date: '9/20/2026', status: 'Approved', statusType: 'approved' },
      { title: 'Next-Gen AI Workflows for Modern Enterprises', type: 'blog', date: '9/22/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Lead DevOps Engineer (Fintech)', type: 'job', date: '9/18/2026', status: 'Pending review', statusType: 'pending' },
      { title: 'Scaling Distributed Kubernetes for Enterprise Microservices', type: 'blog', date: '9/16/2026', status: 'Pending review', statusType: 'pending' },
    ],
    activities: [
      { title: 'Approval requested', desc: 'Supply Chain piece in queue (Sarah)', time: '9/24/2026', color: 'blue' },
      { title: 'Approval requested', desc: 'AI Workflows in queue (Priya)', time: '9/22/2026', color: 'blue' },
      { title: 'Job listing approved', desc: 'Senior Cloud Architect live (James)', time: '9/21/2026', color: 'green' },
      { title: 'Submission approved', desc: 'Compliance article published (Priya)', time: '9/20/2026', color: 'green' },
    ]
  }
};

// ─── Employee Performance Charts & UI Controller ──────────────────────────────
let epPipelineChart = null;
let epTrendChart = null;
let currentSelectedRole = 'all';
let currentSelectedEmployeeId = 'all';

function renderEmployeeOptions(roleFilter, searchQuery = '') {
  const container = document.getElementById('epEmployeeList');
  if (!container) return;

  const q = searchQuery.toLowerCase().trim();
  const filtered = EMPLOYEES_DATA.filter(emp => {
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    const matchesSearch = !q || emp.name.toLowerCase().includes(q) || emp.role.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const showAllOption = !q || 'all employees'.includes(q) || 'all'.includes(q);
  const isAllSelected = currentSelectedEmployeeId === 'all';
  const allLabel = roleFilter === 'all' ? 'All Employees' : `All ${roleFilter}s`;

  let html = '';
  if (showAllOption) {
    html += `
      <div class="ep-dropdown-item ${isAllSelected ? 'is-selected' : ''}"
           role="option"
           data-id="all"
           data-name="${allLabel}"
           data-initials="ALL"
           data-role="Company-Wide"
           tabindex="-1">
        <div class="ep-avatar-sm">ALL</div>
        <div class="ep-item-info">
          <span class="ep-item-name">${allLabel}</span>
          <span class="ep-item-role">${roleFilter === 'all' ? 'Company-Wide' : roleFilter}</span>
        </div>
        <span class="ep-badge">All</span>
      </div>
    `;
  }

  if (filtered.length === 0 && !showAllOption) {
    container.innerHTML = `<div class="ep-dropdown-empty">No employees found</div>`;
    return;
  }

  html += filtered.map(emp => {
    const isSelected = emp.id === currentSelectedEmployeeId;
    return `
      <div class="ep-dropdown-item ${isSelected ? 'is-selected' : ''}"
           role="option"
           data-id="${emp.id}"
           data-name="${emp.name}"
           data-initials="${emp.initials}"
           data-role="${emp.role}"
           tabindex="-1">
        <div class="ep-avatar-sm">${emp.initials}</div>
        <div class="ep-item-info">
          <span class="ep-item-name">${emp.name}</span>
          <span class="ep-item-role">${emp.role}</span>
        </div>
        <span class="ep-badge ${emp.statusClass}">${emp.status}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function updateEmployeePerformanceView(data) {
  // Update Heading
  const headingName = document.getElementById('epHeadingName');
  const headingSub = document.getElementById('epHeadingSub');
  if (headingName) headingName.textContent = data.name;
  if (headingSub) headingSub.textContent = 'Select employee or role to see the performance';

  // Update Summary Cards
  const cJobs = document.getElementById('epCardJobs');
  const cBlogs = document.getElementById('epCardBlogs');
  const cCand = document.getElementById('epCardCandidates');
  const cNew = document.getElementById('epCardNewAssign');

  const mJobs = document.getElementById('epCardJobsMeta');
  const mBlogs = document.getElementById('epCardBlogsMeta');
  const mCand = document.getElementById('epCardCandidatesMeta');
  const mNew = document.getElementById('epCardNewAssignMeta');

  if (cJobs) cJobs.textContent = data.cards.jobs;
  if (cBlogs) cBlogs.textContent = data.cards.blogs;
  if (cCand) cCand.textContent = data.cards.candidates;
  if (cNew) cNew.textContent = data.cards.newAssignments;

  if (mJobs) mJobs.textContent = data.cards.jobsMeta;
  if (mBlogs) mBlogs.textContent = data.cards.blogsMeta;
  if (mCand) mCand.textContent = data.cards.candidatesMeta;
  if (mNew) mNew.textContent = data.cards.newAssignMeta;

  // Update Pipeline Subtitle
  const totalCandidates = data.pipeline.reduce((acc, cur) => acc + cur.count, 0);
  const pSub = document.getElementById('epPipelineSub');
  if (pSub) pSub.textContent = `Breakdown of ${totalCandidates} assigned candidates`;

  // Render Pipeline Donut Chart
  renderPipelineDonut(data.pipeline, totalCandidates);

  // Render Pipeline Legend
  const legendEl = document.getElementById('epPipelineLegend');
  if (legendEl) {
    legendEl.innerHTML = data.pipeline.map(item => `
      <div class="ep-legend-item">
        <span class="ep-legend-dot" style="background:${item.color};"></span>
        <span class="ep-legend-label">${item.label}</span>
        <span class="ep-legend-count">${item.count}</span>
      </div>
    `).join('');
  }

  // Render Line/Area Trend Chart (Jobs, Blogs, New Assignments) with expanded height
  renderTrendLineChart(data.contentWeekly);

  // Render Submissions List (with "Submitted on {date}")
  const subSub = document.getElementById('epSubmissionsSub');
  const pendingCount = data.submissions.filter(s => s.statusType === 'pending').length;
  const approvedCount = data.submissions.filter(s => s.statusType === 'approved').length;
  if (subSub) subSub.textContent = `${pendingCount} pending · ${approvedCount} approved`;

  const subList = document.getElementById('epSubmissionsList');
  if (subList) {
    subList.innerHTML = data.submissions.map(sub => `
      <div class="ep-submission-row">
        <div class="ep-submission-info">
          <span class="ep-sub-title">${sub.title}</span>
          <span class="ep-sub-meta">
            <span class="ep-type-badge ep-type-badge--${sub.type}">${sub.type === 'blog' ? 'Blog' : 'Job'}</span> · Submitted on ${sub.date}
          </span>
        </div>
        <span class="ep-status-badge ep-status-badge--${sub.statusType}">${sub.status}</span>
      </div>
    `).join('');
  }

  // Render Activity Timeline
  const actList = document.getElementById('epActivityList');
  if (actList) {
    actList.innerHTML = data.activities.map(act => `
      <div class="ep-activity-item">
        <div class="ep-activity-dot ep-dot--${act.color}"></div>
        <div class="ep-activity-body">
          <span class="ep-activity-title">${act.title}</span>
          <span class="ep-activity-desc">${act.desc}</span>
          <span class="ep-activity-time">${act.time}</span>
        </div>
      </div>
    `).join('');
  }
}

function renderPipelineDonut(pipeline, total) {
  if (typeof ApexCharts === 'undefined') return;
  const el = document.getElementById('epPipelineChart');
  if (!el) return;

  const series = pipeline.map(p => p.count);
  const labels = pipeline.map(p => p.label);
  const colors = pipeline.map(p => p.color);

  const opts = {
    chart: {
      type: 'donut',
      height: 180,
      fontFamily: "'DM Sans', sans-serif",
      toolbar: { show: false },
      sparkline: { enabled: false },
      animations: { enabled: true, speed: 300 },
    },
    series: series,
    labels: labels,
    colors: colors,
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '11px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#64748b',
              formatter: () => `${total}`,
              fontWeight: 700,
            },
            value: {
              fontSize: '18px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              color: '#121721',
              offsetY: 2,
            },
            name: {
              fontSize: '11px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#64748b',
              offsetY: -3,
            }
          }
        }
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['#ffffff'] },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px', fontFamily: "'DM Sans', sans-serif" },
      y: { formatter: (val) => `${val} candidates` }
    }
  };

  if (epPipelineChart) {
    epPipelineChart.updateOptions({
      series: series,
      labels: labels,
      colors: colors,
      plotOptions: {
        pie: {
          donut: {
            labels: {
              total: { formatter: () => `${total}` }
            }
          }
        }
      }
    }, true, true);
  } else {
    epPipelineChart = new ApexCharts(el, opts);
    epPipelineChart.render();
  }
}

// ─── Modern Line/Area Trend Chart (Jobs, Blogs, New Assignments) with expanded height ───
function renderTrendLineChart(weeklyData) {
  if (typeof ApexCharts === 'undefined') return;
  const el = document.getElementById('epContentChart');
  if (!el) return;

  const opts = {
    chart: {
      type: 'area',
      height: 300,
      fontFamily: "'DM Sans', sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 350,
      },
      parentHeightOffset: 0,
    },
    series: [
      { name: 'Jobs Posted',       data: weeklyData.jobs },
      { name: 'Blog Posts',        data: weeklyData.blogs },
      { name: 'New Assignments',   data: weeklyData.newAssignments },
    ],
    xaxis: {
      categories: weeklyData.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: '11px',
          fontFamily: "'DM Sans', sans-serif",
          colors: '#64748b',
          fontWeight: 500
        }
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        style: {
          fontSize: '11px',
          fontFamily: "'DM Sans', sans-serif",
          colors: '#64748b',
          fontWeight: 500
        },
        formatter: (val) => Math.round(val)
      }
    },
    colors: ['#133484', '#8b5cf6', '#0d9488'],
    stroke: {
      curve: 'smooth',
      width: [2.5, 2.5, 2.5],
      lineCap: 'round',
    },
    markers: {
      size: 0,
      strokeWidth: 2,
      strokeColors: '#ffffff',
      hover: {
        size: 5,
        sizeOffset: 2,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: [0.18, 0.18, 0.18],
        opacityTo: [0.01, 0.01, 0.01],
        stops: [0, 95, 100],
      },
    },
    grid: {
      borderColor: '#edf2f7',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 0,
      },
    },
    legend: { show: false },
    tooltip: {
      theme: 'light',
      shared: true,
      intersect: false,
      style: {
        fontSize: '12px',
        fontFamily: "'DM Sans', sans-serif",
      },
      x: { show: true },
      marker: { show: true },
      y: {
        formatter: (val) => `${val}`,
      },
    },
    dataLabels: { enabled: false },
  };

  if (epTrendChart) {
    epTrendChart.updateOptions({
      xaxis: { categories: weeklyData.categories },
      series: [
        { name: 'Jobs Posted',       data: weeklyData.jobs },
        { name: 'Blog Posts',        data: weeklyData.blogs },
        { name: 'New Assignments',   data: weeklyData.newAssignments },
      ]
    }, true, true);
  } else {
    epTrendChart = new ApexCharts(el, opts);
    epTrendChart.render();
  }
}

// ─── Separate Dropdowns Logic (Role & Employee) ───────────────────────────────
function initEmployeeDropdowns() {
  const roleWrap = document.getElementById('epRoleWrap');
  const roleTrigger = document.getElementById('epRoleTrigger');
  const roleDropdown = document.getElementById('epRoleDropdown');
  const roleValue = document.getElementById('epRoleValue');

  const empWrap = document.getElementById('epEmployeeWrap');
  const empTrigger = document.getElementById('epEmployeeTrigger');
  const empDropdown = document.getElementById('epEmployeeDropdown');
  const empValue = document.getElementById('epEmployeeValue');
  const empAvatar = document.getElementById('epCurrentAvatar');
  const empSearch = document.getElementById('epEmployeeSearch');
  const empList = document.getElementById('epEmployeeList');

  // Toggle Role Dropdown
  if (roleTrigger && roleDropdown) {
    roleTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = roleDropdown.classList.contains('is-open');
      closeAllDropdowns();
      if (!isOpen) {
        roleDropdown.classList.add('is-open');
        roleTrigger.classList.add('is-open');
        roleTrigger.setAttribute('aria-expanded', 'true');
      }
    });

    roleDropdown.querySelectorAll('.ep-dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const role = item.dataset.role;
        currentSelectedRole = role;

        roleDropdown.querySelectorAll('.ep-dropdown-item').forEach(i => i.classList.remove('is-selected'));
        item.classList.add('is-selected');

        if (roleValue) {
          roleValue.textContent = role === 'all' ? 'All Roles' : item.querySelector('span:nth-child(2)').textContent;
        }

        closeAllDropdowns();

        // Refresh employee list options for this role
        renderEmployeeOptions(role, empSearch ? empSearch.value : '');

        // When changing role, default to all employees in that role view
        selectEmployee('all');
      });
    });
  }

  // Toggle Employee Dropdown
  if (empTrigger && empDropdown) {
    empTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = empDropdown.classList.contains('is-open');
      closeAllDropdowns();
      if (!isOpen) {
        empDropdown.classList.add('is-open');
        empTrigger.classList.add('is-open');
        empTrigger.setAttribute('aria-expanded', 'true');
        if (empSearch) {
          empSearch.focus();
        }
      }
    });
  }

  // Employee Search Input
  if (empSearch) {
    empSearch.addEventListener('input', (e) => {
      renderEmployeeOptions(currentSelectedRole, e.target.value);
    });
    empSearch.addEventListener('click', (e) => e.stopPropagation());
  }

  // Delegate click on employee options
  if (empList) {
    empList.addEventListener('click', (e) => {
      const item = e.target.closest('.ep-dropdown-item');
      if (!item) return;
      e.stopPropagation();
      const empId = item.dataset.id;
      selectEmployee(empId);
      closeAllDropdowns();
    });
  }

  function selectEmployee(empId) {
    currentSelectedEmployeeId = empId;

    if (empId === 'all') {
      const aggregateData = ROLE_AGGREGATES[currentSelectedRole] || ROLE_AGGREGATES['all'];
      const label = currentSelectedRole === 'all' ? 'All Employees' : (currentSelectedRole === 'Content Writer' ? 'All Content Writers' : 'All Recruiters');

      if (empValue) empValue.textContent = label;
      if (empAvatar) empAvatar.textContent = 'ALL';

      if (empList) {
        empList.querySelectorAll('.ep-dropdown-item').forEach(i => {
          i.classList.toggle('is-selected', i.dataset.id === 'all');
        });
      }

      updateEmployeePerformanceView(aggregateData);
      return;
    }

    const empData = EMPLOYEES_DATA.find(e => e.id === empId);
    if (!empData) return;

    if (empValue) empValue.textContent = empData.name;
    if (empAvatar) {
      empAvatar.textContent = empData.initials;
    }

    // Update list selection highlight
    if (empList) {
      empList.querySelectorAll('.ep-dropdown-item').forEach(i => {
        i.classList.toggle('is-selected', i.dataset.id === empId);
      });
    }

    updateEmployeePerformanceView(empData);
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.ep-dropdown').forEach(d => d.classList.remove('is-open'));
    document.querySelectorAll('.ep-selector-trigger').forEach(t => {
      t.classList.remove('is-open');
      t.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', closeAllDropdowns);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  // Initial employee options render & view setup: Default to "All Roles" and "All Employees"
  renderEmployeeOptions('all');
  selectEmployee('all');
}

// ─── Tab Switching ────────────────────────────────────────────────────────────
function initTabSwitching() {
  document.querySelectorAll('.dash-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      document.querySelectorAll('.dash-tab').forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add('is-active');
      }

      // Redraw ApexCharts to handle hidden tab dimensions
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        if (target === 'tab-website') {
          if (lineChart) lineChart.render();
          if (donutChart) donutChart.render();
        } else if (target === 'tab-employee') {
          if (epPipelineChart) epPipelineChart.render();
          if (epTrendChart) epTrendChart.render();
        }
      }, 50);
    });
  });
}

// ─── Time Filter Buttons (Website Performance) ────────────────────────────────
function initTimeFilters() {
  document.querySelectorAll('.time-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-filter-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const range = parseInt(btn.dataset.range, 10);
      updateLineChart(range);
    });
  });
}

// ─── Main Initialization ──────────────────────────────────────────────────────
function initDashboard() {
  initTabSwitching();
  initTimeFilters();
  updateLineChart(30);
  initDonutChart();
  initEmployeeDropdowns();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}
