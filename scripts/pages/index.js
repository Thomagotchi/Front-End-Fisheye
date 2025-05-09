import { photographerTemplate } from "../templates/photographer.js";
import { getPhotographers } from "../Api/api.js";

const photographers = getPhotographers();

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  const photographers = await getPhotographers();
  if (photographers && photographers.length > 0) {
    displayData(photographers);
  } else {
    console.log("No photographers data to display.");
  }
}

init();
