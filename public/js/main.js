import { build_page } from "./../../scripts/build.js";

async function main() {
  try {
    console.log("Obteniendo datos...");
    const response = await fetch('/api/data');
    if (!response.ok) {
        throw new Error("Error al obtener los datos");
    }
    const { icons, ids, texts } = await response.json();
    build_page(icons, ids, texts); // Llama a build_page con los datos obtenidos
  } catch (error) {
      console.error("Error al construir la página:", error);
  }
}

window.onload = main;
