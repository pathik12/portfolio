/**
 * Pathik Lakkad — Portfolio Single-Page Application Scripts
 * Capabilities: Intersection reveals, 3D tilt mockups, active nav tracking,
 * magnetic cursor, continuous marquee, and asynchronous brief submission.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Scroll-triggered Reveal Animations
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute("data-delay");
            if (delay) {
              el.style.transitionDelay = `${delay}ms`;
            }
            el.classList.add("is-revealed");
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-revealed"));
  }

  // 2. Top Bar Scroll State & Active Section Tracking
  const topBar = document.querySelector(".top-bar");
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const handleScroll = () => {
    if (window.scrollY > 16) {
      topBar.classList.add("scrolled");
    } else {
      topBar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
                link.setAttribute("aria-current", "location");
              } else {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
              }
            });
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // 3. Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuToggleText = document.querySelector(".menu-toggle-text");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  let isMenuOpen = false;

  const toggleMenu = (open) => {
    isMenuOpen = typeof open === "boolean" ? open : !isMenuOpen;
    if (isMenuOpen) {
      mobileMenu.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
      if (menuToggleText) menuToggleText.textContent = "Close";
      document.body.style.overflow = "hidden";
    } else {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      if (menuToggleText) menuToggleText.textContent = "Menu";
      document.body.style.overflow = "";
    }
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => toggleMenu());
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => toggleMenu(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        toggleMenu(false);
      }
    });
  }

  // 4. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        history.pushState(null, null, targetId);
      }
    });
  });

  // 5. Interactive 3D Mockup Parallax & Tilt Effect
  const mockupContainers = document.querySelectorAll(".mockup-container");
  mockupContainers.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });

  // 6. Rotating Stamp Speed Up on Hover
  const stamps = document.querySelectorAll(".rotating-stamp svg");
  stamps.forEach((stamp) => {
    stamp.addEventListener("mouseenter", () => {
      stamp.style.animationDuration = "6s";
    });
    stamp.addEventListener("mouseleave", () => {
      stamp.style.animationDuration = "28s";
    });
  });

  // 7. Interactive Magnetic Cursor (for desktop fine pointer)
  if (window.matchMedia("(pointer: fine)").matches) {
    const dot = document.createElement("div");
    dot.className = "custom-cursor-dot";
    const ring = document.createElement("div");
    ring.className = "custom-cursor-ring";

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      // Check if mouse is currently over a dark background element
      const targetUnderCursor = document.elementFromPoint(mouseX, mouseY);
      if (
        targetUnderCursor &&
        targetUnderCursor.closest(
          ".on-ink, .site-footer, .contact-section, .booking-mockup-inner, .cta-btn-ink, .blocks-palette"
        )
      ) {
        document.body.classList.add("on-dark-bg");
      } else {
        document.body.classList.remove("on-dark-bg");
      }
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const hoverTargets = document.querySelectorAll(
      "a, button, input, select, textarea, .capability-row, .process-step, .meta-tag-item, .spec-plate, .case-study-link, .back-to-top-link"
    );

    hoverTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      });
      target.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
      });
    });
  }

  // 8. Contact Brief Form Submission — Compose Email
  const briefForm = document.getElementById("brief-form");
  const formNote = document.getElementById("form-note");

  if (briefForm) {
    briefForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const formData = new FormData(briefForm);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const type = (formData.get("type") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      if (!name || !message) {
        if (formNote) {
          formNote.innerHTML = '<span style="color: #F87171;">PLEASE ENTER YOUR NAME AND MESSAGE.</span>';
        }
        return;
      }

      const subject = `Project enquiry${type ? ` — ${type}` : ""}`;
      const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
      const mailtoUrl = `mailto:pathik642@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Open user's default email client with formatted brief
      window.location.href = mailtoUrl;

      if (formNote) {
        formNote.textContent = "YOUR EMAIL APP SHOULD NOW BE OPEN.";
        formNote.style.color = "var(--color-chartreuse)";
      }
    });
  }

  // 9. Stats Counter Animation on Viewport Entry
  const statNumbers = document.querySelectorAll(".stat-counter");
  if ("IntersectionObserver" in window && statNumbers.length > 0) {
    const statObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const endVal = parseInt(target.getAttribute("data-target"), 10);
            const prefix = target.getAttribute("data-prefix") || "";
            const suffix = target.getAttribute("data-suffix") || "";
            const duration = 1500;
            const startTime = performance.now();

            const countStep = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutExpo formula
              const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const currentVal = Math.floor(easeProgress * endVal);
              target.textContent = `${prefix}${currentVal}${suffix}`;
              if (progress < 1) {
                requestAnimationFrame(countStep);
              } else {
                target.textContent = `${prefix}${endVal}${suffix}`;
              }
            };
            requestAnimationFrame(countStep);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((stat) => statObserver.observe(stat));
  }
});
