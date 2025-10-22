"use strict";

/**
 * Muestra un elemento toast en pantalla si existe en el DOM.
 * 
 * Esta función busca un elemento con el ID "toast-interactive" y,
 * si lo encuentra, le agrega la clase "md:block" para hacerlo visible
 * en dispositivos medianos en adelante.
 * 
 * @function
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
 * @function
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

(() => {
    showToast();
    showVideo();
})();