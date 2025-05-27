// Importation des fonctions
import { getPhotographerMedias, getPhotographers } from "../Api/api.js";
import { closeModal, displayModal } from "../utils/modal.js";

// Map pour stocker les likes des médias
let mediaLikesState = new Map();

// Media Element Factory
export const MediaElementFactory = {
  createVideo: (
    photographerFolder,
    mediaUrl,
    title,
    photographer,
    sortedMedias,
    index
  ) => {
    const video = document.createElement("video");
    video.setAttribute("role", "button");
    video.setAttribute("tabindex", "0");
    video.addEventListener("click", () =>
      displayModal("media", photographer, sortedMedias, index)
    );
    video.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        displayModal("media", photographer, sortedMedias, index);
      }
    });
    video.classList.add("photographer-gallery-image-video");
    video.src = `assets/photographers/${photographerFolder}/${mediaUrl}`;
    video.title = title;
    video.setAttribute("aria-label", title);
    return video;
  },

  createImage: (
    photographerFolder,
    mediaUrl,
    title,
    photographer,
    sortedMedias,
    index
  ) => {
    const image = document.createElement("img");
    image.classList.add("photographer-gallery-image-img");
    image.src = `assets/photographers/${photographerFolder}/${mediaUrl}`;
    image.alt = title;
    image.setAttribute("aria-label", title);
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.addEventListener("click", () =>
      displayModal("media", photographer, sortedMedias, index)
    );
    image.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        displayModal("media", photographer, sortedMedias, index);
      }
    });
    return image;
  },

  createMediaElement: function (
    photographerFolder,
    photographer,
    sortedMedias,
    index
  ) {
    const media = sortedMedias[index];
    const mediaUrl = media.image || media.video;
    const isVideo = mediaUrl && mediaUrl.toLowerCase().endsWith(".mp4");
    const title = media.title;

    if (!mediaUrl) {
      console.error("No media found", media);
      return null;
    }

    return isVideo
      ? this.createVideo(
          photographerFolder,
          mediaUrl,
          title,
          photographer,
          sortedMedias,
          index
        )
      : this.createImage(
          photographerFolder,
          mediaUrl,
          title,
          photographer,
          sortedMedias,
          index
        );
  },
};

// Fonction pour mettre à jour le nombre de likes d'un média
function updateMediaLikes(mediaId, defaultLikes, increment = 1) {
  const currentLikes = mediaLikesState.get(mediaId) ?? defaultLikes;
  const newLikes = currentLikes + increment;
  mediaLikesState.set(mediaId, newLikes);
  return newLikes;
}

// Fonction pour obtenir le nombre de likes d'un média
function getMediaLikes(mediaId, defaultLikes) {
  return mediaLikesState.get(mediaId) ?? defaultLikes;
}

// Fonction pour calculer le nombre total de likes
function getTotalLikes(medias) {
  return medias.reduce((acc, media) => {
    const likes = getMediaLikes(media.id, media.likes);
    return acc + likes;
  }, 0);
}

// Fonction pour obtenir l'ID du photographe depuis l'URL
const getPhotographerID = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

// Fonction pour obtenir les informations du photographe actuel
const currentPhotographer = async () => {
  const photographers = await getPhotographers();
  const photographerID = getPhotographerID();
  const photographer = photographers.find(
    (photographer) => photographer.id === parseInt(photographerID)
  );
  return photographer;
};

// Fonction pour créer un élément de média
function createMediaElement(
  photographerFolder,
  photographer,
  sortedMedias,
  index
) {
  return MediaElementFactory.createMediaElement.call(
    MediaElementFactory,
    photographerFolder,
    photographer,
    sortedMedias,
    index
  );
}

