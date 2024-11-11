import { build_page} from "./../../scripts/build.js";

async function main() {
   await build_page();
}

window.onload = await main;
