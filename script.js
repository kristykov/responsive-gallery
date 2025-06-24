const galleryItems = [
  {
    id: 1,
    imageUrl: "assets/media1.png",
    alt: "Featured gallery image",
  },
  {
    id: 2,
    imageUrl: "assets/media2.png",
    alt: "Gallery image 2",
  },
  {
    id: 3,
    imageUrl: "assets/media3.png",
    alt: "Gallery image 3",
  },
  {
    id: 4,
    imageUrl: "assets/media4.png",
    videoId: "x6iyz1AQhuU",
    alt: "Gallery image 4",
  },
  {
    id: 5,
    imageUrl: "assets/media5.png",
    alt: "Gallery image 5",
  },
];

const descriptionText = `
Lorem <em>ipsum</em> dolor sit amet,
<strong>consectetur</strong> adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad
<a href="/link" class="action-link">minim</a>
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
ea commodo consequat.
`;

class Gallery {
  constructor(galleryItems, descriptionText) {
    this.gallery = document.querySelector(".gallery__grid");
    this.modal = document.querySelector(".modal");
    this.modalContent = document.querySelector(".modal__video-container");
    this.closeButton = document.querySelector(".modal__close");
    this.modalOverlay = document.querySelector(".modal__overlay");
    this.modalDescription = document.getElementById(
      "modal-description-container"
    );
    this.galleryDescription = document.getElementById(
      "gallery-description-container"
    );

    this.galleryItems = galleryItems;
    this.descriptionText = descriptionText;
    this.modifiers = {
      1: "large-left",
      2: "large-middle",
      3: "bottom-wide",
      4: "column3-top",
      5: "column3-bottom",
    };

    this.focusableElementsString =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;

    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);

    this.init();
  }

  init() {
    this.generateGalleryItems(this.galleryItems);
    this.createDescription("gallery");
    this.createDescription("modal");

    this.addEventListeners();
  }

  generateGalleryItems(items) {
    const column3 = document.createElement("div");
    column3.classList.add("gallery__grid--column-3");

    items.forEach((item) => {
      const galleryItem = document.createElement("a");
      galleryItem.classList.add("gallery__item");

      galleryItem.setAttribute("aria-label", `Open Link ${item.id}`);
      galleryItem.setAttribute("tabindex", "0");

      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.alt;
      img.classList.add("gallery__image");
      img.loading = "lazy";

      const modifier = this.modifiers[item.id];
      if (modifier) {
        galleryItem.classList.add(`gallery__item--${modifier}`);
      }

      galleryItem.appendChild(img);

      if (item.videoId) {
        galleryItem.dataset.videoId = item.videoId;

        const wrapper = document.createElement("div");
        wrapper.classList.add("gallery__item--wrapper");

        const overlay = document.createElement("div");
        overlay.classList.add("gallery__overlay");

        const button = document.createElement("button");
        button.classList.add("gallery__play-btn");
        button.setAttribute("aria-label", `Play video ${item.id}`);

        button.innerHTML = `
      <svg class="gallery__play-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="24" fill="currentColor"/>
        <path class="gallery__play-icon-path" d="M20.4219 13.8281C19.7281 13.4016 18.8563 13.3875 18.1484 13.786C17.4406 14.1844 17 14.9344 17 15.75V32.25C17 33.0656 17.4406 33.8156 18.1484 34.2141C18.8563 34.6125 19.7281 34.5938 20.4219 34.1719L33.9219 25.9219C34.5922 25.5141 35 24.7875 35 24C35 23.2125 34.5922 22.4906 33.9219 22.0781L20.4219 13.8281Z" fill="currentColor"/>
      </svg>
    `;

        wrapper.appendChild(overlay);
        wrapper.appendChild(button);
        galleryItem.appendChild(wrapper);
      }

      // if (modifier.startsWith("column3-")) {
      //   column3.appendChild(galleryItem);
      // } else {
      this.gallery.appendChild(galleryItem);
      // }
    });
    this.gallery.appendChild(column3);
  }

  createDescription(block) {
    const paragraph = document.createElement("p");
    paragraph.classList.add(`${block}__description`);

    paragraph.innerHTML = this.descriptionText;

    if (block == "modal") {
      this.modalDescription.appendChild(paragraph);
    } else {
      this.galleryDescription.appendChild(paragraph);
    }
  }

  addEventListeners() {
    this.gallery.addEventListener("click", (e) => {
      const galleryItem = e.target.closest(".gallery__item");
      if (galleryItem) {
        this.openModal(galleryItem.dataset.videoId);
      }
    });

    this.closeButton.addEventListener("click", this.closeModal);
    this.modalOverlay.addEventListener("click", this.closeModal);

    document.addEventListener("keydown", this.handleKeyboard);

    this.gallery.addEventListener("keydown", (e) => {
      const galleryItem = e.target.closest(".gallery__item");
      if (galleryItem && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        this.openModal(galleryItem.dataset.videoId);
      }
    });
  }

  openModal(videoId) {
    if (!videoId) return;

    const iframe = document.createElement("iframe");
    iframe.setAttribute(
      "src",
      `https://www.youtube.com/embed/${videoId}?autoplay=1`
    );
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    );
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("title", "YouTube video player");

    this.modalContent.innerHTML = "";
    this.modalContent.appendChild(iframe);

    this.modal.classList.add("modal--active");
    this.modal.setAttribute("aria-hidden", "false");
    this.closeButton.focus();

    document.body.style.overflow = "hidden";
    this.trapFocus();
  }

  closeModal() {
    this.modal.classList.remove("modal--active");
    this.modal.setAttribute("aria-hidden", "true");
    this.modalContent.innerHTML = "";
    document.body.style.overflow = "";
  }

  handleKeyboard(e) {
    if (e.key === "Escape" && this.modal.classList.contains("modal--active")) {
      this.closeModal();
    }
    if (e.key === "Tab" && this.modal.classList.contains("modal--active")) {
      if (e.shiftKey) {
        if (document.activeElement === this.firstFocusableElement) {
          e.preventDefault();
          this.lastFocusableElement.focus();
        }
      } else {
        if (document.activeElement === this.lastFocusableElement) {
          e.preventDefault();
          this.firstFocusableElement.focus();
        }
      }
    }
  }
  trapFocus() {
    const focusableElements = this.modal.querySelectorAll(
      this.focusableElementsString
    );
    this.firstFocusableElement = focusableElements[0];
    this.lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Gallery(galleryItems, descriptionText);
});
