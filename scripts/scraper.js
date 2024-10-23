const icons = [];
const ids = [];
const texts = [];

export async function obtenerDatos(){
    try {
        const response = await fetch("https://tinkererway.dev/web_skill_trees/electronics_skill_tree");
        const data = await response.json();
        data.forEach(item => {
            icons.push(item.icon);
            ids.push(item.id);
            texts.push(item.text);
        });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}

export { icons, ids, texts };