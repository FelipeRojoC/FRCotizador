# FRCotizador — Cuéntame de tu idea

Formulario web para **entender la idea de una página** antes de cotizarla.
Está orientado a **talleres mecánicos**: sin tecnicismos, con ejemplos, dibujos de cada tipo de página
y una **vista previa en vivo** que va armando el boceto del sitio mientras el cliente responde.

100% frontend — no hay servidor, ni base de datos, ni build. Son 4 archivos estáticos.

---

## Qué hace

7 pasos + resumen:

| Paso | Qué pregunta |
|---|---|
| 1. Tu taller | Nombre, años, contacto, redes, direcciones, horarios, especialidades, vehículos y servicios extra |
| 2. Tipo de página | Landing, sitio con varias páginas, servicios con precios, agenda de horas, tienda de repuestos o "no estoy seguro" — cada uno con su dibujo, para qué sirve y un ejemplo |
| 3. Objetivos | Qué quiere lograr (incluye "que empresas me encuentren"), cliente ideal y qué lo diferencia |
| 4. Secciones | Los bloques del sitio, cada uno explicado y con ejemplo; servicios, precios, marcas y reseñas abren un campo para escribirlos |
| 5. Estilo | 8 estilos que muestran el nombre del taller aplicado, colores que le gustan y que no, páginas de referencia |
| 6. Material | Logo, fotos, textos, precios, reseñas → "Lo tengo" / "Necesito ayuda" / "No aplica" |
| 7. Detalles | Dominio, correo corporativo, funciones extra, quién actualiza, plazo y presupuesto (rangos desde $50.000) |

Además:

- **Modo claro y oscuro**: botón 🌙 / ☀️ en la barra superior. Paleta morado + gris oscuro en el modo
  oscuro, morado + blanco en el claro. Arranca según el sistema del visitante y recuerda la elección.
- **Vista previa en vivo**: a la derecha se dibuja el boceto de la página con el nombre del taller,
  sus especialidades, precios, marcas, el color elegido y el botón flotante de WhatsApp.
  En celular se abre con el botón "Ver mi página".
- **Glosario** ("¿Qué significa cada palabra?") con dominio, hosting, responsive, SEO, CTA, CMS y más.
- **Guardado automático** en el navegador: se puede cerrar y seguir después.
- **Brief visual descargable** (HTML autocontenido con el boceto + todas las respuestas).
- **Copiar resumen** y, si se configura un número, **enviar por WhatsApp**.

---

## Cómo llegan los datos al correo

El envío usa [FormSubmit](https://formsubmit.co) — un servicio gratuito que recibe el POST del
formulario y lo reenvía por correo. No requiere backend ni cuenta.

Correo configurado: **felipe.rojo@alumnos.ucn.cl** (en `assets/data.js` → `CONFIG.email`).

> ⚠️ **Activación única**: la **primera vez** que alguien envía el formulario, FormSubmit manda un
> correo de confirmación a esa casilla con un botón *Activate Form*. Hay que apretarlo **una vez**.
> Desde ahí, todos los envíos siguientes llegan directo.
>
> Conviene hacer el primer envío tú mismo apenas esté publicado, para dejarlo activado.

El correo llega como una tabla con secciones (`🏭 TALLER`, `📐 TIPO DE PÁGINA`, `🎨 ESTILO`…) y el
resumen completo en texto.

**El diseño viaja como link, no como adjunto.** Arriba del resumen va el campo
`🖼️ VER EL DISEÑO`: un link a esta misma página con todas las respuestas codificadas en la
dirección (`?b=…`). Al abrirlo se dibuja el brief visual completo — boceto de la página incluido —
y trae un botón para guardarlo como HTML. Se hace así porque los adjuntos no son confiables en el
plan gratuito de FormSubmit; el archivo se intenta adjuntar igual, pero el link siempre funciona.

Para que el link apunte al lugar correcto está `CONFIG.urlPublica`. Si se deja vacío, se arma con
la dirección desde donde se abrió el formulario.

FormSubmit responde HTTP 200 aunque no haya enviado nada, así que el resultado real se lee del
campo `success` del JSON. Si el envío no sale, la pantalla ofrece WhatsApp, el correo ya redactado,
copiar el resumen y descargar el brief.

---

## Configuración

Todo lo editable está arriba de `assets/data.js`:

```js
const CONFIG = {
  email: "felipe.rojo@alumnos.ucn.cl", // dónde llegan los formularios
  whatsapp: "56976728541",               // sin + ni espacios
  urlPublica: "https://feliperojoc.github.io/FRCotizador/", // para el link del diseño
  autor: "Felipe Rojo",
  asunto: "Nuevo brief de página web — Taller"
};
```

Con el WhatsApp configurado, el resumen ofrece además un botón verde que abre el chat
con todo el texto ya escrito.

En el mismo archivo se editan sin tocar código: especialidades, vehículos, servicios extra,
tipos de página, objetivos, secciones, estilos, colores, material, funciones extra, los rangos de
presupuesto (`PRESUPUESTOS`) y el glosario.

---

## Publicar

### GitHub Pages
1. En el repo → **Settings → Pages**.
2. *Source*: **Deploy from a branch** → rama `main`, carpeta `/ (root)`.
3. Queda en `https://feliperojoc.github.io/FRCotizador/`.

### Otra opción
Arrastrar la carpeta a [Netlify Drop](https://app.netlify.com/drop) o subirla a cualquier hosting.
Son archivos estáticos: funciona en cualquier parte.

### Probar en local
```bash
python3 -m http.server 8080
```
y abrir `http://localhost:8080`.

---

## Estructura

```
index.html          Estructura de la página + arranque del tema (sin parpadeo)
assets/styles.css   Estilos: variables de tema claro/oscuro, responsive
assets/data.js      CONFIG + todo el contenido del formulario
assets/app.js       Lógica: pasos, validación, vista previa, resumen y envío
```

Sin dependencias ni build. La única carga externa son las tipografías de Google Fonts.
