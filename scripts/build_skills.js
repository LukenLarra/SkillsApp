export let buffer = {
    title: '',
    score: '',
    svg: '',
    description: '',
    tasks: [],
    resources: []
};

export async function buildSkills(wrapper){
    await setDetails(wrapper);
    const params = new URLSearchParams({
        title: buffer.title,
        score: buffer.score,
        svg: encodeURIComponent(buffer.svg),
        description: buffer.description,
        tasks: JSON.stringify(buffer.tasks),
        resources: JSON.stringify(buffer.resources),
    });

    window.location.href = `/skill_details?${params.toString()}`;
}

export function getDetails() {
    return {
        title: buffer.title,
        score: buffer.score,
        svg: buffer.svg,
        description: buffer.description,
        tasks: buffer.tasks,
        resources: buffer.resources
    };

}

async function setDetails(element){
    const response = await fetch('http://localhost:3000/api/data');
    const data = await response.json();
    await Promise.all(data.map(async (item) => {
        buffer.resources = item.resources;
        buffer.tasks = item.tasks;
        buffer.description = item.description;
        buffer.score = item.points;
        buffer.title = element.querySelector('text').textContent;
        buffer.svg = element.outerHTML;
    }));
}