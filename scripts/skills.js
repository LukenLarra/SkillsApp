export let buffer = {
    title: '',
    score: '',
    svg: '',
    description: '',
    tasks: [],
    resources: []
};

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



export async function setDetails(element){
    buffer.resources = ['resource 1', 'resource 2', 'resource 3'];
    buffer.tasks = ['task 1', 'task 2', 'task 3'];
    buffer.description = 'This is a description of the skill';
    buffer.score = '1 points';
    buffer.title = element.querySelector('text').textContent;
    buffer.svg = element.outerHTML;
}