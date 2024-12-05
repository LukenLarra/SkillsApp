import express from 'express';

const router = express.Router();
import path from "path";
import fs from "fs";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skillDataPath = path.join(__dirname, "./../data.json");
const skills = JSON.parse(fs.readFileSync(skillDataPath, "utf-8"));

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'ELECTRONICS', session: req.session});
});

router.get("/skill_details/:id", function (req, res) {
    const id = req.params.id;
    const skill = skills.find(skill => skill.id === id);
    if (skill) {
        res.render("skill_details", {skill});
    } else {
        res.status(404).send('Skill {id} not found');
    }
});

router.get('/skills/:skillTree/edit/:id', async (req, res) => {
    const {skillTree, id} = req.params;
    // Supongamos que tienes una función para obtener detalles de una habilidad
    const skill = skills.find(skill => skill.id === id);
    if (!skill) {
        return res.status(404).send('Skill not found');
    }

    res.render('edit_skill', {skill, skillTree}); // Renderiza la página de edición
});

router.post('/skills/:skillTree/edit/:id', async (req, res) => {
    const { skillTree, id } = req.params;
    const { text, points, description, tasks, resources } = req.body;

    try {
        const data = await fs.promises.readFile(skillDataPath, 'utf8');
        let skills = JSON.parse(data);

        // Buscar el elemento con el mismo id
        const skillIndex = skills.findIndex(skill => skill.id === id);
        if (skillIndex === -1) {
            return res.status(404).send('Skill not found');
        }

        // Actualizar los campos del elemento
        skills[skillIndex].text = text.split(',').map(t => t.trim()).filter(t => t.length > 0);
        skills[skillIndex].points = points;
        skills[skillIndex].description = description;
        skills[skillIndex].tasks = tasks.split('\n').map(t => t.trim()).filter(t => t.length > 0);
        skills[skillIndex].resources = resources.split('\n').map(t => t.trim()).filter(t => t.length > 0);

        // Guardar los cambios en el archivo data.json
        await fs.promises.writeFile(skillDataPath, JSON.stringify(skills, null, 2));

        // Redirigir solo después de guardar
        res.redirect(`/`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing request');
    }
});
export default router;
