export const PROYECTOS_DESTACADOS = [
  'Siwo',
  'CodeCut',
  'portfolio',
  'Buscador-de-correos',
];

const CASOS = {
  siwo: {
    repo: 'Siwo',
    titulo: 'Siwö',
    categoria: 'BUSCADOR / FRONTEND',
    resumen: 'Archivo de openings y endings de anime con 623 series, filtros por temporada y un índice regenerado automáticamente.',
    problema: 'La colección original reunía cientos de enlaces, pero encontrar una serie concreta exigía navegar manualmente por una gran cantidad de contenido.',
    solucion: 'Convertí esa colección en un buscador estático rápido: el índice se genera durante el build, se enriquece con metadatos y queda listo para filtrar desde el navegador.',
    notaAutor: 'Lo más difícil no fue reunir cientos de enlaces, sino conseguir que la colección siguiera sintiéndose fácil de explorar. Cada filtro existe para reducir ese ruido.',
    loQueCambiaria: 'Añadiría favoritos y una búsqueda tolerante a errores para encontrar una serie incluso cuando el título esté incompleto o escrito de otra manera.',
    decisiones: [
      'Astro entrega una base estática ligera y React concentra la interacción del buscador.',
      'El índice se construye antes del despliegue para evitar una base de datos en producción.',
      'AniList funciona como proveedor principal de metadatos y Kitsu como respaldo.',
      'GitHub Actions regenera el contenido automáticamente para mantenerlo actualizado.',
    ],
    resultados: ['623 series', 'Cobertura 1999–2026', 'Actualización automática'],
    stack: ['Astro', 'React', 'Tailwind CSS', 'GitHub Actions'],
    metrica: '623',
    etiquetaMetrica: 'SERIES EN EL ARCHIVO',
    demo: 'https://kokeeu.github.io/Siwo/',
  },
  codecut: {
    repo: 'CodeCut',
    titulo: 'CodeCut 9:16',
    categoria: 'VIDEO / FULL-STACK',
    resumen: 'Editor de video vertical con timeline multi-clip, textos, transiciones, PIP y exportación mediante FFmpeg.',
    problema: 'Editar varias piezas para formato vertical requiere coordinar clips, cortes, capas y exportación sin perder el estado del proyecto.',
    solucion: 'Construí un editor con timeline interactivo y un flujo de exportación asíncrono que procesa la composición en el servidor y comunica el progreso en tiempo real.',
    notaAutor: 'La timeline terminó dictando todo el proyecto. Cada función nueva tenía que responder una pregunta sencilla: ¿hace más claro el montaje o solo añade otro control?',
    loQueCambiaria: 'Simplificaría la edición de audio y añadiría presets para pasar de clips brutos a una primera versión vertical con menos pasos.',
    decisiones: [
      'React y dnd-kit controlan selección, reordenamiento y edición dentro del timeline.',
      'IndexedDB conserva los medios disponibles y permite restaurar sesiones de trabajo.',
      'Express y FFmpeg procesan la composición vertical a 1080 × 1920.',
      'Server-Sent Events informa progreso, finalización o cancelación de cada exportación.',
    ],
    resultados: ['Hasta 10 videos', 'Salida 1080 × 1920', 'Progreso por SSE'],
    stack: ['React', 'Vite', 'Express', 'FFmpeg'],
    metrica: '9:16',
    etiquetaMetrica: 'EDICIÓN VERTICAL',
  },
  portfolio: {
    repo: 'portfolio',
    titulo: 'Portfolio digital',
    categoria: 'PORTFOLIO / FRONTEND',
    resumen: 'Portfolio personal construido con React Native Web y Expo Router, con una identidad de collage digital, módulos de interfaz y casos de estudio navegables.',
    problema: 'Una cuadrícula de repositorios no comunica por sí sola el criterio, el proceso ni la personalidad detrás del trabajo; el reto era convertir los proyectos técnicos en una experiencia reconocible.',
    solucion: 'Diseñé un sistema visual responsive que selecciona proyectos manualmente, obtiene sus datos desde GitHub y presenta cada pieza como un caso de estudio dentro de una identidad digital coherente.',
    notaAutor: 'Este sitio también es mi laboratorio visual. Lo ajusto mientras aprendo qué partes cuentan algo sobre mi trabajo y cuáles solo ocupan espacio.',
    loQueCambiaria: 'Quiero documentar más del proceso real —bocetos, decisiones descartadas y comparaciones— a medida que cada proyecto evolucione.',
    decisiones: [
      'React Native Web mantiene una base de componentes adaptable entre móvil y escritorio.',
      'Expo Router organiza la portada y las páginas dinámicas de cada caso de estudio.',
      'La selección manual evita que el orden del portfolio cambie cada vez que se actualiza GitHub.',
      'Las animaciones contenidas y la composición responsive conservan el carácter sin perjudicar la lectura.',
    ],
    resultados: ['4 casos curados', 'Lectura responsive', 'Datos desde GitHub'],
    stack: ['React Native', 'Expo Router', 'JavaScript', 'Reanimated'],
    metrica: '04',
    etiquetaMetrica: 'CASOS SELECCIONADOS',
    demo: 'https://portfolio-kokeeu.vercel.app/',
  },
  'buscador-de-correos': {
    repo: 'Buscador-de-correos',
    titulo: 'Buscador de correos',
    categoria: 'DATOS / FULL-STACK',
    resumen: 'Herramienta para localizar negocios, extraer correos públicos y exportar resultados a CSV.',
    problema: 'Encontrar contactos públicos de negocios locales combina búsqueda geográfica, revisión de sitios y limpieza de resultados en un proceso lento y repetitivo.',
    solucion: 'Construí una interfaz que consulta negocios por ubicación o texto, procesa sus sitios de forma concurrente y entrega resultados exportables mientras muestra el avance.',
    notaAutor: 'Encontrar correos era apenas la mitad del trabajo. La parte importante fue hacer visible qué estaba ocurriendo para que la espera no se sintiera como una pantalla congelada.',
    loQueCambiaria: 'Añadiría validación de dominio y una revisión de duplicados más explícita antes de exportar los resultados.',
    decisiones: [
      'Google Places obtiene negocios y Nominatim convierte direcciones en coordenadas.',
      'Cinco workers realizan scraping concurrente con límites de tiempo controlados.',
      'Server-Sent Events mantiene visible el progreso sin recargar la interfaz.',
      'El filtro de correos continúa buscando hasta completar el cupo o agotar resultados.',
    ],
    resultados: ['5 workers', 'Progreso en tiempo real', 'Exportación CSV'],
    stack: ['React', 'Flask', 'Python', 'Google Places'],
    metrica: 'CSV',
    etiquetaMetrica: 'DATOS EXPORTABLES',
  },
};

export const obtenerCasoProyecto = (nombre = '') => CASOS[nombre.toLowerCase()] || null;

export const seleccionarProyectos = (repositorios = []) => {
  const repositoriosPorNombre = new Map(
    repositorios.map((repositorio) => [repositorio.name.toLowerCase(), repositorio])
  );

  return PROYECTOS_DESTACADOS
    .map((nombre) => repositoriosPorNombre.get(nombre.toLowerCase()))
    .filter(Boolean);
};

export const obtenerSiguienteProyecto = (nombre = '') => {
  const indice = PROYECTOS_DESTACADOS.findIndex(
    (proyecto) => proyecto.toLowerCase() === nombre.toLowerCase()
  );
  const siguiente = PROYECTOS_DESTACADOS[(indice + 1) % PROYECTOS_DESTACADOS.length];
  return obtenerCasoProyecto(siguiente);
};
