"use strict";

(() => {
  const dialog = document.querySelector("#lightbox");
  const photos = Array.from(document.querySelectorAll("[data-gallery]"));
  if (!dialog || !photos.length || typeof dialog.showModal !== "function") return;

  const image = document.querySelector("#lightbox-image");
  const counter = document.querySelector("#lightbox-counter");
  let activeIndex = 0;
  let opener = null;
  let touchStart = null;

  function showPhoto(index) {
    activeIndex = (index + photos.length) % photos.length;
    image.src = photos[activeIndex].href;
    image.alt = photos[activeIndex].querySelector("img").alt;
    counter.textContent = `Nino · Photo ${activeIndex + 1} of ${photos.length}`;
  }

  photos.forEach((photo, index) => {
    photo.setAttribute("aria-haspopup", "dialog");
    photo.addEventListener("click", (event) => {
      // Preserve the browser's normal open-in-new-tab behavior.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = photo;
      showPhoto(index);
      dialog.showModal();
    });
  });

  document.querySelector("#previous-photo").addEventListener("click", () => showPhoto(activeIndex - 1));
  document.querySelector("#next-photo").addEventListener("click", () => showPhoto(activeIndex + 1));
  dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener("close", () => {
    touchStart = null;
    opener?.focus({ preventScroll: true });
  });
  image.addEventListener("touchstart", (event) => {
    touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  image.addEventListener("touchend", (event) => {
    if (!touchStart || !event.changedTouches.length) return;
    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      showPhoto(activeIndex + (deltaX < 0 ? 1 : -1));
    }
    touchStart = null;
  }, { passive: true });
  image.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
})();
