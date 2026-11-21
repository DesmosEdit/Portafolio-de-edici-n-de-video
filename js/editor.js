/* Formulario de edición. Genera un config.js comentado para reemplazar js/config.js. */
(() => {
  'use strict';

  const app = document.getElementById('app');
  if (!app) return;
  if (!window.PORTAFOLIO) {
    app.innerHTML = '<div class="config-error"><h1>No está el archivo de configuración</h1><p>Tiene que existir js/config.js junto al portafolio.</p></div>';
    return;
  }

  const ORIGINAL = JSON.parse(JSON.stringify(window.PORTAFOLIO));
  let STATE = JSON.parse(JSON.stringify(window.PORTAFOLIO));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ICONS = [['reels', 'Reels / teléfono'], ['youtube', 'YouTube'], ['sonido', 'Sonido / anuncio'], ['color', 'Color'], ['texto', 'Textos'], ['estrella', 'Estrella'], ['rayo', 'Rayo'], ['corazon', 'Corazón'], ['camara', 'Cámara'], ['megafono', 'Megáfono'], ['check', 'Check']];
  const FORMATOS = [['vertical', 'Vertical (reel, TikTok, story)'], ['horizontal', 'Horizontal (YouTube)'], ['cuadrado', 'Cuadrado'], ['4:5', '4:5 (feed de Instagram)']];
  const COLUMNAS = [['auto', 'Auto: se acomodan solas'], ['2', '2 columnas'], ['3', '3 columnas'], ['4', '4 columnas']];
  const CUALES = [['destacados', 'Solo los marcados como destacados'], ['todos', 'Todos los videos de los proyectos'], ['sin-destacar', 'Todos menos los destacados']];
  const FONDOS = [['', 'Alternar el fondo solo'], ['normal', 'Fondo normal'], ['suave', 'Fondo suave']];
  const TIPOS = [['texto', 'Texto, lista y botón'], ['videos', 'Galería de videos'], ['tarjetas', 'Fichas (como Servicios)'], ['pasos', 'Pasos (como Proceso)']];

  function getPath(obj, path) {
    return String(path).split('.').reduce((cur, key) => (cur == null ? undefined : cur[key]), obj);
  }
  function setPath(obj, path, value) {
    const parts = String(path).split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      const next = parts[i + 1];
      if (cur[key] == null || typeof cur[key] !== 'object') cur[key] = /^\d+$/.test(next) ? [] : {};
      cur = cur[key];
    }
    cur[parts[parts.length - 1]] = value;
  }
  function move(arr, index, dir) {
    if (!arr) return false;
    const j = index + dir;
    if (j < 0 || j >= arr.length) return false;
    const [item] = arr.splice(index, 1);
    arr.splice(j, 0, item);
    return true;
  }
  function slug(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'seccion';
  }
  function allIds() {
    const ids = new Set(['inicio', 'proyectos', 'trabajos', 'casos', 'servicios', 'proceso', 'precios', 'sobre-mi', 'contacto']);
    (STATE.orden || []).forEach((id) => ids.add(id));
    (STATE.galerias || []).forEach((g) => g && g.id && ids.add(g.id));
    (STATE.seccionesExtra || []).forEach((s) => s && s.id && ids.add(s.id));
    return ids;
  }
  function uniqueId(base) {
    const ids = allIds();
    let id = slug(base);
    if (!ids.has(id)) return id;
    let n = 2;
    while (ids.has(`${id}-${n}`)) n += 1;
    return `${id}-${n}`;
  }

  function field(path, label, help, type) {
    const value = getPath(STATE, path);
    const kind = type || 'text';
    if (kind === 'bool') {
      return `<label class="ed-check"><input type="checkbox" data-path="${esc(path)}" data-kind="bool"${value ? ' checked' : ''}><span>${esc(label)}</span>${help ? `<small>${esc(help)}</small>` : ''}</label>`;
    }
    if (kind === 'csv') {
      const text = Array.isArray(value) ? value.join(', ') : String(value || '');
      return `<label class="ed-field"><span>${esc(label)}</span><input type="text" data-path="${esc(path)}" data-kind="csv" value="${esc(text)}">${help ? `<small>${esc(help)}</small>` : ''}</label>`;
    }
    if (kind === 'textarea' || kind === 'lines' || kind === 'paragraphs' || kind === 'words') {
      let text = value == null ? '' : String(value);
      if (kind === 'lines' || kind === 'words') text = Array.isArray(value) ? value.join('\n') : '';
      if (kind === 'paragraphs') text = Array.isArray(value) ? value.join('\n\n') : '';
      const rows = kind === 'textarea' ? 4 : 5;
      return `<label class="ed-field ed-wide"><span>${esc(label)}</span><textarea data-path="${esc(path)}" data-kind="${esc(kind)}" rows="${rows}">${esc(text)}</textarea>${help ? `<small>${esc(help)}</small>` : ''}</label>`;
    }
    const inputType = kind === 'number' ? 'number' : 'text';
    const shown = value == null ? '' : String(value);
    return `<label class="ed-field"><span>${esc(label)}</span><input type="${inputType}" data-path="${esc(path)}"${kind === 'number' ? ' data-kind="number"' : ''} value="${esc(shown)}">${help ? `<small>${esc(help)}</small>` : ''}</label>`;
  }
  function select(path, label, help, options) {
    const value = String(getPath(STATE, path) ?? '');
    const opts = options.map(([v, lab]) => `<option value="${esc(v)}"${value === v ? ' selected' : ''}>${esc(lab)}</option>`).join('');
    return `<label class="ed-field"><span>${esc(label)}</span><select data-path="${esc(path)}">${opts}</select>${help ? `<small>${esc(help)}</small>` : ''}</label>`;
  }
  function tools(act, i, j) {
    const extra = j == null ? '' : ` data-j="${j}"`;
    return `<div class="ed-tools">
      <button type="button" data-act="up-${act}" data-i="${i}"${extra}>Subir</button>
      <button type="button" data-act="down-${act}" data-i="${i}"${extra}>Bajar</button>
      <button type="button" class="ed-danger" data-act="del-${act}" data-i="${i}"${extra}>Quitar</button>
    </div>`;
  }
  function addBtn(act, label, i) {
    const extra = i == null ? '' : ` data-i="${i}"`;
    return `<button class="ed-add" type="button" data-act="add-${act}"${extra}>${esc(label)}</button>`;
  }

  function placeInOrden(id) {
    if (!id) return;
    if (!Array.isArray(STATE.orden)) STATE.orden = [];
    if (STATE.orden.includes(id)) return;
    const contacto = STATE.orden.indexOf('contacto');
    if (contacto >= 0) STATE.orden.splice(contacto, 0, id);
    else STATE.orden.push(id);
  }
  function locate(id) {
    const lists = [['galerias', STATE.galerias], ['seccionesExtra', STATE.seccionesExtra]];
    for (const [name, list] of lists) {
      const i = (list || []).findIndex((x) => x && x.id === id);
      if (i >= 0) return `${name}.${i}`;
    }
    const map = { casos: 'casos', servicios: 'servicios', proceso: 'proceso', precios: 'precios', 'sobre-mi': 'sobreMi', contacto: 'contacto' };
    return map[id] || '';
  }

  function renderSimple() {
    return `
      <details class="ed-card" open>
        <summary>1. Tu nombre y contacto</summary>
        <p class="ed-note">Esto sale en el menú, la portada y los botones de escribirte. Si dejas el WhatsApp o una red vacíos, ese botón no aparece.</p>
        <div class="ed-grid">
          ${field('perfil.nombre', 'Nombre', 'Escribe NOMBRE en otros textos para que se reemplace solo por este nombre.')}
          ${field('perfil.rol', 'A qué te dedicas', 'Ejemplo: Editor de video')}
          ${field('perfil.email', 'Email', 'Vacío = no sale el botón de correo.')}
          ${field('perfil.whatsapp', 'WhatsApp', 'Con código de país. Ejemplo: +53 5123 4567')}
          ${field('perfil.nacionalidad', 'Nacionalidad', 'Si escribes Cubano, Cuba o Cubana, sale la bandera de Cuba.')}
          ${field('perfil.ubicacion', 'Ciudad', 'Opcional. Ejemplo: La Habana, Cuba')}
          ${field('perfil.redes.instagram', 'Link de Instagram', 'El link completo, o vacío.')}
          ${field('perfil.redes.tiktok', 'Link de TikTok', 'El link completo, o vacío.')}
          ${field('perfil.redes.youtube', 'Link de YouTube', 'El link completo, o vacío.')}
          ${field('perfil.redes.facebook', 'Link de Facebook', 'El link completo, o vacío.')}
          ${field('perfil.redes.otra.nombre', 'Otra red (nombre)', 'Opcional. Ejemplo: Behance')}
          ${field('perfil.redes.otra.enlace', 'Otra red (link)', 'Si el link está vacío, no se muestra.')}
        </div>
      </details>

      <details class="ed-card">
        <summary>2. La intro</summary>
        <p class="ed-note">El video corto que se ve una sola vez al entrar. Si lo apagas, la página abre directo.</p>
        <div class="ed-grid">
          ${field('intro.mostrar', 'Mostrar la intro', 'Desmárcalo para entrar directo al portafolio.', 'bool')}
          ${field('intro.video', 'Archivo o link del video', 'Por defecto: assets/video/intro.mp4')}
          ${field('intro.nombre', 'Nombre grande', 'Vacío = tu nombre en mayúsculas.')}
          ${field('intro.rol', 'Texto de abajo', 'Vacío = tu profesión.')}
          ${field('intro.botonSaltar', 'Texto del botón para saltarla', '')}
        </div>
      </details>

      <details class="ed-card" open>
        <summary>3. Portada</summary>
        <p class="ed-note">Lo primero que se lee en grande. *así* se ve en negrita. {así} se ve en color. NOMBRE se cambia por tu nombre.</p>
        <div class="ed-grid">
          ${field('portada.mostrar', 'Mostrar la portada', '', 'bool')}
          ${field('portada.etiqueta', 'Etiqueta pequeña', 'La línea de arriba del título.')}
          ${field('portada.titulo', 'Título', 'Ejemplo: Hey, soy {NOMBRE}.', 'textarea')}
          ${field('portada.texto', 'Párrafo', '', 'textarea')}
          ${field('portada.botonPrincipal.texto', 'Botón principal', 'Vacío = no sale.')}
          ${field('portada.botonPrincipal.enlace', 'A dónde lleva', 'Ejemplo: #trabajos o #contacto')}
          ${field('portada.botonSecundario.texto', 'Botón secundario', 'Vacío = no sale.')}
          ${field('portada.botonSecundario.enlace', 'A dónde lleva el segundo', '')}
          ${field('portada.videoFondo', 'Video de fondo', 'Vacío = sin video. Ejemplo: assets/video/hero-bg.mp4')}
          ${field('portada.logo', 'Dibujo o logo', 'Vacío = no se muestra. Ejemplo: assets/img/logo.webp')}
          ${field('portada.marca', 'Texto de la esquina', 'Ejemplo: DESMOS · EDIT. Vacío = no sale.')}
          ${field('portada.enlaceFlecha', 'La flecha de bajar lleva a', 'Vacío = baja a la primera sección.')}
        </div>
        <div id="datos"></div>
      </details>

      <details class="ed-card">
        <summary>4. Cinta de palabras</summary>
        <p class="ed-note">La franja que se mueve. Una palabra por línea.</p>
        ${field('cinta.mostrar', 'Mostrar la cinta', '', 'bool')}
        ${field('cinta.palabras', 'Palabras', 'Una por línea.', 'words')}
      </details>

      <details class="ed-card" open>
        <summary>5. Orden de las secciones</summary>
        <p class="ed-note">Lo de arriba sale primero. La portada y la cinta van siempre antes y no se mueven de aquí. "Visible" apagado esconde esa parte sin borrarla. El nombre del menú vacío significa que se ve en la página pero no en la barra de arriba.</p>
        <div id="orden"></div>
      </details>

      <details class="ed-card" open>
        <summary>6. Galerías de videos</summary>
        <p class="ed-note">Aquí no se pegan los videos: se elige cuáles de tus proyectos entran, el título y cómo se acomodan. Los videos se agregan en el apartado 7. Con "Auto", da igual si pones 1 o 20: en el celular se apilan y en la computadora arman filas. Los horizontales salen más anchos.</p>
        <div id="galerias"></div>
      </details>

      <details class="ed-card" open>
        <summary>7. Proyectos y videos</summary>
        <p class="ed-note">Cada proyecto puede tener varios videos. "Destacado" lo manda también a Proyectos destacados. El link puede ser de Google Drive (compartido para cualquiera con el enlace), de YouTube o un archivo de la carpeta.</p>
        <div id="proyectos"></div>
      </details>

      <details class="ed-card">
        <summary>8. Fichas de cada proyecto</summary>
        <p class="ed-note">El bloque "Detrás de cada proyecto". Los textos de cada cliente se editan en el apartado 7.</p>
        <div class="ed-grid">
          ${field('casos.mostrar', 'Mostrar esta sección', '', 'bool')}
          ${field('casos.etiqueta', 'Etiqueta', '')}
          ${field('casos.titulo', 'Título', '')}
          ${field('casos.texto', 'Texto', '', 'textarea')}
        </div>
      </details>

      <details class="ed-card">
        <summary>9. Servicios</summary>
        <div class="ed-grid">
          ${field('servicios.mostrar', 'Mostrar servicios', '', 'bool')}
          ${field('servicios.etiqueta', 'Etiqueta', '')}
          ${field('servicios.titulo', 'Título', '')}
          ${field('servicios.texto', 'Texto', '', 'textarea')}
        </div>
        <div id="servicios"></div>
        <h3 class="ed-kicker" style="margin-top:18px">Franja final</h3>
        <div class="ed-grid">
          ${field('servicios.cierre.mostrar', 'Mostrar la franja', '', 'bool')}
          ${field('servicios.cierre.titulo', 'Título', '')}
          ${field('servicios.cierre.texto', 'Texto', '', 'textarea')}
          ${field('servicios.cierre.boton', 'Botón', 'Vacío = sin botón.')}
          ${field('servicios.cierre.enlace', 'Enlace del botón', 'Ejemplo: #contacto')}
        </div>
      </details>

      <details class="ed-card">
        <summary>10. Proceso</summary>
        <div class="ed-grid">
          ${field('proceso.mostrar', 'Mostrar el proceso', '', 'bool')}
          ${field('proceso.etiqueta', 'Etiqueta', '')}
          ${field('proceso.titulo', 'Título', '')}
          ${field('proceso.texto', 'Texto', '', 'textarea')}
        </div>
        <div id="pasos"></div>
      </details>

      <details class="ed-card">
        <summary>11. Precios</summary>
        <div class="ed-grid">
          ${field('precios.mostrar', 'Mostrar precios', 'Si lo apagas, también desaparece del menú.', 'bool')}
          ${field('precios.etiqueta', 'Etiqueta', '')}
          ${field('precios.titulo', 'Título', '')}
          ${field('precios.texto', 'Texto', '', 'textarea')}
          ${field('precios.simbolo', 'Símbolo', 'Ejemplo: $')}
          ${field('precios.moneda', 'Moneda', 'Ejemplo: USD. Sale chiquito junto al precio.')}
          ${field('precios.tituloPaquetes', 'Título de los paquetes', '')}
          ${field('precios.nota', 'Nota al pie', '', 'textarea')}
        </div>
        <div id="precios"></div>
      </details>

      <details class="ed-card">
        <summary>12. Sobre mí</summary>
        <div class="ed-grid">
          ${field('sobreMi.mostrar', 'Mostrar sobre mí', '', 'bool')}
          ${field('sobreMi.etiqueta', 'Etiqueta', '')}
          ${field('sobreMi.titulo', 'Título', '')}
          ${field('sobreMi.imagen', 'Imagen', 'Vacío = sin imagen. Ejemplo: assets/img/logo.webp')}
          ${field('sobreMi.parrafos', 'Párrafos', 'Separa los párrafos con una línea en blanco.', 'paragraphs')}
        </div>
        <div id="pilares"></div>
      </details>

      <details class="ed-card">
        <summary>13. Contacto</summary>
        <p class="ed-note">Los botones usan el WhatsApp y el email del apartado 1. NOMBRE dentro del mensaje se cambia por tu nombre.</p>
        <div class="ed-grid">
          ${field('contacto.mostrar', 'Mostrar contacto', '', 'bool')}
          ${field('contacto.etiqueta', 'Etiqueta', '')}
          ${field('contacto.titulo', 'Título', 'Puedes usar {color} y *negrita*.')}
          ${field('contacto.texto', 'Texto', '', 'textarea')}
          ${field('contacto.despedida', 'Despedida', '')}
          ${field('contacto.mensajeWhatsapp', 'Mensaje que se abre en WhatsApp', '', 'textarea')}
          ${field('contacto.asuntoEmail', 'Asunto del email', '')}
        </div>
      </details>

      <details class="ed-card" open>
        <summary>14. Secciones nuevas</summary>
        <p class="ed-note">Sirven para inventar un bloque que el portafolio no traía: un texto, otra galería de videos, fichas o pasos. Al marcarla visible, entra al final de la página. Luego puedes subirla en el apartado 5.</p>
        <div class="ed-inline">
          <label class="ed-field"><span>Tipo de sección</span>
            <select id="nuevo-tipo">${TIPOS.map(([v, lab]) => `<option value="${esc(v)}">${esc(lab)}</option>`).join('')}</select>
          </label>
          <button class="ed-add" type="button" data-act="add-extra">Agregar sección</button>
        </div>
        <div id="extras"></div>
      </details>

      <details class="ed-card">
        <summary>15. Pestaña del navegador y botón del menú</summary>
        <div class="ed-grid">
          ${field('textos.tituloPestana', 'Texto de la pestaña', '')}
          ${field('textos.descripcion', 'Descripción para Google', '', 'textarea')}
          ${field('textos.tituloCompartir', 'Título al compartir el link', '')}
          ${field('textos.descripcionCompartir', 'Texto al compartir el link', '', 'textarea')}
          ${field('textos.url', 'Dirección del sitio', 'Pégala completa si publicas el portafolio en otro enlace.')}
          ${field('textos.imagenCompartir', 'Imagen al compartir', 'Una imagen horizontal, 1200×630.')}
          ${field('textos.botonMenu', 'Botón corto del menú', 'Ejemplo: Cotizar')}
          ${field('textos.botonMenuLargo', 'Botón largo (celular)', 'Ejemplo: Cotizar mi video')}
          ${field('textos.enlaceBoton', 'A dónde lleva ese botón', 'Ejemplo: #contacto')}
          ${field('textos.pie', 'Texto del pie de página', '')}
        </div>
      </details>

      <details class="ed-card">
        <summary>16. Protección de los videos</summary>
        <p class="ed-note">Pone difícil que los descarguen desde la página. No lo impide del todo: siempre se puede grabar la pantalla. Lo que más cuida tu trabajo es exportar los videos con una marca de agua.</p>
        <div class="ed-grid">
          ${field('proteccion.bloquearDescarga', 'Quitar descarga y clic derecho', '', 'bool')}
          ${field('proteccion.marcaDeAgua', 'Marca sobre el reproductor', 'Vacío = sin marca.')}
          ${field('proteccion.marcaCentral', 'También una marca en el centro', '', 'bool')}
        </div>
      </details>

      <details class="ed-card">
        <summary>17. Frases de los botones</summary>
        <p class="ed-note">No hace falta cambiarlas. Son los textos repetidos, por si quieres otro tono.</p>
        <div class="ed-grid">
          ${field('frases.botonWhatsapp', 'Botón de WhatsApp', '')}
          ${field('frases.botonEmail', 'Botón de email', '')}
          ${field('frases.botonCopiar', 'Botón de copiar', '')}
          ${field('frases.elegir', 'Antes del nombre del paquete', 'Ejemplo: Elegir')}
          ${field('frases.masElegido', 'Etiqueta del paquete destacado', '')}
          ${field('frases.vacioGaleria', 'Texto si una galería no tiene videos', '')}
        </div>
      </details>

      <p class="ed-note"><button class="ed-add" type="button" data-act="reset">Volver a como estaba al abrir esta página</button></p>
    `;
  }

  function renderDatos() {
    const list = STATE.portada.datos || (STATE.portada.datos = []);
    const root = document.getElementById('datos');
    if (!root) return;
    root.innerHTML = `<p class="ed-kicker" style="margin-top:16px">Datos bajo los botones</p>` + list.map((d, i) => `
      <div class="ed-block">
        ${tools('dato', i)}
        <div class="ed-grid">
          ${field(`portada.datos.${i}.titulo`, 'Título corto', 'Ejemplo: Plataformas')}
          ${field(`portada.datos.${i}.texto`, 'Texto', 'Ejemplo: Reels · TikTok')}
        </div>
      </div>`).join('') + addBtn('dato', 'Agregar dato');
  }

  function renderOrden() {
    const root = document.getElementById('orden');
    if (!root) return;
    const orden = STATE.orden || (STATE.orden = []);
    root.innerHTML = orden.map((id, i) => {
      const path = locate(id);
      const block = path ? getPath(STATE, path) : null;
      if (!block) return `<div class="ed-row"><p>No encuentro la sección "${esc(id)}". Puedes quitarla.</p><button type="button" class="ed-danger" data-act="del-orden" data-i="${i}">Quitar</button></div>`;
      const title = block.titulo || block.menu || id;
      return `<div class="ed-row">
        <div class="ed-tools">
          <button type="button" data-act="up-orden" data-i="${i}">Subir</button>
          <button type="button" data-act="down-orden" data-i="${i}">Bajar</button>
        </div>
        <div>
          <strong>${esc(String(title).replace(/[{}*]/g, ''))}</strong>
          <div class="ed-id">id: ${esc(id)}</div>
          <div class="ed-grid">
            ${field(`${path}.mostrar`, 'Visible en la página', '', 'bool')}
            ${field(`${path}.menu`, 'Nombre en el menú', 'Vacío = no sale en la barra de arriba.')}
          </div>
        </div>
      </div>`;
    }).join('') || '<p class="ed-note">No hay secciones en la lista.</p>';
  }

  function renderGalerias() {
    const root = document.getElementById('galerias');
    if (!root) return;
    const list = STATE.galerias || [];
    root.innerHTML = list.map((g, i) => `
      <div class="ed-block">
        <p class="ed-kicker">${esc(g.id || '')}</p>
        <div class="ed-grid">
          ${field(`galerias.${i}.etiqueta`, 'Etiqueta', '')}
          ${field(`galerias.${i}.titulo`, 'Título', '')}
          ${field(`galerias.${i}.texto`, 'Texto', '', 'textarea')}
          ${select(`galerias.${i}.cuales`, 'Qué videos entran', 'Los videos viven en Proyectos.', CUALES)}
          ${select(`galerias.${i}.columnas`, 'Columnas', 'Auto se adapta si agregas o quitas videos.', COLUMNAS)}
          ${select(`galerias.${i}.fondo`, 'Fondo', '', FONDOS)}
          ${field(`galerias.${i}.filtros`, 'Botones para filtrar por categoría', 'Solo aparecen si hay más de una categoría.', 'bool')}
          ${field(`galerias.${i}.nota`, 'Frase al final', 'Puedes poner un enlace así: [Pídemelos](#contacto)', 'textarea')}
        </div>
      </div>`).join('');
  }

  function videoFields(path) {
    return `<div class="ed-grid">
      ${field(`${path}.titulo`, 'Título del video', '')}
      ${field(`${path}.video`, 'Link del video', 'Drive, YouTube o un archivo. Vacío = este video no se muestra.')}
      ${select(`${path}.formato`, 'Formato', 'Vertical es 9:16. Horizontal es 16:9.', FORMATOS)}
      ${field(`${path}.destacado`, 'Destacado', 'Si está marcado, sale en Proyectos destacados.', 'bool')}
      ${field(`${path}.categoria`, 'Categoría', 'Vacío = usa la del proyecto. Sirve para los filtros.')}
      ${field(`${path}.cliente`, 'Cliente en la tarjeta', 'Vacío = usa el cliente del proyecto.')}
      ${field(`${path}.poster`, 'Miniatura propia', 'Opcional. Drive y YouTube ya traen una.')}
      ${field(`${path}.encuadre`, 'Encuadre de la miniatura', 'Opcional. Ejemplo: center, 70% center, center top')}
      ${field(`${path}.ajuste`, 'Ajuste', 'Escribe completo para ver la miniatura entera, sin recorte. Si no, déjalo vacío.')}
      ${field(`${path}.duracion`, 'Duración', 'Opcional. Ejemplo: 0:30. En archivos locales se calcula sola.')}
    </div>`;
  }

  function renderProyectos() {
    const root = document.getElementById('proyectos');
    if (!root) return;
    const list = STATE.proyectos || (STATE.proyectos = []);
    root.innerHTML = list.map((p, i) => `
      <details class="ed-block" ${p.mostrar === false ? '' : 'open'}>
        <summary>${esc(p.titulo || 'Proyecto')} ${p.mostrar === false ? '<span class="ed-mini"> · oculto</span>' : ''}</summary>
        ${tools('project', i)}
        <div class="ed-grid">
          ${field(`proyectos.${i}.mostrar`, 'Visible', 'Apagado = no sale en las galerías ni en los casos.', 'bool')}
          ${field(`proyectos.${i}.titulo`, 'Título del proyecto', '')}
          ${field(`proyectos.${i}.cliente`, 'Cliente', '')}
          ${field(`proyectos.${i}.clienteDetalle`, 'Detalle del cliente', 'Sale chiquito. Ejemplo: Agencia de viajes · España')}
          ${field(`proyectos.${i}.categoria`, 'Categoría', 'Ejemplo: Reels, Anuncios, YouTube')}
          ${field(`proyectos.${i}.plataformas`, 'Plataformas', 'Separadas por coma.', 'csv')}
          ${field(`proyectos.${i}.descripcion`, 'Descripción', '', 'textarea')}
          ${field(`proyectos.${i}.tareas`, 'Tareas', 'Una por línea.', 'lines')}
          ${field(`proyectos.${i}.resultado`, 'Resultado', '', 'textarea')}
          ${field(`proyectos.${i}.links.tiktok`, 'Link de TikTok del proyecto', 'Vacío = sin botón.')}
          ${field(`proyectos.${i}.links.youtube`, 'Link de YouTube del proyecto', 'Vacío = sin botón.')}
          ${field(`proyectos.${i}.links.instagram`, 'Link de Instagram del proyecto', 'Vacío = sin botón.')}
        </div>
        <p class="ed-kicker">Videos de este proyecto</p>
        ${(p.videos || []).map((v, j) => `
          <div class="ed-block">
            ${tools('video', i, j)}
            ${videoFields(`proyectos.${i}.videos.${j}`)}
          </div>`).join('')}
        ${addBtn('video', 'Agregar video a este proyecto', i)}
      </details>`).join('') + addBtn('project', 'Agregar proyecto');
  }

  function renderServicios() {
    const root = document.getElementById('servicios');
    if (!root) return;
    const list = (STATE.servicios && STATE.servicios.tarjetas) || [];
    root.innerHTML = list.map((card, i) => `
      <div class="ed-block">
        ${tools('service', i)}
        <div class="ed-grid">
          ${select(`servicios.tarjetas.${i}.icono`, 'Icono', '', ICONS)}
          ${field(`servicios.tarjetas.${i}.titulo`, 'Título', '')}
          ${field(`servicios.tarjetas.${i}.texto`, 'Texto', '', 'textarea')}
          ${field(`servicios.tarjetas.${i}.grande`, 'Ficha ancha', 'Ocupa dos columnas. Úsala en una o dos.', 'bool')}
          ${field(`servicios.tarjetas.${i}.lineaDeTiempo`, 'Dibujar la línea de edición', 'Queda bien en una sola ficha.', 'bool')}
        </div>
      </div>`).join('') + addBtn('service', 'Agregar servicio');
  }

  function renderPasos() {
    const root = document.getElementById('pasos');
    if (!root) return;
    const list = (STATE.proceso && STATE.proceso.pasos) || [];
    root.innerHTML = list.map((p, i) => `
      <div class="ed-block">
        ${tools('step', i)}
        <div class="ed-grid">
          ${field(`proceso.pasos.${i}.tiempo`, 'Tiempo', 'Vacío = se numera solo (00:00, 00:05...).')}
          ${field(`proceso.pasos.${i}.titulo`, 'Título', '')}
          ${field(`proceso.pasos.${i}.texto`, 'Texto', '', 'textarea')}
        </div>
      </div>`).join('') + addBtn('step', 'Agregar paso');
  }

  function renderPrecios() {
    const root = document.getElementById('precios');
    if (!root) return;
    const precios = STATE.precios || {};
    const durs = precios.porDuracion || [];
    const packs = precios.paquetes || [];
    root.innerHTML = `<p class="ed-kicker">Precio según la duración</p>` + durs.map((d, i) => `
      <div class="ed-block">
        ${tools('dur', i)}
        <div class="ed-grid">
          ${field(`precios.porDuracion.${i}.duracion`, 'Duración', 'Ejemplo: 30 s – 1 min')}
          ${field(`precios.porDuracion.${i}.precio`, 'Precio', 'Solo el número.', 'number')}
        </div>
      </div>`).join('') + addBtn('dur', 'Agregar duración') +
      `<p class="ed-kicker" style="margin-top:18px">Paquetes</p>` + packs.map((k, i) => `
      <div class="ed-block">
        ${tools('pack', i)}
        <div class="ed-grid">
          ${field(`precios.paquetes.${i}.nombre`, 'Nombre', 'Ejemplo: Pack 5')}
          ${field(`precios.paquetes.${i}.detalle`, 'Detalle', '')}
          ${field(`precios.paquetes.${i}.precio`, 'Precio', '', 'number')}
          ${field(`precios.paquetes.${i}.ahorro`, 'Cuánto se ahorra', '0 = no se muestra.', 'number')}
          ${field(`precios.paquetes.${i}.destacado`, 'Marcarlo como el más elegido', '', 'bool')}
          ${field(`precios.paquetes.${i}.incluye`, 'Qué incluye', 'Una línea por cosa.', 'lines')}
        </div>
      </div>`).join('') + addBtn('pack', 'Agregar paquete');
  }

  function renderPilares() {
    const root = document.getElementById('pilares');
    if (!root) return;
    const list = STATE.sobreMi.pilares || (STATE.sobreMi.pilares = []);
    root.innerHTML = `<p class="ed-kicker" style="margin-top:16px">Cajitas</p>` + list.map((p, i) => `
      <div class="ed-block">
        ${tools('pilar', i)}
        <div class="ed-grid">
          ${field(`sobreMi.pilares.${i}.titulo`, 'Título', '')}
          ${field(`sobreMi.pilares.${i}.texto`, 'Texto', '')}
        </div>
      </div>`).join('') + addBtn('pilar', 'Agregar cajita');
  }

  function extraBody(block, i) {
    if (block.tipo === 'videos') {
      const videos = block.videos || [];
      return `<div class="ed-grid">
          ${select(`seccionesExtra.${i}.columnas`, 'Columnas', '', COLUMNAS)}
          ${field(`seccionesExtra.${i}.filtros`, 'Filtros por categoría', '', 'bool')}
          ${field(`seccionesExtra.${i}.nota`, 'Frase al final', '', 'textarea')}
        </div>
        ${videos.map((v, j) => `<div class="ed-block">${tools('evideo', i, j)}${videoFields(`seccionesExtra.${i}.videos.${j}`)}</div>`).join('')}
        ${addBtn('evideo', 'Agregar video', i)}`;
    }
    if (block.tipo === 'tarjetas') {
      const cards = block.tarjetas || [];
      return cards.map((card, j) => `
        <div class="ed-block">
          ${tools('ecard', i, j)}
          <div class="ed-grid">
            ${select(`seccionesExtra.${i}.tarjetas.${j}.icono`, 'Icono', '', ICONS)}
            ${field(`seccionesExtra.${i}.tarjetas.${j}.titulo`, 'Título', '')}
            ${field(`seccionesExtra.${i}.tarjetas.${j}.texto`, 'Texto', '', 'textarea')}
            ${field(`seccionesExtra.${i}.tarjetas.${j}.grande`, 'Ficha ancha', '', 'bool')}
          </div>
        </div>`).join('') + addBtn('ecard', 'Agregar ficha', i);
    }
    if (block.tipo === 'pasos') {
      const pasos = block.pasos || [];
      return pasos.map((p, j) => `
        <div class="ed-block">
          ${tools('estep', i, j)}
          <div class="ed-grid">
            ${field(`seccionesExtra.${i}.pasos.${j}.tiempo`, 'Tiempo', 'Opcional.')}
            ${field(`seccionesExtra.${i}.pasos.${j}.titulo`, 'Título', '')}
            ${field(`seccionesExtra.${i}.pasos.${j}.texto`, 'Texto', '', 'textarea')}
          </div>
        </div>`).join('') + addBtn('estep', 'Agregar paso', i);
    }
    return `<div class="ed-grid">
      ${select(`seccionesExtra.${i}.alineacion`, 'Alineación', '', [['centro', 'Centrado'], ['izquierda', 'A la izquierda']])}
      ${field(`seccionesExtra.${i}.parrafos`, 'Párrafos', 'Separa los párrafos con una línea en blanco.', 'paragraphs')}
      ${field(`seccionesExtra.${i}.lista`, 'Lista', 'Una línea por punto. Vacío = sin lista.', 'lines')}
      ${field(`seccionesExtra.${i}.boton.texto`, 'Botón', 'Vacío = sin botón.')}
      ${field(`seccionesExtra.${i}.boton.enlace`, 'Enlace del botón', 'Ejemplo: #contacto')}
    </div>`;
  }

  function renderExtras() {
    const root = document.getElementById('extras');
    if (!root) return;
    const list = STATE.seccionesExtra || (STATE.seccionesExtra = []);
    root.innerHTML = list.map((block, i) => `
      <details class="ed-block" open>
        <summary>${esc(block.titulo || 'Sección')} <span class="ed-mini">${esc(block.tipo || 'texto')}${block.mostrar === false ? ' · oculta' : ''}</span></summary>
        ${tools('extra', i)}
        <div class="ed-grid">
          ${field(`seccionesExtra.${i}.mostrar`, 'Visible', 'Al activarla, si no estaba en el orden, se agrega al final.', 'bool')}
          ${field(`seccionesExtra.${i}.menu`, 'Nombre en el menú', 'Vacío = no sale en la barra.')}
          ${field(`seccionesExtra.${i}.etiqueta`, 'Etiqueta', '')}
          ${field(`seccionesExtra.${i}.titulo`, 'Título', '')}
          ${field(`seccionesExtra.${i}.texto`, 'Texto bajo el título', '', 'textarea')}
          ${select(`seccionesExtra.${i}.fondo`, 'Fondo', '', FONDOS)}
        </div>
        <p class="ed-id">id: ${esc(block.id || '')} · este nombre es interno. Si la editas a mano, tiene que coincidir con la lista orden.</p>
        ${extraBody(block, i)}
      </details>`).join('') || '<p class="ed-note">Todavía no hay secciones nuevas. La de ejemplo, si existe y está oculta, aparece aquí.</p>';
  }

  function renderLists() {
    renderDatos();
    renderOrden();
    renderGalerias();
    renderProyectos();
    renderServicios();
    renderPasos();
    renderPrecios();
    renderPilares();
    renderExtras();
  }

  function blankVideo() {
    return { titulo: 'Video nuevo', video: '', formato: 'vertical', destacado: false, categoria: '', cliente: '', poster: '', encuadre: '', ajuste: '', duracion: '' };
  }
  function blankSection(tipo) {
    const id = uniqueId('seccion');
    const base = {
      id, tipo, mostrar: true, menu: 'Nueva sección', etiqueta: 'Nueva',
      titulo: 'Título de la sección', texto: '', fondo: '',
    };
    if (tipo === 'videos') {
      base.columnas = 'auto';
      base.filtros = false;
      base.nota = '';
      base.videos = [blankVideo()];
    } else if (tipo === 'tarjetas') {
      base.tarjetas = [{ icono: 'estrella', titulo: 'Ficha nueva', texto: 'Escribe aquí.', grande: false }];
    } else if (tipo === 'pasos') {
      base.pasos = [{ tiempo: '', titulo: 'Paso 1', texto: 'Qué pasa en este paso.' }];
    } else {
      base.alineacion = 'centro';
      base.parrafos = ['Escribe aquí el primer párrafo.'];
      base.lista = [];
      base.boton = { texto: '', enlace: '#contacto' };
    }
    return base;
  }

  function onInput(e) {
    const el = e.target;
    if (!el.dataset || !el.dataset.path) return;
    const kind = el.dataset.kind || '';
    let value;
    if (kind === 'bool') value = !!el.checked;
    else if (kind === 'number') value = el.value === '' ? 0 : Number(el.value);
    else if (kind === 'lines' || kind === 'words') value = el.value.split('\n').map((s) => s.trim()).filter(Boolean);
    else if (kind === 'paragraphs') value = el.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
    else if (kind === 'csv') value = el.value.split(',').map((s) => s.trim()).filter(Boolean);
    else value = el.value;
    const path = el.dataset.path;
    setPath(STATE, path, value);
    const mirror = `[data-path="${path.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"]`;
    document.querySelectorAll(mirror).forEach((box) => {
      if (box === el) return;
      if (box.type === 'checkbox') box.checked = !!value;
      else if (!box.dataset.kind) box.value = Array.isArray(value) ? value.join(', ') : String(value ?? '');
    });
    if (kind === 'bool' && /\.mostrar$/.test(path) && value) {
      const block = getPath(STATE, path.replace(/\.mostrar$/, ''));
      if (block && block.id) {
        const before = (STATE.orden || []).length;
        placeInOrden(block.id);
        if ((STATE.orden || []).length !== before) renderOrden();
      }
    }
  }

  function onClick(e) {
    const btn = e.target.closest('[data-act]');
    if (!btn || !app.contains(btn)) return;
    const act = btn.dataset.act;
    const i = Number(btn.dataset.i);
    const j = Number(btn.dataset.j);
    const proyectos = STATE.proyectos || (STATE.proyectos = []);
    const extras = STATE.seccionesExtra || (STATE.seccionesExtra = []);

    if (act === 'add-dato') { (STATE.portada.datos || (STATE.portada.datos = [])).push({ titulo: 'Nuevo', texto: '' }); renderDatos(); }
    else if (act === 'up-dato') { move(STATE.portada.datos, i, -1); renderDatos(); }
    else if (act === 'down-dato') { move(STATE.portada.datos, i, 1); renderDatos(); }
    else if (act === 'del-dato') { STATE.portada.datos.splice(i, 1); renderDatos(); }

    else if (act === 'up-orden') { move(STATE.orden, i, -1); renderOrden(); }
    else if (act === 'down-orden') { move(STATE.orden, i, 1); renderOrden(); }
    else if (act === 'del-orden') { STATE.orden.splice(i, 1); renderOrden(); }

    else if (act === 'add-project') {
      proyectos.push({
        mostrar: true, titulo: 'Proyecto nuevo', cliente: '', clienteDetalle: '', categoria: 'Reels',
        plataformas: [], descripcion: '', tareas: [], resultado: '',
        links: { tiktok: '', youtube: '', instagram: '' }, videos: [blankVideo()],
      });
      renderProyectos();
    } else if (act === 'up-project') { move(proyectos, i, -1); renderProyectos(); }
    else if (act === 'down-project') { move(proyectos, i, 1); renderProyectos(); }
    else if (act === 'del-project') {
      if (confirm('¿Quitar este proyecto y sus videos?')) { proyectos.splice(i, 1); renderProyectos(); }
    } else if (act === 'add-video') {
      (proyectos[i].videos || (proyectos[i].videos = [])).push(blankVideo());
      renderProyectos();
    } else if (act === 'up-video') { move(proyectos[i].videos, j, -1); renderProyectos(); }
    else if (act === 'down-video') { move(proyectos[i].videos, j, 1); renderProyectos(); }
    else if (act === 'del-video') { proyectos[i].videos.splice(j, 1); renderProyectos(); }

    else if (act === 'add-service') {
      STATE.servicios.tarjetas.push({ icono: 'estrella', titulo: 'Servicio nuevo', texto: '', grande: false, lineaDeTiempo: false });
      renderServicios();
    } else if (act === 'up-service') { move(STATE.servicios.tarjetas, i, -1); renderServicios(); }
    else if (act === 'down-service') { move(STATE.servicios.tarjetas, i, 1); renderServicios(); }
    else if (act === 'del-service') { STATE.servicios.tarjetas.splice(i, 1); renderServicios(); }

    else if (act === 'add-step') { STATE.proceso.pasos.push({ tiempo: '', titulo: 'Paso nuevo', texto: '' }); renderPasos(); }
    else if (act === 'up-step') { move(STATE.proceso.pasos, i, -1); renderPasos(); }
    else if (act === 'down-step') { move(STATE.proceso.pasos, i, 1); renderPasos(); }
    else if (act === 'del-step') { STATE.proceso.pasos.splice(i, 1); renderPasos(); }

    else if (act === 'add-dur') { STATE.precios.porDuracion.push({ duracion: 'Nueva duración', precio: 0 }); renderPrecios(); }
    else if (act === 'up-dur') { move(STATE.precios.porDuracion, i, -1); renderPrecios(); }
    else if (act === 'down-dur') { move(STATE.precios.porDuracion, i, 1); renderPrecios(); }
    else if (act === 'del-dur') { STATE.precios.porDuracion.splice(i, 1); renderPrecios(); }
    else if (act === 'add-pack') {
      STATE.precios.paquetes.push({ nombre: 'Pack nuevo', detalle: '', precio: 0, ahorro: 0, destacado: false, incluye: [] });
      renderPrecios();
    } else if (act === 'up-pack') { move(STATE.precios.paquetes, i, -1); renderPrecios(); }
    else if (act === 'down-pack') { move(STATE.precios.paquetes, i, 1); renderPrecios(); }
    else if (act === 'del-pack') { STATE.precios.paquetes.splice(i, 1); renderPrecios(); }

    else if (act === 'add-pilar') { STATE.sobreMi.pilares.push({ titulo: 'Nuevo', texto: '' }); renderPilares(); }
    else if (act === 'up-pilar') { move(STATE.sobreMi.pilares, i, -1); renderPilares(); }
    else if (act === 'down-pilar') { move(STATE.sobreMi.pilares, i, 1); renderPilares(); }
    else if (act === 'del-pilar') { STATE.sobreMi.pilares.splice(i, 1); renderPilares(); }

    else if (act === 'add-extra') {
      const tipo = (document.getElementById('nuevo-tipo') || {}).value || 'texto';
      const block = blankSection(tipo);
      extras.push(block);
      if (!STATE.orden.includes(block.id)) placeInOrden(block.id);
      renderExtras();
      renderOrden();
    } else if (act === 'up-extra') { move(extras, i, -1); renderExtras(); }
    else if (act === 'down-extra') { move(extras, i, 1); renderExtras(); }
    else if (act === 'del-extra') {
      if (!confirm('¿Quitar esta sección?')) return;
      const id = extras[i] && extras[i].id;
      extras.splice(i, 1);
      STATE.orden = (STATE.orden || []).filter((x) => x !== id);
      renderExtras();
      renderOrden();
    } else if (act === 'add-evideo') { (extras[i].videos || (extras[i].videos = [])).push(blankVideo()); renderExtras(); }
    else if (act === 'up-evideo') { move(extras[i].videos, j, -1); renderExtras(); }
    else if (act === 'down-evideo') { move(extras[i].videos, j, 1); renderExtras(); }
    else if (act === 'del-evideo') { extras[i].videos.splice(j, 1); renderExtras(); }
    else if (act === 'add-ecard') { (extras[i].tarjetas || (extras[i].tarjetas = [])).push({ icono: 'estrella', titulo: 'Ficha', texto: '' }); renderExtras(); }
    else if (act === 'up-ecard') { move(extras[i].tarjetas, j, -1); renderExtras(); }
    else if (act === 'down-ecard') { move(extras[i].tarjetas, j, 1); renderExtras(); }
    else if (act === 'del-ecard') { extras[i].tarjetas.splice(j, 1); renderExtras(); }
    else if (act === 'add-estep') { (extras[i].pasos || (extras[i].pasos = [])).push({ tiempo: '', titulo: 'Paso', texto: '' }); renderExtras(); }
    else if (act === 'up-estep') { move(extras[i].pasos, j, -1); renderExtras(); }
    else if (act === 'down-estep') { move(extras[i].pasos, j, 1); renderExtras(); }
    else if (act === 'del-estep') { extras[i].pasos.splice(j, 1); renderExtras(); }
    else if (act === 'reset') {
      if (!confirm('¿Deshacer todo lo de esta visita y volver a lo que había al abrir la página?')) return;
      STATE = JSON.parse(JSON.stringify(ORIGINAL));
      app.innerHTML = renderSimple();
      renderLists();
    }
  }

  const GUIDE = `/* =====================================================================
   CÓMO EDITAR TU PORTAFOLIO
   =====================================================================
   Este archivo lo armó el formulario (crear/index.html), pero también
   se puede seguir editando aquí.

   A) Formulario: abre crear/index.html, cambia lo que quieras,
      pulsa Descargar config.js y reemplaza este archivo dentro de js/.
   B) A mano: cambia solo el texto entre comillas.
      mostrar: true  = sí se ve.   mostrar: false = no se ve.
      true y false van SIN comillas.
      Para sumar un video, un precio o una sección, copia un bloque
      desde { hasta } (con la coma) y pégalo debajo.

   Si la página queda en blanco, faltó una coma, una comilla o una llave.
   Deshaz (Ctrl+Z) o vuelve a descargar el archivo desde el formulario.

   *así* = negrita.   {así} = color.   [texto](#contacto) = enlace.
   NOMBRE se cambia solo por el nombre de perfil.
   formato del video: "vertical", "horizontal", "cuadrado" o "4:5".
   columnas: "auto" acomoda las tarjetas aunque agregues muchos videos.
   destacado: true manda ese video a Proyectos destacados.
   ===================================================================== */

`;

  const ROOT = ['perfil', 'intro', 'portada', 'cinta', 'orden', 'galerias', 'proyectos', 'casos', 'servicios', 'proceso', 'precios', 'sobreMi', 'contacto', 'seccionesExtra', 'textos', 'frases', 'proteccion'];
  const BANNERS = {
    perfil: '1) QUIÉN ERES',
    intro: '2) INTRO. mostrar: false entra directo, sin el video inicial.',
    portada: '3) PORTADA. {así} es color, *así* es negrita, NOMBRE es tu nombre.',
    cinta: '4) CINTA DE PALABRAS',
    orden: '5) ORDEN. Lo de arriba sale primero. La portada va siempre antes.',
    galerias: '6) GALERÍAS. cuales: "destacados", "todos" o "sin-destacar". columnas: "auto", 2, 3 o 4.',
    proyectos: '7) PROYECTOS. Copia un proyecto o un video para agregar otro. mostrar: false lo esconde.',
    casos: '8) CASOS. menu vacío = no sale en la barra.',
    servicios: '9) SERVICIOS. icono: reels, youtube, sonido, color, texto, estrella, rayo, corazon, camara, megafono, check.',
    proceso: '10) PROCESO. tiempo vacío se numera solo.',
    precios: '11) PRECIOS. mostrar: false esconde la sección y el menú.',
    sobreMi: '12) SOBRE MÍ. Cada texto de parrafos es un párrafo.',
    contacto: '13) CONTACTO. Usa el WhatsApp y el email de perfil.',
    seccionesExtra: '14) SECCIONES NUEVAS. tipo: "texto", "videos", "tarjetas" o "pasos". mostrar: true la publica.',
    textos: '15) PESTAÑA, MENÚ Y PIE',
    frases: '16) FRASES DE BOTONES. Si dejas una vacía, se usa la frase original.',
    proteccion: '17) PROTECCIÓN. No impide grabar la pantalla. Lo importante es la marca de agua en el video exportado.',
  };

  function jsString(value) {
    const s = String(value ?? '');
    if (/[\n\r]/.test(s)) {
      return '`' + s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
    }
    return JSON.stringify(s);
  }
  function literal(value) {
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (value == null) return '""';
    return jsString(value);
  }
  function dump(value, indent) {
    const pad = '  '.repeat(indent);
    if (Array.isArray(value)) {
      if (!value.length) return '[]';
      const simple = value.every((v) => v == null || ['string', 'number', 'boolean'].includes(typeof v));
      const lines = value.map((v) => `${pad}  ${simple ? literal(v) : dump(v, indent + 1)},`);
      return `[\n${lines.join('\n')}\n${pad}]`;
    }
    if (value && typeof value === 'object') {
      const keys = Object.keys(value).filter((k) => value[k] !== undefined && k !== '__borrador');
      const lines = keys.map((k) => `${pad}  ${k}: ${dump(value[k], indent + 1)},`);
      return `{\n${lines.join('\n')}\n${pad}}`;
    }
    return literal(value);
  }
  function serialize(state) {
    const keys = ROOT.filter((k) => state[k] !== undefined).concat(Object.keys(state).filter((k) => !ROOT.includes(k) && k !== '__borrador'));
    const body = keys.map((k) => {
      const banner = BANNERS[k] ? `\n  /* ----- ${BANNERS[k]} ----- */\n` : '\n';
      return `${banner}  ${k}: ${dump(state[k], 1)},`;
    }).join('\n');
    return `${GUIDE}window.PORTAFOLIO = {${body}\n};\n`;
  }
  function check(text) {
    const fn = new Function('window', `${text}\nreturn window.PORTAFOLIO;`);
    const box = {};
    const result = fn(box);
    if (!result || typeof result !== 'object') throw new Error('El archivo no tiene los datos del portafolio.');
    return result;
  }

  function download() {
    let text = '';
    try {
      text = serialize(STATE);
      check(text);
    } catch (err) {
      alert('No pude preparar el archivo. ' + (err && err.message ? err.message : ''));
      return;
    }
    const blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'config.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }
  function preview() {
    try { localStorage.setItem('portafolio-borrador', JSON.stringify(STATE)); }
    catch (_) { /* el navegador no dejó guardar */ }
    if (location.protocol === 'file:') {
      alert('Abriste esta página con doble clic, y así el navegador no deja pasar la prueba al otro archivo.\n\nPulsa Descargar config.js, reemplaza el archivo dentro de la carpeta js y abre index.html.');
      return;
    }
    window.open('../index.html?vista=borrador', '_blank');
  }

  app.innerHTML = renderSimple();
  app.addEventListener('input', onInput);
  app.addEventListener('change', onInput);
  app.addEventListener('click', onClick);
  renderLists();

  document.getElementById('btn-download').addEventListener('click', download);
  document.getElementById('btn-preview').addEventListener('click', preview);
})();
