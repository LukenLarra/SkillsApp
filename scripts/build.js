import { icons, ids, texts } from "./scraper.js";

export function build_page(){
    for (let i = 0; i < 68; i++) {
        const container = document.querySelector(".svg-container");
        const svgWrapper = document.createElement('div');
        svgWrapper.classList.add('svg-wrapper');
        svgWrapper.setAttribute('data-id', ids[i]);
        svgWrapper.setAttribute('data-custom', 'false');
        container.appendChild(svgWrapper);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '100');
        svg.setAttribute('viewBox', '0 0 100 100');
        

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
        polygon.classList.add('hexagon');
        svg.appendChild(polygon);

        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute('x', '35%');
        image.setAttribute('y', '60%');
        image.setAttribute('width', '30');
        image.setAttribute('height', '30');
        image.setAttribute('href', icons[i]);
        svg.appendChild(image);
    }
}