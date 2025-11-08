// public/widget.js

(function () {
  "use strict";

  // Get script element and configuration
  const scriptElement =
    document.getElementById("getvalidated-widget-script") ||
    document.querySelector("script[data-client-key]");

  if (!scriptElement) {
    console.error("getvalidatedfast.com: Script tag not found");
    return;
  }

  const clientKey = scriptElement.getAttribute("data-client-key");
  const language = scriptElement.getAttribute("data-language") || "en";

  if (!clientKey) {
    console.error("getvalidatedfast.com: Missing data-client-key attribute");
    return;
  }

  // API base URL - use localhost for local development
  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://yourdomain.com";

  // Widget configuration
  let widgetConfig = null;
  let userData = null;

  // User identification API
  const GetvalidatedfastAPI = {
    identify: function (data) {
      userData = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        ...data,
      };
      console.log("getvalidatedfast.com: User identified", userData);
    },

    unidentify: function () {
      userData = null;
      console.log("getvalidatedfast.com: User unidentified");
    },
  };

  // Expose API globally
  window.getvalidatedfast = GetvalidatedfastAPI;

  // Fetch widget configuration
  async function loadWidgetConfig() {
    try {
      const response = await fetch(`${API_BASE}/api/widget/${clientKey}`);

      if (!response.ok) {
        throw new Error(`Failed to load widget config: ${response.status}`);
      }

      widgetConfig = await response.json();
      console.log("getvalidatedfast.com: Config loaded", widgetConfig);
      
      checkBehaviorAndShow();
    } catch (error) {
      console.error("getvalidatedfast.com: Error loading widget config", error);
    }
  }

  // Check behavior and trigger widget display
  function checkBehaviorAndShow() {
    if (!widgetConfig) return;

    const behavior = widgetConfig.settings.behavior;

    // Check device compatibility
    if (!isDeviceAllowed(behavior.devices)) {
      console.log("getvalidatedfast.com: Device not allowed");
      return;
    }

    // Check URL inclusion/exclusion
    if (!isUrlAllowed(behavior)) {
      console.log("getvalidatedfast.com: URL not allowed");
      return;
    }

    // Handle trigger types
    switch (behavior.triggerType) {
      case "showImmediately":
        initializeWidget();
        // Open panel immediately if available
        setTimeout(() => {
          if (
            window.getvalidatedfast &&
            typeof window.getvalidatedfast.open === "function"
          ) {
            window.getvalidatedfast.open();
          }
        }, 0);
        break;

      case "afterDelay":
        setTimeout(() => initializeWidget(), 3000); // 3 second delay
        break;

      case "onScroll":
        setupScrollTrigger(() => initializeWidget());
        break;

      case "exitIntent":
        setupExitIntent(() => initializeWidget());
        break;

      case "manual":
        // Widget will be shown manually via API
        console.log(
          "getvalidatedfast.com: Manual trigger mode - use window.getvalidatedfast.show() to display"
        );
        GetvalidatedfastAPI.show = () => initializeWidget();
        break;

      default:
        initializeWidget(); // Default to showing
    }
  }

  // Check if current device is allowed
  function isDeviceAllowed(devices) {
    if (!devices) return true; // If no device restrictions, allow all

    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|iPod|Android/i.test(userAgent);
    const isTablet =
      /iPad|Android/i.test(userAgent) &&
      /Mobile/.test(userAgent) &&
      window.innerWidth >= 768;
    const isDesktop = !isMobile && !isTablet;

    if (isMobile) return devices.mobile !== false;
    if (isTablet) return devices.tablet !== false;
    if (isDesktop) return devices.desktop !== false;

    return true; // Default to true if can't determine
  }

  // Check if current URL is allowed
  function isUrlAllowed(behavior) {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;

    // Check inclusion URLs
    if (behavior.includeUrls && behavior.includeUrls.length > 0) {
      const matches = behavior.includeUrls.some((url) => {
        const trimmed = url.trim();
        return currentUrl.includes(trimmed) || currentPath.includes(trimmed);
      });
      if (!matches) return false; // URL not in include list
    }

    // Check exclusion URLs
    if (behavior.excludeUrls && behavior.excludeUrls.length > 0) {
      const matches = behavior.excludeUrls.some((url) => {
        const trimmed = url.trim();
        return currentUrl.includes(trimmed) || currentPath.includes(trimmed);
      });
      if (matches) return false; // URL is in exclude list
    }

    return true; // Allowed if no restrictions or passed all checks
  }

  // Setup scroll trigger
  function setupScrollTrigger(callback) {
    let hasTriggered = false;

    window.addEventListener(
      "scroll",
      function () {
        if (hasTriggered) return;

        const scrollPercentage =
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100;

        if (scrollPercentage >= 50) {
          // Trigger at 50% scroll
          hasTriggered = true;
          callback();
        }
      },
      { passive: true }
    );
  }

  // Setup exit intent trigger
  function setupExitIntent(callback) {
    let hasTriggered = false;

    document.addEventListener("mouseout", function (e) {
      if (hasTriggered) return;

      // Check if mouse is leaving the viewport from the top
      if (!e.toElement && !e.relatedTarget && e.clientY < 10) {
        hasTriggered = true;
        callback();
      }
    });
  }

  // Initialize an render the widgetd
  function initializeWidget() {
    if (!widgetConfig) return;

    // Remove existing widget if present
    const existing = document.getElementById(
      "getvalidatedfast-widget-container"
    );
    if (existing) {
      existing.remove();
    }

    const settings = widgetConfig.settings;
    createWidgetUI(settings);
  }

  // Create the widget UI (launcher + modal)
  function createWidgetUI(settings) {
    const content = settings.content;
    const functionality = settings.functionality;

    // Root container for launcher and modal
    const container = document.createElement("div");
    container.id = "getvalidatedfast-widget-container";
    container.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

    // Launcher button
    const launcher = document.createElement("button");
    launcher.setAttribute("aria-label", "Open feedback");
    launcher.style.cssText = `
        position: absolute;
        right: 20px;
        bottom: 20px;
        padding: 12px 16px;
        background: #7c3aed; /* purple */
        color: #fff;
        border: none;
        border-radius: 9999px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 12px 24px rgba(124,58,237,0.35);
        cursor: pointer;
        pointer-events: auto;
      `;
    launcher.innerHTML = `
        <span style="display:inline-flex;width:18px;height:18px;border:2px solid currentColor;border-radius:4px;transform: rotate(90deg);"></span>
        <span>Feedback</span>
      `;

    // Modal overlay + panel
    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position: absolute; inset: 0; background: rgba(0,0,0,0.0); display: none; pointer-events: auto;
      `;

    const panel = document.createElement("div");
    panel.style.cssText = `
        position: absolute;
        right: 20px;
        bottom: 76px;
        width: min(420px, calc(100% - 40px));
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        display: none;
        overflow: hidden;
        pointer-events: auto;
      `;

    // Header
    const header = document.createElement("div");
    header.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #f0f0f0;`;
    header.innerHTML = `
        <div style="font-weight:700;font-size:16px;">${
          content.HeaderTitle || "Feedback"
        }</div>
        <button aria-label="Close" style="background:none;border:none;font-size:22px;line-height:1;cursor:pointer">×</button>
      `;

    const headerClose = header.querySelector("button");

    // Content views wrapper
    const views = document.createElement("div");
    views.style.cssText = `padding: 12px 12px 6px 12px;`;

    // Footer
    const footer = document.createElement("div");
    footer.style.cssText = `padding:12px 16px;border-top:1px solid #f0f0f0;color:#6b7280;font-size:12px;display:flex;justify-content:flex-end;`;
    footer.innerHTML = `<span>Powered by <strong>getvalidatedfast.com</strong></span>`;

    panel.appendChild(header);
    panel.appendChild(views);
    panel.appendChild(footer);

    // Assemble DOM
    container.appendChild(overlay);
    container.appendChild(panel);
    container.appendChild(launcher);
    document.body.appendChild(container);

    // Navigation helpers
    function showPanel() {
      overlay.style.display = "block";
      panel.style.display = "block";
      container.style.pointerEvents = "auto";
    }
    function hidePanel() {
      overlay.style.display = "none";
      panel.style.display = "none";
      container.style.pointerEvents = "none";
    }

    function listItem(iconBg, icon, title, subtitle) {
      return `
          <button class="fb-item" data-view="${title}" style="all:unset;display:block;width:100%;">
            <div style="display:flex;align-items:center;gap:14px;padding:16px 14px;border:1px solid #eee;border-radius:14px;">
              <div style="width:38px;height:38px;border-radius:9999px;background:${iconBg};display:flex;align-items:center;justify-content:center;">${icon}</div>
              <div style="flex:1;">
                <div style="font-weight:600;color:#111827;">${title}</div>
                ${
                  subtitle
                    ? `<div style=\"font-size:12px;color:#6b7280;\">${subtitle}</div>`
                    : ""
                }
              </div>
            </div>
          </button>
        `;
    }

    function renderMenu() {
      const functionality = widgetConfig.settings.functionality;
      const content = widgetConfig.settings.content;
    
      views.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:12px;padding:8px 8px 16px 8px;">
          
            ${functionality.surveyEnabled && listItem("#fef3c7", "★", "Share Feedback", "")}
            ${functionality.isReviewsEnabled ? listItem("#dbeafe", "💬", "Leave a Review", ""): ""}
            ${functionality.isBugReportingEnabled ? listItem("#fee2e2", "🧾", "Report an issue", "") : ""}
            ${functionality.isFeatureSuggestionEnabled ? listItem("#dcfce7", "💡", "Request a Feature", "") : ""}
            <div style="border:1px solid #f1f5f9;border-radius:14px;padding:16px 14px;display:flex;align-items:center;gap:14px;">
              <div style="width:38px;height:38px;border-radius:9999px;background:#f3e8ff;display:flex;align-items:center;justify-content:center;">💭</div>
              <div style="flex:1;">
                <div style="font-weight:600;color:#111827;">Live Chat</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;color:#6b7280;font-size:12px;"><span style="width:8px;height:8px;background:#9ca3af;border-radius:9999px;display:inline-block"></span>Offline</div>
            </div>
          </div>
        `;

      // Attach item click handlers (delegated for reliability)
      views.addEventListener("click", function (e) {
        const target = e.target.closest(".fb-item");
        if (!target) return;
        const view = target.getAttribute("data-view");
        if (view === "Share Feedback") return renderFeedbackForm(functionality,content);
        if (view === "Leave a Review") return renderReviewForm();
        if (view === "Report an issue") return renderBugForm();
        if (view === "Request a Feature") return renderFeatureForm();
      });
    }
    function backButton() {
      return `<button type="button" id="fb-back" style="all:unset;cursor:pointer;font-size:18px;">←</button>`;
    }

    function baseForm(innerHtml,type,surveyType = null) {
   
      views.innerHTML = `
          <form id="gvf-form" style="padding:8px 12px 16px 12px;" data-type=${type} ${surveyType ? `data-survey-type = ${surveyType}` : ""}>
           
            ${innerHtml}
            <button type="submit" style="width:100%;margin-top:14px;padding:12px 16px;background:#111827;color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer">${
              content.submitText || "Submit"
            }</button>
          </form>
        `;

          const buttons = document.querySelectorAll('.nps-btn');
    const input = document.getElementById('nps-score');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Reset previous selection
        buttons.forEach(b => b.style.outline = 'none');
        // Highlight selected button
        btn.style.outline = '2px solid black';
        // Update hidden input
        input.value = btn.getAttribute('data-value');
      });
    });

      const form = document.getElementById("gvf-form");
      if (form) form.addEventListener("submit", handleSubmit);
    }

    function renderFeedbackForm(functionality, content) {
      header.firstElementChild.innerHTML = `${backButton()} <span style="margin-left:8px;font-weight:700;">${
        content.question || "How can we help?"
      }</span>`;
      header.querySelector("#fb-back").onclick = () => {
        header.firstElementChild.innerHTML = `${
          content.HeaderTitle || "Feedback"
        }`;
        renderMenu();
      };

      const surveyHtml = buildFormFields(functionality,content);
      const surveyType = functionality?.surveyOptions?.primaryFeedbackType;

      
      baseForm(`
          <input type="hidden" name="type" value="feedback" />
          ${surveyHtml}
          <label style="display:block;margin-bottom:8px;color:#111827;font-weight:600;">${
            content.question || "Tell us more"
          }</label>
          <textarea name="feedback" rows="5" placeholder="Tell us more about your experience (optional)" style="width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:10px;font-family:inherit;"></textarea>
        `, "SURVEY",surveyType);

     
    }

    function renderBugForm() {
      header.firstElementChild.innerHTML = `${backButton()} <span style="margin-left:8px;font-weight:700;">Report an issue</span>`;
      header.querySelector("#fb-back").onclick = () => {
        header.firstElementChild.innerHTML = `${
          content.HeaderTitle || "Feedback"
        }`;
        renderMenu();
      };

      // Build rich bug report form
      views.innerHTML = `
          <form id="gvf-form" style="padding:8px 12px 16px 12px;" data-type="BUGREPORT">
            <input type="hidden" name="type" value="bug" />
            <input type="hidden" id="gvf-screenshot-data" name="screenshotData" />
            <input type="hidden" id="gvf-attachment-data" name="attachmentData" />

            <label style="display:block;margin-bottom:6px;color:#111827;font-weight:700;">Issue Description (Required)</label>
            <textarea required name="bug-description" rows="5" placeholder="Please describe the bug you encountered..." style="width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:10px;font-family:inherit;margin-bottom:14px;"></textarea>

            <div style="font-weight:700;color:#111827;margin-bottom:8px;">Screenshot (Optional, Max 5MB)</div>
            <div style="display:flex;gap:12px;margin-bottom:6px;">
              <button type="button" id="gvf-capture" style="flex:1;border:1px dashed #e5e7eb;border-radius:12px;padding:12px 14px;background:#fff;cursor:pointer;display:flex;align-items:center;gap:10px;justify-content:center;">
                <span>📸</span><span>Capture Screenshot</span>
              </button>
              <button type="button" id="gvf-attach-trigger" style="flex:1;border:1px dashed #e5e7eb;border-radius:12px;padding:12px 14px;background:#fff;cursor:pointer;display:flex;align-items:center;gap:10px;justify-content:center;">
                <span>🖼️</span><span>Attach File</span>
              </button>
              <input id="gvf-attach" type="file" accept="image/*" style="display:none" />
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;font-size:12px;color:#6b7280;">
              <span id="gvf-screenshot-status"></span>
              <span id="gvf-attachment-status"></span>
            </div>

            <div style="display:grid;gap:10px;margin-top:8px;">
              <input name="name" type="text" placeholder="Enter your name (optional)" style="padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
              <input name="email" type="email" placeholder="Enter your email address (optional)" style="padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            </div>

            <button type="submit" style="width:100%;margin-top:16px;padding:12px 16px;background:#6b7280;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer">Submit Bug Report</button>
          </form>
        `;

      const form = document.getElementById("gvf-form");
      if (form) form.addEventListener("submit", handleSubmit);

      // Wire up capture/attach
      const captureBtn = document.getElementById("gvf-capture");
      const attachTrigger = document.getElementById("gvf-attach-trigger");
      const attachInput = document.getElementById("gvf-attach");
      const screenshotStatus = document.getElementById("gvf-screenshot-status");
      const attachmentStatus = document.getElementById("gvf-attachment-status");
      const screenshotHidden = document.getElementById("gvf-screenshot-data");
      const attachmentHidden = document.getElementById("gvf-attachment-data");

      function loadHtml2CanvasIfNeeded() {
        return new Promise((resolve) => {
          if (window.html2canvas) return resolve();
          const s = document.createElement("script");
          s.src =
            "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
          s.onload = () => resolve();
          document.head.appendChild(s);
        });
      }

      if (captureBtn) {
        captureBtn.addEventListener("click", async () => {
          try {
            if (screenshotStatus)
              screenshotStatus.textContent = "Capturing screenshot...";
            await loadHtml2CanvasIfNeeded();
            const canvas = await window.html2canvas(document.body, {
              useCORS: true,
              logging: false,
              scale: 1,
            });
            const dataUrl = canvas.toDataURL("image/png");
            if (screenshotHidden) screenshotHidden.value = dataUrl;
            if (screenshotStatus)
              screenshotStatus.textContent = "Screenshot attached.";
          } catch (e) {
            if (screenshotStatus)
              screenshotStatus.textContent = "Failed to capture screenshot.";
          }
        });
      }

      if (attachTrigger && attachInput) {
        attachTrigger.addEventListener("click", () => attachInput.click());
        attachInput.addEventListener("change", () => {
          const file = attachInput.files && attachInput.files[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) {
            // 5MB
            if (attachmentStatus)
              attachmentStatus.textContent = "File too large (max 5MB).";
            attachInput.value = "";
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            if (attachmentHidden)
              attachmentHidden.value = String(reader.result);
            if (attachmentStatus)
              attachmentStatus.textContent = `Attached: ${file.name}`;
          };
          reader.readAsDataURL(file);
        });
      }
    }

    function renderFeatureForm() {
      header.firstElementChild.innerHTML = `${backButton()} <span style="margin-left:8px;font-weight:700;">Add New Feature Request</span>`;
      header.querySelector("#fb-back").onclick = () => {
        header.firstElementChild.innerHTML = `${
          content.HeaderTitle || "Feedback"
        }`;
        renderMenu();
      };

      // Build feature request form matching the provided layout
      views.innerHTML = `
          <form id="gvf-form" style="padding:8px 12px 16px 12px;" data-type="FEATUREREQUEST">
            <input type="hidden" name="type" value="feature" />

            <div style="font-weight:700;font-size:16px;margin-bottom:12px;">Add New Feature Request</div>

            <label style="display:block;margin-bottom:6px;color:#111827;font-weight:700;">Feature Title</label>
            <input required name="feature-title" type="text" placeholder="Enter a clear, concise title for your feature request" style="width:100%;padding:12px 14px;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:14px;" />

            <label style="display:block;margin-bottom:6px;color:#111827;font-weight:700;">Feature Description</label>
            <textarea required name="feature-description" rows="5" placeholder="Describe the feature you would like to see..." style="width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:10px;font-family:inherit;margin-bottom:14px;"></textarea>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px;">
              <div>
                <div style="font-weight:700;color:#111827;margin-bottom:6px;">Your Name (Optional)</div>
                <input name="name" type="text" placeholder="Enter your name" style="width:100%;padding:12px 14px;border:1px solid #e5e7eb;border-radius:12px;" />
              </div>
              <div>
                <div style="font-weight:700;color:#111827;margin-bottom:6px;">Your Email (Optional)</div>
                <input name="email" type="email" placeholder="Enter your email address" style="width:100%;padding:12px 14px;border:1px solid #e5e7eb;border-radius:12px;" />
              </div>
            </div>

            <div style="margin-top:10px;color:#6b7280;font-size:12px;">We might email you for clarification or updates on your suggestion.</div>

            <button type="submit" style="width:100%;margin-top:16px;padding:12px 16px;background:#6b7280;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer">Submit Feature Request</button>
          </form>
        `;

      const form = document.getElementById("gvf-form");
      if (form) form.addEventListener("submit", handleSubmit);
    }

    function renderReviewForm() {
      header.firstElementChild.innerHTML = `${backButton()} <span style="margin-left:8px;font-weight:700;">Leave a Review</span>`;
      header.querySelector("#fb-back").onclick = () => {
        header.firstElementChild.innerHTML = `${
          content.HeaderTitle || "Feedback"
        }`;
        renderMenu();
      };

      const stars = Array.from({ length: 5 })
        .map(
          (_, i) =>
            `<button type="button" class="fb-star" data-value="${
              i + 1
            }" style="background:none;border:none;font-size:28px;cursor:pointer;color:#e5e7eb">★</button>`
        )
        .join("");

      baseForm(`
          <input type="hidden" name="type" data-type="REVIEW" />
          <input type="hidden" id="fb-rating" name="rating" value="0" />
          <div style="margin-bottom:8px;color:#111827;font-weight:600;">Overall rating</div>
          <div style="display:flex;gap:8px;margin-bottom:12px;">${stars}</div>
          <label style="display:block;margin-bottom:6px;color:#111827;font-weight:600;">Share your experience (Required)</label>
          <textarea name="review" rows="4" required placeholder="Tell us what you think..." style="width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:10px;font-family:inherit;"></textarea>
          <div style="display:grid;gap:10px;margin-top:12px;">
            <input name="email" type="email" required placeholder="your.email@example.com" style="padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            <input name="name" type="text" placeholder="Your name (optional)" style="padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            <input name="social" type="url" placeholder="https://twitter.com/yourusername" style="padding:10px;border:1px solid #e5e7eb;border-radius:12px;" />
            <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#6b7280;">
              <input type="checkbox" name="testimonialConsent" style="width:14px;height:14px" /> I agree that my feedback may be used publicly for marketing or testimonials.
            </label>
          </div>
        `, "REVIEW");

      // wire stars
      views.querySelectorAll(".fb-star").forEach((btn) => {
        btn.addEventListener("click", function () {
          const value = this.getAttribute("data-value");
          views
            .querySelectorAll(".fb-star")
            .forEach((b) => (b.style.color = "#e5e7eb"));
          for (let i = 0; i < Number(value); i++) {
            views.querySelectorAll(".fb-star")[i].style.color = "#f59e0b";
          }
          const rating = document.getElementById("fb-rating");
          if (rating) rating.value = String(value);
        });
      });
    }

    // Show menu initially
    header.firstElementChild.innerHTML = `${content.HeaderTitle || "Feedback"}`;
    renderMenu();

    // Events
    launcher.addEventListener("click", showPanel);
    headerClose.addEventListener("click", hidePanel);
    overlay.addEventListener("click", hidePanel);

    // API helpers
    GetvalidatedfastAPI.open = showPanel;
    GetvalidatedfastAPI.closeWidget = hidePanel;
  }

  // Build form fields based on widget features
  function buildFormFields(functionality, content) {
    let html = "";

    // Survey question
    if (functionality.surveyEnabled && content.question) {
      const surveyType = functionality.surveyOptions?.primaryFeedbackType;

      if (surveyType === "NPS") {
       html += `
  <div style="margin-bottom: 16px;" >
    <label style="display: block; margin-bottom: 8px; font-weight: 500;">
      ${content.question}
    </label>
    <div id="nps-container" style="display: flex; gap: 6px; justify-content: center;">
      ${Array.from({ length: 11 }, (_, i) => {
        let bg, color;
        if (i <= 6) {
          bg = "#fee2e2"; // red-100
          color = "#b91c1c"; // red-700
        } else if (i <= 8) {
          bg = "#fef9c3"; // yellow-100
          color = "#a16207"; // yellow-700
        } else {
          bg = "#dcfce7"; // green-100
          color = "#15803d"; // green-700
        }
        return `
          <button 
            type="button"
            class="nps-btn"
            data-value="${i}"
            style="
              width: 32px;
              height: 32px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #ccc;
              background-color: ${bg};
              color: ${color};
              cursor: pointer;
              transition: all 0.2s ease-in-out;
            "
            onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.15)'"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'"
          >${i}</button>
        `;
      }).join("")}
    </div>
    <input type="hidden" name="npsScore" id="nps-score" />
  </div>`
      } else if (surveyType === "CSAT") {
        html += `
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">${
                content.question
              }</label>
              <div style="display: flex; gap: 8px;">
                ${[1, 2, 3, 4, 5]
                  .map(
                    (i) =>
                      `<button type="button" class="csat-btn" data-value="${i}" style="flex: 1; padding: 8px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">${i}</button>`
                  )
                  .join("")}
              </div>
              <input type="hidden" name="csat-score" id="csat-score" />
            </div>
          `;
      } else {
        html += `
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">${content.question}</label>
              <textarea name="survey-answer" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;" required></textarea>
            </div>
          `;
      }
    }

   

    return html;
  }

  // Setup NPS/CSAT button handlers
  function setupRatingButtons() {
    // NPS buttons
    document.querySelectorAll(".nps-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".nps-btn").forEach((b) => {
          b.style.background = "white";
          b.style.borderColor = "#ddd";
        });
        this.style.background = "#10b981";
        this.style.borderColor = "#10b981";
        this.style.color = "white";
        document.getElementById("nps-score").value = this.dataset.value;
      });
    });

    // CSAT buttons
    document.querySelectorAll(".csat-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".csat-btn").forEach((b) => {
          b.style.background = "white";
          b.style.borderColor = "#ddd";
        });
        this.style.background = "#10b981";
        this.style.borderColor = "#10b981";
        this.style.color = "white";
        document.getElementById("csat-score").value = this.dataset.value;
      });
    });
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const content = {};

    // Collect all form data
    for (let [key, value] of formData.entries()) {
      content[key] = value;
    }

    // Add user data if identified
    if (userData) {
      content.userId = userData.userId;
      if (userData.name) content.userName = userData.name;
      if (userData.email) content.userEmail = userData.email;
    }

    // Add metadata
    const metadata = {
      browser: navigator.userAgent.split(" ")[0],
      os: navigator.platform,
      device: /Mobile/.test(navigator.userAgent)
        ? "mobile"
        : /Tablet/.test(navigator.userAgent)
        ? "tablet"
        : "desktop",
      language: language,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    const form  = document.querySelector("#gvf-form")
    const submissionType = form.dataset.type
    const surveyType = submissionType == "SURVEY" ? form.dataset.surveyType : null;

    console.log("d1" + submissionType)

    try {
      const response = await fetch(`${API_BASE}/api/widget/${clientKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          submissionType,
          surveyType,
          ...metadata,
        }),
      });

      console.log(submissionType)

      if (response.ok) {
        showThankYouMessage();
      } else {
        const error = await response.json();
        console.error("Failed to submit feedback:", error);
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  }

  // Show thank you message
  function showThankYouMessage() {
    const widget = document.getElementById("getvalidatedfast-widget-container");
    if (!widget || !widgetConfig) return;

    const content = widgetConfig.settings.content;
    widget.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">${
            content.ThanksTitle || "Thank You!"
          }</h3>
          <p style="margin: 0; color: #666; line-height: 1.5;">${
            content.ThanksMessage || "We appreciate your feedback."
          }</p>
            <button onclick="window.getvalidatedfast.closeWidget()" style="margin-top: 16px; padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Close
          </button>
        </div>
      `;
  }

  // Setup rating buttons after DOM is ready
  setTimeout(() => {
    setupRatingButtons();
  }, 100);

  // Load config when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadWidgetConfig);
  } else {
    loadWidgetConfig();
  }
})();
