import { build_leaderboard } from "./../../scripts/build.js";

async function main() {
    await build_leaderboard();
}

window.onload = await main;