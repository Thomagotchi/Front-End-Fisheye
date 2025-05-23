import { getPhotographerMedias, getPhotographers } from "../Api/api.js";
import { closeModal, displayModal } from "../utils/modal.js";

const getPhotographerID = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

const currentPhotographer = async () => {
  const photographers = await getPhotographers();
  const photographerID = getPhotographerID();
  const photographer = photographers.find(
    (photographer) => photographer.id === parseInt(photographerID)
  );
  return photographer;
};

function createMediaElement(
  photographerFolder,
  photographer,
  sortedMedias,
  index
) {
  const mediaUrl = sortedMedias[index].image || sortedMedias[index].video;
  const isVideo = mediaUrl.toLowerCase().endsWith(".mp4");

  if (isVideo) {
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
    video.title = sortedMedias[index].title;
    video.setAttribute("aria-label", sortedMedias[index].title);
    return video;
  } else {
    const image = document.createElement("img");
    image.classList.add("photographer-gallery-image-img");
    image.src = `assets/photographers/${photographerFolder}/${mediaUrl}`;
    image.alt = sortedMedias[index].title;
    image.setAttribute("aria-label", sortedMedias[index].title);
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
  }
}

export function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  let currentLikes = 0;

  const picture = `assets/photographers/${portrait}`;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal("media");
      closeModal("contact");
    }
  });

  function getUserCardDOM() {
    const article = document.querySelector(".photographer_section article");
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

    link.setAttribute("href", `photographer.html?id=${id}`);
    link.setAttribute("aria-label", name);
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);
    h2.textContent = name;
    location.textContent = city + ", " + country;
    tag.textContent = tagline;
    tjm.textContent = price + "€/jour";

    if (isFirstCard) {
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
      article.parentNode.appendChild(newArticle);
      return newArticle;
    }
  }

  function getPhotographerHeadDOM(photographer) {
    const photographerHead = document.querySelector(".photograph-header");
    const photographerHeadButton = document.querySelector(".contact_button");

    const headName = photographerHead.querySelector(".photograph-header-name");
    const headLocation = photographerHead.querySelector(
      ".photograph-header-location"
    );
    const headTagline = photographerHead.querySelector(
      ".photograph-header-tagline"
    );
    const headPhoto = photographerHead.querySelector(
      ".photograph-header-photo"
    );
    const photographerHeadClose = document.querySelector(
      ".contact-modal-close"
    );

    photographerHeadButton.addEventListener("click", () => {
      displayModal("contact", "", "");
    });
    photographerHeadClose.addEventListener("click", () => {
      closeModal("contact", "", "");
    });

    headName.textContent = photographer.name;
    headLocation.textContent = photographer.city + ", " + photographer.country;
    headTagline.textContent = photographer.tagline;
    headPhoto.setAttribute("src", picture);
    headPhoto.setAttribute("alt", photographer.name);

    return photographerHead;
  }

  function getPhotographerGalleryDOM(photographer, medias) {
    let sortedMedias = sortMedias(medias, "popularity");

    const photographerGallery = document.querySelector(".photographer-gallery");
    const photographerGallerySort = photographerGallery.querySelector(
      ".photographer-gallery-sort"
    );
    const imageGallery = photographerGallery.querySelector(
      ".photographer-gallery-image"
    );

    const mediaModalCloseBtn = document.querySelector(".media-modal-close");

    mediaModalCloseBtn.addEventListener("click", () => {
      closeModal("media");
    });

    function sortMedias(medias, sortBy = "popularity") {
      const sortedMedias = [...medias];
      switch (sortBy) {
        case "popularity":
          return sortedMedias.sort((a, b) => b.likes - a.likes);
        case "date":
          return sortedMedias.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        case "title":
          return sortedMedias.sort((a, b) => a.title.localeCompare(b.title));
        default:
          return sortedMedias.sort((a, b) => b.likes - a.likes);
      }
    }

    function renderGallery(medias) {
      const templates = document.querySelectorAll(".media-card-template");
      const template = templates[0];

      templates.forEach((t, index) => {
        if (index > 0) t.remove();
      });

      const galleryContent = Array.from(imageGallery.children);
      galleryContent.forEach((child) => {
        if (!child.classList.contains("media-card-template")) {
          child.remove();
        }
      });

      medias.forEach((media, index) => {
        const card = template.content.cloneNode(true);
        const container = card.querySelector(
          ".photographer-gallery-image-container"
        );
        const mediaContainer = card.querySelector(".media-container");
        const title = card.querySelector(".photographer-gallery-image-title");
        const likesCount = card.querySelector(".likes-count");

        let mediaLikesCounter = media.likes;
        let allPhotographerLikes = medias.reduce(
          (acc, media) => acc + media.likes,
          0
        );

        const stickyLikesCount = document.querySelector(
          ".photographer-sticky-likes-text"
        );

        const likeBtn = card.querySelector(".fa-solid");
        likeBtn.addEventListener("click", () => {
          mediaLikesCounter = mediaLikesCounter + 1;
          likesCount.textContent = mediaLikesCounter;
          allPhotographerLikes = allPhotographerLikes + 1;
          stickyLikesCount.textContent = allPhotographerLikes;
        });

        likesCount.textContent = mediaLikesCounter;

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
        mediaContainer.appendChild(mediaElement);

        imageGallery.appendChild(card);
      });
    }

    renderGallery(sortedMedias);

    photographerGallerySort.addEventListener("change", (e) => {
      sortedMedias = sortMedias(medias, e.target.value);
      renderGallery(sortedMedias);
    });

    return photographerGallery;
  }

  function getPhotographerStickyDOM(photographer, medias) {
    const main = document.getElementById("main");

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

    photographerStickyLikesText.textContent = totalLikes;
    photographerStickyTJM.textContent = photographer.price + "€ / jour";
    return photographerSticky;
  }

  return {
    name,
    picture,
    getUserCardDOM,
    getPhotographerHeadDOM,
    getPhotographerGalleryDOM,
    getPhotographerStickyDOM,
  };
}

async function init() {
  const photographer = await currentPhotographer();
  const medias = await getPhotographerMedias(photographer.id);

  if (photographer) {
    const contactModalName = document.querySelector(".contact_modal_name");
    contactModalName.textContent = photographer.name;
    const photographerModel = photographerTemplate(photographer);
    photographerModel.getPhotographerHeadDOM(photographer);
    photographerModel.getPhotographerGalleryDOM(photographer, medias);
    photographerModel.getPhotographerStickyDOM(photographer, medias);
  } else {
    console.error("Photographer not found");
  }
}

init();
