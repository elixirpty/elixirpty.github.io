'use strict';
/* ELIXIR · código compartido de todas las páginas (catálogo, pedido, menú y secciones).
   Los perfumes, precios y promos llegan de data/catalogo.js. */
const PAGE = document.body.dataset.page || '';
/* Enlaces antiguos de una sola página (#catalogo, #faq…) -> página propia */
if(PAGE === 'inicio' && location.hash){
  const MAP = { '#catalogo':'catalogo.html', '#promo':'promo.html', '#nosotros':'quienes-somos.html', '#entregas':'entregas.html', '#faq':'preguntas-frecuentes.html' };
  if(MAP[location.hash]) location.replace(MAP[location.hash]);
}
const EMBEBIDO = {
  whatsapp: '50762003794',
  itbms: 0,
  preciosProvisionales: true,
  perfumes: [
  { id:'PF-001', sku:'ELX-DIO-001',  marca:'Dior',           modelo:'Sauvage',               conc:'Eau de Parfum', genero:'Hombre', tipo:'Diseñador', precios:{5:10,   10:19.5} },
  { id:'PF-002', sku:'ELX-VAL-001',  marca:'Valentino',      modelo:'Born in Roma Intense',  conc:'Eau de Parfum', genero:'Hombre', tipo:'Diseñador', precios:{5:8,    10:16} },
  { id:'PF-003', sku:'ELX-VERS-001', marca:'Versace',        modelo:'Eros',                  conc:'Eau de Parfum', genero:'Hombre', tipo:'Diseñador', precios:{5:4.5,  10:9} },
  { id:'PF-004', sku:'ELX-ARM-001',  marca:'Giorgio Armani', modelo:'Acqua di Gio Profondo', conc:'Eau de Parfum', genero:'Hombre', tipo:'Diseñador', precios:{5:7.5,  10:15} },
  { id:'PF-005', sku:'ELX-RAS-001',  marca:'Rasasi',         modelo:'Hawas Ice Freeze',      conc:'Eau de Parfum', genero:'Hombre', tipo:'Árabe',     precios:{5:4,    10:7.5} },
  { id:'PF-006', sku:'ELX-LAT-001',  marca:'Lattafa',        modelo:'Khamrah Waha',          conc:'Eau de Parfum', genero:'Hombre', tipo:'Árabe',     precios:{5:3.5,  10:6.5} },
  { id:'PF-007', sku:'ELX-ARF-001',  marca:'Armaf',          modelo:'Odyssey MandarinSky',   conc:'Elixir',        genero:'Hombre', tipo:'Árabe',     precios:{5:3,    10:5.5} }
  ],
  promos: [ { min:3, muestras:1 }, { min:5, muestras:2 }, { min:7, muestras:3 } ],
  packs: [
    { id:'arabe', cat:'Árabe', nombre:'Promo Elixir Pack - Árabes', niveles:[ { min:3, muestras:1 }, { min:5, muestras:2 }, { min:7, muestras:3 } ] },
    { id:'diseno', cat:'Diseñador', nombre:'Promo Elixir Pack - Diseñadores', niveles:[ { min:3, muestras:1 }, { min:5, muestras:2 }, { min:7, muestras:3 } ] }
  ]
};
const EXTERNO = window.ELIXIR_CATALOGO && Array.isArray(window.ELIXIR_CATALOGO.perfumes) ? window.ELIXIR_CATALOGO : null;
const CATALOGO = EXTERNO || EMBEBIDO;
const CONFIG = {
  tienda: 'ELIXIR',
  whatsapp: String(CATALOGO.whatsapp || EMBEBIDO.whatsapp).replace(/\D/g, ''),
  itbms: Number(CATALOGO.itbms) || 0,
  preciosProvisionales: !!CATALOGO.preciosProvisionales,
  pagos: ['Yappy', 'Transferencia bancaria', 'Efectivo']
};
/* El envío no tiene tarifa publicada: varía según el delivery y la distancia, y se confirma por WhatsApp. */
/* El frasco completo no se publica: se consulta por WhatsApp. Solo se muestran decants de 5 y 10 ml. */
const PERFUMES = CATALOGO.perfumes.map(p => {
  const pr = {}; [5, 10].forEach(k => { if(p.precios && p.precios[k] != null) pr[k] = p.precios[k]; });
  return Object.assign({}, p, { precios: pr, agota: (p.agota || []).filter(k => +k !== 100) });
}).filter(p => Object.keys(p.precios).length);
const PROMOS = CATALOGO.promos || [];
/* Combo libre: cuentan todos los decants de 10 ml del pedido, de cualquier categoría. Si algún pack trae categoría, solo cuenta esa. El Decant Sorpresa siempre lo elige la tienda. */
const PACKS = Array.isArray(CATALOGO.packs) && CATALOGO.packs.length ? CATALOGO.packs
  : (PROMOS.length ? [{ id:'general', cat:null, nombre:'Promo Elixir Packs', niveles:PROMOS }] : []);
const CAT_ADJ = { 'Árabe':'árabe', 'Diseñador':'de diseñador', 'Nicho':'de nicho' };
const CAT_PL = { 'Árabe':'árabes', 'Diseñador':'de diseñador', 'Nicho':'de nicho' };
const CATS = [
  { id:'Árabe', slug:'arabes', nombre:'Árabes', full:'Perfumes Árabes' },
  { id:'Diseñador', slug:'disenadores', nombre:'Diseñadores', full:'Perfumes Diseñadores' },
  { id:'Nicho', slug:'nicho', nombre:'Nicho', full:'Perfumes Nicho' }
];
const GENS = [
  { id:'Hombre', slug:'hombres', nombre:'Hombres', para:'para hombres' },
  { id:'Mujer', slug:'mujeres', nombre:'Mujeres', para:'para mujeres' },
  { id:'Unisex', slug:'unisex', nombre:'Unisex', para:'unisex' }
];

/* Fotos originales de cada perfume (id -> archivo en img/perfumes). Las fotos nuevas llegan en data/catalogo.js. */
const FOTOS = {
  "PF-001": "img/perfumes/PF-001.jpg",
  "PF-002": "img/perfumes/PF-002.jpg",
  "PF-003": "img/perfumes/PF-003.jpg",
  "PF-004": "img/perfumes/PF-004.jpg",
  "PF-005": "img/perfumes/PF-005.jpg",
  "PF-006": "img/perfumes/PF-006.jpg",
  "PF-007": "img/perfumes/PF-007.jpg"
};
PERFUMES.forEach(p => { p.foto = p.foto || FOTOS[p.id] || ''; });

/* ============ LÓGICA (sin DOM) ============ */
const SIZES = [5, 10];
const NAMES = { 5:'Decant 5 ml', 10:'Decant 10 ml' };
const nameOf = (p, ml) => NAMES[ml];
const BY_ID = Object.fromEntries(PERFUMES.map(p => [p.id, p]));
const isOut = (p, ml) => !!p && Array.isArray(p.agota) && p.agota.indexOf(+ml) !== -1;      // ese tamaño está agotado
const allOut = p => !!p && SIZES.filter(s => p.precios[s] != null).every(s => isOut(p, s));  // todo el perfume está agotado
const r2 = n => Math.round(n * 100) / 100;
const money = n => '$' + r2(n).toFixed(2);

