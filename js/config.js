/* =====================================================================
   CÓMO EDITAR TU PORTAFOLIO
   =====================================================================
   Este es el ÚNICO archivo que tienes que tocar para cambiar textos,
   videos, precios y secciones. No hace falta saber programar.

   HAY DOS FORMAS (usa la que te resulte más fácil):

   A) Formulario
1. Abre crear/index.html con doble clic.
         Si el sitio ya está en internet, entra a la dirección y agrega /crear/
2. Cambia lo que quieras.
3. Pulsa "Descargar config.js".
4. Mete ese archivo dentro de la carpeta js, reemplazando este.
5. Abre index.html y pulsa F5 para recargar.

   B) Editar aquí mismo
1. Cambia el texto que está entre comillas. Ejemplo: "Desmos"
2. mostrar: true   = esa parte SÍ se ve en la página
         mostrar: false  = esa parte NO se ve
         true y false se escriben SIN comillas.
3. Para sumar un video, un precio, un servicio o una sección,
         copia un bloque que ya exista, desde { hasta } , y pégalo debajo.
         Deja la coma al final del bloque.
4. No borres comas , ni llaves { } ni corchetes [ ].
5. Guarda (Ctrl + S) y recarga index.html (F5).

   SI LA PÁGINA SE QUEDA EN BLANCO O SE VE RARA
      Casi siempre se borró una coma, una comilla o una llave.
      Deshaz el último cambio (Ctrl + Z), guarda y recarga.
      O genera el archivo otra vez desde crear/index.html.

   TEXTOS CON ESTILO  (puedes usarlo en títulos y párrafos)
      *esta frase*              se ve en negrita
      {esta frase}              se ve con el color degradado
      [Pídemelos](#contacto)    enlace dentro de la página
      [YouTube](https://...)    enlace a otra web
      NOMBRE                    se cambia solo por el nombre de arriba

   VIDEOS  (el campo "video")
      Puedes pegar cualquiera de estas tres cosas:
      1) Link de Google Drive. El archivo tiene que estar compartido
         como "Cualquier persona con el enlace".
      2) Link de YouTube, de un Short o de un directo.
      3) Un archivo de la carpeta, por ejemplo assets/video/mi-video.mp4
      La miniatura de Drive y de YouTube sale sola.
      formato: "vertical" (reels), "horizontal" (YouTube) o "cuadrado".
      También valen "9:16", "16:9", "1:1" y "4:5".

   MÁS VIDEOS Y LA PÁGINA SE SIGUE VIENDO BIEN
      En cada galería, columnas: "auto" acomoda las tarjetas solas.
      Da igual si pones 1, 4 o 20: en el celular se apilan y en la
      computadora se reparten en filas. Los horizontales salen más anchos
      y los verticales más angostos. Si quieres forzar el número,
      escribe 2, 3 o 4 (sin comillas).

   SECCIONES NUEVAS
      El orden de la página es la lista "orden": lo de arriba sale primero.
      La portada y la cinta de palabras van siempre arriba del todo.
      Para inventar una sección, ve a seccionesExtra (está hacia el final),
      pon mostrar: true y, si quieres elegir el lugar, agrega su id en "orden".
      tipo puede ser:
        "texto"     título, párrafos y una lista
        "videos"    otra tanda de videos, distinta de los proyectos
        "tarjetas"  fichas como las de Servicios
        "pasos"     pasos en orden, como Proceso
   ===================================================================== */

