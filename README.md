# ELIXIR Decants & Parfums

Catálogo público de ELIXIR. Los precios, fotos y promos se actualizan desde el panel privado "ELIXIR Control".

Páginas:
- `index.html`: inicio.
- `catalogo.html`: catálogo (Árabes / Diseñadores / Nicho × Hombres / Mujeres / Unisex) con el carrito que envía el pedido por WhatsApp.
- `promo.html`: Promo Elixir Packs.
- `quienes-somos.html`, `entregas.html`, `preguntas-frecuentes.html`, `terminos.html`, `privacidad.html`.

Archivos compartidos:
- `assets/app.css` y `assets/app.js`: estilos, menú lateral, carrito y lógica de todas las páginas.
- `data/catalogo.js`: perfumes, precios de decants (5 y 10 ml) y promos publicados. El frasco completo no se publica: se consulta por WhatsApp.
- `img/perfumes/`: fotos de los perfumes originales.
- `fotos/`: fotos de los perfumes agregados desde el panel.

Promo oculta (sin packs activos): `promo.html` va en `noindex` y fuera de `sitemap.xml`, y su descripción no menciona regalos. Al reactivar la promo: quitar `noindex`, volver a poner `promo.html` en el sitemap y restaurar su descripción y las menciones en `terminos.html` y `preguntas-frecuentes.html`.