// Fonction pour rendre la carte du photographe
export function renderPhotographerCard(data) {
  const { name, portrait, city, country, tagline, price, id } = data;
  const picture = `assets/photographers/${portrait}`;

  const article = document.querySelector(".photographer-section-card");
  const isFirstCard =
    document.querySelector(".photographer-card-name").textContent === "";

  const newArticle = article.cloneNode(true);
  const link = newArticle.querySelector(".photographer-card-link");
  const img = newArticle.querySelector(".photographer-card-img");
  const h2 = newArticle.querySelector(".photographer-card-name");
  const description = newArticle.querySelector(
    ".photographer-card-description"
  );
  const [location, tag, tjm] = description.querySelectorAll("p");

  // Configuration des attributs de la carte
  link.setAttribute("href", `photographer.html?id=${id}`);
  link.setAttribute("aria-label", name);
  img.setAttribute("src", picture);
  img.setAttribute("alt", name);
  h2.textContent = name;
  location.textContent = city + ", " + country;
  tag.textContent = tagline;
  tjm.textContent = price + "€/jour";

  if (isFirstCard) {
    // Mise à jour de la première carte existante
    const existingImg = article.querySelector(".photographer-card-img");
    const existingH2 = article.querySelector(".photographer-card-name");
    const existingDescription = article.querySelector(
      ".photographer-card-description"
    );
    const [existingLocation, existingTag, existingTjm] =
      existingDescription.querySelectorAll("p");
    const existingLink = article.querySelector(".photographer-card-link");

    existingLink.setAttribute("href", `photographer.html?id=${id}`);
    existingLink.setAttribute("aria-label", name);
    existingImg.setAttribute("src", picture);
    existingImg.setAttribute("alt", name);
    existingH2.textContent = name;
    existingLocation.textContent = city + ", " + country;
    existingTag.textContent = tagline;
    existingTjm.textContent = price + "€/jour";
    return article;
  } else {
    // Ajout d'une nouvelle carte
    article.parentNode.appendChild(newArticle);
    return newArticle;
  }
}

// Fonction pour rendre l'en-tête du photographe
function renderPhotographerHeader(photographer) {
  const picture = `assets/photographers/${photographer.portrait}`;
  const photographerHead = document.querySelector(".photograph-header");
  const photographerHeadButton = document.querySelector(".contact_button");

  const headName = photographerHead.querySelector(".photograph-header-name");
  const headLocation = photographerHead.querySelector(
    ".photograph-header-location"
  );
  const headTagline = photographerHead.querySelector(
    ".photograph-header-tagline"
  );
  const headPhoto = photographerHead.querySelector(".photograph-header-photo");
  const photographerHeadClose = document.querySelector(".contact-modal-close");

  // Configuration des événements pour le modal de contact
  photographerHeadButton.addEventListener("click", () => {
    displayModal("contact", "", "");
  });
  photographerHeadClose.addEventListener("click", () => {
    closeModal("contact", "", "");
  });

  // Mise à jour des informations de l'en-tête
  headName.textContent = photographer.name;
  headLocation.textContent = photographer.city + ", " + photographer.country;
  headTagline.textContent = photographer.tagline;
  headPhoto.setAttribute("src", picture);
  headPhoto.setAttribute("alt", photographer.name);

  return photographerHead;
}

// Fonction pour trier les médias selon différents critères
function sortMedias(medias, sortBy = "popularity") {
  const sortedMedias = [...medias];
  switch (sortBy) {
    case "popularity":
      return sortedMedias.sort((a, b) => {
        const likesA = getMediaLikes(a.id, a.likes);
        const likesB = getMediaLikes(b.id, b.likes);
        return likesB - likesA;
      });
    case "date":
      return sortedMedias.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "title":
      return sortedMedias.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sortedMedias.sort((a, b) => {
        const likesA = getMediaLikes(a.id, a.likes);
        const likesB = getMediaLikes(b.id, b.likes);
        return likesB - likesA;
      });
  }
}

