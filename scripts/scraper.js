import puppeteer from 'puppeteer';
import Skill from '../models/skill.model.js';
import mongoose from "mongoose";

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
                    id: parseInt(id),
                    text: tspans.join(", "),
                    icon: "https://tinkererway.dev/" + svgImage,
                    description: "Descripción de la habilidad",
                    score: 1,
                    tasks: ["Task 1", "Task 2", "Task 3"],
                    resources: ["Resource 1", "Resource 2", "Resource 3"],
                    set: 'electronics'
                };
            });
        });

        elements.forEach(async element => {
            const skill = new Skill(element);
            await skill.save();
        })

        console.log("Datos guardados en la base de datos: ", elements);

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    } finally {
        await browser.close();
    }
}

obtenerDatos();
