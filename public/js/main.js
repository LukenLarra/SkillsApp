import { obtenerDatos } from "./../../scripts/scraper.js";
import { downloadIcons } from "./../../scripts/download_scripts.js";
import { build_page } from "./../../scripts/build.js";

async function main() {
    console.log("Iniciando...");
    await obtenerDatos();
    await downloadIcons();
    build_page();

}

window.onload = main;
