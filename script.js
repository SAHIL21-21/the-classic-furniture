const storeName = "The Classic Furniture Mall";
const whatsappNumber = "918729000378";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isPublicPage() {
  return window.location.protocol === "http:" || window.location.protocol === "https:";
}

function getProductUrl(product) {
  if (!isPublicPage()) return "";
  return new URL(`#${slugify(product.name)}`, window.location.href).href;
}

function getProductImageUrl(product) {
  if (!isPublicPage()) return "";
  return new URL(product.image, window.location.href).href;
}

function buildWhatsAppUrl(product) {
  const lines = [
    `Hi ${storeName}, I am interested in this product.`,
    "",
    `Product Name: ${product.name}`,
    `Category: ${product.category}`,
    `Description: ${product.description}`,
    `Product URL: ${getProductUrl(product) || "Publish the website online to enable a direct product link"}`,
    "",
    "Please share the price, available sizes, colours, and delivery details."
  ];
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function getCards() {
  return Array.from(document.querySelectorAll(".product-card"));
}

function setupWhatsAppLinks() {
  getCards().forEach((card) => {
    const buyLink = card.querySelector(".buy-now-link");
    const product = {
      name: card.dataset.name,
      category: card.dataset.category,
      description: card.dataset.description,
      image: card.dataset.image
    };
    if (buyLink) {
      buyLink.href = buildWhatsAppUrl(product);
    }
  });
}

function setupGlobalWhatsAppLinks() {
  const text = encodeURIComponent(
    `Hi ${storeName}, I want to know more about your furniture collection.`
  );
  const link = `https://wa.me/${whatsappNumber}?text=${text}`;
  const ids = [
    "header-whatsapp",
    "hero-whatsapp",
    "hero-whatsapp2",
    "visit-whatsapp",
    "visit-whatsapp2",
    "footer-whatsapp"
  ];
  ids.forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.href = link;
  });
}

function setupImageModal() {
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const closeButton = document.getElementById("modal-close");

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openModal(card) {
    modalImage.src = card.dataset.image;
    modalImage.alt = card.dataset.name;
    modalTitle.textContent = card.dataset.name;
    modalDescription.textContent = card.dataset.description;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".view-image-button");
    if (button) {
      const card = button.closest(".product-card");
      if (card) openModal(card);
      return;
    }
    if (event.target.closest("[data-modal-close='true']")) {
      closeModal();
    }
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function setupTopbarBehavior() {
  const topbar = document.querySelector(".topbar");
  let lastY = window.scrollY;
  let ticking = false;

  function updateTopbar() {
    const currentY = window.scrollY;
    const delta = currentY - lastY;

    if (currentY <= 24) {
      topbar.classList.remove("is-hidden", "is-compact");
      lastY = currentY;
      return;
    }

    if (delta > 8) {
      topbar.classList.remove("is-hidden");
      topbar.classList.add("is-compact");
    } else if (delta < -8) {
      topbar.classList.add("is-hidden");
    }

    lastY = currentY;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateTopbar();
        ticking = false;
      });
    },
    { passive: true }
  );
}

setupWhatsAppLinks();
setupGlobalWhatsAppLinks();
setupImageModal();
setupTopbarBehavior();