// Fonction pour rendre la galerie de médias
function renderGallery(medias, photographer, imageGallery) {
  const templates = document.querySelectorAll(".media-card-template");
  const template = templates[0];

  // Nettoyage des templates existants
  templates.forEach((t, index) => {
    if (index > 0) t.remove();
  });

  const galleryContent = Array.from(imageGallery.children);
  galleryContent.forEach((child) => {
    if (!child.classList.contains("media-card-template")) {
      child.remove();
    }
  });

  // Création des cartes de médias
  medias.forEach((media, index) => {
    const card = template.content.cloneNode(true);
    const mediaContainer = card.querySelector(".media-container");
    const title = card.querySelector(".photographer-gallery-image-title");
    const likesCount = card.querySelector(".likes-count");

    const currentLikes = getMediaLikes(media.id, media.likes);
    const stickyLikesCount = document.querySelector(
      ".photographer-sticky-likes-text"
    );

    // Configuration du bouton de like
    const likeBtn = card.querySelector(".fa-solid");
    likeBtn.addEventListener("click", () => {
      const newLikes = updateMediaLikes(media.id, media.likes);
      likesCount.textContent = newLikes;
      const totalLikes = getTotalLikes(medias);
      stickyLikesCount.textContent = totalLikes;

      // Mise à jour du tri et du rendu de la galerie
      const sortSelect = document.querySelector("#sort-select");
      const currentSort = sortSelect.value;
      const sortedMedias = sortMedias(medias, currentSort);
      renderGallery(sortedMedias, photographer, imageGallery);
    });

    likesCount.textContent = currentLikes;
    title.textContent = media.title;

    const photographerFolder = photographer.name
      .split(" ")[0]
      .replace("-", " ");

    const mediaElement = createMediaElement(
      photographerFolder,
      photographer,
      medias,
      index
    );

    if (mediaElement) {
      mediaContainer.appendChild(mediaElement);
      imageGallery.appendChild(card);
    } else {
      console.error("Failed to create image", media);
    }
  });
}

// Fonction pour rendre la galerie du photographe
function renderPhotographerGallery(photographer, medias) {
  let sortedMedias = sortMedias(medias, "popularity");

  const photographerGallery = document.querySelector(".photographer-gallery");
  const photographerGallerySort = photographerGallery.querySelector(
    ".photographer-gallery-sort"
  );
  const imageGallery = photographerGallery.querySelector(
    ".photographer-gallery-image"
  );

  const mediaModalCloseBtn = document.querySelector(".media-modal-close");

  // Configuration du bouton de fermeture du modal
  mediaModalCloseBtn.addEventListener("click", () => {
    closeModal("media");
  });

  renderGallery(sortedMedias, photographer, imageGallery);

  // Configuration du tri de la galerie
  photographerGallerySort.addEventListener("change", (e) => {
    sortedMedias = sortMedias(medias, e.target.value);
    renderGallery(sortedMedias, photographer, imageGallery);
  });

  return photographerGallery;
}

// Fonction pour rendre la section sticky du photographe
function renderPhotographerSticky(photographer, medias) {
  function getTotalLikes(medias) {
    return medias.reduce((acc, media) => acc + media.likes, 0);
  }
  const totalLikes = getTotalLikes(medias);

  const photographerSticky = document.querySelector(".photographer-sticky");
  const photographerStickyLikesText = document.querySelector(
    ".photographer-sticky-likes-text"
  );
  const photographerStickyTJM = document.querySelector(
    ".photographer-sticky-tjm"
  );

  // Mise à jour des informations de la barre fixe
  photographerStickyLikesText.textContent = totalLikes;
  photographerStickyTJM.textContent = photographer.price + "€ / jour";
  return photographerSticky;
}

// Template du photographe
export function photographerTemplate(data) {
  const { name, portrait } = data;
  const picture = `assets/photographers/${portrait}`;

  // Configuration de la fermeture des modals avec la touche Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal("media");
      closeModal("contact");
    }
  });

  return {
    name,
    picture,
    renderPhotographerCard: () => renderPhotographerCard(data),
    renderPhotographerHeader: (photographer) =>
      renderPhotographerHeader(photographer),
    renderPhotographerGallery: (photographer, medias) =>
      renderPhotographerGallery(photographer, medias),
    renderPhotographerSticky: (photographer, medias) =>
      renderPhotographerSticky(photographer, medias),
  };
}

// Fonction d'initialisation
async function init() {
  try {
    const photographer = await currentPhotographer();

    if (!photographer) {
      return;
    }

    const medias = await getPhotographerMedias(photographer.id);

    if (!medias || medias.length === 0) {
      return;
    }

    const contactModalName = document.querySelector(".contact_modal_name");
    contactModalName.textContent = photographer.name;

    renderPhotographerHeader(photographer);
    renderPhotographerGallery(photographer, medias);
    renderPhotographerSticky(photographer, medias);
  } catch (error) {
    console.error("Error on photographer page", error);
  }
}

document.addEventListener("DOMContentLoaded", init);