function cartItems(cart){
  return Object.entries(cart).map(([key, q]) => {
    const [id, ml] = key.split('|');
    const p = BY_ID[id];
    const price = p && p.precios[ml];
    if(price == null || !(q > 0) || isOut(p, ml)) return null;
    return { key, p, ml:+ml, q, price, total:r2(price * q) };
  }).filter(Boolean);
}
function totals(its){
  const sub = r2(its.reduce((s, i) => s + i.total, 0));
  const tax = r2(sub * CONFIG.itbms);
  return { sub, tax, total:r2(sub + tax) };
}
function hoy(){
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
/* Código del pedido: ELX-DEC-001, 002, 003… El número consecutivo se pide a un contador en línea justo al enviar el pedido
   (así no se gastan números si el cliente no envía). Si el contador no responde, se usa un código de respaldo (ELX-DEC-R…)
   para no perder el pedido. */
const CODE_API = 'https://abacus.jasoncameron.dev/hit/elixirpty-pedidos/dec';
function codigoRespaldo(){ return 'ELX-DEC-R' + Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, 'X'); }
async function asignarCodigo(){
  let timer;
  try {
    const ctl = new AbortController(); timer = setTimeout(() => ctl.abort(), 6000);
    const r = await fetch(CODE_API, { signal: ctl.signal, cache: 'no-store' });
    const n = parseInt((await r.json()).value, 10);
    if(r.ok && n > 0 && n < 100000) return 'ELX-DEC-' + String(n).padStart(3, '0');
  } catch(e) {}
  finally { clearTimeout(timer); }
  return codigoRespaldo();
}
function fmtFecha(v){
  if(!v) return '';
  const [y, m, d] = v.split('-').map(Number);
  let dia = '';
  try { dia = new Date(y, m - 1, d).toLocaleDateString('es', { weekday:'long' }); } catch(e) {}
  return String(d).padStart(2, '0') + '/' + String(m).padStart(2, '0') + '/' + y + (dia ? ' (' + dia + ')' : '');
}
function fmtHora(v){
  if(!v) return 'a coordinar';
  const [h, m] = v.split(':').map(Number);
  return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + (h >= 12 ? ' p. m.' : ' a. m.');
}
function gift(its){
  const list = PACKS.map(k => {
    const c = its.filter(i => i.ml === 10 && (!k.cat || i.p.tipo === k.cat)).reduce((t, i) => t + i.q, 0);
    const tiers = [...k.niveles].sort((a, b) => a.min - b.min);
    let n = 0; tiers.forEach(t => { if(c >= t.min) n = t.muestras; });
    const next = tiers.find(t => t.min > c) || null;
    return { pack:k, c, n, next, faltan: next ? next.min - c : 0 };
  });
  return { list, n: list.reduce((t, r) => t + r.n, 0) };
}
const pl = (n, a, b) => n + ' ' + (n === 1 ? a : b);
/* tipo: retiro (sin envío) · cotizar (a domicilio: el costo se confirma por WhatsApp) */
function envioDe(st){ return st.form.entrega !== 'Domicilio' ? { tipo:'retiro', monto:0 } : { tipo:'cotizar', monto:null }; }
function totalFinal(st){ return r2(totals(cartItems(st.cart)).total); }
function totalLabel(st){ return envioDe(st).tipo === 'retiro' ? 'Total' : 'Total (sin envío)'; }
function buildMessage(st){
  const its = cartItems(st.cart), t = totals(its), f = st.form, L = [];
  const nF = its.filter(i => Number(i.ml) >= 100).length, tipoP = !nF ? 'Decants' : (nF === its.length ? 'Perfumes' : 'Decants y Perfumes');
  L.push('¡Hola ELIXIR!, Quiero hacer este pedido de ' + tipoP + '.', '');
  L.push('Nombre: ' + (f.nombre.trim() || '-'));
  L.push('Apellido: ' + (f.apellido.trim() || '-'));
  L.push('Provincia: ' + (f.prov || PROVINCIAS[0]));
  if(f.correo.trim()) L.push('Correo: ' + f.correo.trim());
  if(f.fuente) L.push('Cómo nos conoció: ' + f.fuente);
  if(f.fuente === F_REC && f.referido.trim()) L.push('Referido por: ' + f.referido.trim());
  L.push('Entrega: ' + f.entrega);
  const ev = envioDe(st);
  L.push('Pago: ' + (f.pago || '-'), '');
  L.push('Productos:');
  its.forEach((i, n) => L.push((n + 1) + ') ' + i.p.marca + ' ' + i.p.modelo + ' - ' + nameOf(i.p, i.ml) + ' x' + i.q + ' - ' + money(i.total)));
  gift(its).list.filter(r => r.n).forEach(r => L.push(r.pack.nombre + ': ' + pl(r.n, 'Decant Sorpresa', 'Decants Sorpresa') + ' de 2 ml (' + (r.pack.cat ? 'perfume ' + CAT_ADJ[r.pack.cat] + ', ' : '') + 'la elige ' + CONFIG.tienda + ')'));
  L.push('');
  L.push('Subtotal: ' + money(t.sub));
  if(CONFIG.itbms > 0) L.push('ITBMS (' + Math.round(CONFIG.itbms * 100) + '%): ' + money(t.tax));
  if(ev.tipo !== 'retiro') L.push('Envío: por confirmar');
  L.push(totalLabel(st) + ': ' + money(totalFinal(st)));
  L.push('Pedido: ' + (st.code || '(se asigna al enviar)'));
  if(f.notas.trim()) L.push('', 'Notas: ' + f.notas.trim().replace(/\s*\n\s*/g, ' '));
  return L.join('\n');
}
function waLink(msg){ return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg); }
function validate(st){
  const f = st.form, e = [];
  if(!cartItems(st.cart).length) e.push(['', 'Agrega al menos un producto.', 'productos']);
  if(!f.nombre.trim()) e.push(['f-nombre', 'Escribe tu nombre.', 'nombre']);
  if(!f.apellido.trim()) e.push(['f-apellido', 'Escribe tu apellido.', 'apellido']);
  if(!f.correo.trim()) e.push(['f-correo', 'Escribe tu correo.', 'correo']);
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo.trim())) e.push(['f-correo', 'Revisa tu correo.', 'correo']);
  if(!f.pago) e.push(['f-pago', 'Elige tu método de pago.', 'método de pago']);
  return e;
}
function vial(ml, tone, txt){
  const G = {
    2:  { w:22, h:44, cw:12, ch:11, nh:5 },
    5:  { w:30, h:56, cw:16, ch:14, nh:6 },
    10: { w:38, h:72, cw:20, ch:16, nh:7 },
    100:{ w:68, h:92, cw:30, ch:20, nh:10 }
  }[ml];
  const cx = 60, base = 150, by = base - G.h, ny = by - G.nh, cy = ny - G.ch, r = ml === 100 ? 7 : 11;
  const lab = ml === 100 ? { w:G.w - 16, h:34 } : ml === 2 ? { w:G.w - 6, h:18 } : { w:G.w - 10, h:24 };
  const ly = by + G.h * .42;
  return '<svg viewBox="0 0 120 160" aria-hidden="true" focusable="false">'
    + '<ellipse cx="' + cx + '" cy="' + (base + 3) + '" rx="' + (G.w / 2 + 8) + '" ry="4" class="shadow"/>'
    + '<rect x="' + (cx - G.cw * .3) + '" y="' + ny + '" width="' + (G.cw * .6) + '" height="' + (G.nh + 2) + '" class="glass"/>'
    + '<rect x="' + (cx - G.cw / 2) + '" y="' + cy + '" width="' + G.cw + '" height="' + G.ch + '" rx="3" class="cap"/>'
    + '<rect x="' + (cx - G.w / 2) + '" y="' + by + '" width="' + G.w + '" height="' + G.h + '" rx="' + r + '" class="glass"/>'
    + '<rect x="' + (cx - G.w / 2 + 3) + '" y="' + (by + G.h * .24) + '" width="' + (G.w - 6) + '" height="' + (G.h * .76 - 3) + '" rx="' + (r - 3) + '" class="liq-' + tone + '"/>'
    + '<rect x="' + (cx - lab.w / 2) + '" y="' + ly + '" width="' + lab.w + '" height="' + lab.h + '" rx="2" class="paper"/>'
    + '<text x="' + cx + '" y="' + (ly + lab.h / 2 + (ml === 100 ? 3.5 : 3)) + '" text-anchor="middle" class="vt' + (ml === 100 || ml === 2 ? ' big' : '') + '">' + (ml === 2 ? '?' : (txt || ml) + ' ML') + '</text>'
    + '<rect x="' + (cx - G.w / 2 + 5) + '" y="' + (by + 8) + '" width="3" height="' + (G.h * .5) + '" rx="1.5" class="shine"/>'
    + '</svg>';
}

