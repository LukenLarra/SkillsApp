export function getSkillDetails(title, score, svg, description, tasks, resources) {
    title = 'Detalles de la Competencia';
    score = '1 points';
    svg = 'svg';
    description = 'This is a description of the skill';
    tasks = ['task 1', 'task 2', 'task 3'];
    resources = ['resource 1', 'resource 2', 'resource 3'];
    return {
        title: title,
        score: score,
        svg: svg,
        description: description,
        tasks: tasks,
        resources: resources
    };
}