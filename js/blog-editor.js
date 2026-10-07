/**
 * FWC Admin Portal — Medium-Style Blog Post Editor Logic
 * Exclusively DM Sans typography · Auto-fill feature · Floating selection bubble
 */

// Editor State
const editorState = {
  bannerUrl: '',
  bannerCaption: '',
  title: '',
  contentType: 'Article',
  category: 'Industry Insights',
  slug: '',
  bodyHtml: '',
  isSaved: true
};

// DOM References
const editorDom = {};

function initEditorDom() {
  editorDom.bannerDropzone = document.getElementById('bannerDropzone');
  editorDom.bannerFileInput = document.getElementById('bannerFileInput');
  editorDom.bannerPreviewBox = document.getElementById('bannerPreviewBox');
  editorDom.bannerPreviewImg = document.getElementById('bannerPreviewImg');
  editorDom.btnChangeBanner = document.getElementById('btnChangeBanner');
  editorDom.btnRemoveBanner = document.getElementById('btnRemoveBanner');
  editorDom.bannerCaptionInput = document.getElementById('bannerCaptionInput');
  editorDom.btnUseSampleBanner = document.getElementById('btnUseSampleBanner');

  editorDom.titleInput = document.getElementById('editorTitleInput');
  editorDom.contentTypeSelect = document.getElementById('editorContentType');
  editorDom.categorySelect = document.getElementById('editorCategory');
  editorDom.permalinkInput = document.getElementById('editorPermalinkInput');
  editorDom.btnCopySlug = document.getElementById('btnCopySlug');

  editorDom.mediumPlusBtn = document.getElementById('mediumPlusBtn');
  editorDom.mediumInlineActions = document.getElementById('mediumInlineActions');
  editorDom.editorBody = document.getElementById('editorBody');
  editorDom.bubbleMenu = document.getElementById('editorBubbleMenu');

  editorDom.statusIndicator = document.getElementById('editorStatusIndicator');
  editorDom.statusText = document.getElementById('editorStatusText');

  editorDom.btnAutoFill = document.getElementById('btnAutoFill');
  editorDom.btnPreview = document.getElementById('btnEditorPreview');
  editorDom.btnSaveDraft = document.getElementById('btnSaveDraft');
  editorDom.btnPublish = document.getElementById('btnPublishPrimary');

  editorDom.previewModal = document.getElementById('previewModal');
  editorDom.previewContentArea = document.getElementById('previewContentArea');
  editorDom.publishModal = document.getElementById('publishModal');
  editorDom.editorToast = document.getElementById('editorToast');
  editorDom.editorToastMsg = document.getElementById('editorToastMsg');
}

/**
 * Banner Image Handling (1920x1080 16:9 placeholder & live preview)
 */
function setupBannerUploader() {
  if (!editorDom.bannerDropzone) return;

  // Click on dropzone opens file picker
  editorDom.bannerDropzone.addEventListener('click', (e) => {
    if (e.target.closest('#btnUseSampleBanner')) return;
    if (editorDom.bannerFileInput) editorDom.bannerFileInput.click();
  });

  // Handle file input change
  if (editorDom.bannerFileInput) {
    editorDom.bannerFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setBannerImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Handle Drag & Drop
  ['dragenter', 'dragover'].forEach(eventName => {
    editorDom.bannerDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      editorDom.bannerDropzone.classList.add('is-dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    editorDom.bannerDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      editorDom.bannerDropzone.classList.remove('is-dragover');
    });
  });

  editorDom.bannerDropzone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Use Sample Banner (banner.png)
  if (editorDom.btnUseSampleBanner) {
    editorDom.btnUseSampleBanner.addEventListener('click', (e) => {
      e.stopPropagation();
      setBannerImage('banner.png');
    });
  }

  // Change Banner
  if (editorDom.btnChangeBanner) {
    editorDom.btnChangeBanner.addEventListener('click', (e) => {
      e.stopPropagation();
      if (editorDom.bannerFileInput) editorDom.bannerFileInput.click();
    });
  }

  // Remove Banner
  if (editorDom.btnRemoveBanner) {
    editorDom.btnRemoveBanner.addEventListener('click', (e) => {
      e.stopPropagation();
      removeBannerImage();
    });
  }

  // Banner Caption
  if (editorDom.bannerCaptionInput) {
    editorDom.bannerCaptionInput.addEventListener('input', (e) => {
      editorState.bannerCaption = e.target.value;
      triggerAutoSave();
    });
  }
}

