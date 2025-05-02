import { photographerTemplate } from "../templates/photographer.js";

const response = await fetch("../../data/photographers.json");
const json = await response.json();

const photographers = json.photographers;

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  if (photographers && photographers.length > 0) {
    displayData(photographers);
  } else {
    console.log("No photographers data to display.");
  }
}

init();
