/**Dar los buenos dias tardes o noches */

export function saludoPorHora(fecha: Date = new Date()): string {
    const hora = fecha.getHours();
    if (hora < 12) return "Buen dia";
    if (hora < 19) return "Buenas tardes";
    return "Buenas noches";
}

export function fechaLarga(fecha: Date = new Date()): string {
    const texto = fecha.toLocaleDateString("es-Mx", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    return texto.replace(/ de (\d{4})$/, ", $1");
}