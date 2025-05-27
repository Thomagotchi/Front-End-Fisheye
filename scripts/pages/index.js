import { getPhotographers } from "../Api/api.js";
import { renderPhotographerCard } from "./photographer.js";

// Fonction pour afficher les photographes
async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const userCard = renderPhotographerCard(photographer);
    photographersSection.appendChild(userCard);
  });
}

// Fonction pour initialiser l'application
async function init() {
  const photographers = await getPhotographers();
  if (photographers && photographers.length > 0) {
    displayData(photographers);
  } else {
    console.log("No photographers data to display.");
  }
}

init();
