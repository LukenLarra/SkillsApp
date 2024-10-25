import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const icons = [];
const ids = [];
const texts = [];

async function obtenerDatos(){
    try {
        const response = await fetch("https://tinkererway.dev/web_skill_trees/electronics_skill_tree");
        const data = await response.text();
        const dom = new JSDOM(data);
        const doc = dom.window.document;
        const container = doc.querySelector(".svg-container");
        const elements = container.querySelectorAll(".svg-wrapper");

        elements.forEach((wrapper) => {
            const svgImage = wrapper.querySelector("image");
            const textoElement = wrapper.querySelector('text').textContent; // Selecciona el elemento text
            const id = wrapper.getAttribute('data-id'); // Selecciona el atributo data-id

            console.log('Enlace SVG:', svgImage);
            console.log('Texto:', textoElement);
            console.log('ID (data-id):', id);
        });
    } catch (error) {
        console.log(error);
    }
}

obtenerDatos();

export { icons, ids, texts };