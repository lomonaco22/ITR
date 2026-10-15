
var form = document.getElementById("attendance-form");
var nombreInput = document.getElementById("nombre");
var cursoInput = document.getElementById("curso");
var fechaInput = document.getElementById("fecha");
var message = document.getElementById("form-message");
var historyBody = document.getElementById("history-body");

var presentCount = document.getElementById("present-count");
var absentCount = document.getElementById("absent-count");
var justifiedCount = document.getElementById("justified-count");

var historyButton = document.getElementById("history-button");
var clearButton = document.getElementById("clear-history");

var registros = [];

var presentesBase = 18;
var ausentesBase = 2;
var justificadosBase = 1;

// Colocar la fecha actual automáticamente.
var hoy = new Date();
var anio = hoy.getFullYear();
var mes = String(hoy.getMonth() + 1).padStart(2, "0");
var dia = String(hoy.getDate()).padStart(2, "0");

fechaInput.value = anio + "-" + mes + "-" + dia;

// Actualizar los números del resumen.
function actualizarResumen() {
    presentCount.textContent = presentesBase + registros.length;
    absentCount.textContent = ausentesBase;
    justifiedCount.textContent = justificadosBase;
}

// Mostrar los registros en la tabla.
function mostrarHistorial() {
    historyBody.innerHTML = "";

    if (registros.length === 0) {
        var filaVacia = document.createElement("tr");
        filaVacia.className = "empty-row";

        var celdaVacia = document.createElement("td");
        celdaVacia.colSpan = 4;
        celdaVacia.textContent = "Todavía no hay registros nuevos.";

        filaVacia.appendChild(celdaVacia);
        historyBody.appendChild(filaVacia);

        return;
    }

    var i = 0;

    while (i < registros.length) {
        var registro = registros[i];
        var fila = document.createElement("tr");

        var celdaNombre = document.createElement("td");
        celdaNombre.textContent = registro.nombre;
        fila.appendChild(celdaNombre);

        var celdaCurso = document.createElement("td");
        celdaCurso.textContent = registro.curso;
        fila.appendChild(celdaCurso);

        var celdaFecha = document.createElement("td");
        celdaFecha.textContent = registro.fecha;
        fila.appendChild(celdaFecha);

        var celdaEstado = document.createElement("td");
        var etiqueta = document.createElement("span");

        etiqueta.className = "state-pill";
        etiqueta.textContent = "Presente";

        celdaEstado.appendChild(etiqueta);
        fila.appendChild(celdaEstado);

        historyBody.appendChild(fila);

        i++;
    }
}

// Registrar una asistencia.
form.addEventListener("submit", function(event) {
    event.preventDefault();

    var nombre = nombreInput.value.trim();
    var curso = cursoInput.value;
    var fecha = fechaInput.value;

    if (nombre === "" || curso === "" || fecha === "") {
        message.textContent = "Completá todos los campos.";
        message.className = "form-message error";
        return;
    }

    var partesFecha = fecha.split("-");
    var fechaFormateada =
        partesFecha[2] + "/" +
        partesFecha[1] + "/" +
        partesFecha[0];

    var nuevoRegistro = {
        nombre: nombre,
        curso: curso,
        fecha: fechaFormateada
    };

    registros.push(nuevoRegistro);

    mostrarHistorial();
    actualizarResumen();

    message.textContent = "¡Asistencia registrada correctamente!";
    message.className = "form-message success";

    form.reset();

    // Volver a colocar la fecha actual.
    fechaInput.value = anio + "-" + mes + "-" + dia;
});

// Ir al historial cuando se presiona el botón.
historyButton.addEventListener("click", function() {
    document.getElementById("historial").scrollIntoView({
        behavior: "smooth"
    });
});

// Borrar los registros nuevos.
clearButton.addEventListener("click", function() {
    if (registros.length === 0) {
        message.textContent = "No hay registros nuevos para borrar.";
        message.className = "form-message error";
        return;
    }

    var confirmar = confirm(
        "¿Querés borrar todos los registros nuevos de esta sesión?"
    );

    if (confirmar) {
        registros = [];

        mostrarHistorial();
        actualizarResumen();

        message.textContent = "Se borraron los registros nuevos.";
        message.className = "form-message success";
    }
});

// Marcar la opción del menú que se selecciona.
var enlacesMenu = document.querySelectorAll(".nav-link");
var i = 0;

while (i < enlacesMenu.length) {
    enlacesMenu[i].addEventListener("click", function() {
        var j = 0;

        while (j < enlacesMenu.length) {
            enlacesMenu[j].classList.remove("active");
            j++;
        }

        this.classList.add("active");
    });

    i++;
}

// Mostrar los datos iniciales.
actualizarResumen();
mostrarHistorial();
