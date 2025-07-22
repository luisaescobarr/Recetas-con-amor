// Menú hamburguesa (☰)
document.getElementById("menu-btn").addEventListener("click", function () {
  const menu = document.getElementById("menu-lateral");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
});

// Mostrar solo una sección a la vez
function mostrarSeccion(id) {
  const secciones = document.querySelectorAll(".seccion-opcion");
  secciones.forEach((sec) => (sec.style.display = "none"));
  document.getElementById(id).style.display = "block";
}

// Guardar foto en el álbum de recetas
document.getElementById("form-album").addEventListener("submit", function (e) {
  e.preventDefault();
  const fotoInput = document.getElementById("foto");
  const descripcionInput = document.getElementById("descripcion");

  const reader = new FileReader();
  reader.onload = function () {
    const imagenBase64 = reader.result;
    const descripcion = descripcionInput.value;

    const nuevaFoto = { imagen: imagenBase64, descripcion };
    let album = JSON.parse(localStorage.getItem("albumRecetas")) || [];
    album.push(nuevaFoto);
    localStorage.setItem("albumRecetas", JSON.stringify(album));
    mostrarAlbum();
    fotoInput.value = "";
    descripcionInput.value = "";
  };
  reader.readAsDataURL(fotoInput.files[0]);
});

// Mostrar el álbum guardado
function mostrarAlbum() {
  const galeria = document.getElementById("galeria");
  galeria.innerHTML = "";
  const album = JSON.parse(localStorage.getItem("albumRecetas")) || [];

  album.forEach((item, index) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "foto-tarjeta";
    tarjeta.innerHTML = `
      <img src="${item.imagen}" alt="Foto receta" width="200">
      <p>${item.descripcion}</p>
      <button onclick="eliminarFoto(${index})">🗑 Eliminar</button>
    `;
    galeria.appendChild(tarjeta);
  });
}

// Eliminar una foto del álbum
function eliminarFoto(index) {
  let album = JSON.parse(localStorage.getItem("albumRecetas")) || [];
  album.splice(index, 1);
  localStorage.setItem("albumRecetas", JSON.stringify(album));
  mostrarAlbum();
}

// Mostrar recetas favoritas
function mostrarFavoritas() {
  const favoritas = JSON.parse(localStorage.getItem("favoritas")) || [];
  const lista = document.getElementById("lista-favoritas");
  lista.innerHTML = "";

  favoritas.forEach((receta) => {
    const card = document.createElement("div");
    card.className = "card-receta";
    card.innerHTML = `
      <h3>${receta.nombre}</h3>
      <p>${receta.descripcion}</p>
    `;
    lista.appendChild(card);
  });
}

// Simulación de agregar a favoritos desde otras páginas (desayuno, etc.)
// Este código debe ir también en las otras páginas donde estén las recetas.
// Por ejemplo: 
// Cuando alguien haga clic en un ❤️, puedes usar algo como:
// agregarAFavoritos({ nombre: "Tortilla de verde", descripcion: "Tortilla ecuatoriana deliciosa" });

function agregarAFavoritos(receta) {
  let favoritas = JSON.parse(localStorage.getItem("favoritas")) || [];
  favoritas.push(receta);
  localStorage.setItem("favoritas", JSON.stringify(favoritas));
  alert("¡Receta guardada en favoritas! ❤️");
}

// Mostrar álbum y favoritas al cargar
window.onload = function () {
  mostrarAlbum();
  mostrarFavoritas();
};
