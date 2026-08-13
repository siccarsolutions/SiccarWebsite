/* ==========================================================================
   Siccar — vanilla JS
   - Mobile nav toggle (hamburger)
   - Header shadow on scroll
   Written to fail quietly if the elements aren't present on a page.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Mobile nav toggle ------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");

  if (toggle && nav) {
    var closeNav = function () {
      nav.setAttribute("data-open", "false");
      toggle.setAttribute("aria-expanded", "false");
    };

    var openNav = function () {
      nav.setAttribute("data-open", "true");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close the menu when a link is tapped (mobile).
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeNav();
      }
    });

    // Close on Escape and return focus to the toggle.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNav();
        toggle.focus();
      }
    });

    // Reset state if the viewport grows past the mobile breakpoint.
    var desktopQuery = window.matchMedia("(min-width: 800px)");
    var handleBreakpoint = function (event) {
      if (event.matches) {
        closeNav();
      }
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", handleBreakpoint);
    } else if (desktopQuery.addListener) {
      // Older Safari
      desktopQuery.addListener(handleBreakpoint);
    }
  }

  /* ---- Header shadow on scroll ------------------------------------------ */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 4) {
        header.classList.add("site-header--scrolled");
      } else {
        header.classList.remove("site-header--scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Contact form → Formspree (AJAX, in-page states) ------------------ */
  var form = document.getElementById("contact-form");
  if (form) {
    var statusEl = document.getElementById("form-status");
    var successEl = document.getElementById("form-success");
    var submitBtn = form.querySelector('[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : "Send message";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var showError = function (detail) {
      statusEl.innerHTML =
        (detail ? detail + " " : "We couldn't send your message just now. ") +
        'Please email <a href="mailto:smita@siccarsolutions.com">smita@siccarsolutions.com</a> ' +
        'or call <a href="tel:+15109609100">510-960-9100</a> and we\'ll pick it up directly.';
      statusEl.hidden = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }
      statusEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Native constraint validation, surfaced without leaving the page.
      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        return;
      }

      statusEl.hidden = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            form.hidden = true;
            successEl.hidden = false;
            successEl.focus();
            successEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
            return;
          }
          // Surface Formspree's validation messages when it returns them.
          return response.json().then(
            function (data) {
              var msg =
                data && data.errors && data.errors.length
                  ? data.errors
                      .map(function (e) { return e.message; })
                      .join(" ")
                  : null;
              showError(msg);
            },
            function () { showError(); }
          );
        })
        .catch(function () {
          // Network failure, offline, or the endpoint isn't configured yet.
          showError();
        });
    });
  }
})();
