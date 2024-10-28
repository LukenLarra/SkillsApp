import { icons, obtenerDatos } from "./scraper.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirPath = path.join(__dirname, "../public", "electronics", "icons");

export async function downloadIcons() {
  for (let i = 0; i < icons.length; i++) {
    const iconUrl = icons[i]; 
    console.log(iconUrl);
    const fileName = `icon${i + 1}.svg`;
    const filePath = path.join(dirPath, fileName)
    
    if (fs.existsSync(filePath)) {
      console.log(`El archivo ya existe: ${filePath}. Pasando al siguiente.`);
      continue;
    }

    try {
      const response = await fetch(iconUrl);
      if (!response.ok) {
        throw new Error(
          `Error al descargar el SVG desde ${iconUrl}: ${response.statusText}`
        );
      }
      const svgContent = await response.text();
     ;

      fs.writeFileSync(filePath, svgContent);
      console.log(`SVG guardado en: ${filePath}`);
    } catch (error) {
      console.error(`Error al descargar el SVG desde ${iconUrl}:`, error);
    }
  }
  console.log("Se han descargado todos los iconos");
}


await obtenerDatos();
downloadIcons();