import puppeteer from "puppeteer";
import {upload} from "./upload.js";

let badges = [];

async function getBadges() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto("https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/wiki#listado-de-rangos", {waitUntil: 'networkidle0'});
        badges = await page.evaluate(() => {
            const badgesList = [];
            let bitpoints_min = 0;
            let bitpoints_max = 9;

            const content = document.querySelector(".markdown-body");
            for (let i = 36; i <= 45; i += 2) {
                const child = content.children[i];
                const tbody = child.querySelector("tbody");
                const rows = tbody.querySelectorAll("tr");
                rows.forEach(row => {
                    const cells = row.querySelectorAll("td");
                    let imgSrc = cells[1]?.querySelector("img")?.src;
                    const strongText = cells[2]?.querySelector("strong")?.innerText;

                    imgSrc = imgSrc.split("/png/")[1];
                    imgSrc = imgSrc.split(".png")[0];
                    imgSrc = imgSrc + "-min.png";

                    badgesList.push({
                        rango: strongText,
                        bitpoints_min,
                        bitpoints_max,
                        png: imgSrc
                    });

                    bitpoints_min += 10;
                    bitpoints_max += 10;
                });
            }
            return badgesList;
        });

        if (badges.length > 0) {
            await upload(badges, "api/badges");
            console.log("Datos:", badges);
        } else {
            console.warn("No se encontraron datos para cargar.");
        }
    } catch (error) {
        console.error("Error al obtener los datos");
        console.error(error.stack);
    } finally {
        await browser.close();
    }
}

getBadges();