import { icons, obtenerDatos } from "./scraper.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirPath = path.join(__dirname, "../public", "electronics", "icons");

export async function downloadIcons() {
  icons.forEach(async (iconUrl) => {
    const fileName =  path.basename(iconUrl);
    const filePath = path.join(dirPath, fileName)
    if (fs.existsSync(filePath)) {
      console.log(`El archivo ya existe: ${filePath}. Pasando al siguiente.`);
      
    }else{
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
  });
}