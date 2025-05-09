export async function getPhotographers() {
  const response = await fetch("../../data/photographers.json");
  const json = await response.json();
  return json.photographers;
}

export async function getMedias() {
  const response = await fetch("../../data/photographers.json");
  const json = await response.json();
  return json.media;
}

export async function getPhotographer(id) {
  const photographers = await getPhotographers();
  return photographers.find((photographer) => photographer.id === parseInt(id));
}

export async function getPhotographerMedias(id) {
  const photographer = await getPhotographer(id);
  const medias = await getMedias();

  return medias.filter((media) => media.photographerId === photographer.id);
}
