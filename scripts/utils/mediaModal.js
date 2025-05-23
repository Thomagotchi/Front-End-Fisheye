export function displayMediaModal(photographer, media) {
  const modal = document.getElementById("media_modal");
  modal.style.display = "flex";
  modal.style.position = "fixed";

  const mediaModalContainer = document.querySelector(".media-modal-container");
  mediaModalContainer.innerHTML = "";

  const mediaModalTitle = document.createElement("p");
  mediaModalTitle.classList.add("media-modal-title");
  mediaModalTitle.textContent = media.title;

  let mediaElement;

  const photographerFolder = photographer.name.split(" ")[0].replace("-", " ");

  if (media.image) {
    mediaElement = document.createElement("img");
    mediaElement.src = `assets/photographers/${photographerFolder}/${media.image}`;
    mediaElement.alt = media.title;
  } else if (media.video) {
    mediaElement = document.createElement("video");
    mediaElement.src = `assets/photographers/${photographerFolder}/${media.video}`;
    mediaElement.controls = true;
    mediaElement.autoplay = true;
  }

  mediaElement.classList.add("media-modal-content");

  mediaModalContainer.appendChild(mediaElement);
  mediaModalContainer.appendChild(mediaModalTitle);
}

export function closeMediaModal() {
  const modal = document.getElementById("media_modal");
  modal.style.display = "none";
}

export function previousMedia() {
  const currentMedia = document.querySelector(".media-modal-content");
}

export function nextMedia() {}
