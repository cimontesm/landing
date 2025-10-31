"use strict";

import { fetchCategories, fetchProducts } from "./function";
import { saveVote } from "./firebase";
import { getVotes } from "./firebase";

/**
 * Muestra un elemento toast en pantalla si existe en el DOM.
 * 
 * Esta función busca un elemento con el ID "toast-interactive" y,
 * si lo encuentra, le agrega la clase "md:block" para hacerlo visible
 * en dispositivos medianos en adelante.
 * 
 * @function showToast
 * @returns {void}
 */

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

/**
 * Agrega un evento al botón de demostración para abrir un video.
 * 
 * Esta función busca un elemento con el ID "demo" y, si lo encuentra,
 * añade un evento `click` que abre un video en una nueva pestaña del navegador.
 *  
 * @function showVideo
 * @returns {void}
 */

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

/**
 * Descarga y renderiza una lista de productos en el contenedor #products-container.
 * Actualmente se muestran hasta 6 productos.
 * 
 * @function renderProducts
 * @returns {void} No devuelve valor. Si ocurre un error muestra una alerta.
 */
const renderProducts = () => {
    fetchProducts('https://data-dawm.github.io/datum/reseller/products.json')
        .then(result => {
            if (result.success) {
                const container = document.getElementById("products-container");
                container.innerHTML = '';
                const products = result.body.slice(0, 6);
                products.forEach(product => {
                    let productHTML = `
                        <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                            <img
                                class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
                                src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
                            <h3
                                class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
                                $[PRODUCT.PRICE]
                            </h3>

                            <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
                                <div class="space-y-2">
                                    <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                                        Ver en Amazon
                                    </a>
                                    <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
                                </div>
                            </div>
                        </div>`;

                    productHTML = productHTML.replaceAll('[PRODUCT.IMGURL]', product.imgUrl);
                    productHTML = productHTML.replaceAll('[PRODUCT.TITLE]', product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title);
                    productHTML = productHTML.replaceAll('[PRODUCT.PRICE]', product.price);
                    productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id);

                    container.innerHTML += productHTML;
                })

            } else {
                alert(result.message || 'Error al cargar los productos.');
            }

        })
};


/**
 * Descarga el XML de categorías y popula el <select id="categories"> con las opciones.
 * En caso de error muestra una alerta con el mensaje correspondiente.
 * 
 * @async
 * @function renderCategories
 * @returns {Promise<void>} Promesa resuelta cuando se ha actualizado el DOM o se lanzó una alerta en error.
 */
const renderCategories = async () => {
    try {
        const result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml');

        if (result.success) {
            const container = document.getElementById("categories");
            if (!container) return;

            container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;

            const categoriesXML = result.body;
            const categories = categoriesXML.getElementsByTagName('category');

            for (let category of categories) {
                const idEl = category.getElementsByTagName('id')[0];
                const nameEl = category.getElementsByTagName('name')[0];
                const id = idEl ? idEl.textContent.trim() : '';
                const name = nameEl ? nameEl.textContent.trim() : '';

                let categoryHTML = `<option value="[ID]">[NAME]</option>`;
                categoryHTML = categoryHTML.replace('[ID]', id).replace('[NAME]', name);

                container.innerHTML += categoryHTML;
            }
        } else {
            alert(result.message || 'Error al cargar las categorías.');
        }
    } catch (error) {
        alert(error.message || 'Error al cargar las categorías.');
    }
};

const enableForm = () => {
    const form = document.getElementById("form_voting");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const selectedProduct = document.getElementById("select_product").value;
        const result = await saveVote(selectedProduct);
        if (result.status === 'success') {
            console.log('Voto guardado correctamente.');
        } else {
            console.error('Error al guardar el voto: ' + result.message);
        }
    });
}

const displayVotes = async () => {
    const container = document.getElementById("results");
    if (!container) return;

    const result = await getVotes();

    if (result.status !== 'success') {
        container.innerHTML = `<p class="text-red-600">Error: ${result.message || 'No se pudieron obtener los votos.'}</p>`;
        return;
    }

    if (!result.data || Object.keys(result.data).length === 0) {
        container.innerHTML = `<p>No hay votos registrados.</p>`;
        return;
    }

    // Contar votos por productID
    const counts = {};
    for (const voteID in result.data) {
        const vote = result.data[voteID];
        const productID = vote?.productID ?? 'Sin producto';
        counts[productID] = (counts[productID] || 0) + 1;
    }

    // Construir tabla HTML
    let tableHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votos</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
    `;

    for (const [productID, total] of Object.entries(counts)) {
        tableHTML += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${productID}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${total}</td>
            </tr>
        `;
    }
    tableHTML += `
            </tbody>
        </table>
    `;
    container.innerHTML = tableHTML;
};

(() => {
    showToast();
    showVideo();
    renderProducts();
    renderCategories();
    enableForm();
    displayVotes();
})();