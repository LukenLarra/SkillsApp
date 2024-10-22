const icons = [];
fetch("https://tinkererway.dev/web_skill_trees/electronics_skill_tree")
    .then(response => response.json())
    .then(data => {
        let id = data.id;
        let text = data.text;
        let icon = data.icon;
        icons.push(icon);
    });
