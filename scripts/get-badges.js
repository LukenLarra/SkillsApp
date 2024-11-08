import puppeteer from "puppeteer";
const badges = [];

async function getBadges(){

const browser = await puppeteer.launch();
const page = await browser.newPage();

try {
    await page.goto("https://tinkererway.dev/web_skill_trees/electronics_skill_tree", { waitUntil: 'networkidle0' });

    const elements = await page.evaluate(() => {

    });

} catch (error) {
    console.error("Error al obtener los datos:", error);
    }
}