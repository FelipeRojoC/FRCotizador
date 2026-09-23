/* =========================================================
   FRCotizador — Lógica del formulario
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- Utilidades ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const lines = (s) => String(s || "").split("\n").map(x => x.trim()).filter(Boolean);
  const nz = (s) => String(s || "").trim();

  /* ---------------- Estado ---------------- */
  const KEY = "frcotizador-taller-v1";
  const blank = () => ({
    nombreContacto: "", cargo: "",
    nombre: "", anios: "", tel: "", email: "", ig: "", fb: "", webActual: "",
    direcciones: [{ dir: "", ciudad: "" }],
    horario: "",
    especialidades: [], otraEsp: "",
    vehiculos: [], serviciosExtra: [],
    tipo: "", tipoNota: "",
    objetivos: [], clienteIdeal: "", diferencia: "", competencia: "",
    secciones: ["portada", "servicios", "ubicacion", "horarios"], secTxt: {},
    estilo: "", coloresSi: [], coloresNo: [], estiloNota: "",
    refs: [{ url: "", gusta: "" }],
    material: {}, materialNota: "",
    dominio: "", dominioCual: "", correoCorp: "",
    extras: [], quienActualiza: "", plazo: "", presupuesto: "", comentarios: ""
  });
  let S = blank();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) S = Object.assign(blank(), JSON.parse(raw));
  } catch (e) { /* sin guardado */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  /* ---------------- Pasos ---------------- */
  const STEPS = [
    { id: "taller",    nav: "Tu taller",    kick: "Paso 1 de 7", title: "Cuéntame de tu taller",      sub: "Lo básico: cómo se llama, qué hacen y cómo te ubican. Esto va a ir directo en la página." },
    { id: "tipo",      nav: "Tipo de página", kick: "Paso 2 de 7", title: "¿Qué tipo de página necesitas?", sub: "Cada opción tiene un dibujo de cómo se organiza. Si no sabes, elige la última y yo te recomiendo." },
    { id: "objetivos", nav: "Objetivos",    kick: "Paso 3 de 7", title: "¿Para qué quieres la página?", sub: "Esto define dónde van los botones y qué se muestra primero. Marca todo lo que aplique." },
    { id: "secciones", nav: "Secciones",    kick: "Paso 4 de 7", title: "¿Qué debe tener la página?",  sub: "Son los bloques que se ven al bajar con el dedo. Marca los que quieras; cada uno trae su explicación." },
    { id: "estilo",    nav: "Estilo",       kick: "Paso 5 de 7", title: "¿Cómo te gustaría que se viera?", sub: "Toca el estilo que más te represente. Abajo eliges colores y me pasas páginas que te gusten." },
    { id: "material",  nav: "Material",     kick: "Paso 6 de 7", title: "¿Qué material tienes listo?",  sub: "Marca lo que ya tienes, lo que necesitas que te ayude a conseguir y lo que no aplica." },
    { id: "detalles",  nav: "Detalles",     kick: "Paso 7 de 7", title: "Últimos detalles",             sub: "Dominio, correo, funciones extra y plazos. Después de esto ya está." },
    { id: "resumen",   nav: "Enviar",       kick: "Listo",       title: "Revisa y envía",               sub: "Este es el resumen de todo lo que me contaste. Revísalo y apreta enviar." }
  ];
  let step = 0;

  /* ---------------- Dibujos (wireframes) ---------------- */
  const W = {
    box: (x, y, w, h, f, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r == null ? 2 : r}" fill="${f}"/>`,
  };
  const C = { line: "var(--wire-1)", soft: "var(--wire-2)", acc: "var(--acc)", dim: "var(--wire-3)" };
  function wire(type) {
    const head = W.box(6, 6, 108, 8, C.line) + W.box(120, 8, 34, 4, C.soft);
    let body = "";
    if (type === "landing") {
      body = W.box(6, 20, 148, 34, C.dim) + W.box(46, 30, 68, 6, "#55677f") + W.box(62, 40, 36, 7, C.acc, 3) +
             W.box(6, 58, 148, 14, C.soft) + W.box(6, 76, 70, 20, C.soft) + W.box(84, 76, 70, 20, C.soft) +
             W.box(6, 100, 148, 10, C.line);
    } else if (type === "sitio") {
      body = W.box(6, 20, 148, 26, C.dim) +
             W.box(6, 52, 44, 24, C.soft) + W.box(58, 52, 44, 24, C.soft) + W.box(110, 52, 44, 24, C.soft) +
             W.box(6, 82, 148, 6, C.line) + W.box(6, 92, 100, 6, C.line) +
             W.box(120, 8, 8, 4, C.acc) + W.box(132, 8, 8, 4, C.soft) + W.box(144, 8, 8, 4, C.soft);
    } else if (type === "precios") {
      body = W.box(6, 20, 148, 16, C.dim);
      for (let i = 0; i < 4; i++) {
        body += W.box(6, 42 + i * 17, 100, 12, C.soft) + W.box(112, 42 + i * 17, 26, 12, C.acc, 3);
      }
    } else if (type === "agenda") {
      body = W.box(6, 20, 148, 12, C.dim);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
        const on = (r === 1 && c === 2);
        body += W.box(8 + c * 24, 38 + r * 18, 20, 14, on ? C.acc : C.soft, 3);
      }
      body += W.box(6, 96, 148, 12, C.line);
    } else if (type === "tienda") {
      body = W.box(6, 20, 148, 12, C.dim);
      for (let i = 0; i < 3; i++) {
        body += W.box(8 + i * 50, 38, 44, 34, C.soft, 3) + W.box(8 + i * 50, 76, 28, 5, C.line) + W.box(8 + i * 50, 85, 20, 6, C.acc, 2);
      }
      body += W.box(128, 6, 26, 8, C.acc, 3);
    } else {
      body = W.box(30, 30, 100, 10, C.soft) + W.box(30, 46, 76, 10, C.soft) + W.box(30, 62, 88, 10, C.soft) +
             `<text x="80" y="96" font-size="15" text-anchor="middle" fill="${C.acc}">?</text>`;
    }
    return `<svg class="wire" viewBox="0 0 160 116" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${head}${body}</svg>`;
  }

  /* ---------------- Constructores de pasos ---------------- */
  function chipList(name, arr, sel) {
    return `<div class="chips">` + arr.map(v => {
      const on = sel.indexOf(v) >= 0;
      return `<label class="chip ${on ? "on" : ""}"><input type="checkbox" data-multi="${name}" value="${esc(v)}" ${on ? "checked" : ""}>${esc(v)}</label>`;
    }).join("") + `</div>`;
  }

  function stepTaller() {
    return `
    <div class="card">
      <h3>🔧 Lo esencial</h3>
      <p class="hint">Así se va a llamar tu página y así te van a contactar.</p>
      <div class="field">
        <label>¿Cómo se llama tu taller? <span class="req">*</span></label>
        <input type="text" data-k="nombre" value="${esc(S.nombre)}" placeholder="Ej: Taller Mecánico El Pistón">
      </div>
      <div class="grid-2">
        <div class="field">
          <label>¿Cuántos años llevan funcionando?</label>
          <input type="text" data-k="anios" value="${esc(S.anios)}" placeholder="Ej: 18 años">
        </div>
        <div class="field">
          <label>¿Cómo te llamas tú? <span class="sub">Para saber con quién hablo</span></label>
          <input type="text" data-k="nombreContacto" value="${esc(S.nombreContacto)}" placeholder="Ej: Juan Pérez, dueño">
        </div>
      </div>
      <div class="grid-2">
        <div class="field">
          <label>Teléfono / WhatsApp <span class="req">*</span></label>
          <input type="tel" data-k="tel" value="${esc(S.tel)}" placeholder="+56 9 1234 5678">
        </div>
        <div class="field">
          <label>Correo</label>
          <input type="email" data-k="email" value="${esc(S.email)}" placeholder="contacto@tutaller.cl">
        </div>
      </div>
      <div class="grid-3">
        <div class="field"><label>Instagram</label><input type="text" data-k="ig" value="${esc(S.ig)}" placeholder="@tutaller"></div>
        <div class="field"><label>Facebook</label><input type="text" data-k="fb" value="${esc(S.fb)}" placeholder="/tutaller"></div>
        <div class="field"><label>¿Ya tienes página?</label><input type="text" data-k="webActual" value="${esc(S.webActual)}" placeholder="No / www.tutaller.cl"></div>
      </div>
    </div>

    <div class="card">
      <h3>📍 Dónde te encuentran</h3>
      <p class="hint">Si tienes más de un local, agrégalos todos.</p>
      <div id="dirHost"></div>
      <button class="btn ghost sm" type="button" id="addDir">+ Agregar otra dirección</button>
      <div class="field" style="margin-top:16px">
        <label>Horarios de atención</label>
        <input type="text" data-k="horario" value="${esc(S.horario)}" placeholder="Lun a Vie 8:30 - 18:30 · Sáb 9:00 - 14:00">
        <div class="chips" style="margin-top:8px">
          ${HORARIOS_PRESET.map(h => `<span class="chip" data-preset-horario="${esc(h)}">${esc(h)}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="card">
      <h3>🛠️ ¿En qué son buenos?</h3>
      <p class="hint">Marca tus especialidades. Esto sale en la portada, es lo que la gente busca en Google.</p>
      ${chipList("especialidades", ESPECIALIDADES, S.especialidades)}
      <div class="field" style="margin-top:14px">
        <label>¿Algo más que hagan y no esté en la lista?</label>
        <input type="text" data-k="otraEsp" value="${esc(S.otraEsp)}" placeholder="Ej: conversión a gas, tapicería, polarizado">
      </div>
    </div>

    <div class="card">
      <h3>🚗 ¿Qué vehículos atienden?</h3>
      <p class="hint">Sirve para que el cliente sepa altiro si le sirves.</p>
      ${chipList("vehiculos", VEHICULOS, S.vehiculos)}
    </div>

    <div class="card">
      <h3>⭐ ¿Qué más ofrecen?</h3>
      <p class="hint">Estas cosas son las que te diferencian del taller de la esquina.</p>
      ${chipList("serviciosExtra", SERVICIOS_EXTRA, S.serviciosExtra)}
    </div>`;
  }

  function stepTipo() {
    return `
    <div class="card">
      <h3>📐 Elige una</h3>
      <p class="hint">Mira el dibujo de cada una: te muestra cómo se ordena la información.</p>
      <div class="opt-grid">
        ${PAGE_TYPES.map(t => `
          <label class="opt ${S.tipo === t.id ? "on" : ""}" data-opt="${t.id}">
            <input type="radio" name="tipo" value="${t.id}" ${S.tipo === t.id ? "checked" : ""}>
            ${wire(t.wire)}
            <h4>${t.icon} ${esc(t.name)} <span class="tag ${t.tag.cls}">${esc(t.tag.txt)}</span></h4>
            <p class="desc">${esc(t.desc)}</p>
            <p class="eg">${esc(t.eg)}</p>
          </label>`).join("")}
      </div>
      <div class="field" style="margin-top:18px">
        <label>¿Quieres agregar algo sobre lo que te imaginas?</label>
        <textarea data-k="tipoNota" placeholder="Ej: quiero que se parezca a la de un taller que vi en Santiago, con harta foto y el WhatsApp siempre a mano.">${esc(S.tipoNota)}</textarea>
      </div>
    </div>`;
  }

  function stepObjetivos() {
    return `
    <div class="card">
      <h3>🎯 ¿Qué quieres lograr? <span class="req">*</span></h3>
      <p class="hint">Marca todo lo que aplique. Lo primero que marques manda en el diseño.</p>
      <div class="chips">
        ${OBJETIVOS.map(o => {
          const on = S.objetivos.indexOf(o.id) >= 0;
          return `<label class="chip ${on ? "on" : ""}"><input type="checkbox" data-multi="objetivos" value="${o.id}" ${on ? "checked" : ""}>${o.icon} ${esc(o.txt)}</label>`;
        }).join("")}
      </div>
    </div>

    <div class="card">
      <h3>👤 ¿Quién es tu cliente ideal?</h3>
      <p class="hint">Con esto escribo los textos apuntando a esa persona, no a "todo el mundo".</p>
      <div class="field">
        <textarea data-k="clienteIdeal" placeholder="Ej: dueños de camionetas de trabajo entre 30 y 55 años, que necesitan el vehículo funcionando sí o sí. También empresas mineras con flotas de 10 a 40 vehículos.">${esc(S.clienteIdeal)}</textarea>
      </div>
    </div>

    <div class="card">
      <h3>💪 ¿Qué te hace distinto?</h3>
      <p class="hint">Lo que dirías si te preguntan "¿por qué llevo mi auto a tu taller y no a otro?".</p>
      <div class="field">
        <textarea data-k="diferencia" placeholder="Ej: entregamos presupuesto por escrito antes de tocar el auto, damos 6 meses de garantía y mandamos fotos del avance por WhatsApp.">${esc(S.diferencia)}</textarea>
      </div>
      <div class="field">
        <label>¿Hay talleres de la competencia que te gusten? <span class="sub">Dime cuáles y qué les ves de bueno</span></label>
        <input type="text" data-k="competencia" value="${esc(S.competencia)}" placeholder="Ej: Taller X, porque su Instagram y su página se ven ordenados">
      </div>
    </div>`;
  }

  function stepSecciones() {
    return `
    <div class="card">
      <h3>🧱 Los bloques de tu página</h3>
      <p class="hint">Cada bloque es una parte que se ve al ir bajando. Marca lo que quieras que aparezca — ya dejé marcadas las básicas.</p>
      ${SECCIONES.map(sec => {
        const on = S.secciones.indexOf(sec.id) >= 0;
        return `
        <div class="sec-item ${on ? "on" : ""}" data-sec="${sec.id}">
          <div class="sec-top" data-sec-toggle>
            <div class="sec-check">✓</div>
            <div class="sec-body">
              <h4>${esc(sec.name)} ${sec.must ? '<span class="tag ok">Siempre va</span>' : ""}</h4>
              <p>${esc(sec.what)}</p>
              <p class="eg">${esc(sec.eg)}</p>
            </div>
          </div>
          ${sec.input ? `<div class="sec-extra ${on ? "" : "hidden"}">
            <label>${esc(sec.input.label)}</label>
            <textarea data-sectxt="${sec.id}" placeholder="${esc(sec.input.ph)}">${esc(S.secTxt[sec.id] || "")}</textarea>
          </div>` : ""}
        </div>`;
      }).join("")}
    </div>`;
  }

  function stepEstilo() {
    const nom = nz(S.nombre) || "Tu Taller";
    return `
    <div class="card">
      <h3>🎨 ¿Qué estilo te representa?</h3>
      <p class="hint">Cada tarjeta muestra el nombre de tu taller en ese estilo. Elige el que más te guste.</p>
      <div class="style-grid">
        ${ESTILOS.map(e => `
          <label class="style-card ${S.estilo === e.id ? "on" : ""}" data-estilo="${e.id}">
            <input type="radio" name="estilo" value="${e.id}" ${S.estilo === e.id ? "checked" : ""}>
            <div class="style-demo" style="background:${e.bg};color:${e.fg};font-family:${e.font}">
              <p class="sd-sub" style="color:${e.acc}">Taller mecánico</p>
              <p class="sd-name" style="font-family:${e.font};${e.up ? "text-transform:uppercase;font-weight:700;letter-spacing:.01em" : "font-weight:700"}">${esc(nom)}</p>
              <span class="sd-btn" style="background:${e.acc};color:${e.id === "premium" || e.id === "clasico" ? "#fff" : "#111"}">Cotizar ahora</span>
            </div>
            <div class="style-meta"><strong>${esc(e.name)}</strong><span>${esc(e.desc)}</span></div>
          </label>`).join("")}
      </div>
    </div>

    <div class="card">
      <h3>✅ Colores que te gustan</h3>
      <p class="hint">Si tu logo ya tiene colores, marca esos. El primero que marques manda.</p>
      <div class="swatches">
        ${COLORES.map(c => {
          const on = S.coloresSi.indexOf(c.id) >= 0;
          return `<label class="sw ${on ? "on" : ""}" data-col="si" data-id="${c.id}"><i style="background:${c.hex}"></i><span>${esc(c.name)}</span></label>`;
        }).join("")}
      </div>
    </div>

    <div class="card">
      <h3>🚫 Colores que NO quieres</h3>
      <p class="hint">Igual de importante: así no pierdo el tiempo proponiéndote algo que odias.</p>
      <div class="swatches">
        ${COLORES.map(c => {
          const on = S.coloresNo.indexOf(c.id) >= 0;
          return `<label class="sw ${on ? "on" : ""}" data-col="no" data-id="${c.id}"><i style="background:${c.hex}"></i><span>${esc(c.name)}</span></label>`;
        }).join("")}
      </div>
    </div>

    <div class="card">
      <h3>🔗 Páginas de referencia</h3>
      <p class="hint">Pégame páginas que te gusten (de talleres o de lo que sea) y dime qué te gusta de cada una.</p>
      <div id="refHost"></div>
      <button class="btn ghost sm" type="button" id="addRef">+ Agregar otra página</button>
      <div class="field" style="margin-top:16px">
        <label>¿Algo más sobre el look?</label>
        <textarea data-k="estiloNota" placeholder="Ej: que no se vea recargado, que las fotos se vean grandes y que los números de teléfono sean bien visibles.">${esc(S.estiloNota)}</textarea>
      </div>
    </div>`;
  }

  function stepMaterial() {
    return `
    <div class="card">
      <h3>📦 ¿Qué tienes y qué te falta?</h3>
      <p class="hint">Marca honestamente. Si falta algo, lo resolvemos: puedo ir a sacar fotos o escribir los textos.</p>
      ${MATERIAL.map(m => {
        const v = S.material[m.id] || "";
        const o = (val, txt) => `<label data-v="${val}" class="${v === val ? "on" : ""}"><input type="radio" name="mat-${m.id}" value="${val}" ${v === val ? "checked" : ""}>${txt}</label>`;
        return `<div class="mat-row" data-mat="${m.id}">
          <div class="mat-name">${esc(m.name)}<small>${esc(m.sub)}</small></div>
          <div class="tri">${o("tengo", "Lo tengo")}${o("ayuda", "Necesito ayuda")}${o("noaplica", "No aplica")}</div>
        </div>`;
      }).join("")}
      <div class="field" style="margin-top:16px">
        <label>¿Algo que quieras aclarar del material?</label>
        <textarea data-k="materialNota" placeholder="Ej: tengo el logo pero solo en una foto del letrero. Fotos tengo hartas en el Instagram.">${esc(S.materialNota)}</textarea>
      </div>
    </div>`;
  }

  function stepDetalles() {
    const r = (k, val, txt) => `<label class="chip ${S[k] === val ? "on" : ""}" data-single="${k}" data-val="${esc(val)}">${esc(txt)}</label>`;
    return `
    <div class="card">
      <h3>🌐 Dominio y correo</h3>
      <p class="hint">El dominio es la dirección de tu página (ej: tutaller.cl). Si no tienes, yo lo consigo.</p>
      <div class="field">
        <label>¿Ya tienes dominio?</label>
        <div class="chips">${r("dominio", "si", "Sí, ya lo tengo")}${r("dominio", "no", "No, necesito uno")}${r("dominio", "nose", "No sé qué es")}</div>
      </div>
      <div class="grid-2">
        <div class="field">
          <label>¿Cuál es o cuál te gustaría?</label>
          <input type="text" data-k="dominioCual" value="${esc(S.dominioCual)}" placeholder="Ej: tallerelpiston.cl">
        </div>
        <div class="field">
          <label>¿Quieres correo con tu dominio?</label>
          <input type="text" data-k="correoCorp" value="${esc(S.correoCorp)}" placeholder="Ej: sí, contacto@tallerelpiston.cl">
        </div>
      </div>
    </div>

    <div class="card">
      <h3>⚙️ Funciones extra</h3>
      <p class="hint">Marca lo que te sirva. Algunas suman al valor, te lo digo claro en la cotización.</p>
      <div class="chips">
        ${EXTRAS.map(e => {
          const on = S.extras.indexOf(e.id) >= 0;
          return `<label class="chip ${on ? "on" : ""}"><input type="checkbox" data-multi="extras" value="${e.id}" ${on ? "checked" : ""}>${esc(e.txt)}</label>`;
        }).join("")}
      </div>
    </div>

    <div class="card">
      <h3>🔄 Después de entregada</h3>
      <div class="field">
        <label>¿Quién va a actualizar la página?</label>
        <div class="chips">
          ${r("quienActualiza", "yo", "Yo mismo (quiero un panel)")}
          ${r("quienActualiza", "tu", "Prefiero que lo hagas tú")}
          ${r("quienActualiza", "poco", "Casi no va a cambiar")}
          ${r("quienActualiza", "nose", "No lo tengo claro")}
        </div>
      </div>
      <div class="field">
        <label>¿Para cuándo la necesitas?</label>
        <div class="chips">
          ${r("plazo", "urgente", "Lo antes posible")}
          ${r("plazo", "mes", "Dentro de un mes")}
          ${r("plazo", "2-3", "En 2 o 3 meses")}
          ${r("plazo", "sinapuro", "Sin apuro")}
        </div>
      </div>
      <div class="field">
        <label>Presupuesto aproximado <span class="sub">Opcional, pero ayuda a proponerte algo realista</span></label>
        <div class="chips">
          ${r("presupuesto", "a", "Hasta $200.000")}
          ${r("presupuesto", "b", "$200.000 a $400.000")}
          ${r("presupuesto", "c", "$400.000 a $700.000")}
          ${r("presupuesto", "d", "Más de $700.000")}
          ${r("presupuesto", "e", "Prefiero que me propongas")}
        </div>
      </div>
      <div class="field">
        <label>¿Algo más que quieras contarme?</label>
        <textarea data-k="comentarios" placeholder="Cualquier cosa: una idea, una duda, algo que viste y te gustó.">${esc(S.comentarios)}</textarea>
      </div>
    </div>`;
  }

  /* ---------------- Resumen ---------------- */
  function pageTypeName(id) { const t = PAGE_TYPES.find(x => x.id === id); return t ? t.name : "Sin definir"; }
  function estiloName(id) { const e = ESTILOS.find(x => x.id === id); return e ? e.name : "Sin definir"; }
  function colorNames(ids) { return ids.map(i => (COLORES.find(c => c.id === i) || {}).name).filter(Boolean); }
  function objetivoTxt(id) { const o = OBJETIVOS.find(x => x.id === id); return o ? o.txt : id; }
  function extraTxt(id) { const e = EXTRAS.find(x => x.id === id); return e ? e.txt : id; }
  function seccionName(id) { const s = SECCIONES.find(x => x.id === id); return s ? s.name : id; }
  const MATLBL = { tengo: "Lo tengo", ayuda: "Necesito ayuda", noaplica: "No aplica" };
  const MAP_TXT = {
    dominio: { si: "Ya tiene dominio", no: "Necesita dominio", nose: "No sabe qué es" },
    quienActualiza: { yo: "Él mismo (quiere panel de edición)", tu: "Prefiere que lo haga yo", poco: "Casi no va a cambiar", nose: "No lo tiene claro" },
    plazo: { urgente: "Lo antes posible", mes: "Dentro de un mes", "2-3": "En 2 o 3 meses", sinapuro: "Sin apuro" },
    presupuesto: { a: "Hasta $200.000", b: "$200.000 a $400.000", c: "$400.000 a $700.000", d: "Más de $700.000", e: "Prefiere una propuesta" }
  };

  function dirTxt() {
    return S.direcciones.filter(d => nz(d.dir)).map(d => nz(d.dir) + (nz(d.ciudad) ? ", " + nz(d.ciudad) : "")).join(" · ");
  }
  function refsTxt() {
    return S.refs.filter(r => nz(r.url)).map(r => nz(r.url) + (nz(r.gusta) ? " — le gusta: " + nz(r.gusta) : "")).join("\n");
  }

  function summaryBlocks() {
    const esps = S.especialidades.concat(nz(S.otraEsp) ? [nz(S.otraEsp)] : []);
    const mats = MATERIAL.filter(m => S.material[m.id]).map(m => m.name + ": " + MATLBL[S.material[m.id]]);
    return [
      { h: "El taller", rows: [
        ["Nombre del taller", S.nombre],
        ["Contacto", [nz(S.nombreContacto), nz(S.tel), nz(S.email)].filter(Boolean).join(" · ")],
        ["Años funcionando", S.anios],
        ["Direcciones", dirTxt()],
        ["Horarios", S.horario],
        ["Redes", [nz(S.ig), nz(S.fb)].filter(Boolean).join(" · ")],
        ["Página actual", S.webActual],
        ["Especialidades", esps.join(", ")],
        ["Vehículos que atiende", S.vehiculos.join(", ")],
        ["Servicios adicionales", S.serviciosExtra.join(", ")]
      ]},
      { h: "Tipo de página", rows: [
        ["Eligió", pageTypeName(S.tipo)],
        ["Comentario", S.tipoNota]
      ]},
      { h: "Objetivos", rows: [
        ["Qué quiere lograr", S.objetivos.map(objetivoTxt).join(" · ")],
        ["Cliente ideal", S.clienteIdeal],
        ["Qué lo diferencia", S.diferencia],
        ["Competencia que le gusta", S.competencia]
      ]},
      { h: "Secciones", rows: [
        ["Bloques elegidos", S.secciones.map(seccionName).join(" · ")]
      ].concat(Object.keys(S.secTxt).filter(k => nz(S.secTxt[k]) && S.secciones.indexOf(k) >= 0)
        .map(k => [seccionName(k), S.secTxt[k]]))
      },
      { h: "Estilo", rows: [
        ["Estilo elegido", estiloName(S.estilo)],
        ["Colores que le gustan", colorNames(S.coloresSi).join(", ")],
        ["Colores que NO quiere", colorNames(S.coloresNo).join(", ")],
        ["Páginas de referencia", refsTxt()],
        ["Notas de estilo", S.estiloNota]
      ]},
      { h: "Material", rows: [
        ["Estado del material", mats.join(" · ")],
        ["Notas", S.materialNota]
      ]},
      { h: "Detalles finales", rows: [
        ["Dominio", (MAP_TXT.dominio[S.dominio] || "") + (nz(S.dominioCual) ? " — " + nz(S.dominioCual) : "")],
        ["Correo corporativo", S.correoCorp],
        ["Funciones extra", S.extras.map(extraTxt).join(" · ")],
        ["Quién actualiza", MAP_TXT.quienActualiza[S.quienActualiza] || ""],
        ["Plazo", MAP_TXT.plazo[S.plazo] || ""],
        ["Presupuesto", MAP_TXT.presupuesto[S.presupuesto] || ""],
        ["Comentarios", S.comentarios]
      ]}
    ];
  }

  function stepResumen() {
    const blocks = summaryBlocks();
    return `
    <div class="summary-hero">
      <h2>${esc(nz(S.nombre) || "Tu taller")}</h2>
      <p>Esto es lo que voy a recibir. Si algo está mal, vuelve atrás y corrígelo.</p>
    </div>
    <div class="card">
      ${blocks.map(b => `
        <div class="sum-block">
          <h4>${esc(b.h)}</h4>
          ${b.rows.filter(r => nz(r[1])).map(r => `<div class="sum-row"><b>${esc(r[0])}</b><span>${esc(r[1]).replace(/\n/g, "<br>")}</span></div>`).join("") || '<p class="tiny">Sin respuestas en esta parte.</p>'}
        </div>`).join("")}
    </div>
    <div class="card">
      <h3>📨 Enviar</h3>
      <p class="hint">Al enviar, todo esto le llega a ${esc(CONFIG.autor)} (${esc(CONFIG.email)}) junto con el boceto de tu página.</p>
      <button class="btn primary lg wide" type="button" id="btnEnviar">Enviar mi información →</button>
      <div class="send-actions">
        <button class="btn ghost" type="button" id="btnBrief">⬇️ Descargar el brief visual</button>
        <button class="btn ghost" type="button" id="btnCopiar">📋 Copiar el resumen</button>
      </div>
      ${CONFIG.whatsapp ? `<button class="btn green wide" type="button" id="btnWsp" style="margin-top:12px">💬 Enviar por WhatsApp</button>` : ""}
      <p class="tiny">Si el envío falla (por internet), puedes descargar el brief o copiar el resumen y mandármelo tú.</p>
    </div>`;
  }

  /* ---------------- Render ---------------- */
  const BUILDERS = { taller: stepTaller, tipo: stepTipo, objetivos: stepObjetivos, secciones: stepSecciones, estilo: stepEstilo, material: stepMaterial, detalles: stepDetalles, resumen: stepResumen };

  function renderNav() {
    $("#stepsNav").innerHTML = STEPS.map((s, i) =>
      `<button type="button" class="snav ${i === step ? "active" : ""} ${i < step ? "done" : ""}" data-go="${i}"><b>${i < step ? "✓" : i + 1}</b>${esc(s.nav)}</button>`
    ).join("");
    $("#progressFill").style.width = ((step) / (STEPS.length - 1) * 100) + "%";
    const act = $(".snav.active");
    if (act) act.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function render() {
    const s = STEPS[step];
    $("#stepsHost").innerHTML = `
      <section class="step on">
        <div class="step-head">
          <span class="step-kicker">${esc(s.kick)}</span>
          <h2>${esc(s.title)}</h2>
          <p>${esc(s.sub)}</p>
        </div>
        ${BUILDERS[s.id]()}
      </section>`;
    if (s.id === "taller") renderDirs();
    if (s.id === "estilo") renderRefs();
    $("#btnPrev").classList.toggle("hidden", step === 0);
    $("#btnNext").classList.toggle("hidden", step === STEPS.length - 1);
    $("#footInfo").textContent = step === STEPS.length - 1 ? "Ya está, solo falta enviar" : "Paso " + (step + 1) + " de " + STEPS.length;
    renderNav();
    drawPreview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderDirs() {
    const host = $("#dirHost"); if (!host) return;
    host.innerHTML = S.direcciones.map((d, i) => `
      <div class="rep-item">
        <div class="grid-2">
          <input type="text" data-dir="${i}" data-f="dir" value="${esc(d.dir)}" placeholder="Calle y número">
          <input type="text" data-dir="${i}" data-f="ciudad" value="${esc(d.ciudad)}" placeholder="Comuna o ciudad">
        </div>
        ${S.direcciones.length > 1 ? `<button class="rep-del" type="button" data-deldir="${i}">✕</button>` : ""}
      </div>`).join("");
  }

  function renderRefs() {
    const host = $("#refHost"); if (!host) return;
    host.innerHTML = S.refs.map((r, i) => `
      <div class="rep-item">
        <div class="grid-2">
          <input type="text" data-ref="${i}" data-f="url" value="${esc(r.url)}" placeholder="www.ejemplo.cl">
          <input type="text" data-ref="${i}" data-f="gusta" value="${esc(r.gusta)}" placeholder="Qué te gusta de ella">
        </div>
        ${S.refs.length > 1 ? `<button class="rep-del" type="button" data-delref="${i}">✕</button>` : ""}
      </div>`).join("");
  }

  /* ---------------- Vista previa en vivo ---------------- */
  function theme() {
    const e = ESTILOS.find(x => x.id === S.estilo);
    const c = COLORES.find(x => x.id === S.coloresSi[0]);
    return {
      bg: e ? e.bg : "#211d2e",
      fg: e ? e.fg : "#f4f2fa",
      acc: c ? c.hex : (e ? e.acc : "#8b5cf6"),
      font: e ? e.font : "'Barlow Condensed',sans-serif",
      up: e ? !!e.up : true
    };
  }
  function ctaTxt() {
    if (S.objetivos.indexOf("agenda") >= 0) return "Agenda tu hora";
    if (S.objetivos.indexOf("repuestos") >= 0) return "Ver repuestos";
    if (S.objetivos.indexOf("empresas") >= 0) return "Convenio empresas";
    if (S.tipo === "precios" || S.objetivos.indexOf("precios") >= 0) return "Cotizar ahora";
    return "Escríbenos por WhatsApp";
  }
  function heroSub() {
    const e = S.especialidades.slice(0, 3);
    const v = S.vehiculos.slice(0, 3);
    if (!e.length && !v.length) return "Marca tus especialidades en el paso 1 y aparecen aquí";
    let t = e.join(" · ");
    if (v.length) t += (t ? " — " : "") + v.join(", ");
    return t;
  }
  function has(id) { return S.secciones.indexOf(id) >= 0; }

  function drawPreview() {
    const t = theme();
    const nom = nz(S.nombre) || "Tu Taller";
    const dom = nz(S.dominioCual) || (nz(S.nombre) ? nz(S.nombre).toLowerCase().replace(/[^a-z0-9]+/g, "") + ".cl" : "tutaller.cl");
    const nameStyle = `font-family:${t.font};${t.up ? "text-transform:uppercase;" : ""}`;
    const navLinks = S.tipo === "sitio"
      ? ["Inicio", "Servicios", "Nosotros", "Contacto"]
      : ["Servicios", has("precios") ? "Precios" : null, has("galeria") ? "Trabajos" : null, "Contacto"].filter(Boolean);

    let html = `
      <div class="mock-bar"><span class="mock-dots"><i></i><i></i><i></i></span><span class="mock-url">https://www.${esc(dom)}</span></div>
      <div class="mock-nav" style="background:${t.bg};color:${t.fg};border-bottom-color:rgba(128,128,128,.25)">
        <span class="mock-logo" style="${nameStyle}">${esc(nom)}</span>
        <span class="mock-links" style="color:${t.fg};opacity:.7">${navLinks.map(l => `<span>${esc(l)}</span>`).join("")}</span>
      </div>
      <div class="mock-hero" style="background:linear-gradient(150deg,${t.bg},${shade(t.bg, 18)});color:${t.fg}">
        <h3 style="${nameStyle}">${esc(nom)}</h3>
        <p>${esc(heroSub())}</p>
        <span class="mock-cta" style="background:${t.acc};color:${contrast(t.acc)}">${esc(ctaTxt())}</span>
        ${S.serviciosExtra.length ? `<div class="mock-strip">${S.serviciosExtra.slice(0, 4).map(s => `<span>${esc(s)}</span>`).join("")}</div>` : ""}
      </div>`;

    const secTitle = (txt) => `<h5><i style="background:${t.acc}"></i>${esc(txt)}</h5>`;

    if (has("sobre")) {
      html += `<div class="mock-sec">${secTitle("Sobre el taller")}<div style="font-size:9.5px;color:#66707e;line-height:1.5">${esc(nz(S.anios) ? nz(S.anios) + " de experiencia. " : "")}${esc(nz(S.diferencia).slice(0, 110) || "Aquí va tu historia y por qué confiar en ustedes.")}</div></div>`;
    }
    if (has("servicios")) {
      const servs = lines(S.secTxt.servicios).length ? lines(S.secTxt.servicios) : (S.especialidades.length ? S.especialidades : ["Mantención", "Frenos", "Scanner", "Suspensión"]);
      html += `<div class="mock-sec">${secTitle("Servicios")}<div class="mock-cards">${servs.slice(0, 4).map(s => `<div><b>${esc(s)}</b>Descripción corta</div>`).join("")}</div></div>`;
    }
    if (has("precios")) {
      const ps = lines(S.secTxt.precios).length ? lines(S.secTxt.precios) : ["Cambio de aceite desde $45.000", "Pastillas de freno desde $60.000", "Scanner $25.000"];
      html += `<div class="mock-sec">${secTitle("Precios de referencia")}${ps.slice(0, 4).map(p => `<div style="display:flex;justify-content:space-between;gap:8px;font-size:9.5px;padding:4px 0;border-bottom:1px dashed #e9edf2"><span>${esc(p)}</span><b style="color:${t.acc}">›</b></div>`).join("")}</div>`;
    }
    if (has("marcas")) {
      const ms = nz(S.secTxt.marcas) ? S.secTxt.marcas.split(",").map(x => x.trim()).filter(Boolean) : ["Toyota", "Chevrolet", "Hyundai", "Ford", "Nissan"];
      html += `<div class="mock-sec">${secTitle("Marcas que atendemos")}<div class="mock-brands">${ms.slice(0, 8).map(m => `<span>${esc(m)}</span>`).join("")}</div></div>`;
    }
    if (has("galeria")) {
      html += `<div class="mock-sec">${secTitle("Trabajos — antes y después")}<div class="mock-photos"><i>📷</i><i>📷</i><i>📷</i></div></div>`;
    }
    if (has("garantia")) {
      html += `<div class="mock-sec">${secTitle("Garantía y confianza")}<div class="mock-cards"><div><b>Garantía escrita</b>En mano de obra</div><div><b>Boleta o factura</b>Siempre</div></div></div>`;
    }
    if (has("empresas")) {
      html += `<div class="mock-sec">${secTitle("Empresas y flotas")}<div style="font-size:9.5px;color:#66707e">Convenios, facturación y mantención programada. <b style="color:${t.acc}">Solicitar convenio ›</b></div></div>`;
    }
    if (has("resenas")) {
      const rs = lines(S.secTxt.resenas).length ? lines(S.secTxt.resenas) : ['"Rápidos y honestos, me explicaron todo" — Carlos M.'];
      html += `<div class="mock-sec">${secTitle("Lo que dicen los clientes")}<div class="mock-stars">★★★★★</div>${rs.slice(0, 2).map(r => `<div style="font-size:9.5px;color:#66707e;margin-top:3px">${esc(r)}</div>`).join("")}</div>`;
    }
    if (has("cotizador")) {
      html += `<div class="mock-sec">${secTitle("Cotiza tu reparación")}<div class="mock-form"><i></i><i></i><i></i><span style="display:block;background:${t.acc};color:${contrast(t.acc)};text-align:center;border-radius:4px;padding:4px;font-size:9px;font-weight:700">Enviar cotización</span></div><div style="font-size:8.5px;color:#93a0b0;margin-top:5px">Patente · Marca · Modelo · Qué le pasa</div></div>`;
    }
    if (has("faq")) {
      html += `<div class="mock-sec">${secTitle("Preguntas frecuentes")}<div style="font-size:9.5px;color:#66707e">¿Puedo llevar mi propio repuesto? <b style="float:right;color:${t.acc}">+</b></div></div>`;
    }
    if (has("blog")) {
      html += `<div class="mock-sec">${secTitle("Consejos de mantención")}<div class="mock-cards"><div><b>Cada cuánto cambiar pastillas</b></div><div><b>Señales de que falla el embrague</b></div></div></div>`;
    }
    if (has("ubicacion")) {
      html += `<div class="mock-sec">${secTitle("Dónde estamos")}<div style="background:#e8edf3;border-radius:6px;height:46px;display:grid;place-items:center;font-size:14px">📍</div><div style="font-size:9px;color:#66707e;margin-top:4px">${esc(dirTxt() || "Tu dirección aparece aquí")}</div></div>`;
    }
    if (has("horarios")) {
      html += `<div class="mock-sec">${secTitle("Horarios")}<div style="font-size:9.5px;color:#66707e">${esc(nz(S.horario) || "Lun a Vie 8:30 - 18:30 · Sáb 9:00 - 14:00")}</div></div>`;
    }
    if (has("redes")) {
      html += `<div class="mock-sec">${secTitle("Síguenos")}<div class="mock-brands"><span>${esc(nz(S.ig) || "@tutaller")}</span><span>Facebook</span></div></div>`;
    }

    html += `<div class="mock-foot">${esc(nom)} — ${esc(nz(S.tel) || "+56 9 ...")}<br>${esc(dirTxt() || "Tu dirección")} · ${esc(nz(S.horario) || "Horarios")}</div>`;
    html += `<div class="mock-wa">💬</div>`;

    const mock = $("#mock");
    if (!nz(S.nombre) && !S.especialidades.length && step === 0) {
      mock.innerHTML = `<div class="mock-empty">Escribe el nombre de tu taller y este boceto se empieza a armar solo 👇</div>`;
      return;
    }
    mock.innerHTML = html;
  }

  function shade(hex, amt) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function contrast(hex) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
    const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    return l > 0.6 ? "#111111" : "#ffffff";
  }

  /* ---------------- Eventos ---------------- */
  document.addEventListener("input", (ev) => {
    const el = ev.target;
    if (el.dataset.k) { S[el.dataset.k] = el.value; save(); drawPreview(); }
    if (el.dataset.sectxt) { S.secTxt[el.dataset.sectxt] = el.value; save(); drawPreview(); }
    if (el.dataset.dir != null && el.dataset.f) { S.direcciones[+el.dataset.dir][el.dataset.f] = el.value; save(); drawPreview(); }
    if (el.dataset.ref != null && el.dataset.f) { S.refs[+el.dataset.ref][el.dataset.f] = el.value; save(); }
    if (el.dataset.k === "nombre") { const sg = $(".style-grid"); if (sg) render(); }
  });

  document.addEventListener("change", (ev) => {
    const el = ev.target;
    if (el.dataset.multi) {
      const arr = S[el.dataset.multi];
      const i = arr.indexOf(el.value);
      if (el.checked && i < 0) arr.push(el.value);
      if (!el.checked && i >= 0) arr.splice(i, 1);
      const chip = el.closest(".chip"); if (chip) chip.classList.toggle("on", el.checked);
      save(); drawPreview();
    }
  });

  document.addEventListener("click", (ev) => {
    const el = ev.target;

    const nav = el.closest("[data-go]");
    if (nav) { goTo(+nav.dataset.go); return; }

    const opt = el.closest("[data-opt]");
    if (opt) {
      S.tipo = opt.dataset.opt; save();
      $$("[data-opt]").forEach(o => o.classList.toggle("on", o.dataset.opt === S.tipo));
      drawPreview(); return;
    }

    const est = el.closest("[data-estilo]");
    if (est) {
      S.estilo = est.dataset.estilo; save();
      $$("[data-estilo]").forEach(o => o.classList.toggle("on", o.dataset.estilo === S.estilo));
      drawPreview(); return;
    }

    const col = el.closest("[data-col]");
    if (col) {
      const bag = col.dataset.col === "si" ? S.coloresSi : S.coloresNo;
      const id = col.dataset.id, i = bag.indexOf(id);
      if (i >= 0) bag.splice(i, 1); else bag.push(id);
      col.classList.toggle("on", i < 0);
      save(); drawPreview(); return;
    }

    const secT = el.closest("[data-sec-toggle]");
    if (secT) {
      const item = secT.closest("[data-sec]"), id = item.dataset.sec;
      const i = S.secciones.indexOf(id);
      if (i >= 0) S.secciones.splice(i, 1); else S.secciones.push(id);
      item.classList.toggle("on", i < 0);
      const ex = $(".sec-extra", item); if (ex) ex.classList.toggle("hidden", i >= 0);
      save(); drawPreview(); return;
    }

    const matRow = el.closest(".mat-row");
    if (matRow && el.closest(".tri")) {
      const lbl = el.closest("label"); if (!lbl) return;
      S.material[matRow.dataset.mat] = lbl.dataset.v;
      $$("label", $(".tri", matRow)).forEach(l => l.classList.toggle("on", l === lbl));
      save(); return;
    }

    const single = el.closest("[data-single]");
    if (single) {
      const k = single.dataset.single;
      S[k] = (S[k] === single.dataset.val) ? "" : single.dataset.val;
      single.parentElement.querySelectorAll("[data-single='" + k + "']").forEach(x => x.classList.toggle("on", x.dataset.val === S[k]));
      save(); return;
    }

    const preH = el.closest("[data-preset-horario]");
    if (preH) {
      S.horario = preH.dataset.presetHorario;
      const inp = $("[data-k='horario']"); if (inp) inp.value = S.horario;
      save(); drawPreview(); return;
    }

    if (el.id === "addDir") { S.direcciones.push({ dir: "", ciudad: "" }); save(); renderDirs(); return; }
    if (el.dataset.deldir != null) { S.direcciones.splice(+el.dataset.deldir, 1); save(); renderDirs(); drawPreview(); return; }
    if (el.id === "addRef") { S.refs.push({ url: "", gusta: "" }); save(); renderRefs(); return; }
    if (el.dataset.delref != null) { S.refs.splice(+el.dataset.delref, 1); save(); renderRefs(); return; }

    if (el.id === "btnStart") { $("#intro").classList.add("hidden"); $("#form").classList.remove("hidden"); render(); return; }
    if (el.id === "btnNext") { if (validate()) goTo(step + 1); return; }
    if (el.id === "btnPrev") { goTo(step - 1); return; }
    if (el.id === "btnReset") {
      if (confirm("¿Seguro que quieres borrar todo y empezar de nuevo?")) {
        S = blank(); save(); step = 0;
        $("#form").classList.add("hidden"); $("#intro").classList.remove("hidden");
        drawPreview(); renderNav();
      }
      return;
    }
    if (el.closest("#btnTheme")) { toggleTema(); return; }
    if (el.id === "btnGlosario") { openGlosario(); return; }
    if (el.id === "btnOpenPrev") { $("#colPreview").classList.add("open"); return; }
    if (el.id === "btnClosePrev") { $("#colPreview").classList.remove("open"); return; }
    if (el.id === "btnEnviar") { enviar(); return; }
    if (el.id === "btnBrief") { descargarBrief(); return; }
    if (el.id === "btnCopiar") { copiarResumen(el); return; }
    if (el.id === "btnWsp") { abrirWsp(); return; }

    if (el.hasAttribute("data-close") || el.classList.contains("modal")) {
      const m = el.closest(".modal"); if (m) m.hidden = true;
    }
  });

  function goTo(i) {
    if (i < 0 || i > STEPS.length - 1) return;
    if (i > step && !validate()) return;
    step = i;
    if ($("#form").classList.contains("hidden")) { $("#intro").classList.add("hidden"); $("#form").classList.remove("hidden"); }
    render();
  }

  function validate() {
    $$(".err").forEach(e => e.classList.remove("err"));
    $$(".err-msg").forEach(e => e.remove());
    const fail = (sel, msg) => {
      const el = $(sel); if (!el) return;
      el.classList.add("err");
      const p = document.createElement("p"); p.className = "err-msg"; p.textContent = msg;
      el.parentElement.appendChild(p);
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    const id = STEPS[step].id;
    if (id === "taller") {
      if (!nz(S.nombre)) { fail("[data-k='nombre']", "Necesito el nombre de tu taller para seguir."); return false; }
      if (!nz(S.tel) && !nz(S.email)) { fail("[data-k='tel']", "Déjame un teléfono o un correo para poder responderte."); return false; }
    }
    if (id === "tipo" && !S.tipo) {
      alert("Elige una opción. Si no sabes cuál, marca \"No estoy seguro\" y yo te recomiendo.");
      return false;
    }
    if (id === "objetivos" && !S.objetivos.length) {
      alert("Marca al menos un objetivo: es lo que define el diseño de la página.");
      return false;
    }
    return true;
  }

  /* ---------------- Tema claro / oscuro ---------------- */
  const TKEY = "frc-theme";
  function temaActual() { return document.documentElement.getAttribute("data-theme") || "dark"; }
  function pintarTema() {
    const t = temaActual();
    const b = $("#btnTheme");
    if (b) { b.textContent = t === "light" ? "☀️" : "🌙"; b.title = t === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"; }
    const m = document.querySelector("meta[name=theme-color]");
    if (m) m.setAttribute("content", t === "light" ? "#f6f5fa" : "#17161d");
  }
  function toggleTema() {
    const nuevo = temaActual() === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nuevo);
    try { localStorage.setItem(TKEY, nuevo); } catch (e) {}
    pintarTema();
  }

  /* ---------------- Glosario ---------------- */
  function openGlosario() {
    $("#glosarioBody").innerHTML = GLOSARIO.map(g =>
      `<div class="glo"><b>${esc(g.t)}</b><p>${esc(g.d)}</p><p class="eg">${esc(g.e)}</p></div>`).join("");
    $("#modalGlosario").hidden = false;
  }

  /* ---------------- Texto / brief ---------------- */
  function resumenTexto() {
    let out = "BRIEF DE PAGINA WEB — " + (nz(S.nombre) || "Taller sin nombre") + "\n";
    out += "Enviado el " + new Date().toLocaleString("es-CL") + "\n";
    out += "==========================================\n\n";
    summaryBlocks().forEach(b => {
      const rows = b.rows.filter(r => nz(r[1]));
      if (!rows.length) return;
      out += "### " + b.h.toUpperCase() + "\n";
      rows.forEach(r => { out += "- " + r[0] + ": " + String(r[1]).replace(/\n/g, " | ") + "\n"; });
      out += "\n";
    });
    return out;
  }

  function briefHTML() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n, f) => (cs.getPropertyValue(n) || "").trim() || f;
    const TH = {
      bg: v("--bg", "#17161d"), panel: v("--panel", "#232129"), line: v("--line-soft", "#2d2a37"),
      txt: v("--txt", "#f5f3fa"), txt2: v("--txt-2", "#b6b0c8"), txt3: v("--txt-3", "#867f9b"),
      acc: v("--acc", "#8b5cf6"), acc2: v("--acc-2", "#b79cff"), accSoft: v("--acc-soft", "rgba(139,92,246,.16)"),
      accRing: v("--acc-ring", "rgba(139,92,246,.3)")
    };
    const t = theme();
    const mock = $("#mock") ? $("#mock").outerHTML : "";
    const css = document.querySelector("link[rel=stylesheet][href*='styles.css']");
    const blocks = summaryBlocks();
    return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<title>Brief — ${esc(nz(S.nombre) || "Taller")}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;background:${TH.bg};color:${TH.txt};font-family:Inter,system-ui,sans-serif;line-height:1.55}
.wrap{max-width:1100px;margin:0 auto;padding:32px 20px 80px}
.hd{background:linear-gradient(150deg,${TH.accSoft},${TH.panel});border:1px solid ${TH.accRing};border-radius:20px;padding:28px;margin-bottom:22px}
.hd h1{margin:0 0 6px;font-size:32px;text-transform:uppercase;letter-spacing:-.01em}
.hd p{margin:0;color:${TH.txt2}}
.cols{display:grid;grid-template-columns:minmax(0,1fr) 400px;gap:22px;align-items:start}
@media(max-width:900px){.cols{grid-template-columns:1fr}}
.card{background:${TH.panel};border:1px solid ${TH.line};border-radius:16px;padding:22px;margin-bottom:16px}
h4{margin:0 0 10px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:${TH.acc2}}
.row{display:flex;gap:12px;padding:5px 0;flex-wrap:wrap;border-bottom:1px solid ${TH.line}}
.row:last-child{border:0}
.row b{color:${TH.txt3};font-weight:500;min-width:180px}
.row span{flex:1;min-width:220px}
.pal{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.pal i{width:42px;height:42px;border-radius:10px;display:block}
.mock{background:#fff;border-radius:12px;overflow:hidden;color:#18202b;font-size:11px;position:relative}
${mockCSS()}
</style></head><body><div class="wrap">
<div class="hd"><h1>${esc(nz(S.nombre) || "Taller")}</h1>
<p>Brief de página web · ${esc(new Date().toLocaleDateString("es-CL"))} · Contacto: ${esc([nz(S.nombreContacto), nz(S.tel), nz(S.email)].filter(Boolean).join(" · ") || "sin datos")}</p></div>
<div class="cols">
<div>
  <div class="card"><h4>Resumen rápido</h4>
    <div class="row"><b>Tipo de página</b><span>${esc(pageTypeName(S.tipo))}</span></div>
    <div class="row"><b>Estilo</b><span>${esc(estiloName(S.estilo))}</span></div>
    <div class="row"><b>Objetivo principal</b><span>${esc(S.objetivos.map(objetivoTxt)[0] || "sin definir")}</span></div>
    <div class="row"><b>Plazo</b><span>${esc(MAP_TXT.plazo[S.plazo] || "sin definir")}</span></div>
    <div class="row"><b>Presupuesto</b><span>${esc(MAP_TXT.presupuesto[S.presupuesto] || "sin definir")}</span></div>
    <div class="pal">${S.coloresSi.map(id => { const c = COLORES.find(x => x.id === id); return c ? `<i style="background:${c.hex}" title="${esc(c.name)}"></i>` : ""; }).join("")}</div>
  </div>
  ${blocks.map(b => {
    const rows = b.rows.filter(r => nz(r[1]));
    if (!rows.length) return "";
    return `<div class="card"><h4>${esc(b.h)}</h4>${rows.map(r => `<div class="row"><b>${esc(r[0])}</b><span>${esc(r[1]).replace(/\n/g, "<br>")}</span></div>`).join("")}</div>`;
  }).join("")}
</div>
<div><div class="card"><h4>Boceto de la página</h4>${mock}</div></div>
</div></div></body></html>`;
  }

  function mockCSS() {
    /* Copia las reglas .mock* del stylesheet para que el brief sea autocontenido */
    let out = "";
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try { rules = sheet.cssRules; } catch (e) { continue; }
      if (!rules) continue;
      for (const r of Array.from(rules)) {
        if (r.selectorText && /\.mock/.test(r.selectorText)) out += r.cssText + "\n";
      }
    }
    return out;
  }

  function descargarBrief() {
    const blob = new Blob([briefHTML()], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "brief-" + (nz(S.nombre) || "taller").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".html";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  function copiarResumen(btn) {
    const txt = resumenTexto();
    const done = () => { const o = btn.textContent; btn.textContent = "✓ Copiado"; setTimeout(() => btn.textContent = o, 2200); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done).catch(() => fallbackCopy(txt, done));
    else fallbackCopy(txt, done);
  }
  function fallbackCopy(txt, done) {
    const ta = document.createElement("textarea");
    ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { alert("Copia manual:\n\n" + txt); }
    ta.remove();
  }
  /* WhatsApp: versión corta, porque los links muy largos fallan en algunos celulares */
  function resumenWsp() {
    const L = [];
    L.push("Hola " + CONFIG.autor + ", te dejo la info de mi taller para la página web:");
    L.push("");
    L.push("*" + (nz(S.nombre) || "Mi taller") + "*" + (nz(S.anios) ? " · " + nz(S.anios) : ""));
    if (nz(S.nombreContacto)) L.push("Contacto: " + nz(S.nombreContacto) + (nz(S.tel) ? " · " + nz(S.tel) : ""));
    if (dirTxt()) L.push("Dirección: " + dirTxt());
    const esps = S.especialidades.concat(nz(S.otraEsp) ? [nz(S.otraEsp)] : []);
    if (esps.length) L.push("Especialidades: " + esps.join(", "));
    if (S.vehiculos.length) L.push("Vehículos: " + S.vehiculos.join(", "));
    L.push("");
    if (S.tipo) L.push("Tipo de página: " + pageTypeName(S.tipo));
    if (S.objetivos.length) L.push("Objetivo: " + S.objetivos.map(objetivoTxt).join(" · "));
    if (S.estilo) L.push("Estilo: " + estiloName(S.estilo));
    if (S.coloresSi.length) L.push("Colores: " + colorNames(S.coloresSi).join(", "));
    if (S.secciones.length) L.push("Secciones: " + S.secciones.map(seccionName).join(", "));
    if (S.plazo) L.push("Plazo: " + (MAP_TXT.plazo[S.plazo] || ""));
    if (S.presupuesto) L.push("Presupuesto: " + (MAP_TXT.presupuesto[S.presupuesto] || ""));
    if (nz(S.comentarios)) { L.push(""); L.push("Comentario: " + nz(S.comentarios)); }
    L.push("");
    L.push("(El detalle completo te lo mandé también por el formulario)");
    return L.join("\n");
  }
  function abrirWsp() {
    if (!CONFIG.whatsapp) return;
    window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(resumenWsp()), "_blank");
  }

  /* ---------------- Envío ---------------- */
  function campos() {
    const f = {};
    f["_subject"] = CONFIG.asunto + ": " + (nz(S.nombre) || "sin nombre");
    f["_template"] = "table";
    f["_captcha"] = "false";
    if (nz(S.email)) f["_replyto"] = nz(S.email);
    f["🏭 TALLER"] = nz(S.nombre);
    f["👤 Contacto"] = [nz(S.nombreContacto), nz(S.tel), nz(S.email)].filter(Boolean).join(" · ");
    f["📅 Años funcionando"] = nz(S.anios);
    f["📍 Direcciones"] = dirTxt();
    f["🕐 Horarios"] = nz(S.horario);
    f["📱 Redes"] = [nz(S.ig), nz(S.fb)].filter(Boolean).join(" · ");
    f["🌐 Página actual"] = nz(S.webActual);
    f["🛠️ Especialidades"] = S.especialidades.concat(nz(S.otraEsp) ? [nz(S.otraEsp)] : []).join(", ");
    f["🚗 Vehículos"] = S.vehiculos.join(", ");
    f["⭐ Servicios extra"] = S.serviciosExtra.join(", ");
    f["📐 TIPO DE PÁGINA"] = pageTypeName(S.tipo);
    f["📝 Nota del tipo"] = nz(S.tipoNota);
    f["🎯 OBJETIVOS"] = S.objetivos.map(objetivoTxt).join(" · ");
    f["👥 Cliente ideal"] = nz(S.clienteIdeal);
    f["💪 Qué lo diferencia"] = nz(S.diferencia);
    f["🔍 Competencia que le gusta"] = nz(S.competencia);
    f["🧱 SECCIONES"] = S.secciones.map(seccionName).join(" · ");
    Object.keys(S.secTxt).forEach(k => {
      if (nz(S.secTxt[k]) && S.secciones.indexOf(k) >= 0) f["   ↳ " + seccionName(k)] = S.secTxt[k];
    });
    f["🎨 ESTILO"] = estiloName(S.estilo);
    f["✅ Colores que le gustan"] = colorNames(S.coloresSi).join(", ");
    f["🚫 Colores que NO quiere"] = colorNames(S.coloresNo).join(", ");
    f["🔗 Referencias"] = refsTxt();
    f["🖌️ Notas de estilo"] = nz(S.estiloNota);
    f["📦 MATERIAL"] = MATERIAL.filter(m => S.material[m.id]).map(m => m.name + ": " + MATLBL[S.material[m.id]]).join(" · ");
    f["📦 Notas de material"] = nz(S.materialNota);
    f["🌍 Dominio"] = (MAP_TXT.dominio[S.dominio] || "") + (nz(S.dominioCual) ? " — " + nz(S.dominioCual) : "");
    f["📧 Correo corporativo"] = nz(S.correoCorp);
    f["⚙️ Funciones extra"] = S.extras.map(extraTxt).join(" · ");
    f["🔄 Quién actualiza"] = MAP_TXT.quienActualiza[S.quienActualiza] || "";
    f["⏱️ Plazo"] = MAP_TXT.plazo[S.plazo] || "";
    f["💰 Presupuesto"] = MAP_TXT.presupuesto[S.presupuesto] || "";
    f["💬 Comentarios"] = nz(S.comentarios);
    f["📄 RESUMEN COMPLETO"] = resumenTexto();
    Object.keys(f).forEach(k => { if (!nz(f[k])) delete f[k]; });
    return f;
  }

  function modalEnvio(title, bodyHTML) {
    $("#envioTitle").textContent = title;
    $("#envioBody").innerHTML = bodyHTML;
    $("#modalEnvio").hidden = false;
  }

  function enviar() {
    modalEnvio("Enviando…", `<div class="state"><div class="spinner"></div><h3>Mandando tu información</h3><p>Un segundo, estamos enviando todo a ${esc(CONFIG.autor)}.</p></div>`);

    const f = campos();
    const url = "https://formsubmit.co/ajax/" + encodeURIComponent(CONFIG.email);

    const armar = (conAdjunto) => {
      const fd = new FormData();
      Object.keys(f).forEach(k => fd.append(k, f[k]));
      if (conAdjunto) {
        fd.append("attachment", new Blob([briefHTML()], { type: "text/html" }),
          "brief-" + (nz(S.nombre) || "taller").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".html");
      }
      return fd;
    };

    /* FormSubmit responde 200 incluso cuando NO envía el correo:
       hay que mirar el campo "success" del JSON, no solo el código HTTP. */
    const intento = (fd) => fetch(url, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(r => r.json().catch(() => ({ success: r.ok ? "true" : "false", message: "Respuesta inesperada del servidor" })))
      .then(j => {
        if (j && String(j.success).toLowerCase() === "false") {
          const e = new Error("envio-rechazado"); e.info = j; throw e;
        }
        return j;
      });

    intento(armar(true))
      .then(ok)
      .catch(() => intento(armar(false)).then(ok).catch(fail));

    function ok() {
      try { localStorage.removeItem(KEY); } catch (e) {}
      modalEnvio("¡Listo!", `
        <div class="state">
          <div class="big">✅</div>
          <h3>Tu información ya va en camino</h3>
          <p>Gracias, ${esc(nz(S.nombreContacto) || "gracias")}. Te voy a escribir a <strong>${esc(nz(S.tel) || nz(S.email))}</strong> con una propuesta para ${esc(nz(S.nombre) || "tu taller")}.</p>
          <div class="note">Guárdate una copia: descarga el brief visual con el boceto de tu página para tenerlo a mano.</div>
          <button class="btn primary wide" type="button" id="btnBrief" style="margin-top:14px">⬇️ Descargar el brief visual</button>
        </div>`);
    }

    function fail(err) {
      const detalle = err && err.info && err.info.message ? String(err.info.message) : "";
      modalEnvio("No se pudo enviar", `
        <div class="state">
          <div class="big">📭</div>
          <h3>El envío automático no salió</h3>
          <p>No perdiste nada: todas tus respuestas siguen guardadas. Mándamelo por acá y lo recibo igual.</p>
          ${CONFIG.whatsapp ? '<button class="btn green wide" type="button" id="btnWsp" style="margin-top:14px">💬 Mandármelo por WhatsApp</button>' : ""}
          <a class="btn primary wide" style="margin-top:12px" href="mailto:${esc(CONFIG.email)}?subject=${encodeURIComponent(CONFIG.asunto + ": " + nz(S.nombre))}&body=${encodeURIComponent(resumenTexto())}">📧 Abrir mi correo con todo escrito</a>
          <div class="send-actions">
            <button class="btn ghost" type="button" id="btnCopiar">📋 Copiar el resumen</button>
            <button class="btn ghost" type="button" id="btnBrief">⬇️ Descargar el brief</button>
          </div>
          <div class="note">Mi correo es <strong>${esc(CONFIG.email)}</strong>${CONFIG.whatsapp ? " y mi WhatsApp el +" + esc(CONFIG.whatsapp) : ""}.${detalle ? '<br><span style="opacity:.7;font-size:12px">Detalle técnico: ' + esc(detalle) + "</span>" : ""}</div>
        </div>`);
    }
  }

  /* ---------------- Arranque ---------------- */
  const tieneDatos = nz(S.nombre) || S.especialidades.length || S.tipo;
  if (tieneDatos) {
    $("#intro").classList.remove("hidden");
    const b = $("#btnStart");
    b.textContent = "Seguir donde quedé →";
  }
  pintarTema();
  renderNav();
  drawPreview();
})();
