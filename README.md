# Portafolio · Desmos (editor de video)

Sitio estático (HTML + CSS + JS, sin instalar nada), listo para GitHub Pages.

🌐 **Sitio publicado:** https://desmosedit.github.io/Portafolio-de-edici-n-de-video/

## Verlo en local

Doble clic en `index.html`. Listo.

## Editar el contenido

Hay dos formas. Las dos tocan el mismo archivo, `js/config.js`.
Arriba de ese archivo está la guía, y cada bloque tiene un comentario que dice qué cambiar.

**Formulario (más fácil si no programas)**

1. Abre `crear/index.html` (doble clic). En el sitio publicado la dirección termina en `/crear/`.
2. Cambia los campos. Cada uno explica para qué sirve.
3. Pulsa **Descargar config.js**.
4. Mete ese archivo en la carpeta `js`, reemplazando el anterior.
5. Abre `index.html` y pulsa F5.

**A mano**

Abre `js/config.js` y cambia el texto que está entre comillas `"así"`.
`mostrar: true` enseña esa parte. `mostrar: false` la esconde.
Para sumar un video, un precio o una sección, copia un bloque que ya exista
(desde `{` hasta `}`, con la coma) y pégalo debajo.

| Qué | Dónde, en `js/config.js` |
| --- | --- |
| Nombre, email, WhatsApp, redes | `perfil` |
| Portada, cinta, menú, orden | `portada`, `cinta`, `orden` |
| Videos y proyectos | `proyectos` (y qué galería los muestra, en `galerias`) |
| Servicios, proceso, precios, sobre mí, contacto | su bloque con ese nombre |
| Una sección nueva | `seccionesExtra` (`tipo`: `"texto"`, `"videos"`, `"tarjetas"` o `"pasos"`) |
| Precios ocultos | `precios` → `mostrar: false` |

`columnas: "auto"` en una galería acomoda las tarjetas aunque agregues muchos videos:
en el celular se apilan y en la computadora arman filas. Un video `"horizontal"` sale más ancho que uno `"vertical"`.

Si la página se queda en blanco, se borró una coma, una comilla o una llave.
Deshaz el cambio (Ctrl+Z) o vuelve a descargar el archivo desde `crear/index.html`.

### Poner los videos de Google Drive

1. En Drive: clic derecho al video → **Compartir** → Acceso general: **"Cualquier persona con el enlace"**.
2. Copia el enlace y pégalo en el campo `video`:

```js
{ titulo: "Reel promocional", video: "https://drive.google.com/file/d/XXXX/view?usp=sharing" }
```

La miniatura sale sola desde Drive (no hace falta `poster`). También funcionan links de YouTube.

Cuando ya estén todos los videos de Drive, borra la carpeta `assets/video/demo/` y `assets/posters/`
(son solo de prueba).

## 🔒 Proteger los videos

Ninguna página web puede impedir al 100% que se lleven un video (siempre se puede grabar la pantalla).
Lo que sí se puede es ponerlo difícil y que lo que se lleven tenga su firma:

1. **Marca de agua en el propio video (lo más importante).** Exporta las versiones del portafolio
   desde CapCut con "DESMOS" o tu @ visible. Si alguien se lo lleva, se lleva tu firma.
2. **Sube versiones de muestra** (por ejemplo 720p) y guarda los originales en alta calidad solo para ti.
3. **Desactiva la descarga en Drive**, en cada video: *Compartir → ⚙️ Configuración →* desmarca
   *"Los lectores y comentadores pueden ver la opción de descargar, imprimir y copiar"*.
4. **Nunca subas los videos reales a este repositorio.** El repo es público (GitHub Pages gratis lo exige)
   y cualquiera puede clonarlo. Aunque borres un video después, queda guardado en el historial de git.

La página ya trae protecciones activadas en `js/config.js` → `proteccion`: sin botón de descarga,
sin clic derecho ni arrastre sobre los videos, sin ventana flotante, marca de agua sobre el reproductor
y el botón "abrir en Drive" tapado. Frenan a la mayoría de la gente, pero alguien con conocimientos
técnicos (herramientas del navegador) todavía podría sacar el video: por eso importa el punto 1.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `desmos-portafolio`).
2. Sube **el contenido de esta carpeta** (que `index.html` quede en la raíz del repo).
3. En el repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`** → Save.
4. En 1–2 minutos queda en `https://TU-USUARIO.github.io/desmos-portafolio/`.

Si el sitio cambia de dirección, en `index.html` actualiza `og:url` y `og:image` con la URL completa
(`https://TU-USUARIO.github.io/desmos-portafolio/assets/img/og.jpg`) para que se vea la vista previa al compartir el link.

## Estructura

```
index.html          página
css/styles.css      estilos
js/config.js        ✏️ contenido editable
js/main.js          lógica (galería, reproductor, intro, menú)
assets/img/         logo, favicon, imagen para compartir
assets/video/       intro de marca y video de fondo
assets/video/demo/  videos de prueba (temporales)
```
