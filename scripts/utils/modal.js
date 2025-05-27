// Import du Factory des médias
import { MediaElementFactory } from "../pages/photographer.js";

// Variable pour la navigation au clavier entre les photos
let handleKeyboardNavigation = null;

// Variable pour la touche escape
let handleEscapeKey = null;

export function displayModal(name, photographer, sortedMedias, index) {
  // Gestionnaire de la touche escape
  handleEscapeKey = (e) => {
    if (e.key === "Escape") {
      closeModal(name);
    }
  };
  document.addEventListener("keydown", handleEscapeKey);

  if (name === "media") {
    const modal = document.getElementById("media_modal");
    modal.style.display = "flex";
    modal.style.position = "fixed";

    // Récupération des boutons de la modal
    const closeButton = modal.querySelector(".media-modal-close");
    const leftArrow = modal.querySelector(".modal-arrow-left");
    const rightArrow = modal.querySelector(".modal-arrow-right");

    const focusableElements = [];

    if (closeButton) {
      closeButton.setAttribute("tabindex", "0");
      focusableElements.push(closeButton);
      // Ajout de l'événement pour la touche entrée sur le bouton de fermeture
      closeButton.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          closeModal("media");
        }
      });
    }

    if (leftArrow) {
      leftArrow.setAttribute("tabindex", "0");
      focusableElements.push(leftArrow);
    }

    if (rightArrow) {
      rightArrow.setAttribute("tabindex", "0");
      focusableElements.push(rightArrow);
    }

    if (focusableElements.length > 0) {
      modal.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            // Si shift + tab et sur le premier élément, focus sur le dernier
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Si tab et sur le dernier élément, focus sur le premier
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });

      // Focus initial sur la flèche gauche
      if (leftArrow) {
        leftArrow.focus();
      }
    }

    // Stockage de l'index de la photo pour la navigation
    modal.dataset.currentIndex = index;

    // Initialisation du contenu de la modal
    updateModalContent(photographer, sortedMedias, index);

    // Navigation vers la photo précédente
    function prevMedia() {
      let newIndex = parseInt(modal.dataset.currentIndex) - 1;
      if (newIndex < 0) {
        newIndex = sortedMedias.length - 1;
      }
      modal.dataset.currentIndex = newIndex;
      updateModalContent(photographer, sortedMedias, newIndex);
    }

    // Navigation vers la photo suivante
    function nextMedia() {
      let newIndex = parseInt(modal.dataset.currentIndex) + 1;
      if (newIndex >= sortedMedias.length) {
        newIndex = 0;
      }
      modal.dataset.currentIndex = newIndex;
      updateModalContent(photographer, sortedMedias, newIndex);
    }

    // Événements pour les flèches
    if (leftArrow) {
      leftArrow.addEventListener("click", () => {
        prevMedia();
      });
      leftArrow.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          prevMedia();
        }
      });
    }

    if (rightArrow) {
      rightArrow.addEventListener("click", () => {
        nextMedia();
      });
      rightArrow.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          nextMedia();
        }
      });
    }

    // Gestionnaire des touches fléchées du clavier
    handleKeyboardNavigation = (e) => {
      if (e.key === "ArrowLeft") {
        prevMedia();
      } else if (e.key === "ArrowRight") {
        nextMedia();
      }
    };

    document.addEventListener("keydown", handleKeyboardNavigation);
  } else if (name === "contact") {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "flex";

    // Récupération des éléments focusables de la modal contact
    const closeButton = modal.querySelector(".contact-modal-close");
    const firstNameInput = modal.querySelector(
      'input[type="text"]:first-of-type'
    );
    const lastNameInput = modal.querySelector(
      'input[type="text"]:last-of-type'
    );
    const emailInput = modal.querySelector('input[type="email"]');
    const messageInput = modal.querySelector("textarea");
    const submitButton = modal.querySelector("button[type='submit']");

    const focusableElements = [];

    // Ajout du tabindex aux éléments
    if (closeButton) {
      closeButton.setAttribute("tabindex", "0");
      focusableElements.push(closeButton);
      closeButton.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          closeModal("contact");
        }
      });
    }

    if (firstNameInput) {
      firstNameInput.setAttribute("tabindex", "0");
      focusableElements.push(firstNameInput);
    }

    if (lastNameInput) {
      lastNameInput.setAttribute("tabindex", "0");
      focusableElements.push(lastNameInput);
    }

    if (emailInput) {
      emailInput.setAttribute("tabindex", "0");
      focusableElements.push(emailInput);
    }

    if (messageInput) {
      messageInput.setAttribute("tabindex", "0");
      focusableElements.push(messageInput);
    }

    if (submitButton) {
      submitButton.setAttribute("tabindex", "0");
      focusableElements.push(submitButton);
    }

    // Gestion de la boucle de tabulation
    if (focusableElements.length > 0) {
      modal.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            // Si shift + tab et sur le premier élément, focus sur le dernier
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Si tab et sur le dernier élément, focus sur le premier
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });

      // Focus initial sur le premier champ
      if (firstNameInput) {
        firstNameInput.focus();
      }
    }

    // Gestionnaire du formulaire
    const contactForm = document.querySelector(".contact-modal-form");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        firstName: e.target.querySelectorAll('input[type="text"]')[0].value,
        lastName: e.target.querySelectorAll('input[type="text"]')[1].value,
        email: e.target.querySelector('input[type="email"]').value,
        message: e.target.querySelector("textarea").value,
      };

      console.log("Form submitted:", formData);
      contactForm.reset();
      closeModal("contact");
    });
  }
}

