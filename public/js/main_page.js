import { buildIndex} from "../../scripts/build_index.js";

async function main() {
   await buildIndex();
}

window.onload = await main;
