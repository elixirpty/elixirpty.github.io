/* Vitrina de categorías: 3 nichos iluminados; al tocar uno, zoom tipo cámara y se elige Hombres/Mujeres */
(function(){
  if(document.body.dataset.page !== 'catalogo') return;
  var chips = document.getElementById('chips'), tools = chips && chips.parentNode;
  if(!chips) return;
  var IMG = 'img/vitrina/';
  var CATS = [
    { tipo:'Árabe', nom:'Árabes', img:'arabe.webp', k:'Colección', t:'<em>Árabes</em>', d:'Fragancias intensas y envolventes, con el lujo del Medio Oriente.' },
    { tipo:'Diseñador', nom:'Diseñador', img:'disenador.webp', k:'Colección', t:'<em>Diseñador</em>', d:'Las casas más reconocidas del mundo, en decants de 5 y 10 ml.' },
    { tipo:'Nicho', nom:'Nicho', img:'nicho.webp', k:'Muy pronto', t:'<em>Nicho</em>', d:'Perfumería de autor, exclusiva y poco común. Estamos preparando esta colección.', soon:true }
  ];
  var vit = document.createElement('div');
  vit.className = 'vit'; vit.id = 'vit';
  vit.innerHTML = '<div class="vit-row">' + CATS.map(function(c, i){
      return '<button class="nich' + (c.soon ? ' soon' : '') + '" type="button" data-i="' + i + '" aria-label="' + c.nom + '"><img src="' + IMG + c.img + '" alt="" loading="eager" decoding="async"><span class="lbl">' + c.nom + (c.soon ? '<small>Próximamente</small>' : '') + '</span></button>';
    }).join('') + '</div>' +
    '<div class="vit-cap"><b>Elige tu colección</b>Toca una vitrina</div>' +
    '<div class="vit-stage" aria-live="polite"><img class="vit-bottle" alt=""><button class="vit-back" type="button">← Vitrina</button>' +
    '<div class="vit-txt"><div class="vit-k"></div><div class="vit-t"></div><p class="vit-d"></p><div class="vit-b"></div></div></div>';
  tools.insertBefore(vit, chips);
  document.body.classList.add('has-vit');

  var stage = vit.querySelector('.vit-stage'), bottle = stage.querySelector('.vit-bottle');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var actual = null;

  function pulsar(sel){ var b = document.querySelector(sel); if(b) b.click(); }
  function elegir(c, gen){
    pulsar('#chips .chip[data-tipo="' + c.tipo + '"]');
    setTimeout(function(){
      pulsar('#chips-gen .chip[data-gen="' + gen + '"]');
      var g = document.getElementById('chips-gen') || document.getElementById('grid');
      if(g) g.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }, 60);
  }

  function llenar(c){
    stage.classList.toggle('soon', !!c.soon);
    bottle.src = IMG + c.img;
    stage.querySelector('.vit-k').textContent = c.k;
    stage.querySelector('.vit-t').innerHTML = c.t;
    stage.querySelector('.vit-d').textContent = c.d;
    var b = stage.querySelector('.vit-b'); b.innerHTML = '';
    if(c.soon) return;
    [['Hombre','Hombres'],['Mujer','Mujeres'],['Todos','Todos']].forEach(function(g, i){
      var x = document.createElement('button'); x.type = 'button'; x.textContent = g[1];
      if(i === 2) x.className = 'ghost';
      x.addEventListener('click', function(){ elegir(c, g[0]); });
      b.appendChild(x);
    });
  }

  function abrir(i, sinAnim){
    var c = CATS[i], n = vit.querySelectorAll('.nich')[i];
    actual = i; llenar(c);
    var R = vit.getBoundingClientRect(), r = n.getBoundingClientRect();
    vit.classList.add('open');
    if(sinAnim || reduce || !stage.animate){ vit.classList.add('shown'); return; }
    var top = r.top - R.top, left = r.left - R.left, right = R.right - r.right, bot = R.bottom - r.bottom;
    var ease = 'cubic-bezier(.7,0,.2,1)';
    stage.animate([
      { clipPath: 'inset(' + top + 'px ' + right + 'px ' + bot + 'px ' + left + 'px round 12px)', backgroundSize: (R.width / r.width * 100) + '%' },
      { clipPath: 'inset(0px 0px 0px 0px round 0px)', backgroundSize: 'cover' }
    ], { duration: 750, easing: ease });
    var s = r.height / R.height, dx = (r.left + r.width / 2) - (R.left + R.width / 2), dy = (r.top - R.top) - 0;
    bottle.animate([
      { transform: 'translate(calc(-50% + ' + dx + 'px),' + (dy + r.height * 0.06) + 'px) scale(' + s * 1.08 + ')', transformOrigin: '50% 0' },
      { transform: 'translate(-50%,0) scale(1)', transformOrigin: '50% 0' }
    ], { duration: 750, easing: ease });
    setTimeout(function(){ vit.classList.add('shown'); }, 120);
  }

  function cerrar(){
    if(actual === null) return;
    var n = vit.querySelectorAll('.nich')[actual];
    var R = vit.getBoundingClientRect(), r = n.getBoundingClientRect();
    vit.classList.remove('shown');
    var fin = function(){ vit.classList.remove('open'); actual = null; };
    if(reduce || !stage.animate){ fin(); return; }
    var a = stage.animate([
      { clipPath: 'inset(0px 0px 0px 0px round 0px)' },
      { clipPath: 'inset(' + (r.top - R.top) + 'px ' + (R.right - r.right) + 'px ' + (R.bottom - r.bottom) + 'px ' + (r.left - R.left) + 'px round 12px)', opacity: .2 }
    ], { duration: 550, easing: 'cubic-bezier(.5,0,.2,1)' });
    a.onfinish = fin;
  }

  vit.querySelectorAll('.nich').forEach(function(n){
    n.addEventListener('click', function(){ abrir(+n.dataset.i); });
  });
  stage.querySelector('.vit-back').addEventListener('click', function(){
    cerrar(); pulsar('#chips .chip[data-tipo="Todos"]');
  });

  // Si se llega con una categoría ya elegida (enlace ?c=...), la vitrina abre directo en ella
  setTimeout(function(){
    var p = chips.querySelector('.chip[aria-pressed="true"]');
    var t = p && p.dataset.tipo;
    var i = CATS.findIndex(function(c){ return c.tipo === t; });
    if(i >= 0) abrir(i, true);
  }, 150);
})();
