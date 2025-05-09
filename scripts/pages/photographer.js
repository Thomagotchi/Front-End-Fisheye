import { getPhotographerMedias, getPhotographers } from "../Api/api.js";
import { photographerTemplate } from "../templates/photographer.js";
import { initMediaModal } from "../utils/mediaModal.js";

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
initMediaModal();
