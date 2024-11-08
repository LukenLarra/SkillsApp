import puppeteer from 'puppeteer';
import { upload } from './upload.js';

const data = [];

export async function obtenerDatos() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto("https://tinkererway.dev/web_skill_trees/electronics_skill_tree", { waitUntil: 'networkidle0' });

    const elements = await page.evaluate(() => {
      const wrappers = document.querySelectorAll('.svg-wrapper');
      return Array.from(wrappers).map(wrapper => {
        const svgImage = wrapper.querySelector("image").getAttribute("href");
        const textElement = wrapper.querySelector("text");
        const tspans = Array.from(textElement.querySelectorAll("tspan")).map(tspan => tspan.textContent);
        const id = wrapper.getAttribute("data-id");

        return {
          id,
          text: tspans,
          icon: "https://tinkererway.dev/" + svgImage
        };
      });
    });

    data.push(...elements);

    await upload(data, "api/data");

    console.log("Datos:", data);

  } catch (error) {
    console.error("Error al obtener los datos:", error);
  } finally {
    await browser.close();
  }
}
obtenerDatos();