/* ============ INTERFAZ ============ */
/* ---- DOM ---- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const waUrl = t => 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(t);
const LS = {
  get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} }
};

const PROVINCIAS = ['Bocas del Toro', 'Coclé', 'Colón', 'Chiriquí', 'Darién', 'Herrera', 'Los Santos', 'Panamá', 'Panamá Oeste', 'Veraguas'];
const FUENTES = ['Instagram', 'Facebook', 'TikTok', 'Página web', 'WhatsApp', 'Recomendación de un amigo', 'Otro'];
const F_REC = 'Recomendación de un amigo';   // las 10 provincias de Panamá
const state = {
  cart: LS.get('elx_cart') || {},
  form: Object.assign({ nombre:'', apellido:'', correo:'', prov:'Panamá', fuente:'', referido:'', entrega:'Domicilio', pago:'', notas:'' }, LS.get('elx_form') || {}),
  code: LS.get('elx_code') || '',
  sel: {}, tipo: 'Todos', gen: 'Todos', q: '', promoSel: null
};
state.cart = Object.fromEntries(Object.entries(state.cart).filter(([k, q]) => cartItems({ [k]:q }).length));
LS.set('elx_code', state.code);

let opener = null;

/* ============ ESTRUCTURA COMÚN (menú, encabezado, pedido, pie) ============ */
const SHELL = {
  defs: `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="lgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3E39A"/><stop offset=".5" stop-color="#E0A33A"/><stop offset="1" stop-color="#A0620E"/></linearGradient>
    <linearGradient id="lgS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#D9DCE2"/><stop offset="1" stop-color="#8E939C"/></linearGradient>
    <symbol id="ic-dec" viewBox="0 0 20 44">
      <rect x="7" y="0" width="6" height="6" rx="1" fill="url(#lgS)"/>
      <rect x="6" y="6" width="8" height="4" rx="1" fill="#8E939C"/>
      <rect x="2" y="10" width="16" height="33" rx="3" fill="#14110D" stroke="url(#lgG)" stroke-width="1.3"/>
      <rect x="3.7" y="19" width="12.6" height="22.5" rx="2" fill="url(#lgG)"/>
      <rect x="5.2" y="21.5" width="2" height="16" rx="1" fill="#fff" opacity=".4"/>
    </symbol>
    <symbol id="ic-smp" viewBox="0 0 20 44">
      <rect x="7" y="0" width="6" height="6" rx="1" fill="url(#lgG)"/>
      <rect x="6" y="6" width="8" height="4" rx="1" fill="#B9791A"/>
      <rect x="2" y="10" width="16" height="33" rx="3" fill="#14110D" stroke="url(#lgS)" stroke-width="1.3"/>
      <rect x="3.7" y="16" width="12.6" height="25.5" rx="2" fill="url(#lgS)"/>
      <text x="10" y="35" text-anchor="middle" font-size="16" font-weight="700" fill="#7A4D0B" font-family="Georgia,serif">?</text>
    </symbol>
  </defs>
</svg>

`,
  top: `<header class="top">
    <div class="wrap">
      <div class="top-l">
        <a class="menubtn backbtn" id="back" href="index.html" aria-label="Volver a la página anterior" title="Volver" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg></a>
        <button class="menubtn" id="open-menu" type="button" aria-haspopup="dialog" aria-controls="menu" aria-label="Abrir menú"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      <a class="brand" href="index.html" aria-label="ELIXIR Decants y Parfums, inicio"><img src="img/logo-redondo.jpg" alt="ELIXIR Decants &amp; Parfums" width="52" height="52"></a>
      </div>
      <button class="cartbtn" id="open-cart" type="button">Mi pedido <svg class="cart-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 3h2.6l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h9.2a1.6 1.6 0 0 0 1.6-1.2L21 7H5.4"/><path d="M10.2 7.4l.3 4.6M13.8 7.4v4.6M17.4 7.4l-.3 4.6"/><circle cx="9.6" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></svg> <span class="n" id="hcount">0</span></button>
    </div>
  </header>`,
  bottom: `<footer class="foot">
    <div class="wrap">
      <img src="img/logo.png" alt="ELIXIR Parfums &amp; Decants" width="173" height="78">
      <nav class="social" id="social" aria-label="Redes de ELIXIR" hidden></nav>
      <nav class="fnav" aria-label="Información"><a href="quienes-somos.html">Quiénes somos</a><a href="entregas.html">Entregas y pagos</a><a href="preguntas-frecuentes.html">Preguntas</a><a href="terminos.html">Términos y condiciones</a><a href="privacidad.html">Privacidad</a></nav>
      <p class="fine">Realiza tu pedido por WhatsApp. Te confirmamos el total y la entrega. El pago es contra entrega.</p>
    </div>
  </footer>
<button class="fab" id="fab" type="button" aria-label="Escribirnos por WhatsApp" aria-haspopup="true" aria-expanded="false" aria-controls="qk-list"><svg class="ic-wa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.5A8.4 8.4 0 1 1 21 11.5z"/><path d="M8.5 10.2h7M8.5 13.2h4.5"/></svg><svg class="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="fab-t">Escríbenos</span></button>
<div class="qk" id="qk"><div class="qk-list" id="qk-list" role="group" aria-label="Opciones para escribirnos por WhatsApp" hidden></div></div>

  
<div class="bar" id="bar">
    <button type="button" id="open-bar"><span id="bar-n">0 artículos</span><span>Ver pedido <span class="t" id="bar-t">$0.00</span></span></button>
  </div>`,
  dialogs: `<dialog class="sidemenu" id="menu" aria-label="Menú de ELIXIR">
  <div class="sm-h">
    <img src="img/logo-redondo.jpg" alt="" width="40" height="40">
    <span class="sm-t">Menú</span>
    <button class="x" type="button" data-close aria-label="Cerrar menú">×</button>
  </div>
  <div class="sm-b">
    <form class="sm-search" id="sm-form" role="search" action="catalogo.html" method="get">
      <label class="sr" for="sm-q">Buscar fragancia</label>
      <input id="sm-q" name="q" type="search" placeholder="Buscar marca o perfume" autocomplete="off">
    </form>
    <nav class="sm-nav" aria-label="Secciones del sitio">
      <a href="index.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>Inicio</a>
      <a href="promo.html" id="sm-promo" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 9h16v4H4z"/><path d="M5 13h14v8H5zM12 9v12"/><path d="M12 9c-1.5-3-5-3-5-.8 0 1.5 2 .8 5 .8zm0 0c1.5-3 5-3 5-.8 0 1.5-2 .8-5 .8z"/></svg>Promo Elixir Packs</a>
      <a href="catalogo.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>Catálogo</a>
      <div class="sm-sub" id="sm-cats"></div>
      <a href="index.html#resenas" id="sm-rev" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.2l6.1-.8z"/></svg>Reseñas</a>
      <a href="quienes-somos.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>Quiénes somos</a>
      <a href="entregas.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/></svg>Entregas y pagos</a>
      <a href="preguntas-frecuentes.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/></svg>Preguntas frecuentes</a>
      <div class="sm-sep" role="presentation"></div>
      <a href="terminos.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>Términos y condiciones</a>
      <a href="privacidad.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l7 3v5.5c0 4.4-2.9 7.9-7 9.5-4.1-1.6-7-5.1-7-9.5V6z"/></svg>Aviso de privacidad</a>
    </nav>
  </div>
  <div class="sm-f">
    <a class="btn wa" id="sm-wa" href="#" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
    <div class="social" id="sm-social" hidden></div>
  </div>
</dialog>


<div class="scrim" id="scrim"></div>

<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="d-title" inert>
  <div class="dhead">
    <div><h2 id="d-title">Tu pedido</h2><p class="code" id="d-code"></p></div>
    <button class="x" id="close-cart" type="button" aria-label="Cerrar pedido">×</button>
  </div>

  <div class="dbody" id="dbody">
    <div class="sent" id="sent" hidden>
      <p>Abrimos WhatsApp con tu pedido <b id="sent-code"></b>. Toca Enviar en el chat para completarlo. Tu canasta ya quedó vacía para hacer un pedido nuevo.</p>
      <button class="btn ghost" id="recover" type="button">No se envió: recuperar mi pedido</button>
    </div>

    <p class="empty" id="empty">Tu pedido está vacío. Agrega una fragancia del catálogo.</p>

    <div id="filled" hidden>
      <ul class="lines" id="lines"></ul>
      <p class="nudge" id="nudge" hidden></p>
      <dl class="sum" id="sum"></dl>

      <h3>Tus datos</h3>
      <form id="form" novalidate>
        <div class="row2">
          <div class="field">
            <label for="f-nombre">Nombre</label>
            <input id="f-nombre" type="text" autocomplete="given-name" placeholder="Tu nombre">
          </div>
          <div class="field">
            <label for="f-apellido">Apellido</label>
            <input id="f-apellido" type="text" autocomplete="family-name" placeholder="Tu apellido">
          </div>
        </div>
        <div class="field">
          <label for="f-prov">Provincia</label>
          <select id="f-prov"></select>
        </div>
        <div class="field">
          <label for="f-correo">Correo</label>
          <input id="f-correo" type="email" inputmode="email" autocomplete="email" placeholder="tucorreo@ejemplo.com" required aria-required="true">
        </div>
        <div class="field">
          <label for="f-fuente">¿Cómo conociste ELIXIR? (opcional)</label>
          <select id="f-fuente"></select>
        </div>
        <div class="field" id="ref-box" hidden>
          <label for="f-referido">¿Quién te recomendó? (opcional)</label>
          <input id="f-referido" type="text" autocomplete="off" placeholder="Para agradecer su recomendación">
        </div>
        <p class="note">Usamos tus datos solo para atender tu pedido. <a href="privacidad.html" target="_blank" rel="noopener">Aviso de privacidad</a></p>

        <fieldset class="field">
          <legend>Entrega</legend>
          <div class="seg2">
            <label><input type="radio" name="entrega" id="e-dom" value="Domicilio"><span class="opt">A domicilio</span></label>
            <label><input type="radio" name="entrega" id="e-ret" value="Retiro"><span class="opt">Retiro</span></label>
          </div>
        </fieldset>

        <p class="hint" id="dom-note">El costo del envío varía según el delivery y la distancia. Te lo confirmamos por WhatsApp, junto con la dirección, la fecha y la hora.</p>
        <p class="hint" id="ret-note" hidden>Te confirmamos el punto de retiro por WhatsApp.</p>


        <div class="field">
          <label for="f-pago">Método de pago</label>
          <select id="f-pago"></select>
          <p class="hint" style="margin-top:6px">El pago es contra entrega: pagas cuando recibes tu pedido.</p>
        </div>

        <div class="field">
          <label for="f-notas">Notas (opcional)</label>
          <textarea id="f-notas" rows="2" placeholder="Indicaciones adicionales para tu pedido"></textarea>
        </div>
      </form>

      <details id="det">
        <summary>Ver el mensaje que se enviará</summary>
        <textarea id="preview" rows="14" readonly aria-label="Mensaje del pedido"></textarea>
      </details>
      <p class="fine2">Al enviar su pedido por WhatsApp estaremos confirmando la disponibilidad y entrega de sus decants de ELIXIR.</p>
      <p class="fine2">Al enviar tu pedido aceptas los <a href="terminos.html" target="_blank" rel="noopener">Términos y condiciones</a>.</p>
    </div>
  </div>

  <div class="dfoot" id="dfoot" hidden>
    <div class="errs" id="errs" role="alert" hidden></div>
    <div class="tot"><span id="tot-label">Total (sin envío)</span><b id="tot">$0.00</b></div>
    <p class="hint" style="text-align:center;margin:-4px 0 2px">Pago contra entrega</p>
    <a class="btn wa" id="send" href="#" target="_blank" rel="noopener noreferrer">Enviar pedido por WhatsApp</a>
  </div>
</aside>

`
};
(function(){
  document.body.insertAdjacentHTML('afterbegin', SHELL.defs);
  const pg = document.getElementById('page');
  pg.insertAdjacentHTML('afterbegin', SHELL.top);
  pg.insertAdjacentHTML('beforeend', SHELL.bottom);
  document.body.insertAdjacentHTML('beforeend', SHELL.dialogs);
})();

