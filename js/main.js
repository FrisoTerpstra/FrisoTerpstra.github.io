"use strict";

// Shared enhancements; the page content and links also work without JavaScript.
document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {
  menuToggle.hidden = false;
  siteNav.dataset.enhanced = "true";

  function closeMenu(returnFocus = false) {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.dataset.open = "false";
    if (returnFocus) menuToggle.focus();
  }

  menuToggle.addEventListener("click", () => {
    const opening = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(opening));
    siteNav.dataset.open = String(opening);
  });
  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  window.matchMedia("(max-width: 560px)").addEventListener("change", () => closeMenu());
}
