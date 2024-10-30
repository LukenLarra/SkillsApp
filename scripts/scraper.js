import puppeteer from 'puppeteer';

const icons = [];
const texts = [];
const ids = [];

export async function obtenerDatos() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto("https://tinkererway.dev/web_skill_trees/electronics_skill_tree", { waitUntil: 'networkidle0' });

    const elements = await page.evaluate(() => {
      const wrappers = document.querySelectorAll('.svg-wrapper');
      return Array.from(wrappers).map(wrapper => {
        const svgImage = wrapper.querySelector("image").getAttribute("href");
        const rawText = wrapper.querySelector("text").textContent;
        const textElement = rawText.replace(/\s+/g, " ");
        const id = wrapper.getAttribute("data-id");

        return {
          svgImage: "https://tinkererway.dev/" + svgImage,
          textElement,
          id
        };
      });
    });

    elements.forEach(element => {
      icons.push(element.svgImage);
      texts.push(element.textElement);
      ids.push(element.id);
    });

    console.log("Íconos:", icons);
    console.log("Textos:", texts);
    console.log("IDs:", ids);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  } finally {
    await browser.close();
  }
}

export { icons, ids, texts };