/* ---- Catálogo ---- */
function selSize(p){
  const s = state.sel[p.id];
  if(s && p.precios[s] != null && !isOut(p, s)) return s;
  if(p.precios[10] != null && !isOut(p, 10)) return 10;
  return SIZES.find(x => p.precios[x] != null && !isOut(p, x)) || SIZES.find(x => p.precios[x] != null) || 10;
}
function mediaBase(p, ml){
  if(p.foto) return '<img src="' + esc(p.foto) + '" alt="' + esc(p.marca + ' ' + p.modelo) + '" loading="lazy"><span class="szb">Decant ' + ml + ' ml</span>';
  return vial(ml, p.tipo === 'Árabe' ? 'a' : 'd');
}
const RIBBON = '<svg class="rib" viewBox="0 0 100 100" role="img" aria-label="Agotado"><defs><linearGradient id="ribg" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0" stop-color="#ff5a68"/><stop offset=".4" stop-color="#f12b40"/><stop offset="1" stop-color="#b01f2f"/></linearGradient></defs><polygon points="55,0 100,0 0,100 0,55" fill="url(#ribg)"/><polygon points="55,0 100,0 99,1 54.5,1" fill="#fff" opacity=".18"/><text x="38.75" y="38.75" text-anchor="middle" dominant-baseline="central" transform="rotate(-45 38.75 38.75)">SOLD OUT</text></svg>';
function mediaHTML(p, ml){
  return mediaBase(p, ml) + (isOut(p, ml) ? RIBBON : '');
}
const ETQ = {
  'Nuevo': '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/></svg>Nuevo',
  'Más vendido': '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.2l6.1-.8z"/></svg>Más vendido'
};
function etqHTML(p){ return p.etq && ETQ[p.etq] ? '<span class="etq ' + (p.etq === 'Nuevo' ? 'nuevo' : 'top') + '">' + ETQ[p.etq] + '</span>' : ''; }
const BELL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';
function avisoHTML(p){
  const outs = SIZES.filter(s => p.precios[s] != null && isOut(p, s));
  if(!outs.length) return '';
  const tam = outs.map(s => s + ' ml').join(' y ');
  const todo = allOut(p);
  const msg = 'Hola, quisiera que me avisen cuando esté disponible nuevamente el ' + p.marca + ' ' + p.modelo + (todo ? '' : ' (' + tam + ')') + '.';
  return '<a class="avisa" href="https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener noreferrer">' + BELL + 'Avísame cuando esté disponible' + (todo ? '' : ' el de ' + esc(tam)) + '</a>';
}
/* Frasco completo: no se publica precio; se consulta por WhatsApp. */
function frascoHTML(p){
  const msg = 'Hola, quisiera consultar el precio y la disponibilidad del frasco completo del ' + p.marca + ' ' + p.modelo + '.';
  return '<a class="frasco" href="' + waUrl(msg) + '" target="_blank" rel="noopener noreferrer">¿Frasco completo? <span>Consúltalo por WhatsApp</span></a>';
}
function cardHTML(p){
  const ml = selSize(p), tone = p.tipo === 'Árabe' ? 'a' : 'd';
  const out = allOut(p);
  const opts = SIZES.filter(s => p.precios[s] != null).map(s =>
    '<label><input type="radio" name="sz-' + p.id + '" value="' + s + '"' + (s === ml ? ' checked' : '') + (isOut(p, s) ? ' disabled' : '') + '>'
    + '<span class="opt"><span class="ml">' + s + ' ml</span><span class="pr">' + money(p.precios[s]) + '</span></span></label>'
  ).join('');
  return '<article class="card' + (out ? ' out' : '') + '" data-id="' + p.id + '">'
    + '<div class="vial" data-vial>' + mediaHTML(p, ml) + '</div>'
    + etqHTML(p)
    + '<div class="info">'
    +   '<p class="marca">' + esc(p.marca) + '</p>'
    +   '<h3 class="modelo">' + esc(p.modelo) + '</h3>'
    +   '<p class="meta"><span class="tag ' + (tone === 'a' ? 'arabe' : 'dis') + '">' + esc(p.tipo) + '</span><span>' + esc(p.conc) + ' · ' + esc(p.genero) + '</span></p>'
    +   '<p class="incart" data-incart></p>'
    + '</div>'
    + '<fieldset class="sizes" style="--n:' + Math.max(1, SIZES.filter(s => p.precios[s] != null).length) + '"><legend class="sr">Tamaño de ' + esc(p.marca + ' ' + p.modelo) + '</legend>' + opts + '</fieldset>'
    + (out ? '<button class="add" type="button" disabled><span>Agotado</span></button>'
           : '<button class="add" type="button" data-add><span data-add-t>Agregar al pedido</span><span class="pr" data-add-p>' + money(p.precios[ml]) + '</span></button>')
    + avisoHTML(p)
    + frascoHTML(p)
    + '</article>';
}
const pasa = (p, tipo, gen) => (tipo === 'Todos' || p.tipo === tipo) && (gen === 'Todos' || p.genero === gen);
function selLabel(){
  const c = CATS.find(x => x.id === state.tipo), g = GENS.find(x => x.id === state.gen);
  if(!c && !g) return '';
  return (c ? c.full : 'Perfumes') + (g ? ' · ' + g.nombre : '');
}
function soonHTML(){
  const c = CATS.find(x => x.id === state.tipo), g = GENS.find(x => x.id === state.gen);
  const nombre = 'perfumes' + (c ? ' ' + CAT_PL[c.id] : '') + (g ? ' ' + g.para : '');
  const msg = 'Hola, quisiera que me avisen cuando estén disponibles los ' + nombre + '.';
  return '<div class="soon-box"><b>Próximamente</b><p>Estamos preparando esta selección. Escríbenos y te avisamos cuando esté disponible.</p>'
    + '<a class="avisa" href="https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener noreferrer">' + BELL + 'Avísame cuando esté disponible</a></div>';
}
function renderCatalog(){
  const q = norm(state.q.trim());
  const list = PERFUMES.filter(p => pasa(p, state.tipo, state.gen) && (!q || norm(p.marca + ' ' + p.modelo).includes(q)))
    .map((p, i) => ({ p, i })).sort((a, b) => (allOut(a.p) - allOut(b.p)) || (a.i - b.i)).map(x => x.p);   // agotados al final
  const filtrado = state.tipo !== 'Todos' || state.gen !== 'Todos';
  $('#grid').innerHTML = list.length ? list.map(cardHTML).join('')
    : (!q && filtrado ? soonHTML() : '<p class="empty-cat">No hay fragancias con ese filtro. Prueba con otra búsqueda.</p>');
  const n = list.length + (list.length === 1 ? ' fragancia' : ' fragancias');
  const lab = selLabel();
  $('#cat-count').innerHTML = (lab ? '<span class="sel">' + esc(lab) + '</span>' : '') + '<span class="n">' + (list.length || q || !filtrado ? n : 'Próximamente') + '</span>';
  updateBadges();
}
function renderPromoCtx(){
  const box = $('#promo-ctx'); if(!box) return;
  const ps = state.promoSel;
  if(!ps){ box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false;
  box.innerHTML = '<span class="t"><b>Promo ' + ps.min + '+' + ps.gift + ' · ' + esc(ps.label) + '</b>Elige ' + ps.min + ' decants de 10 ml' + (ps.libre ? ' de cualquier categoría' : '') + ' y recibe ' + pl(ps.gift, 'Decant Sorpresa', 'Decants Sorpresa') + ' gratis.</span><button type="button" data-promo-off>Ver todo</button>';
}
function renderChips(){
  const hay = (tipo, gen) => PERFUMES.some(p => pasa(p, tipo, gen));
  const chip = (attr, id, txt, activo, vacio, tenue) => '<button class="chip' + (vacio || tenue ? ' soon' : '') + '" type="button" data-' + attr + '="' + esc(id) + '" aria-pressed="' + activo + '">' + esc(txt) + (vacio ? '<small>Próximamente</small>' : '') + '</button>';
  $('#chips').innerHTML = chip('tipo', 'Todos', 'Todos', state.tipo === 'Todos', false)
    + CATS.map(c => chip('tipo', c.id, c.nombre, state.tipo === c.id, !hay(c.id, 'Todos'))).join('');
  $('#chips-gen').innerHTML = chip('gen', 'Todos', 'Todos', state.gen === 'Todos', false)
    + GENS.map(g => chip('gen', g.id, g.nombre, state.gen === g.id, false, !hay(state.tipo, g.id))).join('');
}
function updateCard(card){
  const p = BY_ID[card.dataset.id];
  const ml = +card.querySelector('input[type=radio]:checked').value;
  state.sel[p.id] = ml;
  card.querySelector('[data-vial]').innerHTML = mediaHTML(p, ml);
  const ap = card.querySelector('[data-add-p]'); if(ap) ap.textContent = money(p.precios[ml]);
}
function updateBadges(){
  const per = {};
  cartItems(state.cart).forEach(i => { per[i.p.id] = (per[i.p.id] || 0) + i.q; });
  document.querySelectorAll('.card').forEach(c => {
    const n = per[c.dataset.id] || 0;
    c.querySelector('[data-incart]').textContent = n ? n + (n === 1 ? ' unidad en tu pedido' : ' unidades en tu pedido') : '';
  });
}
function add(id, ml, btn){
  if(isOut(BY_ID[id], ml)) return;
  const key = id + '|' + ml;
  soltarEnviado();
  state.cart[key] = (state.cart[key] || 0) + 1;
  saveCart(); renderCart();
  if(btn){
    const t = btn.querySelector('[data-add-t]');
    btn.classList.add('ok'); t.textContent = 'Agregado';
    setTimeout(() => { btn.classList.remove('ok'); t.textContent = 'Agregar al pedido'; }, 900);
  }
}

/* ---- Pedido ---- */
function saveCart(){ LS.set('elx_cart', state.cart); }
function saveForm(){ LS.set('elx_form', state.form); }

function renderCart(){
  const its = cartItems(state.cart), t = totals(its), n = its.reduce((s, i) => s + i.q, 0), empty = !its.length;
  $('#hcount').textContent = n;
  $('#bar').classList.toggle('on', n > 0);
  document.body.classList.toggle('has-bar', n > 0);
  $('#bar-n').textContent = n + (n === 1 ? ' artículo' : ' artículos');
  $('#bar-t').textContent = money(t.total);
  $('#d-code').textContent = state.code ? 'Pedido ' + state.code : '';
  $('#empty').hidden = !empty;
  $('#filled').hidden = empty;
  $('#dfoot').hidden = empty;
  const g = gift(its);
  const giftLine = g.list.filter(r => r.n).map(r => '<li class="line gift"><p class="ln-name">Decant Sorpresa de 2 ml × ' + r.n + (r.pack.cat ? ' · ' + esc(r.pack.cat) : '') + '</p><p class="ln-total">Gratis</p><p class="ln-size">' + esc(r.pack.nombre) + '. La fragancia la elige ' + CONFIG.tienda + '.</p></li>').join('');
  const nd = $('#nudge');
  const nudges = g.list.filter(r => r.next && its.some(i => !r.pack.cat || i.p.tipo === r.pack.cat));
  if(nudges.length){
    nd.hidden = false;
    nd.innerHTML = nudges.map(r => esc('Agrega ' + pl(r.faltan, 'decant', 'decants') + ' de 10 ml' + (r.pack.cat ? ' ' + CAT_PL[r.pack.cat] : '') + ' más para recibir ' + pl(r.next.muestras, 'Decant Sorpresa', 'Decants Sorpresa') + ' de 2 ml gratis con ' + r.pack.nombre + '.')).join('<br>');
  } else nd.hidden = true;
  $('#lines').innerHTML = its.map(i => {
    const nm = esc(i.p.marca + ' ' + i.p.modelo);
    return '<li class="line">'
      + '<p class="ln-name">' + nm + '</p>'
      + '<p class="ln-total">' + money(i.total) + '</p>'
      + '<p class="ln-size">' + nameOf(i.p, i.ml) + ' · ' + money(i.price) + ' c/u</p>'
      + '<div class="step">'
      +   '<button type="button" data-dec="' + i.key + '" aria-label="Quitar una unidad de ' + nm + ', ' + nameOf(i.p, i.ml) + '">−</button>'
      +   '<span aria-live="polite">' + i.q + '</span>'
      +   '<button type="button" data-inc="' + i.key + '" aria-label="Agregar una unidad de ' + nm + ', ' + nameOf(i.p, i.ml) + '">+</button>'
      + '</div></li>';
  }).join('') + giftLine;
  $('#sum').innerHTML = '<div><dt>Subtotal</dt><dd>' + money(t.sub) + '</dd></div>'
    + g.list.filter(r => r.n).map(r => '<div><dt>' + esc(r.pack.nombre) + '</dt><dd>' + pl(r.n, 'Decant Sorpresa', 'Decants Sorpresa') + '</dd></div>').join('')
    + (CONFIG.itbms > 0 ? '<div><dt>ITBMS (' + Math.round(CONFIG.itbms * 100) + '%)</dt><dd>' + money(t.tax) + '</dd></div>' : '')
    + (function(){ const ev = envioDe(state); return '<div><dt>Envío</dt><dd>' + (ev.tipo === 'retiro' ? 'No aplica' : 'Por confirmar') + '</dd></div>'; })();
  $('#tot').textContent = money(totalFinal(state));
  $('#tot-label').textContent = totalLabel(state);
  updateSend();
  updateBadges();
}
function updateSend(){
  const msg = buildMessage(state);
  $('#send').href = waLink(msg);
  $('#preview').value = msg;
  const dom = state.form.entrega === 'Domicilio';
  $('#dom-note').hidden = !dom;
  $('#ret-note').hidden = dom;
  $('#tot-label').textContent = totalLabel(state);
}
function syncForm(){
  const f = state.form;
  $('#f-nombre').value = f.nombre; $('#f-apellido').value = f.apellido; $('#f-correo').value = f.correo; if(!PROVINCIAS.includes(f.prov)) f.prov = 'Panamá'; $('#f-prov').value = f.prov; $('#f-fuente').value = f.fuente || ''; $('#f-referido').value = f.referido; $('#ref-box').hidden = f.fuente !== F_REC;
  $('#f-pago').value = f.pago; $('#f-notas').value = f.notas;
  $('#e-dom').checked = f.entrega === 'Domicilio'; $('#e-ret').checked = f.entrega === 'Retiro';
}
function showErrors(errs){
  document.querySelectorAll('.bad').forEach(el => el.classList.remove('bad'));
  errs.forEach(([id]) => { const el = id && document.getElementById(id); if(el) el.classList.add('bad'); });
  const box = $('#errs');
  box.innerHTML = '<p>Para enviar tu pedido, completa: ' + esc(errs.map(e => e[2]).join(', ')) + '.</p>';
  box.hidden = false;
  const first = errs.find(e => e[0]);
  if(first){ const el = document.getElementById(first[0]); if(el){ el.focus({ preventScroll:true }); el.scrollIntoView({ block:'center', behavior:'smooth' }); } }
}
function clearErrors(){
  $('#errs').hidden = true;
  document.querySelectorAll('.bad').forEach(el => el.classList.remove('bad'));
}
function toast(msg){
  const old = $('.toast'); if(old) old.remove();
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 4200);
}