window.PORTAFOLIO = {

  /* =====================================================================
     1) QUIÉN ERES
     Esto se usa en el menú, la portada, el contacto y los mensajes.
     ===================================================================== */
  perfil: {
    nombre: "Desmos", // se escribe NOMBRE en los textos para usar este nombre
    rol: "Editor de video",
    email: "desmosedit@gmail.com", // vacío "" = no se muestra el botón de email
    whatsapp: "", // con código de país, ej. "+53 5123 4567". Vacío = no se muestra
    nacionalidad: "Cubano", // si escribes Cuba, Cubano o Cubana sale la bandera
    ubicacion: "", // opcional, ej. "La Habana, Cuba"
    icono: "assets/img/apple-touch-icon.png", // cuadradito del menú
    favicon: "assets/img/favicon.png", // icono de la pestaña del navegador
    redes: {
      // Pega el link completo. Vacío "" = esa red no se muestra.
      instagram: "",
      tiktok: "",
      youtube: "",
      facebook: "",
      otra: { nombre: "", enlace: "" }, // una red más, si la necesitas
    },
  },

  /* =====================================================================
     2) INTRO  (el video negro que sale una vez al entrar)
     ===================================================================== */
  intro: {
    mostrar: true, // false = entra directo a la página, sin intro
    video: "assets/video/intro.mp4",
    nombre: "", // vacío = usa tu nombre en mayúsculas
    rol: "", // vacío = usa el rol de arriba
    botonSaltar: "Saltar intro",
  },

  /* =====================================================================
     3) PORTADA  (lo primero que se ve, en grande)
     ===================================================================== */
  portada: {
    mostrar: true,
    etiqueta: "Editor de video · Contenido para redes",
    titulo: "Hey, soy {NOMBRE}.", // {así} sale en color. NOMBRE = tu nombre
    texto: "Edito *reels, TikToks, videos de YouTube y anuncios* que atrapan en los primeros segundos, retienen hasta el final y generan resultados reales.",
    botonPrincipal: { texto: "Ver trabajos", enlace: "#trabajos" },
    botonSecundario: { texto: "Cotizar mi video", enlace: "#contacto" },
    // Cada dato es una línea chiquita debajo de los botones. Copia un bloque para sumar otro.
    datos: [
      { titulo: "Plataformas", texto: "Reels · TikTok · YouTube · Ads" },
      { titulo: "Formatos", texto: "9:16 · 1:1 · 16:9" },
      { titulo: "Software", texto: "CapCut" },
    ],
    videoFondo: "assets/video/hero-bg.mp4", // vacío "" = sin video de fondo
    poster: "assets/img/hero-poster.jpg",
    logo: "assets/img/logo.webp", // vacío "" = sin el dibujo de la pantera
    marca: "DESMOS · EDIT", // textito de la esquina. Vacío = no se muestra
    grabando: "REC",
    enlaceFlecha: "", // vacío = la flecha baja a la primera sección. O escribe "#contacto"
  },

  /* =====================================================================
     4) CINTA DE PALABRAS  (la franja que se mueve sola)
     ===================================================================== */
  cinta: {
    mostrar: true, // false = se esconde
    palabras: ["Reels", "TikTok", "YouTube", "Shorts", "Anuncios", "Subtítulos", "Color", "Sonido"],
  },

  /* =====================================================================
     5) ORDEN DE LAS SECCIONES
     Lo que está más arriba sale primero en la página.
     Para esconder una sección sin borrarla, pon su "mostrar" en false
     más abajo, o quita su nombre de esta lista.
     Para mostrar la sección de ejemplo, borra las dos barras // de "ejemplo".
     ===================================================================== */
  orden: [
    "proyectos",
    "trabajos",
    "casos",
    "servicios",
    "proceso",
    "precios",
    "sobre-mi",
    "contacto",
    // "ejemplo",
  ],

  /* =====================================================================
     6) GALERÍAS DE VIDEOS (INDEPENDIENTES DE "PROYECTOS")
     Aquí pones directamente los videos que quieras que aparezcan en cada
     galería, en el orden en que los escribas. No toman videos de
     "proyectos" a menos que tú copies los enlaces aquí.

     columnas: "auto" se acomoda solo (recomendado). También puedes poner 2, 3 o 4.
     filtros: true muestra botones para filtrar por categoría (si hay más de una).
     ===================================================================== */
  galerias: [
    {
      id: "proyectos",
      mostrar: true,
      menu: "Destacados",
      etiqueta: "Galería",
      titulo: "Videos destacados",
      texto: "Selección de videos destacados. Toca cualquiera para verlo completo.",
      columnas: "auto",
      filtros: false,
      nota: "",
      fondo: "normal",
      videos: [
        {
          titulo: "Reel promocional",
          categoria: "Reels",
          video: "https://drive.google.com/file/d/12Ls0Z6BI5OByFsp-hRTziNOBiqW2pNMz/view?usp=drive_link",
          formato: "vertical",
        },
        {
          titulo: "Reel de marketing",
          categoria: "Reels",
          video: "https://drive.google.com/file/d/15r0MXEd6PRzTu_tis4dkJi--yCA8FFVF/view?usp=drive_link",
          formato: "vertical",
          encuadre: "78% center",
        },
        {
          titulo: "Reel de atención al cliente",
          categoria: "Reels",
          video: "https://drive.google.com/file/d/1pmfnhKb67NKD8Mo2UrrKPJ5z0z8mkiLg/view?usp=drive_link",
          formato: "vertical",
        },
      ],
    },
    {
        /* Copia desde { hasta }, incluida la coma, para sumar más videos:
        {
          titulo: "Nuevo video destacado",
          categoria: "YouTube",
          video: "https://youtu.be/TU_ID_DE_VIDEO",
          formato: "horizontal", // "vertical", "horizontal" o "cuadrado"
          poster: "assets/posters/mi-foto.jpg", // opcional
          ajuste: "completo", // opcional: muestra miniatura sin recortar
          duracion: "0:30", // opcional
        },
        */
     id: "trabajos",
      mostrar: true,
      menu: "Trabajos",
      etiqueta: "Trabajos",
      titulo: "Más recientes",
      texto: "Algunos proyectos en los que he trabajado recientemente. Toca cualquier video para verlo completo.",
      columnas: "auto",
      filtros: true,
      nota: "¿Quieres ver más ejemplos de tu nicho? [Pídemelos](#contacto)",
      fondo: "normal",
      videos: [
        {
          titulo: "Reel promocional",
          categoria: "Reels",
          video: "https://drive.google.com/file/d/1lEChKCobo_hNs7IItBDpXoP-OZakmFUO/view?usp=drive_link",
          formato: "vertical",
        },
        {
          titulo: "Reel de marketing",
          categoria: "Reels",
          video: "https://drive.google.com/file/d/1o5zjafcEpZhvw3-PjpBZmwy0j_MqKT7Y/view?usp=drive_link",
          formato: "vertical",
          encuadre: "78% center",
        },
        {
          titulo: "Reel de atención al cliente",
          categoria: "Reels",
          video: "https://drive.google.com/file/d/17tygVKcLL6figjbebs9ts9R3pL8oFfik/view?usp=drive_link",
          formato: "vertical",
        },
        {
          titulo: "Reel de producto",
          categoria: "Reels",
          video: "https://drive.google.com/file/d/1dsfIyEfGt5fbqJGTKM39EEvQcyg0abIo/view?usp=drive_link",
          formato: "vertical",
          encuadre: "78% center",
        },
        /* Agrega aquí cualquier otro enlace que quieras solo en "Más recientes" */
      ],
    },
  ],
  /* =====================================================================
     7) PROYECTOS Y SUS VIDEOS (APARTE DE LAS GALERÍAS)
     Esta sección sirve para tus fichas de casos / clientes. No alimenta
     automáticamente las galerías de arriba.

     CÓMO AGREGAR UN PROYECTO ENTERO
     Copia un proyecto completo (el bloque grande) y pégalo después,
     antes del ]. Cambia los textos y los links.

     mostrar: false esconde ese proyecto de la sección de casos.
     ===================================================================== */
  proyectos: [
    {
      mostrar: true,
      titulo: "Reels para agencia de viajes",
      cliente: "Kruceros",
      clienteDetalle: "Agencia de viajes · España", // sale chiquito debajo del cliente
      categoria: "Reels",
      plataformas: ["TikTok", "YouTube"], // solo texto, para la ficha del caso
      descripcion: "Edición completa de una serie de reels para la agencia de viajes española Kruceros. El objetivo era mostrar los productos y la excelente atención al cliente de forma rápida, clara y atractiva.",
      tareas: [
        "Selección de las mejores tomas y ajuste del ritmo",
        "Animaciones, intros y cierres de marca",
        "Transiciones, efectos de sonido y música",
        "Imágenes, íconos y textos animados",
        "Subtítulos para ver sin sonido",
      ],
      resultado: "Ayudó a aumentar las visualizaciones y la interacción en el perfil de la marca.",
      links: {
        tiktok: "", // link público a los reels. Vacío = no sale el botón
        youtube: "",
      },
      videos: [
        {
          titulo: "Reel promocional",
          video: "https://drive.google.com/file/d/1lEChKCobo_hNs7IItBDpXoP-OZakmFUO/view?usp=drive_link",
          formato: "vertical",
        },
        {
          titulo: "Reel de marketing",
          video: "https://drive.google.com/file/d/1o5zjafcEpZhvw3-PjpBZmwy0j_MqKT7Y/view?usp=drive_link",
          formato: "vertical",
          encuadre: "78% center",
        },
        {
          titulo: "Reel de atención al cliente",
          video: "https://drive.google.com/file/d/17tygVKcLL6figjbebs9ts9R3pL8oFfik/view?usp=drive_link",
          formato: "vertical",
        },
      ],
    },
    {
      mostrar: true,
      titulo: "Reel para producto",
      cliente: "Marca / negocio",
      clienteDetalle: "Marketing de producto",
      categoria: "Reels",
      plataformas: ["Instagram", "TikTok"],
      descripcion: "Edición a partir de varios fragmentos de video entregados por el cliente, convertidos en una sola pieza lista para publicar en redes.",
      tareas: [
        "Selección de tomas y ritmo",
        "Intro y cierre con animaciones",
        "Transiciones, efectos de sonido y música",
        "Textos, íconos y subtítulos",
      ],
      resultado: "Resultado satisfactorio para el cliente, listo para publicar.",
      links: {
        tiktok: "",
        youtube: "",
      },
      videos: [
        {
          titulo: "Reel de producto",
          video: "https://drive.google.com/file/d/1dsfIyEfGt5fbqJGTKM39EEvQcyg0abIo/view?usp=drive_link",
          formato: "vertical",
          encuadre: "78% center",
        },
      ],
    },
  ],

  /* =====================================================================
     8) CASOS  (la ficha larga de cada proyecto: cliente, tareas, resultado)
     menu vacío = no sale una pestaña propia en el menú.
     ===================================================================== */
  casos: {
    id: "casos",
    mostrar: true,
    menu: "",
    resaltar: "trabajos", // mientras leen esta parte, el menú marca "Trabajos"
    etiqueta: "Casos",
    titulo: "Detrás de cada proyecto",
    texto: "Qué se pidió, qué hice y qué se logró.",
    fondo: "suave",
  },

  /* =====================================================================
     9) SERVICIOS
     icono puede ser: reels, youtube, sonido, color, texto, estrella,
     rayo, corazon, camara, megafono, check.
     grande: true hace la ficha del doble de ancha (úsala en una o dos).
     lineaDeTiempo: true dibuja la línea de edición (queda bien en una sola).
     ===================================================================== */
  servicios: {
    id: "servicios",
    mostrar: true,
    menu: "Servicios",
    etiqueta: "Servicios",
    titulo: "¿Qué hago?",
    texto: "Me adapto al estilo de cada cliente y a la plataforma donde se publica el contenido.",
    fondo: "normal",
    tarjetas: [
      {
        icono: "reels",
        titulo: "Reels y TikTok",
        texto: "Ediciones rápidas y dinámicas, con cortes precisos, música, subtítulos y elementos visuales pensados para la retención y el watch time.",
        grande: true,
        lineaDeTiempo: true,
      },
      {
        icono: "youtube",
        titulo: "Videos para YouTube",
        texto: "Estructura del contenido, eliminación de partes lentas, mejora de audio y gráficos simples para que tus videos sean más claros y entretenidos.",
      },
      {
        icono: "sonido",
        titulo: "Anuncios para redes",
        texto: "Piezas cortas optimizadas para Instagram, Facebook o TikTok Ads, enfocadas en captar atención en los primeros segundos y llevar a la acción.",
      },
      {
        icono: "color",
        titulo: "Color y corrección",
        texto: "Ajuste de color y exposición para dar un look profesional y coherente con la identidad de tu marca o canal.",
      },
      {
        icono: "texto",
        titulo: "Subtítulos y textos",
        texto: "Subtítulos quemados, textos llamativos y llamadas a la acción para mejorar la comprensión y la conversión.",
      },
    ],
    cierre: {
      mostrar: true, // la franja final de la sección
      titulo: "¿Tienes algo diferente en mente?",
      texto: "Cuéntame tu idea, tu plataforma y tu objetivo. Te digo cómo lo editaría.",
      boton: "Hablemos",
      enlace: "#contacto",
    },
  },

  /* =====================================================================
     10) PROCESO  (los pasos de cómo trabajas)
     Si dejas "tiempo" vacío, se numera solo: 00:00, 00:05, 00:10...
     Copia un paso para agregar otro. Se acomodan solos.
     ===================================================================== */
  proceso: {
    id: "proceso",
    mostrar: true,
    menu: "Proceso",
    etiqueta: "Proceso",
    titulo: "Así trabajamos",
    texto: "Comunicación constante durante todo el proceso, para que el resultado sea exactamente lo que buscas.",
    fondo: "suave",
    pasos: [
      { tiempo: "00:00", titulo: "Brief", texto: "Me cuentas el objetivo del video (vender, educar, entretener o posicionar), la plataforma y tus referencias." },
      { tiempo: "00:05", titulo: "Material", texto: "Me envías tus tomas, logo y recursos. Si hace falta, te oriento sobre qué grabar." },
      { tiempo: "00:10", titulo: "Edición", texto: "Ritmo, hook, música, efectos, color y subtítulos, adaptados a tu público y a tu formato." },
      { tiempo: "00:15", titulo: "Revisión y entrega", texto: "Ajusto según tus comentarios y te entrego el archivo final listo para publicar." },
    ],
  },

  /* =====================================================================
     11) PRECIOS
     mostrar: false esconde toda la sección y también su botón del menú.
     Copia un precio o un paquete para agregar otro. Las columnas se ajustan.
     destacado: true marca UN paquete como el más elegido.
     ===================================================================== */
  precios: {
    id: "precios",
    mostrar: true,
    menu: "Precios",
    etiqueta: "Precios",
    titulo: "Precios claros",
    texto: "Paga por video según la duración, o ahorra con un paquete.",
    fondo: "normal",
    moneda: "USD", // se ve chiquito junto al número
    simbolo: "$",
    tituloPaquetes: "Paquetes",
    porDuracion: [
      { duracion: "30 s – 1 min", precio: 20 },
      { duracion: "2 – 4 min", precio: 40 },
      { duracion: "5 – 7 min", precio: 75 },
      { duracion: "10 – 15 min", precio: 100 },
    ],
    paquetes: [
      {
        nombre: "Pack 3",
        detalle: "3 videos de 30 s – 1 min",
        precio: 55,
        ahorro: 5, // 0 o vacío = no se muestra la línea de "Ahorras"
        destacado: false,
        incluye: ["3 videos de 30 s – 1 min", "Entrega en 5 días", "1 ronda de revisiones"],
      },
      {
        nombre: "Pack 5",
        detalle: "5 videos de 30 s – 1 min",
        precio: 90,
        ahorro: 10,
        destacado: true,
        incluye: ["5 videos de 30 s – 1 min", "Entrega en 7 días", "2 rondas de revisiones", "Miniaturas incluidas"],
      },
      {
        nombre: "Pack 10",
        detalle: "10 videos de 30 s – 1 min",
        precio: 170,
        ahorro: 30,
        destacado: false,
        incluye: ["10 videos de 30 s – 1 min", "Entrega en 10 días", "Revisiones ilimitadas", "Miniaturas + subtítulos"],
      },
    ],
    nota: "Los precios pueden variar según la complejidad del proyecto. Escríbeme y te preparo un presupuesto personalizado.",
  },

  /* =====================================================================
     12) SOBRE MÍ
     Cada texto de "parrafos" es un párrafo. Copia la línea para agregar otro.
     "pilares" son las tres cajitas. Puedes poner 2, 3 o las que quieras.
     ===================================================================== */
  sobreMi: {
    id: "sobre-mi",
    mostrar: true,
    menu: "Sobre mí",
    etiqueta: "Sobre mí",
    titulo: "Edito con un objetivo claro",
    fondo: "suave",
    imagen: "assets/img/logo.webp", // vacío "" = sin imagen
    parrafos: [
      "Como editor de video me gusta entender el objetivo de cada pieza (vender, educar, entretener o posicionar una marca) y adaptar la edición al público y a la plataforma. Cuido especialmente el ritmo, la imagen y la claridad del mensaje, y mantengo una comunicación constante durante el proceso para que el resultado sea exactamente lo que buscas.",
    ],
    pilares: [
      { titulo: "Ritmo", texto: "Cortes que mantienen la atención de principio a fin." },
      { titulo: "Imagen", texto: "Color, encuadre y gráficos con look profesional." },
      { titulo: "Mensaje", texto: "Subtítulos y textos que se entienden sin sonido." },
    ],
  },

  /* =====================================================================
     13) CONTACTO
     El botón de WhatsApp usa el número de la parte 1.
     El botón de email usa el correo de la parte 1.
     Si los dos están vacíos, esta sección igual se ve, pero sin botones.
     menu vacío porque el botón "Cotizar" del menú ya trae hasta aquí.
     Si escribes menu: "Contacto", sale además como enlace del menú.
     ===================================================================== */
  contacto: {
    id: "contacto",
    mostrar: true,
    menu: "",
    etiqueta: "Contacto",
    titulo: "¿Hacemos tu {próximo video}?",
    texto: "¿Quieres que trabajemos juntos en tu próximo video o en el contenido de tu canal o marca? Escríbeme y te respondo lo antes posible.",
    despedida: "¡Espero saber de ti!",
    fondo: "normal",
    mensajeWhatsapp: "Hola NOMBRE, vi tu portafolio y me gustaría cotizar un video.",
    asuntoEmail: "Cotización de video",
  },

  /* =====================================================================
     14) SECCIONES NUEVAS
     La de abajo es un EJEMPLO. No se ve, porque mostrar es false.
     Para usarla: cambia false por true. Si además quieres elegir el lugar,
     quita las dos barras // que están delante de "ejemplo" en la lista orden.

     tipo: "texto"     párrafos, una lista y un botón
           "videos"    una galería aparte (no usa los proyectos)
           "tarjetas"  fichas con icono, título y texto
           "pasos"     pasos numerados
     ===================================================================== */
  seccionesExtra: [
    {
      id: "ejemplo",
      tipo: "texto", // "texto", "videos", "tarjetas" o "pasos"
      mostrar: false, // cámbialo a true para publicarla
      menu: "Ejemplo", // vacío "" = se ve en la página pero no en el menú
      etiqueta: "Ejemplo",
      titulo: "Una sección hecha por ti",
      texto: "Este texto sale debajo del título. *Puedes resaltar así* y {pintar así}.",
      fondo: "", // vacío = se alterna el fondo solo. O escribe "normal" o "suave"
      alineacion: "centro", // "centro" o "izquierda"
      parrafos: [
        "Este es un párrafo. Borra este texto y escribe el tuyo.",
        "Este es otro párrafo. Si no quieres párrafos, deja el corchete vacío: [ ]",
      ],
      lista: [
        "Un punto de una lista",
        "Otro punto",
      ],
      boton: { texto: "Escríbeme", enlace: "#contacto" }, // texto vacío = sin botón
    },
  ],

  /* =====================================================================
     15) PESTAÑA DEL NAVEGADOR, MENÚ Y PIE
     tituloPestana es el texto de la pestaña.
     Los otros dos salen cuando alguien comparte el link en WhatsApp o redes.
     Si cambias la dirección del sitio publicado, pega la URL nueva en "url".
     ===================================================================== */
  textos: {
    tituloPestana: "Desmos · Editor de video para reels, TikTok, YouTube y anuncios",
    descripcion: "Desmos, editor de video especializado en reels, TikTok, YouTube y anuncios para redes. Videos con ritmo, hooks y subtítulos que retienen la atención y generan resultados.",
    tituloCompartir: "Desmos · Editor de video",
    descripcionCompartir: "Reels, TikTok, YouTube y anuncios que atrapan en los primeros segundos.",
    url: "https://desmosedit.github.io/Portafolio-de-edici-n-de-video/",
    imagenCompartir: "https://desmosedit.github.io/Portafolio-de-edici-n-de-video/assets/img/og.jpg",
    botonMenu: "Cotizar", // el botón corto de la barra
    botonMenuLargo: "Cotizar mi video", // el mismo botón cuando el menú está abierto en el celular
    enlaceBoton: "#contacto",
    pie: "Editor de video para redes",
    volverArriba: "Volver arriba ↑",
  },

  /* =====================================================================
     16) FRASES DE BOTONES
     No hace falta tocarlas. Están por si quieres otro tono.
     Si dejas una vacía, se usa la frase que ya trae la página.
     ===================================================================== */
  frases: {
    botonWhatsapp: "Escríbeme por WhatsApp",
    botonEmail: "Enviar email",
    botonCopiar: "Copiar email",
    textoCopiado: "¡Copiado!",
    elegir: "Elegir",
    masElegido: "★ Más elegido",
    ahorras: "Ahorras",
    porVideo: "por video",
    resultado: "Resultado",
    cliente: "Cliente",
    tipo: "Tipo",
    plataformas: "Plataformas",
    formato: "Formato",
    proyecto: "Proyecto",
    videos: "videos",
    verEn: "Ver en",
    vacioGaleria: "Muy pronto subiré nuevos trabajos aquí.",
    whatsapp: "WhatsApp",
    email: "Email",
    nacionalidad: "Nacionalidad",
    ubicacion: "Ubicación",
    saltarIntro: "Saltar intro",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
    cerrarVideo: "Cerrar video",
    videoAnterior: "Video anterior",
    videoSiguiente: "Video siguiente",
    saltarAlContenido: "Saltar al contenido",
  },

  /* =====================================================================
     17) PROTECCIÓN DE LOS VIDEOS
     Esto pone difícil descargarlos desde la página. No lo impide al 100%:
     siempre se puede grabar la pantalla. Lo que más protege es exportar
     los videos del portafolio con una marca de agua ya quemada.
     Más explicación en README.md.
     ===================================================================== */
  proteccion: {
    bloquearDescarga: true, // quita el botón de descarga, el clic derecho y la ventana flotante
    marcaDeAgua: "DESMOS", // texto sobre el reproductor. "" para quitarla
    marcaCentral: true, // además, una marca suave en el centro del video
  },
};
