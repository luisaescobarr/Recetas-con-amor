document.addEventListener('DOMContentLoaded', () => {
  const categorias = document.querySelectorAll('.categoria');
  let categoriaAbierta = null;

  // Datos ejemplo: 10 recetas por categoría con más detalles
  const recetasPorCategoria = {
    'Desayuno': [
      {
        nombre: 'Tostadas con aguacate',
        descripcion: 'Deliciosas y saludables.',
        valorNutricional: '250 kcal por porción',
        ingredientes: [
          { nombre: 'Pan integral', cantidad: 2, unidad: 'rebanadas' },
          { nombre: 'Aguacate', cantidad: 0.5, unidad: 'pieza' },
          { nombre: 'Sal', cantidad: 0.25, unidad: 'cucharadita' },
          { nombre: 'Pimienta', cantidad: 0.1, unidad: 'cucharadita' }
        ],
        pasos: [
          'Tostar el pan integral.',
          'Machacar el aguacate con sal y pimienta.',
          'Untar el aguacate sobre el pan tostado.',
          'Servir y disfrutar.'
        ]
      },
      // ... aquí irían las otras 9 recetas con detalle (por simplicidad omito, pero luego podemos ir agregándolas)
    ],
    // Otras categorías con sus recetas...
  };

  const main = document.querySelector('main');
  let divRecetas, listaRecetas, inputBuscar;
  let modalReceta;

  // Función para crear la vista completa de la receta
  function mostrarRecetaCompleta(receta) {
    // Si ya hay un modal abierto, eliminarlo
    if (modalReceta) modalReceta.remove();

    modalReceta = document.createElement('div');
    modalReceta.classList.add('modal-receta');

    // Crear el contenido del modal
    modalReceta.innerHTML = `
      <div class="modal-contenido">
        <button class="cerrar-modal" aria-label="Cerrar receta">&times;</button>
        <h2>${receta.nombre}</h2>
        <p><em>${receta.descripcion}</em></p>
        <p><strong>Valor nutricional:</strong> ${receta.valorNutricional}</p>
        <h3>Ingredientes:</h3>
        <div class="ingredientes-calculadora">
          ${receta.ingredientes.map((ing, i) => `
            <div class="ingrediente" data-cantidad="${ing.cantidad}" data-unidad="${ing.unidad}">
              <span class="cantidad">${ing.cantidad}</span> ${ing.unidad} de ${ing.nombre}
            </div>
          `).join('')}
          <label for="porciones">Porciones:</label>
          <input type="number" id="porciones" min="1" max="100" value="1" />
        </div>
        <h3>Pasos:</h3>
        <ol>
          ${receta.pasos.map(paso => `<li>${paso}</li>`).join('')}
        </ol>
      </div>
    `;

    document.body.appendChild(modalReceta);

    // Función para actualizar cantidades según porciones
    const inputPorciones = modalReceta.querySelector('#porciones');
    const ingredientesDivs = modalReceta.querySelectorAll('.ingrediente');

    inputPorciones.addEventListener('input', () => {
      let factor = Number(inputPorciones.value);
      if (factor < 1) factor = 1;
      if (factor > 100) factor = 100;
      ingredientesDivs.forEach(div => {
        const cantidadBase = parseFloat(div.dataset.cantidad);
        const unidad = div.dataset.unidad;
        div.querySelector('.cantidad').textContent = (cantidadBase * factor).toFixed(2).replace(/\.00$/, '');
        div.childNodes[2].textContent = ` ${unidad} de ${div.textContent.split(' de ')[1]}`; 
      });
    });

    // Botón para cerrar modal
    modalReceta.querySelector('.cerrar-modal').addEventListener('click', () => {
      modalReceta.remove();
      modalReceta = null;
    });
  }

  // Función para mostrar recetas en la lista (filtrado)
  function mostrarRecetas(nombreCat, filtro = '') {
    listaRecetas.innerHTML = ''; // Limpiar
    const filtroMinus = filtro.toLowerCase();

    const recetas = recetasPorCategoria[nombreCat] || [];

    recetas.forEach(receta => {
      if (receta.nombre.toLowerCase().includes(filtroMinus) || receta.descripcion.toLowerCase().includes(filtroMinus)) {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-receta');
        tarjeta.innerHTML = `
          <h3>${receta.nombre}</h3>
          <p>${receta.descripcion}</p>
          <button class="ver-receta-btn">Ver receta</button>
        `;

        // Evento para mostrar receta completa
        tarjeta.querySelector('.ver-receta-btn').addEventListener('click', () => {
          mostrarRecetaCompleta(receta);
        });

        listaRecetas.appendChild(tarjeta);
      }
    });

    if (listaRecetas.innerHTML === '') {
      listaRecetas.innerHTML = '<p>No se encontraron recetas.</p>';
    }
  }

  // Evento para los botones de categoría
  categorias.forEach(categoria => {
    categoria.addEventListener('click', () => {
      const nombreCat = categoria.textContent;

      // Si ya hay una categoría abierta y es distinta, la cerramos
      if (categoriaAbierta && categoriaAbierta !== nombreCat) {
        const anteriorDiv = document.querySelector('.recetas-desplegadas');
        if (anteriorDiv) anteriorDiv.remove();
      }

      // Si la misma categoría está abierta, la cerramos
      const contenedorActual = document.querySelector('.recetas-desplegadas');
      if (contenedorActual && categoriaAbierta === nombreCat) {
        contenedorActual.remove();
        categoriaAbierta = null;
        return;
      }

      // Crear div para mostrar recetas
      divRecetas = document.createElement('div');
      divRecetas.classList.add('recetas-desplegadas');

      // Crear buscador en tiempo real
      inputBuscar = document.createElement('input');
      inputBuscar.type = 'search';
      inputBuscar.placeholder = `Buscar en ${nombreCat}...`;
      inputBuscar.classList.add('buscador-categoria');

      divRecetas.appendChild(inputBuscar);

      // Crear lista de recetas
      listaRecetas = document.createElement('div');
      listaRecetas.classList.add('lista-recetas');
      divRecetas.appendChild(listaRecetas);

      categoria.after(divRecetas);

      categoriaAbierta = nombreCat;

      mostrarRecetas(nombreCat);

      // Escuchar el input para buscar en tiempo real
      inputBuscar.addEventListener('input', (e) => {
        mostrarRecetas(nombreCat, e.target.value);
      });
    });
  });
});
.modal-receta {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(84, 88, 85, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenido {
  background-color: #F6CEC8;
  padding: 25px;
  border-radius: 15px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 6px 12px rgba(84, 88, 85, 0.4);
  position: relative;
}

.cerrar-modal {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  color: #545855;
}

.ingredientes-calculadora {
  margin-bottom: 20px;
}

.ingrediente {
  font-family: 'Baloo 2', cursive;
  font-size: 1rem;
  margin-bottom: 5px;
}

#porciones {
  width: 60px;
  margin-left: 10px;
  padding: 5px;
  border-radius: 10px;
  border: 2px solid #D19793;
  font-size: 1rem;
}

#porciones:focus {
  outline: none;
  border-color: #545855;
}