/* ---- Panel ---- */
function openCart(from){
  opener = from || null;
  $('#page').inert = true;
  const d = $('#drawer'); d.inert = false; d.classList.add('on');
  $('#scrim').classList.add('on');
  document.documentElement.style.overflow = 'hidden';
  $('#close-cart').focus();
}
function closeCart(){
  const d = $('#drawer'); d.classList.remove('on'); d.inert = true;
  $('#scrim').classList.remove('on');
  $('#page').inert = false;
  document.documentElement.style.overflow = '';
  if(opener && opener.focus) opener.focus();
}

$('#open-cart').addEventListener('click', e => openCart(e.currentTarget));
$('#open-bar').addEventListener('click', e => openCart(e.currentTarget));
$('#close-cart').addEventListener('click', closeCart);
$('#scrim').addEventListener('click', closeCart);
document.addEventListener('keydown', e => { if(e.key === 'Escape' && $('#drawer').classList.contains('on')) closeCart(); });

$('#lines').addEventListener('click', e => {
  const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
  if(inc){ soltarEnviado(); state.cart[inc.dataset.inc] = (state.cart[inc.dataset.inc] || 0) + 1; }
  else if(dec){
    const k = dec.dataset.dec; state.cart[k] = (state.cart[k] || 0) - 1;
    if(state.cart[k] <= 0) delete state.cart[k];
  } else return;
  saveCart(); renderCart();
});

