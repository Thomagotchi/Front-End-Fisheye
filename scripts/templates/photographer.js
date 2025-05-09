import { displayMediaModal } from "../utils/mediaModal.js";

export function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const link = document.createElement("a");
    link.classList.add("photographer-card-link");
    link.setAttribute("href", `photographer.html?id=${id}`);
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("photographer-card-img-container");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    const h2 = document.createElement("h2");
    h2.textContent = name;
    const description = document.createElement("div");
    description.classList.add("photographer-card-description");
    const location = document.createElement("p");
    location.textContent = city + ", " + country;
    const tag = document.createElement("p");
    tag.textContent = tagline;
    const tjm = document.createElement("p");
    tjm.textContent = price + "€/jour";

    imgContainer.appendChild(img);
    link.appendChild(imgContainer);
    link.appendChild(h2);
    link.appendChild(description);
    description.appendChild(location);
    description.appendChild(tag);
    description.appendChild(tjm);
    link.classList.add("photographer-card");
    img.classList.add("photographer-card-img");
    h2.classList.add("photographer-card-name");
    article.appendChild(link);
    return article;
  }

  function getPhotographerHeadDOM(photographer) {
    const photographerHead = document.querySelector(".photograph-header");
    const headContainer = document.createElement("div");
    headContainer.classList.add("photograph-header-container");
    const headName = document.createElement("h1");
    headName.textContent = photographer.name;
    const headLocation = document.createElement("p");
    headLocation.textContent = photographer.city + ", " + photographer.country;
    const headTagline = document.createElement("p");
    headTagline.textContent = photographer.tagline;
    const headPhoto = document.createElement("img");
    headPhoto.setAttribute("src", picture);
    headPhoto.setAttribute("alt", photographer.name);
    const headPhotoContainer = document.createElement("div");
    headPhotoContainer.classList.add("photograph-header-photo-container");
    headPhotoContainer.appendChild(headPhoto);

    headContainer.appendChild(headName);
    headContainer.appendChild(headLocation);
    headContainer.appendChild(headTagline);
    photographerHead.insertBefore(headContainer, photographerHead.firstChild);
    photographerHead.appendChild(headPhotoContainer);
    return headContainer;
  }

  function getPhotographerGalleryDOM(photographer, medias) {
    const main = document.getElementById("main");

    const photographerGallery = document.createElement("section");
    photographerGallery.classList.add("photographer-gallery");

    const photographerGalleryTitle = document.createElement("h2");
    photographerGalleryTitle.textContent = "Trier par";

    const photographerGallerySort = document.createElement("select");
    photographerGallerySort.classList.add("photographer-gallery-sort");

    const photographerGallerySortOption1 = document.createElement("option");
    photographerGallerySortOption1.textContent = "Popularité";
    photographerGallerySortOption1.value = "popularity";
    photographerGallerySortOption1.selected = true;

    const photographerGallerySortOption2 = document.createElement("option");
    photographerGallerySortOption2.textContent = "Date";
    photographerGallerySortOption2.value = "date";

    const photographerGallerySortOption3 = document.createElement("option");
    photographerGallerySortOption3.textContent = "Titre";
    photographerGallerySortOption3.value = "title";

    const imageGallery = document.createElement("div");
    imageGallery.classList.add("photographer-gallery-image");

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
      imageGallery.innerHTML = "";
      medias.forEach((media) => {
        const imageContainer = document.createElement("div");
        const imageContainerCaption = document.createElement("div");
        imageContainerCaption.classList.add(
          "photographer-gallery-image-caption"
        );
        const imageContainerTitle = document.createElement("p");
        imageContainerTitle.classList.add("photographer-gallery-image-title");
        imageContainerTitle.textContent = media.title;
        const imageContainerLikes = document.createElement("div");
        imageContainerLikes.classList.add("photographer-gallery-image-likes");
        const imageContainerLikesNumber = document.createElement("p");
        imageContainerLikesNumber.textContent = media.likes;
        const imageContainerLikesIcon = document.createElement("i");
        imageContainerLikesIcon.classList.add("fa-solid", "fa-heart");
        imageContainer.classList.add("photographer-gallery-image-container");

        const photographerFolder = photographer.name
          .split(" ")[0]
          .replace("-", " ");

        if (media.image) {
          const image = document.createElement("img");
          image.classList.add("photographer-gallery-image-img");
          image.setAttribute(
            "src",
            `assets/photographers/${photographerFolder}/${media.image}`
          );
          image.setAttribute("alt", media.title);
          image.addEventListener("click", () =>
            displayMediaModal(photographer, media)
          );
          imageContainer.appendChild(image);
          imageGallery.appendChild(imageContainer);
        }
        if (media.video) {
          const video = document.createElement("video");
          video.classList.add("photographer-gallery-image-video");
          video.setAttribute(
            "src",
            `assets/photographers/${photographerFolder}/${media.video}`
          );
          video.setAttribute("alt", media.title);
          imageContainer.appendChild(video);
          imageGallery.appendChild(imageContainer);
        }
        imageContainer.appendChild(imageContainerCaption);
        imageContainerCaption.appendChild(imageContainerTitle);
        imageContainerCaption.appendChild(imageContainerLikes);
        imageContainerLikes.appendChild(imageContainerLikesNumber);
        imageContainerLikes.appendChild(imageContainerLikesIcon);
      });
    }

    renderGallery(medias);

    photographerGallerySort.addEventListener("change", (e) => {
      const sortedMedias = sortMedias(medias, e.target.value);
      renderGallery(sortedMedias);
    });

    photographerGallerySort.appendChild(photographerGallerySortOption1);
    photographerGallerySort.appendChild(photographerGallerySortOption2);
    photographerGallerySort.appendChild(photographerGallerySortOption3);

    photographerGallery.appendChild(photographerGalleryTitle);
    photographerGallery.appendChild(photographerGallerySort);
    photographerGallery.appendChild(imageGallery);
    main.appendChild(photographerGallery);
  }

  function getPhotographerStickyDOM(photographer, medias) {
    const main = document.getElementById("main");

    function getTotalLikes(medias) {
      return medias.reduce((acc, media) => acc + media.likes, 0);
    }
    const totalLikes = getTotalLikes(medias);

    const photographerSticky = document.createElement("div");
    photographerSticky.classList.add("photographer-sticky");

    const photographerStickyLikes = document.createElement("div");
    photographerStickyLikes.classList.add("photographer-sticky-likes");
    const photographerStickyLikesText = document.createElement("p");
    photographerStickyLikesText.textContent = totalLikes;
    const photographerStickyLikesIcon = document.createElement("i");
    photographerStickyLikesIcon.classList.add("fa-solid", "fa-heart");

    const photographerStickyTJM = document.createElement("p");
    photographerStickyTJM.classList.add("photographer-sticky-tjm");
    photographerStickyTJM.textContent = photographer.price + "€ / jour";

    photographerStickyLikes.appendChild(photographerStickyLikesText);
    photographerStickyLikes.appendChild(photographerStickyLikesIcon);
    photographerSticky.appendChild(photographerStickyLikes);
    photographerSticky.appendChild(photographerStickyTJM);
    main.appendChild(photographerSticky);
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