function setBannerImage(url) {
  editorState.bannerUrl = url;
  if (editorDom.bannerPreviewImg) editorDom.bannerPreviewImg.src = url;
  if (editorDom.bannerDropzone) editorDom.bannerDropzone.style.display = 'none';
  if (editorDom.bannerPreviewBox) editorDom.bannerPreviewBox.classList.add('is-active');
  triggerAutoSave();
  showToast('Banner image uploaded (1920 × 1080)');
}

function removeBannerImage() {
  editorState.bannerUrl = '';
  if (editorDom.bannerPreviewImg) editorDom.bannerPreviewImg.src = '';
  if (editorDom.bannerPreviewBox) editorDom.bannerPreviewBox.classList.remove('is-active');
  if (editorDom.bannerDropzone) editorDom.bannerDropzone.style.display = 'flex';
  if (editorDom.bannerFileInput) editorDom.bannerFileInput.value = '';
  triggerAutoSave();
}

/**
 * Title & Dynamic Slug Generator
 */
function setupTitleAndSlug() {
  if (!editorDom.titleInput) return;

  function autoResizeTitle() {
    editorDom.titleInput.style.height = 'auto';
    editorDom.titleInput.style.height = editorDom.titleInput.scrollHeight + 'px';
  }

  editorDom.titleInput.addEventListener('input', (e) => {
    autoResizeTitle();
    editorState.title = e.target.value;
    
    // Auto generate slug
    const generatedSlug = generateSlug(e.target.value);
    if (editorDom.permalinkInput) {
      editorDom.permalinkInput.value = generatedSlug;
      editorState.slug = generatedSlug;
    }
    triggerAutoSave();
  });

  if (editorDom.permalinkInput) {
    editorDom.permalinkInput.addEventListener('input', (e) => {
      editorState.slug = e.target.value;
      triggerAutoSave();
    });
  }

  if (editorDom.btnCopySlug) {
    editorDom.btnCopySlug.addEventListener('click', () => {
      const fullUrl = `https://fwc.internal/blog/${editorState.slug || 'your-slug'}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        showToast('Permalink copied to clipboard');
      });
    });
  }

  if (editorDom.contentTypeSelect) {
    editorDom.contentTypeSelect.addEventListener('change', (e) => {
      editorState.contentType = e.target.value;
      triggerAutoSave();
    });
  }

  if (editorDom.categorySelect) {
    editorDom.categorySelect.addEventListener('change', (e) => {
      editorState.category = e.target.value;
      triggerAutoSave();
    });
  }
}

function generateSlug(text) {
  if (!text) return 'untitled-post';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Medium-Style Inline (+) / (X) Insert Toolbar (Exact Match)
 */
function setupMediumInsertToolbar() {
  if (!editorDom.mediumPlusBtn || !editorDom.mediumInlineActions) return;

  // Toggle (+) and (X)
  editorDom.mediumPlusBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = editorDom.mediumPlusBtn.classList.toggle('is-open');
    editorDom.mediumInlineActions.classList.toggle('is-visible', isOpen);
  });

  // Action: Add Image
  const btnAddImage = document.getElementById('btnInsertImage');
  if (btnAddImage) {
    btnAddImage.addEventListener('click', () => {
      closeMediumToolbar();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            insertHtmlAtCursor(`
              <figure class="editor-embedded-media">
                <img src="${ev.target.result}" alt="Embedded Image" />
                <figcaption contenteditable="true">Type caption for image (optional)</figcaption>
              </figure>
              <p><br></p>
            `);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    });
  }

  // Action: Add from Unsplash
  const btnAddUnsplash = document.getElementById('btnInsertUnsplash');
  if (btnAddUnsplash) {
    btnAddUnsplash.addEventListener('click', () => {
      closeMediumToolbar();
      const sampleImg = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80';
      insertHtmlAtCursor(`
        <figure class="editor-embedded-media">
          <img src="${sampleImg}" alt="Unsplash Tech Editorial" />
          <figcaption contenteditable="true">Photo via Unsplash · Modern Enterprise Architecture</figcaption>
        </figure>
        <p><br></p>
      `);
      showToast('Inserted high-res Unsplash image');
    });
  }

  // Action: Add Video
  const btnAddVideo = document.getElementById('btnInsertVideo');
  if (btnAddVideo) {
    btnAddVideo.addEventListener('click', () => {
      closeMediumToolbar();
      const videoUrl = prompt('Paste YouTube or Vimeo video URL:', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      if (videoUrl) {
        insertHtmlAtCursor(`
          <div class="editor-embedded-media" style="padding: 24px; text-align: center; background: #0f172a; color: white;">
            <i class="ph ph-video-camera" style="font-size: 36px; color: #38bdf8;"></i>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8;">Embedded Video Stream: <a href="${videoUrl}" target="_blank" style="color: #38bdf8;">${videoUrl}</a></p>
          </div>
          <p><br></p>
        `);
      }
    });
  }

  // Action: Add Embed
  const btnAddEmbed = document.getElementById('btnInsertEmbed');
  if (btnAddEmbed) {
    btnAddEmbed.addEventListener('click', () => {
      closeMediumToolbar();
      const embedCode = prompt('Paste embed link or iframe URL:');
      if (embedCode) {
        insertHtmlAtCursor(`
          <div class="editor-embedded-media" style="padding: 16px; border: 1px dashed #94a3b8; text-align: center;">
            <span style="font-size: 13px; color: #64748b;">Interactive Widget Embed: ${embedCode}</span>
          </div>
          <p><br></p>
        `);
      }
    });
  }

  // Action: Add Code Block
  const btnAddCode = document.getElementById('btnInsertCode');
  if (btnAddCode) {
    btnAddCode.addEventListener('click', () => {
      closeMediumToolbar();
      insertHtmlAtCursor(`
        <pre><code>// Modern Cloud Microservices Configuration
export const clusterConfig = {
  region: "us-east-1",
  nodes: 12,
  autoScale: true,
  observability: "OpenTelemetry"
};</code></pre>
        <p><br></p>
      `);
    });
  }

  // Action: Add Section Divider (Three dots)
  const btnAddDivider = document.getElementById('btnInsertDivider');
  if (btnAddDivider) {
    btnAddDivider.addEventListener('click', () => {
      closeMediumToolbar();
      insertHtmlAtCursor(`
        <hr class="section-divider">
        <p><br></p>
      `);
    });
  }
}

function closeMediumToolbar() {
  if (editorDom.mediumPlusBtn) editorDom.mediumPlusBtn.classList.remove('is-open');
  if (editorDom.mediumInlineActions) editorDom.mediumInlineActions.classList.remove('is-visible');
}

/**
 * Floating Selection Bubble Menu (Active ONLY when text is highlighted)
 */
function setupBubbleMenu() {
  if (!editorDom.bubbleMenu || !editorDom.editorBody) return;

  // Prevent selection loss when clicking bubble menu buttons
  editorDom.bubbleMenu.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });

  editorDom.bubbleMenu.querySelectorAll('.btn-bubble').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const command = btn.getAttribute('data-command');
      const value = btn.getAttribute('data-value') || null;

      if (command === 'createLink') {
        const url = prompt('Enter hyperlink URL:', 'https://');
        if (url) {
          document.execCommand(command, false, url);
        }
      } else if (command === 'formatBlock') {
        document.execCommand(command, false, `<${value}>`);
      } else {
        document.execCommand(command, false, value);
      }

      triggerAutoSave();
    });
  });

  // Handle document selection changes
  document.addEventListener('selectionchange', handleSelectionChange);

  // Editor content input listener
  editorDom.editorBody.addEventListener('input', () => {
    editorState.bodyHtml = editorDom.editorBody.innerHTML;
    triggerAutoSave();
  });
}

function handleSelectionChange() {
  if (!editorDom.bubbleMenu || !editorDom.editorBody) return;

  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) {
    editorDom.bubbleMenu.classList.remove('is-visible');
    return;
  }

  const range = selection.getRangeAt(0);
  if (!editorDom.editorBody.contains(range.commonAncestorContainer)) {
    editorDom.bubbleMenu.classList.remove('is-visible');
    return;
  }

  const rect = range.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    editorDom.bubbleMenu.classList.remove('is-visible');
    return;
  }

  editorDom.bubbleMenu.classList.add('is-visible');
  const menuWidth = 310;
  const top = rect.top + window.scrollY - 52;
  const left = rect.left + window.scrollX + (rect.width / 2) - (menuWidth / 2);

  editorDom.bubbleMenu.style.top = `${Math.max(10, top)}px`;
  editorDom.bubbleMenu.style.left = `${Math.max(10, left)}px`;
}

function insertHtmlAtCursor(html) {
  if (editorDom.editorBody) {
    editorDom.editorBody.focus();
  }
  document.execCommand('insertHTML', false, html);
  triggerAutoSave();
}

/**
 * Auto-Fill Feature (Dummy Icon Action)
 */
function setupAutoFill() {
  if (!editorDom.btnAutoFill) return;

  editorDom.btnAutoFill.addEventListener('click', () => {
    // 1. Set Banner
    setBannerImage('banner.png');

    // 2. Set Title
    const sampleTitle = 'The Future of AI in Manufacturing Supply Chains';
    if (editorDom.titleInput) {
      editorDom.titleInput.value = sampleTitle;
      editorDom.titleInput.style.height = 'auto';
      editorDom.titleInput.style.height = editorDom.titleInput.scrollHeight + 'px';
      editorState.title = sampleTitle;
    }

    // 3. Set Content Type & Category
    if (editorDom.contentTypeSelect) {
      editorDom.contentTypeSelect.value = 'Article';
      editorState.contentType = 'Article';
    }
    if (editorDom.categorySelect) {
      editorDom.categorySelect.value = 'Industry Insights';
      editorState.category = 'Industry Insights';
    }

    // 4. Set Permalink Slug
    const sampleSlug = 'future-of-ai-manufacturing-supply-chains';
    if (editorDom.permalinkInput) {
      editorDom.permalinkInput.value = sampleSlug;
      editorState.slug = sampleSlug;
    }

    // 5. Set Rich Body Content
    if (editorDom.editorBody) {
      editorDom.editorBody.innerHTML = `
        <p>The manufacturing and supply chain landscape is undergoing a monumental transformation. As global logistics networks face unprecedented volatility, industrial organizations are turning to artificial intelligence and automated edge nodes to stabilize procurement, predict bottlenecks, and ensure uninterrupted production cycles.</p>
        
        <h2>The Paradigm Shift in Smart Automation</h2>
        <p>Traditional ERP and deterministic scheduling algorithms often fail when unforeseen disruptions ripple through multi-tier supplier ecosystems. With modern machine learning pipelines, predictive telemetry models forecast component shortages up to six weeks in advance, granting operators sufficient lead time to re-route logistics corridors seamlessly.</p>
        
        <blockquote>“AI isn’t merely optimizing supply chains — it is redesigning the speed, precision, and resilience at which global business operates.”</blockquote>
        
        <p>Furthermore, digital twin environments allow operations teams to simulate stress-test scenarios across thousands of manufacturing nodes without interrupting live factory lines:</p>
        
        <pre><code>// Predictive Inventory Allocation Protocol
export const supplyRouteEngine = {
  telemetryMode: "Realtime-Edge",
  riskThreshold: 0.12,
  autoReRoute: true,
  fallbackHub: "us-east-cluster"
};</code></pre>

        <hr class="section-divider">

        <p>As we advance deeper into 2026, the convergence of distributed computing and autonomous intelligence will establish a new baseline for enterprise efficiency. Organizations that integrate these agile workflows today are defining the operational benchmarks of tomorrow.</p>
      `;
      editorState.bodyHtml = editorDom.editorBody.innerHTML;
    }

    triggerAutoSave();
    showToast('Auto-filled sample article content');
  });
}

/**
 * Auto-Save State Simulation
 */
let autoSaveTimeout;
function triggerAutoSave() {
  if (!editorDom.statusIndicator || !editorDom.statusText) return;

  editorDom.statusIndicator.className = 'editor-status-indicator is-saving';
  editorDom.statusText.textContent = 'Saving changes...';
  editorState.isSaved = false;

  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    editorDom.statusIndicator.className = 'editor-status-indicator is-saved';
    editorDom.statusText.textContent = 'Draft saved';
    editorState.isSaved = true;
  }, 900);
}

/**
 * Toast Notifications
 */
let toastTimeout;
function showToast(msg) {
  if (!editorDom.editorToast || !editorDom.editorToastMsg) return;
  editorDom.editorToastMsg.textContent = msg;
  editorDom.editorToast.classList.add('is-visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    editorDom.editorToast.classList.remove('is-visible');
  }, 3000);
}

/**
 * Preview Modal & Publish Workflow
 */
function setupModals() {
  // Preview Button
  if (editorDom.btnPreview) {
    editorDom.btnPreview.addEventListener('click', () => {
      openPreviewModal();
    });
  }

  // Close Preview
  const btnClosePreview = document.getElementById('btnClosePreview');
  const btnClosePreviewBottom = document.getElementById('btnClosePreviewBottom');
  if (btnClosePreview) btnClosePreview.addEventListener('click', closePreviewModal);
  if (btnClosePreviewBottom) btnClosePreviewBottom.addEventListener('click', closePreviewModal);

  // Save Draft Action
  if (editorDom.btnSaveDraft) {
    editorDom.btnSaveDraft.addEventListener('click', () => {
      savePostAndRedirect(true);
    });
  }

  // Publish / Submit Button
  if (editorDom.btnPublish) {
    editorDom.btnPublish.addEventListener('click', () => {
      openPublishModal();
    });
  }

  const btnClosePublishModal = document.getElementById('btnClosePublishModal');
  const btnCancelPublish = document.getElementById('btnCancelPublish');
  const btnConfirmPublish = document.getElementById('btnConfirmPublish');

  if (btnClosePublishModal) btnClosePublishModal.addEventListener('click', closePublishModal);
  if (btnCancelPublish) btnCancelPublish.addEventListener('click', closePublishModal);
  if (btnConfirmPublish) {
    btnConfirmPublish.addEventListener('click', () => {
      savePostAndRedirect(false);
    });
  }

  // Global click outside to close popups
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.medium-insert-container')) {
      closeMediumToolbar();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePreviewModal();
      closePublishModal();
      closeMediumToolbar();
    }
  });
}

function openPreviewModal() {
  if (!editorDom.previewModal || !editorDom.previewContentArea) return;

  const title = editorState.title || 'Untitled Post';
  const type = editorState.contentType || 'Article';
  const category = editorState.category || 'Industry Insights';
  const permalink = `/blog/${editorState.slug || 'untitled-post'}`;
  const banner = editorState.bannerUrl ? `<img src="${editorState.bannerUrl}" style="width: 100%; border-radius: 8px; margin: 16px 0;" alt="Banner" />` : '';
  const body = editorDom.editorBody ? editorDom.editorBody.innerHTML : '<p>No content yet.</p>';

  editorDom.previewContentArea.innerHTML = `
    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
      <span style="font-size: 11px; font-weight: 600; color: #4338ca; background: #eef2ff; padding: 3px 8px; border-radius: 4px;">${type}</span>
      <span style="font-size: 11px; font-weight: 600; color: #059669; background: #ecfdf5; padding: 3px 8px; border-radius: 4px;">${category}</span>
      <span style="font-size: 11px; color: #64748b; font-family: monospace;">${permalink}</span>
    </div>
    <h1 style="font-size: 28px; font-weight: 700; color: #0f172a; line-height: 1.25; margin: 0 0 16px 0;">${title}</h1>
    ${banner}
    <div style="font-size: 16px; line-height: 1.7; color: #334155;">
      ${body}
    </div>
  `;

  editorDom.previewModal.classList.add('is-open');
}

function closePreviewModal() {
  if (editorDom.previewModal) editorDom.previewModal.classList.remove('is-open');
}

function openPublishModal() {
  if (!editorDom.publishModal) return;
  const pubTitle = document.getElementById('publishDialogTitle');
  if (pubTitle) pubTitle.textContent = editorState.title || 'Untitled Post';
  editorDom.publishModal.classList.add('is-open');
}

function closePublishModal() {
  if (editorDom.publishModal) editorDom.publishModal.classList.remove('is-open');
}

function savePostAndRedirect(isDraft = false) {
  const title = editorState.title || 'Untitled Post';
  showToast(isDraft ? `Draft "${title}" saved successfully` : `Post "${title}" submitted for review`);

  setTimeout(() => {
    window.location.href = 'blog-posts.html';
  }, 1000);
}

/**
 * Initialize Editor on Load
 */
document.addEventListener('DOMContentLoaded', () => {
  initEditorDom();
  setupBannerUploader();
  setupTitleAndSlug();
  setupMediumInsertToolbar();
  setupBubbleMenu();
  setupAutoFill();
  setupModals();
});
