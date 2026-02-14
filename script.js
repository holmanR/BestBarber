/* ================= VARIABLES ================= */
let corteSeleccionado = "";
let precioSeleccionado = "";

function bloquesNecesarios(servicio) {
  if (servicio === "Cejas") return 1;   // 10 min
  if (servicio === "Barba") return 2;   // 20 min
  return 6; // Cortes y completo = 1 hora
}

const BLOQUES = [
  "08:00","08:10","08:20","08:30","08:40","08:50",
  "09:00","09:10","09:20","09:30","09:40","09:50",
  "10:00","10:10","10:20","10:30","10:40","10:50",
  "11:00","11:10","11:20","11:30","11:40","11:50",

  // ⛔ 12:00–13:00 almuerzo

  "13:00","13:10","13:20","13:30","13:40","13:50",
  "14:00","14:10","14:20","14:30","14:40","14:50",
  "15:00","15:10","15:20","15:30","15:40","15:50",
  "16:00","16:10","16:20","16:30","16:40","16:50",
  "17:00","17:10","17:20","17:30","17:40","17:50",
  "18:00","18:10","18:20","18:30","18:40","18:50",
  "19:00","19:10","19:20","19:30","19:40","19:50"
];

const CORTES = {
  degradado: {
    titulo: "",
    items: [
      { nombre: "Muller", precio: "10.000", tiempo: "40 min", img: "recursos/muler.jpeg" },
      { nombre: "Siete", precio: "10.000", tiempo: "40 min", img: "recursos/siete.jpg" },
      { nombre: "Low Fade", precio: "10.000", tiempo: "40 min", img: "recursos/low.jpg" },
      { nombre: "Degradado", precio: "10.000", tiempo: "40 min", img: "recursos/degradado.jpg" },
      { nombre: "Mohicano", precio: "10.000", tiempo: "40 min", img: "recursos/mohicano.jpeg" },
      { nombre: "Taper Fade", precio: "10.000", tiempo: "40 min", img: "recursos/taper fade.jpg" }
    ]
  },
};

/* ================= UTILIDAD ================= */
function ocultarTodo() {
  document.getElementById("vista-principal").style.display = "none";
  document.getElementById("vista-cortes").style.display = "none";
  document.getElementById("vista-galeria").style.display = "none";
  document.getElementById("vista-disenos").style.display = "none";
  document.getElementById("vista-local").style.display = "none";
}

/* ================= SPA ================= */
function mostrarCategoria(tipo) {
  ocultarTodo();
  document.getElementById("vista-cortes").style.display = "grid";
  document.querySelector(".volver-btn").classList.remove("oculto");

  document.getElementById("titulo-categoria").textContent = CORTES[tipo].titulo;

  const contenedor = document.getElementById("contenedor-cortes");
  contenedor.innerHTML = "";

  CORTES[tipo].items.forEach(corte => {
    contenedor.innerHTML += `
      <div class="card">
        <img src="${corte.img}">
        <div class="titulo-corte">
          <h3>${corte.nombre}</h3>
          <span class="tiempo">🕒 ${corte.tiempo}</span>
        </div>
        <p class="precio">$${corte.precio}</p>
        <button onclick="abrirModal('${corte.nombre}','${corte.precio}')">Reservar</button>
      </div>
    `;
  });

  window.scrollTo(0, 0);
}

function volverInicio() {
  ocultarTodo();
  document.getElementById("vista-principal").style.display = "grid";
  document.querySelector(".volver-btn").classList.add("oculto");
  window.scrollTo(0, 0);
}

/* ================= MODAL ================= */
function abrirModal(corte, precio) {
  corteSeleccionado = corte;
  precioSeleccionado = precio;

  document.querySelector(".hero").style.display = "none";
  document.getElementById("modal").style.display = "flex";

  const fechaInput = document.getElementById("fecha");
  fechaInput.dispatchEvent(new Event("change")); // 🔥 CLAVE
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
  document.querySelector(".hero").style.display = "flex";
}