const FIELDS = { 'f-nombre':'nombre', 'f-apellido':'apellido', 'f-correo':'correo', 'f-prov':'prov', 'f-fuente':'fuente', 'f-referido':'referido', 'f-pago':'pago', 'f-notas':'notas' };
$('#form').addEventListener('input', e => {
  const k = FIELDS[e.target.id];
  if(k){ state.form[k] = e.target.value; e.target.classList.remove('bad'); }
  else if(e.target.name === 'entrega'){ state.form.entrega = e.target.value; }
  if(e.target.id === 'f-fuente') $('#ref-box').hidden = e.target.value !== F_REC;
  saveForm(); updateSend();
  if(e.target.name === 'entrega' || e.target.id === 'f-prov') renderCart();
});
$('#form').addEventListener('change', e => { if(e.target.id === 'f-pago'){ state.form.pago = e.target.value; saveForm(); updateSend(); } });
$('#form').addEventListener('submit', e => e.preventDefault());

function terminarEnvio(){
  marcarEnviado();
  $('#sent-code').textContent = state.code;
  $('#sent').hidden = false;
  $('#dbody').scrollTo({ top:0 });
  /* WhatsApp ya empezó a abrirse: un momento después la canasta queda vacía para el siguiente pedido */
  setTimeout(() => { const m = LS.get('elx_sent'); if(m && m.code === state.code) reiniciarPedido(); }, 1200);
}
let enviando = false;
$('#send').addEventListener('click', async e => {
  const errs = validate(state);
  if(errs.length){ e.preventDefault(); showErrors(errs); return; }
  clearErrors();
  if(state.code){ terminarEnvio(); return; }      /* código ya asignado: el enlace abre WhatsApp tal cual */
  e.preventDefault();
  if(enviando) return;
  enviando = true;
  const btn = $('#send'), txt = btn.textContent;
  btn.textContent = 'Preparando tu pedido…'; btn.setAttribute('aria-busy', 'true');
  state.code = await asignarCodigo();
  LS.set('elx_code', state.code);
  updateSend();
  btn.textContent = txt; btn.removeAttribute('aria-busy');
  enviando = false;
  const url = btn.href;
  terminarEnvio();
  const w = window.open(url, '_blank');
  if(w){ try { w.opener = null; } catch(e) {} } else { window.location.href = url; }   /* si el navegador bloquea la ventana, se abre en esta misma */
});

/* Al enviar el pedido se guarda una copia (marca «elx_sent»). La canasta se vacía enseguida para que el cliente no vea el pedido que ya
   mandó por WhatsApp; si no alcanzó a enviarlo, puede recuperarlo desde el aviso. */
function marcarEnviado(){
  LS.set('elx_sent', { code: state.code, notas: state.form.notas, cart: state.cart, at: Date.now() });
}
function olvidarEnviado(){ try { localStorage.removeItem('elx_sent'); } catch(e) {} }
function reiniciarPedido(){
  state.cart = {}; state.code = '';
  state.form.notas = '';
  LS.set('elx_code', state.code); saveCart(); saveForm();
  syncForm(); renderCart();
}
function recuperarPedido(){
  const m = LS.get('elx_sent'); if(!m) return;
  olvidarEnviado();
  state.cart = m.cart || {}; state.code = m.code || ''; state.form.notas = m.notas || '';
  LS.set('elx_code', state.code); saveCart(); saveForm();
  $('#sent').hidden = true; syncForm(); renderCart();
  const t = $('.toast'); if(t) t.remove();
}
/* Cuando el cliente empieza a armar otro pedido, ya no hace falta poder recuperar el anterior */
function soltarEnviado(){ if(!$('#sent').hidden || LS.get('elx_sent')){ $('#sent').hidden = true; olvidarEnviado(); } }
$('#recover').addEventListener('click', recuperarPedido);
function toastUndo(msg, label, fn){
  const old = $('.toast'); if(old) old.remove();
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
  const sp = document.createElement('span'); sp.textContent = msg + ' ';
  const b = document.createElement('button'); b.type = 'button'; b.className = 'toast-btn'; b.textContent = label;
  b.addEventListener('click', () => { fn(); t.remove(); });
  t.append(sp, b); document.body.appendChild(t); setTimeout(() => t.remove(), 12000);
}


/* ---- Inicio ---- */
$('#f-pago').innerHTML = '<option value="">Elige un método</option>' + CONFIG.pagos.map(p => '<option>' + esc(p) + '</option>').join('');
$('#f-prov').innerHTML = PROVINCIAS.map(p => '<option>' + esc(p) + '</option>').join('');
$('#f-fuente').innerHTML = '<option value="">Elige una opción</option>' + FUENTES.map(p => '<option>' + esc(p) + '</option>').join('');

/* ---- FAQ, redes y reseñas ---- */
  (function(){
    const box = $('#faq-promo'); if(!box || !PACKS.length) return;
    const dsc = n => pl(n, 'Decant Sorpresa', 'Decants Sorpresa');
    const frase = niv => niv.map((t, i) => 'con ' + t.min + (i ? ', ' : ' decants de 10 ml recibes ') + dsc(t.muestras)).join('; ');
    const iguales = PACKS.every(k => JSON.stringify(k.niveles) === JSON.stringify(PACKS[0].niveles));
    let h = iguales
      ? '<p>Arma tu combo con los decants de 10 ml que prefieras, de cualquier categoría: ' + esc(frase(PACKS[0].niveles)) + '.</p>'
      : PACKS.map(k => '<p><b>' + esc(k.nombre) + ':</b> ' + esc(frase(k.niveles)) + '.</p>').join('');
    h += '<p>El Decant Sorpresa es de 2 ml y siempre lo elige ' + esc(CONFIG.tienda) + '.</p>';
    box.innerHTML = h;
  })();

