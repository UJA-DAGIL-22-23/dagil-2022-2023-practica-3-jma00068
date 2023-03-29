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

Plantilla.plantillaTags = {
    "ID": "### ID ###",
    "NOMBRE": "### NOMBRE ###",
    "APELLIDOS": "### APELLIDOS ###",
    "FECHA NACIMIENTO": "### FECHA NACIMIENTO ###",
    "AÑOS GANA PREMIOS": "### AÑOS GANA PREMIOS ###",
    "NÚMERO CAMPEONATOS": "### NÚMERO CAMPEONATOS ###",
}

/// Plantilla para poner los datos de varios jugadores dentro de una tabla
Plantilla.tablaJugadores = {}

// Cabecera de la tabla
Plantilla.tablaJugadores.cabecera = `<table width="100%" class="listado-personas">
                    <thead>
                        <th width="15%">Id</th>
                        <th width="15%">Nombre</th>
                        <th width="20%">Apellidos</th>
                        <th width="15%">Fecha Nacimiento</th>
                        <th width="20%">Años gana premios</th>
                        <th width="15%">Número campeonatos</th>
                    </thead>
                    <tbody>
    `;

// Elemento TR que muestra los datos de un jugador
Plantilla.tablaJugadores.cuerpo = `
    <tr title="${Plantilla.plantillaTags.ID}">
        <td>${Plantilla.plantillaTags.ID}</td>
        <td>${Plantilla.plantillaTags.NOMBRE}</td>
        <td>${Plantilla.plantillaTags.APELLIDOS}</td>
        <td>${Plantilla.plantillaTags["FECHA NACIMIENTO"]}</td>
        <td>${Plantilla.plantillaTags["AÑOS GANA PREMIOS"]}</td>
        <td>${Plantilla.plantillaTags["NÚMERO CAMPEONATOS"]}</td>
    </tr>
    `;

// Pie de la tabla
Plantilla.tablaJugadores.pie = `        </tbody>
             </table>
             `;

/**
 * Actualiza el cuerpo de la plantilla deseada con los datos del jugador que se le pasa
 * @param {String} Plantilla Cadena conteniendo HTML en la que se desea cambiar los campos de la plantilla por datos
 * @param {Jugador} Jugador Objeto con los datos del jugador que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */           
Plantilla.sustituyeTags = function (plantilla, jugador) {
    let fecha_nac = jugador.data.fecha_nac.dia+"/"+jugador.data.fecha_nac.mes+"/"+jugador.data.fecha_nac.anio
    return plantilla
        .replace(new RegExp(Plantilla.plantillaTags.ID, 'g'), jugador.ref['@ref'].id)
        .replace(new RegExp(Plantilla.plantillaTags.NOMBRE, 'g'), jugador.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTags.APELLIDOS, 'g'), jugador.data.apellidos)
        .replace(new RegExp(Plantilla.plantillaTags["FECHA NACIMIENTO"], 'g'), fecha_nac)
        .replace(new RegExp(Plantilla.plantillaTags["AÑOS GANA PREMIOS"], 'g'), jugador.data.anio_gana_premio)
        .replace(new RegExp(Plantilla.plantillaTags["NÚMERO CAMPEONATOS"], 'g'), jugador.data.num_campeonatos)
}

/**
 * Actualiza el cuerpo de la tabla con los datos del jugador que se le pasa
 * @param {Jugador} Jugador Objeto con los datos del jugador que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */
Plantilla.tablaJugadores.actualiza = function (jugador) {
    return Plantilla.sustituyeTags(this.cuerpo, jugador)
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
 * Función para mostrar en pantalla todos los jugadores que se han recuperado de la BBDD.
 * @param {Vector_de_jugadores} vector Vector con los datos de los jugadores a mostrar
 */

Plantilla.imprimeMuchosJugadores = function (datosDescargados) {
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

    // Muestro todos los jugadores que se han descargado en forma de tabla
    else {
        let vectorJugadores = datosDescargados.data

        // Compongo el contenido que se va a mostrar dentro de la tabla
        mensajeAMostrar = Plantilla.tablaJugadores.cabecera
        vectorJugadores.forEach(e => mensajeAMostrar += Plantilla.tablaJugadores.actualiza(e))
        mensajeAMostrar += Plantilla.tablaJugadores.pie

    }

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar("Listado de jugadores", mensajeAMostrar)
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

/**
 * Función principal para responder al evento de elegir la opción "Listar jugadores" y mostrarlos de forma ordenada
 */
Plantilla.procesarJugadores = function () {
    this.descargarRuta("/plantilla/getTodos", this.imprimeMuchosJugadores);
}