// Mise à jour du contenu de la modal
function updateModalContent(photographer, sortedMedias, index) {
  const mediaModalContainer = document.querySelector(".media-modal-container");
  mediaModalContainer.innerHTML = "";

  const mediaModalTitle = document.createElement("p");
  mediaModalTitle.classList.add("media-modal-title");
  mediaModalTitle.textContent = sortedMedias[index].title;

  const photographerFolder = photographer.name.split(" ")[0].replace("-", " ");

  // Création de l'élément média avec la factory
  const mediaElement = MediaElementFactory.createMediaElement(
    photographerFolder,
    photographer,
    sortedMedias,
    index
  );

  // Ajout des classes et attributs spécifiques à la modal
  mediaElement.classList.add("media-modal-content");
  if (mediaElement instanceof HTMLVideoElement) {
    mediaElement.controls = true;
    mediaElement.autoplay = true;
  }

  mediaModalContainer.appendChild(mediaElement);
  mediaModalContainer.appendChild(mediaModalTitle);
}

// Fermeture de la modal
export function closeModal(name) {
  const modal = document.getElementById(`${name}_modal`);
  modal.style.display = "none";

  if (name === "media") {
    // Nettoyage des éléments de la modal média
    const closeButton = modal.querySelector(".media-modal-close");
    const leftArrow = modal.querySelector(".modal-arrow-left");
    const rightArrow = modal.querySelector(".modal-arrow-right");

    if (closeButton) closeButton.removeAttribute("tabindex");
    if (leftArrow) leftArrow.removeAttribute("tabindex");
    if (rightArrow) rightArrow.removeAttribute("tabindex");
  } else if (name === "contact") {
    // Nettoyage des éléments de la modal contact
    const closeButton = modal.querySelector(".contact-modal-close");
    const firstNameInput = modal.querySelector(
      'input[type="text"]:first-of-type'
    );
    const lastNameInput = modal.querySelector(
      'input[type="text"]:last-of-type'
    );
    const emailInput = modal.querySelector('input[type="email"]');
    const messageInput = modal.querySelector("textarea");
    const submitButton = modal.querySelector("button[type='submit']");

    if (closeButton) closeButton.removeAttribute("tabindex");
    if (firstNameInput) firstNameInput.removeAttribute("tabindex");
    if (lastNameInput) lastNameInput.removeAttribute("tabindex");
    if (emailInput) emailInput.removeAttribute("tabindex");
    if (messageInput) messageInput.removeAttribute("tabindex");
    if (submitButton) submitButton.removeAttribute("tabindex");
  }

  // Suppression de l'événement escape
  if (handleEscapeKey) {
    document.removeEventListener("keydown", handleEscapeKey);
    handleEscapeKey = null;
  }

  // Suppression de l'index de la modal
  if (name === "media") {
    delete modal.dataset.currentIndex;
  }

  // Suppression des événements de navigation
  if (handleKeyboardNavigation) {
    document.removeEventListener("keydown", handleKeyboardNavigation);
    handleKeyboardNavigation = null;
  }
}
