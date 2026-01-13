/* ================= VARIABLES ================= */
let corteSeleccionado = "";
let precioSeleccionado = "";

const HORAS = [
  "08:00 am","09:00 am","10:00 am","11:00 am",
  "12:00 pm","02:00 pm","03:00 pm","04:00 pm",
  "05:00 pm","06:00 pm","07:00 pm","08:00 pm"
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
  cejas: {
    titulo: "",
    items: [
      { nombre: "Cejas", precio: "2.000", tiempo: "5 min", img: "recursos/cejas.webp" }
    ]
  },
  barba: {
    titulo: "",
    items: [
      { nombre: "Barba", precio: "5.000", tiempo: "10 min", img: "recursos/barba.jpeg" }
    ]
  },
  completo: {
    titulo: "",
    items: [
      { nombre: "Servicio Completo", precio: "15.000", tiempo: "1 hora", img: "recursos/completo.jpg" }
    ]
  }
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

function cargarHoras(fecha) {
  const select = document.getElementById("hora");
  select.innerHTML = `<option value="">Selecciona la hora</option>`;

  const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
  const ocupadas = reservas[fecha] || [];

  HORAS.forEach(hora => {
    if (!ocupadas.includes(hora)) {
      select.innerHTML += `<option>${hora}</option>`;
    }
  });
}

/* ================= WHATSAPP ================= */
function enviarWhatsApp() {
  const nombre = document.getElementById("nombre").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const pago = document.getElementById("pago").value;
  const dia = document.getElementById("diaSemana").textContent;

  if (!nombre || !fecha || !hora || !pago) {
    alert("Completa todos los campos");
    return;
  }

  const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
  if (!reservas[fecha]) reservas[fecha] = [];
  reservas[fecha].push(hora);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  const msg =
    `*Hola, quiero reservar un turno* %0A%0A` +
    `*Nombre*: ${nombre}%0A` +
    `*Corte*: ${corteSeleccionado}%0A` +
    `*Fecha*: ${fecha} (${dia})%0A` +
    `*Hora*: ${hora}%0A` +
    `*Precio*: $${precioSeleccionado}%0A` +
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