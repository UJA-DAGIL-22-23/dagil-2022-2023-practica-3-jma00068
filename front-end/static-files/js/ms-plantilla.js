/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};

// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = {
    mensaje: "Datos Descargados No válidos",
    autor: "",
    email: "",
    fecha: ""
}

/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}


/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos

    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "getNombres" de MS Plantilla
 */
Plantilla.mostrarNombres = function (datosDescargados) {
    // Mensaje que se enviará para mostrar los datos
    let mensajeAMostrar = ""

    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto  o NO contiene el campo data
    if (typeof datosDescargados !== "object" || typeof datosDescargados.data === "undefined") {
        datosDescargados = this.datosDescargadosNulos
        mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    }

    // Muestro todos los jugadores que se han descargado
    else {
        let numJugador = 1
        mensajeAMostrar = `<a href="javascript:Plantilla.procesarNombresOrdenados()" class="opcion-principal"
        title="Llama a la ruta /getNombres del MS Plantilla">Ordenar alfabéticamente</a><ul>`;
        datosDescargados.data.forEach(element => {
            mensajeAMostrar += `<li><b>Nombre jugador ${numJugador}</b>: ${element}</li>`
            numJugador++
        });
        mensajeAMostrar += `</ul>`;
        datosDescargados = mensajeAMostrar
    }
    Frontend.Article.actualizar("Listado de nombres de los jugadores de Golf", mensajeAMostrar)
}

/**
 * Función principal para mostrar los datos enviados de forma ordenada por la ruta "getNombres" de MS Plantilla
 */
Plantilla.mostrarNombresOrdenados = function (datosDescargados) {
    // Mensaje que se enviará para mostrar los datos
    let mensajeAMostrar = ""

    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto  o NO contiene el campo data
    if (typeof datosDescargados !== "object" || typeof datosDescargados.data === "undefined") {
        datosDescargados = this.datosDescargadosNulos
        mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    }

    // Muestro todos los jugadores que se han descargado de forma ordenada alfabéticamente
    else {
        datosDescargados.data.sort() // Ordenamos los nombres recibidos
        let numJugador = 1
        mensajeAMostrar = `<a href="javascript:Plantilla.procesarNombres()" class="opcion-principal"
        title="Llama a la ruta /getNombres del MS Plantilla">Quitar orden alfabético</a><ul>`;
        datosDescargados.data.forEach(element => {
            mensajeAMostrar += `<li><b>Nombre jugador ${numJugador}</b>: ${element}</li>`
            numJugador++
        });
        mensajeAMostrar += `</ul>`;
        datosDescargados = mensajeAMostrar
    }
    Frontend.Article.actualizar("Listado de nombres de los jugadores de Golf", mensajeAMostrar)
}

/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () {
    this.descargarRuta("/plantilla/", this.mostrarHome);
}

/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () {
    this.descargarRuta("/plantilla/acercade", this.mostrarAcercaDe);
}

/**
 * Función principal para responder al evento de elegir la opción "Nombres jugadores"
 */
Plantilla.procesarNombres = function () {
    this.descargarRuta("/plantilla/getNombres", this.mostrarNombres);
}

/**
 * Función principal para responder al evento de elegir la opción "Nombres jugadores" y mostrarlos de forma ordenada
 */
Plantilla.procesarNombresOrdenados = function () {
    this.descargarRuta("/plantilla/getNombres", this.mostrarNombresOrdenados);
}