/* ================= FECHA / HORAS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const fecha = document.getElementById("fecha");
  fecha.min = new Date().toISOString().split("T")[0];

  fecha.addEventListener("change", () => {
    const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    const d = new Date(fecha.value + "T00:00:00");
    document.getElementById("diaSemana").textContent = dias[d.getDay()];
    cargarHoras(fecha.value);
  });
});

function formatearHora12(hora24) {
  let [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")} ${ampm}`;
}

function convertirHoraTextoABloque(texto) {
  texto = texto.toLowerCase().replace(/\s/g, "");

  let match = texto.match(/(\d{1,2}):?(\d{0,2})(am|pm)/);
  if (!match) return null;

  let h = parseInt(match[1]);
  let m = match[2] ? parseInt(match[2]) : 0;
  let ampm = match[3];

  if (ampm === "pm" && h !== 12) h += 12;
  if (ampm === "am" && h === 12) h = 0;

  const hora24 = `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;

  return BLOQUES.includes(hora24) ? hora24 : null;
}

function sugerirHora(fecha, horaInicio, bloquesServicio) {
  const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
  const ocupados = reservas[fecha] || [];

  let index = BLOQUES.indexOf(horaInicio);

  for (let i = index + 1; i < BLOQUES.length; i++) {
    let disponible = true;

    for (let j = 0; j < bloquesServicio; j++) {
      const b = BLOQUES[i + j];
      if (!b || ocupados.includes(b)) {
        disponible = false;
        break;
      }
    }

    if (disponible) {
      return BLOQUES[i];
    }
  }

  return null;
}

function cargarHoras(fecha) {
  const select = document.getElementById("hora");
  select.innerHTML = `<option value="">Selecciona la hora</option>`;

  const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
  const ocupados = reservas[fecha] || [];

  const hoy = new Date();
  const fechaSeleccionada = new Date(fecha + "T00:00:00");

  const bloquesServicio = bloquesNecesarios(corteSeleccionado || "Corte");

  BLOQUES.forEach((bloque, i) => {

    // 🔒 SOLO permitir inicios alineados
    if (i % bloquesServicio !== 0) return;

    // Verificar espacio continuo
    let disponible = true;
    for (let j = 0; j < bloquesServicio; j++) {
      const b = BLOQUES[i + j];
      if (!b || ocupados.includes(b)) {
        disponible = false;
        break;
      }
    }
    if (!disponible) return;

    const [h, m] = bloque.split(":").map(Number);
    const horaBloque = new Date(fechaSeleccionada);
    horaBloque.setHours(h, m, 0, 0);

    const esHoy = hoy.toDateString() === fechaSeleccionada.toDateString();
    const yaPaso = esHoy && horaBloque <= hoy;
    if (yaPaso) return;

    select.innerHTML += `<option value="${bloque}">${formatearHora12(bloque)}</option>`;
  });
}

/* ================= WHATSAPP ================= */
function enviarWhatsApp() {
  const nombre = document.getElementById("nombre").value;
  const fecha = document.getElementById("fecha").value;
  const horaTexto = document.getElementById("hora").value;
  const hora = convertirHoraTextoABloque(horaTexto);
  const pago = document.getElementById("pago").value;
  const dia = document.getElementById("diaSemana").textContent;

   if (!nombre || !fecha || !horaTexto || !pago) {
     alert("Completa todos los campos");
     return;
   }

  if (!hora) {
    document.getElementById("sugerenciaHora").textContent =
    "Formato inválido. Ejemplo: 10:00 am";
    return;
  }


  const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
  if (!reservas[fecha]) reservas[fecha] = [];

  const bloques = bloquesNecesarios(corteSeleccionado);
  const index = BLOQUES.indexOf(hora);

  // 🔒 Verificamos que haya espacio suficiente
  for (let i = 0; i < bloques; i++) {
   const bloque = BLOQUES[index + i];
   if (!bloque || reservas[fecha].includes(bloque)) {
     const sugerida = sugerirHora(fecha, hora, bloques);
     if (sugerida) {
      document.getElementById("sugerenciaHora").innerHTML =
        `❌ Esa hora no está disponible.<br>
         ✅ Turno cercano: ${formatearHora12(sugerida)}`;
     } else {
      document.getElementById("sugerenciaHora").textContent =
        "❌ No hay horarios disponibles ese día";
     }

      return;
    }
  }

  // Guardamos todos los bloques ocupados
  for (let i = 0; i < bloques; i++) {
    reservas[fecha].push(BLOQUES[index + i]);
  }
  document.getElementById("sugerenciaHora").textContent = "";
  localStorage.setItem("reservas", JSON.stringify(reservas));

  const msg =
    `*Reserva de turno* %0A%0A` +
    `*Nombre*: ${nombre}%0A` +
    `*Servicio*: ${corteSeleccionado}%0A` +
    `*Fecha*: ${fecha} (${dia})%0A` +
    `*Hora inicio*: ${hora}%0A` +
    `*Pago*: ${pago}`;

  window.open(`https://wa.me/573219538179?text=${msg}`, "_blank");
  cerrarModal();
}

/* ================= BARRA SUPERIOR ================= */
function mostrarGaleria() {
  ocultarTodo();
  document.getElementById("vista-galeria").style.display = "grid";
  document.querySelector(".volver-btn").classList.remove("oculto");
  window.scrollTo(0, 0);
}

function mostrarDisenos() {
  ocultarTodo();
  document.getElementById("vista-disenos").style.display = "grid";
  document.querySelector(".volver-btn").classList.remove("oculto");
  window.scrollTo(0, 0);
}

function mostrarLocal() {
  ocultarTodo();
  document.getElementById("vista-local").style.display = "grid";
  document.querySelector(".volver-btn").classList.remove("oculto");
  window.scrollTo(0, 0);
}