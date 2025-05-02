export class PhotographerAPI {
  constructor(basePath = "../../data") {
    this.basePath = basePath;
  }

  async getPhotographers() {
    try {
      const response = await fetch(`${this.basePath}/photographers.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Photographers data:", data.photographers);
      return data;
    } catch (error) {
      console.error("Error fetching photographers:", error);
      return { photographers: [] };
    }
  }
}
