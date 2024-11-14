import { buildLeaderboard } from "./../../scripts/build.js";

async function main() {
    await buildLeaderboard();
}

window.onload = await main;