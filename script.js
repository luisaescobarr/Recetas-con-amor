document.addEventListener('DOMContentLoaded', () => {
  const categorias = document.querySelectorAll('.categoria');
  let categoriaAbierta = null;

  // Datos ejemplo: 10 recetas por categoría (solo nombres y descripciones simples)
  const recetasPorCategoria = {
    'Desayuno': [
      { nombre: 'Tostadas con aguacate', descripcion: 'Deliciosas y saludables.' },
      { nombre: 'Huevos revueltos', descripcion: 'Clásico y nutritivo.' },
      { nombre: 'Smoothie de frutas', descripcion: 'Refrescante y dulce.' },
      { nombre: 'Pancakes de avena', descripcion: 'Perfectos para un día frío.' },
      { nombre: 'Yogur con granola', descripcion: 'Ligero y crocante.' },
      { nombre: 'Bowl de frutas', descripcion: 'Frescura en cada bocado.' },
      { nombre: 'Muffins integrales', descripcion: 'Dulces y saludables.' },
      { nombre: 'Avena con miel', descripcion: 'Energía para empezar.' },
      { nombre: 'Pan integral con queso', descripcion: 'Sencillo y rico.' },
      { nombre: 'Café con leche', descripcion: 'Clásico acompañante.' }
    ],
    'Almuerzo': [
      { nombre: 'Ensalada César', descripcion: 'Clásica y fresca.' },
      { nombre: 'Pechuga a la plancha', descripcion: 'Proteína magra.' },
      { nombre: 'Arroz con verduras', descripcion: 'Colorido y sabroso.' },
      { nombre: 'Sopa de pollo', descripcion: 'Calentita y reconfortante.' },
      { nombre: 'Pasta al pesto', descripcion: 'Sabor italiano.' },
      { nombre: 'Quinoa con verduras', descripcion: 'Nutritiva y ligera.' },
      { nombre: 'Tacos vegetarianos', descripcion: 'Ricos y saludables.' },
      { nombre: 'Lentejas guisadas', descripcion: 'Clásico casero.' },
      { nombre: 'Filete de pescado', descripcion: 'Delicado y sabroso.' },
      { nombre: 'Ensalada de garbanzos', descripcion: 'Proteína vegetal.' }
    ],
    'Cena': [
      { nombre: 'Pizza casera', descripcion: 'Para compartir.' },
      { nombre: 'Crema de calabaza', descripcion: 'Suave y nutritiva.' },
      { nombre: 'Salmón al horno', descripcion: 'Rico en omega 3.' },
      { nombre: 'Vegetales salteados', descripcion: 'Fácil y rápido.' },
      { nombre: 'Pollo al curry', descripcion: 'Exótico y sabroso.' },
      { nombre: 'Tortilla española', descripcion: 'Clásico español.' },
      { nombre: 'Risotto de champiñones', descripcion: 'Cremoso y delicioso.' },
      { nombre: 'Ensalada caprese', descripcion: 'Simple y fresca.' },
      { nombre: 'Hamburguesa casera', descripcion: 'Para consentirte.' },
      { nombre: 'Puré de papas', descripcion: 'Suave y reconfortante.' }
    ],
    'Bebidas': [
      { nombre: 'Limonada natural', descripcion: 'Refrescante y fácil.' },
      { nombre: 'Batido de fresa', descripcion: 'Dulce y cremoso.' },
      { nombre: 'Té verde', descripcion: 'Saludable y ligero.' },
      { nombre: 'Café helado', descripcion: 'Para los amantes del café.' },
      { nombre: 'Jugo de naranja', descripcion: 'Vitaminas al máximo.' },
      { nombre: 'Smoothie detox', descripcion: 'Limpia tu cuerpo.' },
      { nombre: 'Agua de coco', descripcion: 'Natural y deliciosa.' },
      { nombre: 'Chocolate caliente', descripcion: 'Ideal para días fríos.' },
      { nombre: 'Té de manzanilla', descripcion: 'Relajante y calmante.' },
      { nombre: 'Mojito sin alcohol', descripcion: 'Fresco y divertido.' }
    ],
    'Postres': [
      { nombre: 'Brownies de chocolate', descripcion: 'Clásicos y deliciosos.' },
      { nombre: 'Tarta de limón', descripcion: 'Ácida y dulce.' },
      { nombre: 'Helado casero', descripcion: 'Para los días calurosos.' },
      { nombre: 'Flan tradicional', descripcion: 'Suave y cremoso.' },
      { nombre: 'Mousse de maracuyá', descripcion: 'Exótico y ligero.' },
      { nombre: 'Galletas de avena', descripcion: 'Crujientes y saludables.' },
      { nombre: 'Cheesecake', descripcion: 'Clásico irresistible.' },
      { nombre: 'Pudín de chía', descripcion: 'Nutritivo y refrescante.' },
      { nombre: 'Tiramisú', descripcion: 'Italiano y delicioso.' },
      { nombre: 'Manzana asada', descripcion: 'Sencillo y dulce.' }
    ]
  };

  // Crear contenedor para desplegar recetas
  const main = document.querySelector('main');

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
      const divRecetas = document.createElement('div');
      divRecetas.classList.add('recetas-desplegadas');

      // Crear buscador en tiempo real
      const inputBuscar = document.createElement('input');
      inputBuscar.type = 'search';
      inputBuscar.placeholder = `Buscar en ${nombreCat}...`;
      inputBuscar.classList.add('buscador-categoria');

      divRecetas.appendChild(inputBuscar);

      // Crear lista de recetas
      const listaRecetas = document.createElement('div');
      listaRecetas.classList.add('lista-recetas');

      // Función para mostrar recetas filtradas
      const mostrarRecetas = (filtro = '') => {
        listaRecetas.innerHTML = ''; // Limpiar
        const filtroMinus = filtro.toLowerCase();

        recetasPorCategoria[nombreCat].forEach(receta => {
          if (receta.nombre.toLowerCase().includes(filtroMinus) || receta.descripcion.toLowerCase().includes(filtroMinus)) {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta-receta');
            tarjeta.innerHTML = `
              <h3>${receta.nombre}</h3>
              <p>${receta.descripcion}</p>
              <button class="ver-receta-btn">Ver receta</button>
            `;
            listaRecetas.appendChild(tarjeta);
          }
        });

        if (listaRecetas.innerHTML === '') {
          listaRecetas.innerHTML = '<p>No se encontraron recetas.</p>';
        }
      };

      mostrarRecetas();

      // Escuchar el input para buscar en tiempo real
      inputBuscar.addEventListener('input', (e) => {
        mostrarRecetas(e.target.value);
      });

      divRecetas.appendChild(listaRecetas);
      categoria.after(divRecetas);

      categoriaAbierta = nombreCat;
    });
  });
});
