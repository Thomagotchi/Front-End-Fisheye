// Cela deviendras la fonction pour naviguer entre les photos en utilisant les fleches du clavier
let handleKeyboardNavigation = null;

export function displayModal(name, photographer, sortedMedias, index) {
  // Cette fonction affiche la modal pour les medias en fonction du props passer
  if (name === "media") {
    const modal = document.getElementById("media_modal");
    modal.style.display = "flex";
    modal.style.position = "fixed";

    // Cela permet de stocker l'index de la photo dans la modal pour pouvoir naviguer entre les photos
    modal.dataset.currentIndex = index;

    // Cette fonction met initialise le contenu de la modal
    updateModalContent(photographer, sortedMedias, index);

    // Fonction pour naviguer vers la photo précédente
    function prevMedia() {
      // On decrémente l'index de 1 ou sinon on revient à la dernière photo
      let newIndex = parseInt(modal.dataset.currentIndex) - 1;
      if (newIndex < 0) {
        newIndex = sortedMedias.length - 1;
      }
      // On met à jour l'index de la photo dans la modal
      modal.dataset.currentIndex = newIndex;
      // On met à jour le contenu de la modal
      updateModalContent(photographer, sortedMedias, newIndex);
    }

    // Fonction pour naviguer vers la photo suivante
    function nextMedia() {
      // On incrémente l'index de 1 ou sinon on revient à la première photo
      let newIndex = parseInt(modal.dataset.currentIndex) + 1;
      if (newIndex >= sortedMedias.length) {
        newIndex = 0;
      }
      // On met à jour l'index de la photo dans la modal
      modal.dataset.currentIndex = newIndex;
      // On met à jour le contenu de la modal
      updateModalContent(photographer, sortedMedias, newIndex);
    }

    // Evenements pour les fleches
    const leftArrow = document.querySelector(".modal-arrow-left");
    const rightArrow = document.querySelector(".modal-arrow-right");

    leftArrow.addEventListener("click", () => {
      prevMedia();
    });
    rightArrow.addEventListener("click", () => {
      nextMedia();
    });

    // Store the keyboard event handler as a named function
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
  }
}

// Cette fonction met à jour le contenu de la modal en fonction de l'index
function updateModalContent(photographer, sortedMedias, index) {
  const mediaModalContainer = document.querySelector(".media-modal-container");

  // Cela supprime le contenu de la modal pour la remplacer par le nouveau contenu
  mediaModalContainer.innerHTML = "";

  const mediaModalTitle = document.createElement("p");
  mediaModalTitle.classList.add("media-modal-title");
  mediaModalTitle.textContent = sortedMedias[index].title;

  let mediaElement;

  const photographerFolder = photographer.name.split(" ")[0].replace("-", " ");

  // Je suis obligé de récréer le contenu de la modal car le HTML peux changer en fonction du type de media

  // ICI REMPLACER CE IF/ELSE PAR LE FACTORY CREER
  if (sortedMedias[index].image) {
    mediaElement = document.createElement("img");
    mediaElement.src = `assets/photographers/${photographerFolder}/${sortedMedias[index].image}`;
    mediaElement.alt = sortedMedias[index].title;
  } else if (sortedMedias[index].video) {
    mediaElement = document.createElement("video");
    mediaElement.src = `assets/photographers/${photographerFolder}/${sortedMedias[index].video}`;
    mediaElement.controls = true;
    mediaElement.autoplay = true;
  }

  mediaElement.classList.add("media-modal-content");

  mediaModalContainer.appendChild(mediaElement);
  mediaModalContainer.appendChild(mediaModalTitle);
}

// Cette fonction ferme la modal
export function closeModal(name) {
  const modal = document.getElementById(`${name}_modal`);
  modal.style.display = "none";

  // Cela supprime l'index de la modal quand elle est fermée
  if (name === "media") {
    delete modal.dataset.currentIndex;
  }

  // Cela supprime les evenements pour les fleches quand la modal est fermée
  if (handleKeyboardNavigation) {
    document.removeEventListener("keydown", handleKeyboardNavigation);
    handleKeyboardNavigation = null; // Reset the reference
  }
}
