import { buildLeaderboard } from "./../../scripts/build_leaderboard.js";

async function main() {
    await buildLeaderboard();
}

window.onload = await main;