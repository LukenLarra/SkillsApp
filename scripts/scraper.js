import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const icons = [];
const ids = [];
const texts = [];

export async function obtenerDatos() {
  try {
    const response = await fetch(
      "https://tinkererway.dev/web_skill_trees/electronics_skill_tree"
    );
    const data = await response.text();
    const dom = new JSDOM(data);
    const doc = dom.window.document;
    const container = doc.querySelector(".svg-container");
    const elements = container.querySelectorAll(".svg-wrapper");

    elements.forEach((wrapper) => {
      const svgImage = wrapper.querySelector("image").getAttribute("href");
      const rawText = wrapper.querySelector("text").textContent; // Selecciona el elemento text
      const textElement = rawText.replace(/\s+/g, " ");
      const id = wrapper.getAttribute("data-id"); // Selecciona el atributo data-id

      icons.push(svgImage);
      texts.push(textElement);
      ids.push(id);
    });

    console.log("Íconos:", icons);
    console.log("Textos:", texts);
    console.log("IDs:", ids);
  } catch (error) {
    console.log(error);
  }
}

export { icons, ids, texts };
