/* Vitrina de colecciones (se abre con «Ver catálogo» en Inicio):
   3 nichos iluminados; al tocar uno, zoom tipo cámara y se elige Hombres / Mujeres / Todos */
(function(){
  var modal = document.getElementById('x-cats');
  var box = modal && modal.querySelector('.xc-box');
  if(!box) return;
  var shelf = box.querySelector('.xc-shelf');
  var IMG = 'img/vitrina/';
  var CATS = [
    { slug:'arabes', nom:'Árabes', img:'arabe.webp', k:'Colección', t:'<em>Árabes</em>', d:'Fragancias intensas y envolventes, con el lujo del Medio Oriente.' },
    { slug:'disenadores', nom:'Diseñador', img:'disenador.webp', k:'Colección', t:'<em>Diseñador</em>', d:'Las casas más reconocidas del mundo, en decants de 5 y 10 ml.' },
    { slug:'nicho', nom:'Nicho', img:'nicho.webp', k:'Muy pronto', t:'<em>Nicho</em>', d:'Perfumería de autor, exclusiva y poco común. Estamos preparando esta colección.', soon:true }
  ];
  var vit = document.createElement('div');
  vit.className = 'vit'; vit.id = 'vit';
  vit.innerHTML = '<div class="vit-row">' + CATS.map(function(c, i){
      return '<button class="nich' + (c.soon ? ' soon' : '') + '" type="button" data-i="' + i + '" aria-label="' + c.nom + '"><img src="' + IMG + c.img + '" alt="" decoding="async"><span class="lbl">' + c.nom + (c.soon ? '<small>Próximamente</small>' : '') + '</span></button>';
    }).join('') + '</div>' +
    '<div class="vit-cap"><b>Elige tu colección</b>Toca una vitrina</div>' +
    '<div class="vit-stage" aria-live="polite"><img class="vit-bottle" alt=""><button class="vit-back" type="button">← Vitrina</button>' +
    '<div class="vit-txt"><div class="vit-k"></div><div class="vit-t"></div><p class="vit-d"></p><div class="vit-b"></div></div></div>';
  if(shelf){ shelf.hidden = true; shelf.style.display = 'none'; box.insertBefore(vit, shelf); } else box.appendChild(vit);
  box.classList.add('has-vitrina');

  var stage = vit.querySelector('.vit-stage'), bottle = stage.querySelector('.vit-bottle');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var actual = null;

  function llenar(c){
    stage.classList.toggle('soon', !!c.soon);
    bottle.src = IMG + c.img;
    stage.querySelector('.vit-k').textContent = c.k;
    stage.querySelector('.vit-t').innerHTML = c.t;
    stage.querySelector('.vit-d').textContent = c.d;
    var b = stage.querySelector('.vit-b'); b.innerHTML = '';
    if(c.soon) return;
    [['hombres','Hombres'],['mujeres','Mujeres'],['','Todos']].forEach(function(g, i){
      var a = document.createElement('a');
      a.href = 'catalogo.html?c=' + c.slug + (g[0] ? '&g=' + g[0] : '');
      a.textContent = g[1];
      if(i === 2) a.className = 'ghost';
      b.appendChild(a);
    });
  }

  function abrir(i){
    var c = CATS[i], n = vit.querySelectorAll('.nich')[i];
    actual = i; llenar(c);
    var R = vit.getBoundingClientRect(), r = n.getBoundingClientRect();
    vit.classList.add('open');
    if(reduce || !stage.animate){ vit.classList.add('shown'); return; }
    var ease = 'cubic-bezier(.7,0,.2,1)';
    stage.animate([
      { clipPath: 'inset(' + (r.top - R.top) + 'px ' + (R.right - r.right) + 'px ' + (R.bottom - r.bottom) + 'px ' + (r.left - R.left) + 'px round 12px)' },
      { clipPath: 'inset(0px 0px 0px 0px round 0px)' }
    ], { duration: 750, easing: ease });
    var s = r.height / R.height, dx = (r.left + r.width / 2) - (R.left + R.width / 2), dy = r.top - R.top;
    bottle.animate([
      { transform: 'translate(calc(-50% + ' + dx + 'px),' + (dy + r.height * 0.06) + 'px) scale(' + s * 1.08 + ')', transformOrigin: '50% 0' },
      { transform: 'translate(-50%,0) scale(1)', transformOrigin: '50% 0' }
    ], { duration: 750, easing: ease });
    setTimeout(function(){ vit.classList.add('shown'); }, 120);
  }

  function cerrar(sinAnim){
    if(actual === null) return;
    var n = vit.querySelectorAll('.nich')[actual];
    var R = vit.getBoundingClientRect(), r = n.getBoundingClientRect();
    vit.classList.remove('shown');
    var fin = function(){ vit.classList.remove('open'); actual = null; };
    if(sinAnim || reduce || !stage.animate || !R.width){ fin(); return; }
    var a = stage.animate([
      { clipPath: 'inset(0px 0px 0px 0px round 0px)' },
      { clipPath: 'inset(' + (r.top - R.top) + 'px ' + (R.right - r.right) + 'px ' + (R.bottom - r.bottom) + 'px ' + (r.left - R.left) + 'px round 12px)', opacity: .2 }
    ], { duration: 550, easing: 'cubic-bezier(.5,0,.2,1)' });
    a.onfinish = fin;
  }

  vit.querySelectorAll('.nich').forEach(function(n){
    n.addEventListener('click', function(){ abrir(+n.dataset.i); });
  });
  stage.querySelector('.vit-back').addEventListener('click', function(){ cerrar(); });
  // Cada vez que se abre o se cierra la ventana, la vitrina vuelve a mostrar los 3 nichos
  document.addEventListener('click', function(e){
    if(e.target.closest && (e.target.closest('.xc-x') || e.target.closest('a.cta'))) cerrar(true);
  }, true);
})();
