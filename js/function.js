"use strict";

/**
 * Descarga un JSON de productos desde la URL indicada y normaliza la respuesta.
 *
 * Realiza un fetch a la URL proporcionada y devuelve un objeto con la forma:
 * { success: true, body: <datos JSON> } o { success: false, body: <mensaje de error> }.
 *
 * @function fetchProducts
 * @param {string} url - URL del endpoint JSON de productos.
 * @returns {Promise<{success: boolean, body: any|string}>} Promesa que resuelve con el resultado normalizado.
 */
let fetchProducts = (url) => {

    return fetch(url)
        .then(response => {

            // Verificar si la respuesta no es exitosa
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return response.json();

        })
        .then(data => {

            // Respuesta exitosa
            return {
                success: true,
                body: data
            };

        })
        .catch(error => {

            // Error en la solicitud
            return {
                success: false,
                body: error.message
            };

        });
}


/**
 * Descarga un XML de categorías desde la URL indicada y lo parsea a Document XML.
 *
 * Realiza un fetch a la URL proporcionada, parsea el texto a XML usando DOMParser
 * y devuelve un objeto con la forma:
 * { success: true, body: <Document XML> } o { success: false, body: <mensaje de error> }.
 *
 * @async
 * @function fetchCategories
 * @param {string} url - URL del recurso XML de categorías.
 * @returns {Promise<{success: boolean, body: Document|string}>} Promesa que resuelve con el Document XML o mensaje de error.
 */
let fetchCategories = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        let text = await response.text()

        const parser = new DOMParser();
        const data = parser.parseFromString(text, "application/xml");

        return {
            success: true,
            body: data
        };

    } catch (error) {

        return {
            success: false,
            body: error.message
        };

    }
}

export { fetchProducts }
export { fetchCategories }