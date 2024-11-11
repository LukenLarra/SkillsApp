import { build_index} from "./../../scripts/build.js";

async function main() {
   await build_index();
}

window.onload = await main;
