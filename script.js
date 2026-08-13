// Pure JavaScript interactions — no framework required.

const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links a:not(.nav-cta)");
const sections = document.querySelectorAll("main section[id]");
const cursor = document.querySelector(".cursor-glow");

menuButton.addEventListener("click", () => nav.classList.toggle("open"));

navLinks.forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

window.addEventListener("scroll", () => {
  let current = "home";
  const scrollPosition = window.scrollY + 180;

  sections.forEach(section => {
    if (section.offsetTop <= scrollPosition) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

window.addEventListener("mousemove", e => {
  if (cursor) {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  }
});

// Scroll reveal animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// 3D tilt effect for cards
document.querySelectorAll(".project-card, .value-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    if (window.innerWidth < 800) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const intensity = card.classList.contains("project-card") ? 8 : 6;
    card.style.transform =
      `perspective(800px) rotateX(${y * -intensity}deg) rotateY(${x * intensity}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Small magnetic effect for buttons
document.querySelectorAll(".btn, .nav-cta, .mini-btn, .contact-actions a").forEach(button => {
  button.addEventListener("mousemove", e => {
    if (window.innerWidth < 800) return;
    const rect = button.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.08;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.08;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

// Prevent placeholder project links from jumping to the top.
document.querySelectorAll(".project-links a").forEach(link => {
  link.addEventListener("click", e => {
    if (link.getAttribute("href") === "#") e.preventDefault();
  });
});

// Formspree submit feedback
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", () => {
    const button = contactForm.querySelector(".submit-btn");
    if (button) {
      button.disabled = true;
      button.innerHTML = "Sending... <span>⏳</span>";
    }
  });
}


// View More controls for projects and certifications.
// The button appears automatically only when a section has more than 3 items.
document.querySelectorAll(".view-more-btn").forEach(button => {
  const target = document.getElementById(button.dataset.target);
  if (!target) return;

  const items = target.children;
  if (items.length <= 3) return;

  button.style.display = "inline-flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";

  button.addEventListener("click", () => {
    const expanded = target.classList.toggle("collection-expanded");
    button.classList.toggle("expanded", expanded);
    button.setAttribute("aria-expanded", String(expanded));
    button.innerHTML = expanded
      ? `Show Less <span>↑</span>`
      : `View More ${button.dataset.target === "projectGrid" ? "Projects" : "Certifications"} <span>↓</span>`;
  });
});
