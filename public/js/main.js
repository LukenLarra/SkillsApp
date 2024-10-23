import { obtenerDatos } from "./../../scripts/scraper.js";
import { downloadIcons } from "./../../scripts/download_scripts.js";

async function main() {
    await obtenerDatos();
    await downloadIcons();
}

main();