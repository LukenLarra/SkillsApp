import express from 'express';
import { obtenerDatos, icons, ids, texts } from '../scripts/scraper.js';
import { downloadIcons } from '../scripts/download_scripts.js';

const router = express.Router();

router.get('/api/data', async (req, res) => {
    try {
        await obtenerDatos(); // Obtiene los datos de la fuente externa
        await downloadIcons(); // Descarga los íconos necesarios
        res.json({ icons, texts, ids }); // Envía los datos al frontend
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Skills' });
});


export default router;