// Récupération des photographes
export async function getPhotographers() {
  const response = await fetch("../../data/photographers.json");
  const json = await response.json();
  return json.photographers;
}

// Récupération des médias
export async function getMedias() {
  const response = await fetch("../../data/photographers.json");
  const json = await response.json();
  return json.media;
}

// Récupération du photographe
export async function getPhotographer(id) {
  const photographers = await getPhotographers();
  return photographers.find((photographer) => photographer.id === parseInt(id));
}

// Récupération des médias du photographe
export async function getPhotographerMedias(id) {
  const medias = await getMedias();
  const filteredMedias = medias.filter(
    (media) => media.photographerId === parseInt(id)
  );
  return filteredMedias;
}
