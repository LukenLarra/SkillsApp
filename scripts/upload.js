export async function upload(data, url) {
    const response = await fetch(`http://localhost:3000/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        console.error("Error al subir los datos:", response.statusText);
    } else {
        console.log("Datos subidos correctamente");
    }
}