(function(){
  const R = (EXTERNO && EXTERNO.redes) || {}, out = [];
  const clean = v => String(v || '').trim();
  const handle = v => clean(v).replace(/^@/, '').replace(/[^A-Za-z0-9._]/g, '');
  const url = (v, base) => { v = clean(v); if(!v) return ''; if(/^https:\/\//i.test(v)) return v; if(/^http:\/\//i.test(v)) return 'https://' + v.slice(7); if(base){ const h = handle(v); return h ? base + h : ''; } return /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(v) ? 'https://' + v : ''; };
  const abs = f => new URL(f, document.baseURI).href;   // la máscara se resuelve respecto al CSS, así que va con ruta completa
  const LOGO = {'Instagram': abs('img/redes/instagram-oro.png'), 'TikTok': abs('img/redes/tiktok-oro.png'), 'Threads': abs('img/redes/threads-oro.png')};
  const IC = {
    'Instagram': '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    'TikTok': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    'Threads': '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>',
    'Más enlaces': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
  };
  [['Instagram', url(R.instagram, 'https://www.instagram.com/')], ['TikTok', url(R.tiktok, 'https://www.tiktok.com/@')], ['Threads', url(R.threads, 'https://www.threads.net/@')]]
    .forEach(([t, u]) => { if(u) out.push('<a href="' + esc(u) + '" target="_blank" rel="noopener" aria-label="' + t + '" title="' + t + '">' + (LOGO[t] ? '<i class="lg" aria-hidden="true" style="--m:url(' + LOGO[t] + ')"></i>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + IC[t] + '</svg>') + '</a>'); });
  if(out.length){ $('#social').innerHTML = out.join(''); $('#social').hidden = false; }
  const rs = ((EXTERNO && EXTERNO.resenas) || []).filter(r => r && clean(r.t)).slice(0, 6);
  { const sr = $('#sm-rev'); if(sr) sr.hidden = !rs.length; }
  if(rs.length && $('#rv-list')){
    const star = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.2l6.1-.8z"/></svg>';
    $('#rv-list').innerHTML = rs.map(r => { const e = Math.max(1, Math.min(5, Math.round(+r.e || 5)));
      return '<figure class="rv"><div class="st" role="img" aria-label="' + e + ' de 5 estrellas">' + star.repeat(e) + '</div><blockquote>' + esc(clean(r.t).slice(0, 260)) + '</blockquote>' + (clean(r.n) ? '<figcaption>' + esc(clean(r.n).slice(0, 40)) + '</figcaption>' : '') + '</figure>'; }).join('');
    $('#resenas').hidden = false;
  }
})();


/* ============ INICIO COMÚN: formulario, aviso, WhatsApp ============ */
$('#sm-wa').href = waUrl('Hola, tengo una consulta sobre sus perfumes y decants.');
/* Botón flotante de WhatsApp: al tocarlo abre 3 opciones; cada una abre WhatsApp con su mensaje. Se cierra al tocar fuera, con Escape o al elegir. */
(function(){
  const fab = $('#fab'), box = $('#qk'), list = $('#qk-list'); if(!fab || !box || !list) return;
  const QS = [
    ['Consultar Perfumes', 'Hola, tengo una consulta sobre sus perfumes y decants.'],
    ['Entregas y Pagos', 'Hola, tengo una consulta sobre la entrega o el pago de mi pedido.'],
    ['Otras Preguntas', 'Hola, tengo otra pregunta.']
  ];
  list.innerHTML = QS.map(q => '<a class="qk-i" href="' + waUrl(q[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(q[0]) + '</a>').join('');
  const txt = fab.querySelector('.fab-t');
  function set(open){
    list.hidden = !open; box.classList.toggle('open', open); fab.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    fab.setAttribute('aria-label', open ? 'Cerrar opciones de WhatsApp' : 'Escribirnos por WhatsApp');
    if(txt) txt.textContent = open ? 'Cerrar' : 'Escríbenos';
  }
  set(false);
  fab.addEventListener('click', () => set(list.hidden));
  list.addEventListener('click', e => { if(e.target.closest('a')) set(false); });
  document.addEventListener('click', e => { if(!list.hidden && !e.target.closest('#fab') && !e.target.closest('#qk')) set(false); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !list.hidden){ set(false); fab.focus(); } });
})();
document.querySelectorAll('a[data-wa]').forEach(a => { a.href = waUrl(a.dataset.wa); });
document.querySelectorAll('.pays').forEach(ul => { ul.innerHTML = CONFIG.pagos.map(x => '<li>' + esc(x) + '</li>').join(''); });
const PACK_LBL = { 'Árabe':'Árabes', 'Diseñador':'Diseñadores', 'Nicho':'Nicho' };
const packLbl = k => k.cat ? (PACK_LBL[k.cat] || k.cat) : 'Combo libre';
const calm = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
syncForm(); renderCart();
(function(){
  const m = LS.get('elx_sent'); if(!m) return;
  if(Date.now() - (m.at || 0) > 864e5){ olvidarEnviado(); return; }          /* más de un día: ya no se ofrece recuperar */
  if(Object.keys(state.cart).length) reiniciarPedido();                        /* la página se recargó antes del reinicio */
  if(m.avisado) return;
  m.avisado = true; LS.set('elx_sent', m);
  toastUndo('Empezamos un pedido nuevo.', 'Recuperar el anterior', recuperarPedido);
})();

/* ============ PÁGINAS ============ */
/* ---- Inicio: colecciones y enlaces ---- */
document.querySelectorAll('[data-col]').forEach(t => {
  if(!PERFUMES.some(p => p.tipo === t.dataset.col)){ const s = t.querySelector('small'); if(s) s.textContent = 'Próximamente'; }
});
{ const hp = $('#home-promo'); if(hp) hp.hidden = !PACKS.length; }
/* ---- Promo oculta: sin packs activos se esconden sus textos (preguntas frecuentes, términos, entregas) y se renumeran los términos ---- */
document.querySelectorAll('[data-promo]').forEach(e => { e.hidden = !PACKS.length; });
document.querySelectorAll('[data-sinpromo]').forEach(e => { e.hidden = !!PACKS.length; });
if(!PACKS.length){ let n = 0; document.querySelectorAll('.prose h2').forEach(h => { if(h.closest('[data-promo]') || !/^\d+\.\s/.test(h.textContent)) return; n++; h.textContent = h.textContent.replace(/^\d+\.\s/, n + '. '); }); }

/* ---- Inicio: perfumes del mes (se eligen en el panel; hasta 3) ---- */
const CAT_ICON = {"arabes": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 1.8c.9.9 1.6 1.7 1.6 2.8h-3.2c0-1.1.7-1.9 1.6-2.8z\"/><path d=\"M10.6 4.6v1.6h2.8V4.6\"/><path d=\"M9.6 6.2h4.8\"/><path d=\"M9.6 6.2C6.9 7.5 5.2 10 5.2 13.6c0 3.9 2.7 7 6.8 7s6.8-3.1 6.8-7c0-3.6-1.7-6.1-4.4-7.4\"/><path d=\"M5.6 12.6h12.8\"/><path d=\"M12 14.1l1.1 1.4-1.1 1.4-1.1-1.4z\"/></svg>", "disenadores": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 1.8l2.3 2.3L12 6.4 9.7 4.1z\"/><path d=\"M12 6.4v1.3\"/><path d=\"M10.4 7.7h3.2\"/><circle cx=\"12\" cy=\"14.6\" r=\"6.2\"/><path d=\"M12 11.1c.2 1.7.9 2.4 2.6 2.6-1.7.2-2.4.9-2.6 2.6-.2-1.7-.9-2.4-2.6-2.6 1.7-.2 2.4-.9 2.6-2.6z\"/><path d=\"M15.9 16.6l.5.9.9.5-.9.5-.5.9-.5-.9-.9-.5.9-.5z\" stroke-width=\"1.1\"/></svg>", "nicho": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"9.2\" y=\"1.9\" width=\"5.6\" height=\"3.6\" rx=\".8\"/><path d=\"M10.6 5.5v1.7M13.4 5.5v1.7\"/><rect x=\"5.5\" y=\"7.2\" width=\"13\" height=\"14\" rx=\"2.2\"/><rect x=\"8.8\" y=\"11.4\" width=\"6.4\" height=\"5\" rx=\".7\"/><path d=\"M10.2 13.9h3.6\"/></svg>"};
{
  const box = $('#mes-grid');
  if(box){
    const mes = PERFUMES.filter(p => p.mes).slice(0, 3);
    $('#mes').hidden = !mes.length;
    box.innerHTML = mes.map(p => {
      const c = CATS.find(x => x.id === p.tipo), out = allOut(p), tone = p.tipo === 'Árabe' ? 'a' : 'd';
      const href = 'catalogo.html?' + (c ? 'c=' + c.slug + '&' : '') + 'q=' + encodeURIComponent(p.modelo);
      return '<a class="mes-card' + (out ? ' out' : '') + '" href="' + href + '" aria-label="' + esc(p.marca + ' ' + p.modelo) + '">'
        + '<span class="ph">' + (p.foto ? '<img src="' + esc(p.foto) + '" alt="' + esc(p.marca + ' ' + p.modelo) + '" loading="lazy" decoding="async">' : vial(10, tone)) + '</span>'
        + (out ? '<span class="so">SOLD OUT</span>' : '')
        + '<span class="tx"><span class="m1">' + esc(p.marca) + '</span><span class="m2">' + esc(p.modelo) + '</span>'
        + '<span class="m3">' + (out ? 'Agotado' : esc(p.genero)) + '</span></span></a>';
    }).join('');
  }
}

/* ---- Botón de atrás (todas las páginas menos Inicio) ---- */
{
  const bk = $('#back');
  if(bk){
    bk.hidden = PAGE === 'inicio';
    bk.addEventListener('click', e => {
      let mismo = false;
      try { mismo = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch(_){ mismo = false; }
      if(mismo && history.length > 1){ e.preventDefault(); history.back(); }   /* si no, el enlace lleva al Inicio */
    });
  }
  /* al volver con "atrás" el navegador puede mostrar la página tal como quedó: se recarga para ver el pedido al día */
  window.addEventListener('pageshow', e => { if(e.persisted) location.reload(); });
}

/* ---- Promo: packs ---- */
if($('#packs')){
  if(PACKS.length){
    $('#promo').hidden = false;
    const icons = n => Array.from({ length: Math.min(n, 6) }, () => '<svg class="ic smp" aria-hidden="true"><use href="#ic-smp"/></svg>').join('');
    const decs = n => Array.from({ length: Math.min(n, 10) }, () => '<svg class="ic dec" aria-hidden="true"><use href="#ic-dec"/></svg>').join('');
    let act = 0;
    const paint = () => {
      $('#pk-tabs').innerHTML = PACKS.length > 1 ? PACKS.map((k, i) => '<button type="button" role="tab" class="seg-b' + (i === act ? ' on' : '') + '" aria-selected="' + (i === act) + '" data-i="' + i + '">' + esc(packLbl(k)) + '</button>').join('') : '';
      const tiers = [...PACKS[act].niveles].sort((a, b) => a.min - b.min);
      $('#packs').innerHTML = tiers.map((t, i) => '<button type="button" class="eq" data-min="' + t.min + '" data-gift="' + t.muestras + '" style="animation-delay:' + (i * 70) + 'ms">'
        + '<span class="sr">' + t.min + ' decants de 10 ml y ' + pl(t.muestras, 'Decant Sorpresa gratis', 'Decants Sorpresa gratis') + '. Selecciona este pack para armar tu combo' + (PACKS[act].cat ? ' ' + esc(packLbl(PACKS[act]).toLowerCase()) : ' con los perfumes que prefieras') + '</span>'
        + '<span class="n a" aria-hidden="true">' + t.min + '</span><span class="p" aria-hidden="true">+</span><span class="n g" aria-hidden="true">' + t.muestras + '</span>'
        + '<span class="mv" aria-hidden="true">' + decs(t.min) + '</span><span aria-hidden="true"></span><span class="s" aria-hidden="true">' + icons(t.muestras) + '</span>'
        + '<span class="gp" aria-hidden="true">+' + t.muestras + ' gratis</span></button>').join('');
    };
    $('#pk-tabs').addEventListener('click', e => {
      const b = e.target.closest('button[data-i]');
      if(!b) return;
      act = +b.dataset.i; paint();
      const on = $('#pk-tabs button.on'); if(on) on.focus();
    });
    $('#packs').addEventListener('click', e => {
      const b = e.target.closest('button.eq'); if(!b) return;
      const k = PACKS[act], cs = CATS.find(c => c.id === k.cat), u = new URLSearchParams();
      if(cs && PERFUMES.some(p => p.tipo === k.cat)) u.set('c', cs.slug);
      u.set('promo', b.dataset.min + '-' + b.dataset.gift); u.set('pk', k.id);
      location.href = 'catalogo.html?' + u.toString();
    });
    paint();
  } else { const none = $('#promo-none'); if(none) none.hidden = false; }
}

/* ---- Catálogo ---- */
if($('#grid')){
  const leerUrl = u => {
    const c = CATS.find(x => x.slug === u.get('c')), g = GENS.find(x => x.slug === u.get('g'));
    state.tipo = c ? c.id : 'Todos'; state.gen = g ? g.id : 'Todos'; state.q = (u.get('q') || '').slice(0, 80);
    const m = /^(\d+)-(\d+)$/.exec(u.get('promo') || ''), k = PACKS.find(x => x.id === u.get('pk')) || PACKS[0];
    state.promoSel = m && k ? { min:+m[1], gift:+m[2], label:packLbl(k), pk:k.id, libre:!k.cat } : null;
    $('#q').value = state.q;
  };
  const guardarUrl = () => {
    const u = new URLSearchParams(), c = CATS.find(x => x.id === state.tipo), g = GENS.find(x => x.id === state.gen);
    if(c) u.set('c', c.slug); if(g) u.set('g', g.slug); if(state.q.trim()) u.set('q', state.q.trim());
    if(state.promoSel){ u.set('promo', state.promoSel.min + '-' + state.promoSel.gift); u.set('pk', state.promoSel.pk || ''); }
    const s = u.toString();
    try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '')); } catch(e) {}
  };
  const pintar = () => { renderChips(); renderCatalog(); renderPromoCtx(); };
  $('#grid').addEventListener('change', e => {
    if(e.target.matches('input[type=radio]')) updateCard(e.target.closest('.card'));
  });
  $('#grid').addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if(!b) return;
    const card = b.closest('.card');
    add(card.dataset.id, selSize(BY_ID[card.dataset.id]), b);
  });
  $('#grid').addEventListener('error', e => {
    if(e.target.tagName !== 'IMG') return;
    const card = e.target.closest('.card'); if(!card) return;
    BY_ID[card.dataset.id].foto = '';
    updateCard(card);
  }, true);
  $('#chips').addEventListener('click', e => {
    const b = e.target.closest('[data-tipo]'); if(!b) return;
    state.tipo = b.dataset.tipo; state.promoSel = null; pintar(); guardarUrl();
  });
  $('#chips-gen').addEventListener('click', e => {
    const b = e.target.closest('[data-gen]'); if(!b) return;
    state.gen = b.dataset.gen; state.promoSel = null; pintar(); guardarUrl();
  });
  $('#promo-ctx').addEventListener('click', e => {
    if(!e.target.closest('[data-promo-off]')) return;
    state.promoSel = null; state.tipo = 'Todos'; state.gen = 'Todos'; pintar(); guardarUrl();
  });
  $('#q').addEventListener('input', e => { state.q = e.target.value; renderCatalog(); guardarUrl(); });
  /* desde el menú lateral, sin recargar la página */
  const subir = () => { const t = $('#catalogo'); if(t) t.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' }); };
  window.__catalogoIr = href => { leerUrl(new URL(href, location.href).searchParams); pintar(); guardarUrl(); subir(); };
  window.__catalogoBuscar = q => { leerUrl(new URLSearchParams()); state.q = q; $('#q').value = q; pintar(); guardarUrl(); subir(); };
  leerUrl(new URLSearchParams(location.search)); pintar();
}

/* ---- Menú lateral ---- */
(function(){
  const dlg = $('#menu'); if(!dlg) return;
  const cerrar = () => { if(typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); document.body.style.overflow = ''; $('#open-menu').setAttribute('aria-expanded', 'false'); };
  $('#sm-promo').hidden = !PACKS.length;
  $('#sm-cats').innerHTML = CATS.map(c => {
    const hay = PERFUMES.some(p => p.tipo === c.id);
    return '<div class="sm-grp"><a href="catalogo.html?c=' + c.slug + '"><i class="ci">' + CAT_ICON[c.slug] + '</i>' + esc(c.full) + (hay ? '' : '<small>Próximamente</small>') + '</a>'
      + '<div class="sm-gens">' + GENS.map(g => '<a href="catalogo.html?c=' + c.slug + '&amp;g=' + g.slug + '"' + (PERFUMES.some(p => pasa(p, c.id, g.id)) ? '' : ' class="soon"') + '>' + esc(g.nombre) + '</a>').join('') + '</div></div>';
  }).join('');
  const aqui = location.pathname.split('/').pop() || 'index.html';
  dlg.querySelectorAll('.sm-nav a[href]').forEach(a => {
    const h = a.getAttribute('href');
    if(!/[?#]/.test(h) && h === aqui) a.setAttribute('aria-current', 'page');
  });
  $('#open-menu').addEventListener('click', () => {
    const so = $('#social'), ms = $('#sm-social');
    ms.innerHTML = so ? so.innerHTML : ''; ms.hidden = !ms.innerHTML.trim();
    $('#sm-q').value = '';
    $('#open-menu').setAttribute('aria-expanded', 'true');
    if(typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    $('.sm-b').scrollTop = 0;
  });
  dlg.addEventListener('click', e => {
    if(e.target === dlg || e.target.closest('[data-close]')) return cerrar();
    const a = e.target.closest('a[href]');
    if(a && window.__catalogoIr && /^catalogo\.html(\?|$)/.test(a.getAttribute('href'))){ e.preventDefault(); cerrar(); window.__catalogoIr(a.getAttribute('href')); }
  });
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; $('#open-menu').setAttribute('aria-expanded', 'false'); });
  $('#sm-form').addEventListener('submit', e => {
    if(!window.__catalogoBuscar) return;   // en las demás páginas el formulario abre el catálogo con la búsqueda
    e.preventDefault(); cerrar(); window.__catalogoBuscar($('#sm-q').value.trim());
  });
})();

/* ---- Visitas (GoatCounter) ---- */
(function(){
  const s = document.createElement('script');
  s.async = true; s.dataset.goatcounter = 'https://elixirpty.goatcounter.com/count'; s.src = '//gc.zgo.at/count.js';
  document.body.appendChild(s);
})();
