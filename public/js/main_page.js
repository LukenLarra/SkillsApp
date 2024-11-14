import { buildIndex} from "./../../scripts/build.js";

async function main() {
   await buildIndex();
}

window.onload = await main;
