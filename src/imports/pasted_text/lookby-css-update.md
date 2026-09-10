Quiero que modifiques ÚNICAMENTE los estilos CSS de la interfaz existente de mi proyecto LookBy. La página YA está diseñada y funcionando correctamente, por lo tanto NO quiero que generes una imagen, NO quiero que crees un nuevo diseño y NO quiero que cambies la estructura actual de la página.

Quiero realizar únicamente mejoras visuales relacionadas con la TIPOGRAFÍA, los COLORES, el CONTRASTE y la LEGIBILIDAD de los textos, especialmente cuando se cambia entre MODO NOCHE y MODO DÍA.

IMPORTANTE: NO modificar la estructura HTML/JSX existente. NO crear componentes nuevos. NO eliminar componentes. NO cambiar la distribución de los elementos. NO cambiar las imágenes. NO cambiar la navegación. NO cambiar el formulario de reserva. NO cambiar las tarjetas de categorías. NO cambiar las funcionalidades. NO crear nuevas secciones. NO rediseñar la página. NO generar imágenes.

La página debe seguir teniendo exactamente la misma estructura y distribución que tiene actualmente. Solo quiero que visualmente se vea mejor terminada y que los textos sean mucho más legibles.

1. TIPOGRAFÍA

Actualmente utilizo las fuentes Pinyon Script, DM Serif Display y DM Sans.

Quiero cambiar la combinación tipográfica por una combinación más atractiva, elegante, moderna y profesional, adecuada para una plataforma premium de belleza y estética.

La nueva combinación debe transmitir lujo, elegancia, belleza y modernidad, pero sin hacer que la interfaz pierda legibilidad.

Quiero mantener una jerarquía tipográfica clara:

- El logotipo LookBy debe conservar una apariencia elegante y sofisticada.
- Los títulos principales deben utilizar una tipografía serif elegante y premium.
- Los subtítulos y textos descriptivos deben utilizar una tipografía sans-serif moderna, limpia y muy legible.
- Los botones deben utilizar una tipografía sans-serif clara y profesional, preferiblemente con un peso semibold.
- Los textos de navegación deben ser limpios, modernos y fáciles de leer.
- Los nombres de las categorías deben tener suficiente peso para que se puedan leer claramente sobre las imágenes.

No quiero utilizar demasiadas familias tipográficas diferentes. La combinación debe verse coherente en toda la plataforma.

La prioridad de la nueva tipografía debe ser:

ELEGANCIA + LEGIBILIDAD + MODERNIDAD + IDENTIDAD PREMIUM.

2. CORREGIR LOS TEXTOS EN MODO DÍA

Este es uno de los cambios más importantes.

Actualmente el modo noche se ve correctamente, pero cuando cambio al modo día algunos textos se vuelven demasiado claros, pierden contraste o prácticamente desaparecen sobre el fondo claro.

Quiero que corrijas esto utilizando las variables de tema existentes.

Actualmente utilizo estas variables:

--fg
--fg-muted
--fg-dim
--fg-ghost

En el modo claro actualmente tengo:

html.light {
  --bg: #F8F9FA;
  --bg-mid: #EFEFEF;
  --bg-card: #FFFFFF;
  --bg-surface: #F0EDE8;
  --fg: #141414;
  --fg-muted: #555555;
  --fg-dim: #888888;
  --fg-ghost: #BBBBBB;
}

Quiero que ajustes especialmente --fg-muted, --fg-dim y --fg-ghost para que los textos secundarios sigan teniendo una jerarquía visual, pero NO pierdan legibilidad.

No quiero textos gris demasiado claro sobre fondos blancos o claros.

En modo día:

- Los títulos deben ser oscuros y claramente visibles.
- Los subtítulos deben utilizar un gris oscuro con buen contraste.
- Los textos secundarios deben seguir siendo diferenciables del texto principal, pero deben poder leerse fácilmente.
- Las etiquetas deben ser visibles.
- Los textos de navegación deben ser claramente visibles.
- Los textos de los botones deben tener suficiente contraste.
- Ningún texto debe desaparecer visualmente.

NO quiero simplemente poner todos los textos en negro. Quiero mantener una jerarquía visual elegante utilizando diferentes niveles de contraste.

3. MODO NOCHE

No quiero cambiar innecesariamente la apariencia actual del modo noche.

Quiero conservar la estética oscura, elegante y premium.

Mantener principalmente estos valores:

--bg: #0A0A0A;
--bg-mid: #141414;
--bg-card: #1F1F1F;
--bg-surface: #252525;
--fg: #F8F9FA;

También quiero conservar la identidad dorada de LookBy:

#D4AF37
#E6CA65
#C89D7C

Solo realiza ajustes en el modo noche si son estrictamente necesarios para mejorar la tipografía o la legibilidad.

No quiero que el modo noche cambie completamente de apariencia.

4. CATEGORÍAS DE ESTÉTICA

Existe una sección llamada "Categorías de Estética".

Las categorías actuales son:

- Salón de Belleza
- Barbería Premium
- Spa & Bienestar
- Estudio Makeup
- Depilación & Skin
- Cuidado Corporal

Estas tarjetas YA EXISTEN.

NO quiero cambiar su estructura, tamaño, posición, cantidad, imágenes ni distribución.

Actualmente cada tarjeta tiene una imagen de fondo, un icono circular y el nombre de la categoría.

El problema específico es el siguiente:

En modo noche los nombres de las categorías aparecen en blanco y se pueden leer correctamente.

Pero cuando cambio al modo día, los nombres pueden cambiar a un color oscuro debido a las variables generales del tema y terminan mezclándose con las fotografías de fondo.

Quiero corregir únicamente este problema.

Los nombres de las categorías deben permanecer claramente visibles SOBRE LAS IMÁGENES, independientemente de si está activo el modo noche o el modo día.

Como estos textos están encima de fotografías, NO deben depender directamente de --fg.

Por ejemplo, si actualmente existe una clase para estos nombres, quiero que tenga un color específico para texto sobre imágenes, preferiblemente:

color: #FFFFFF;

El texto debe permanecer blanco tanto en modo noche como en modo día si está ubicado directamente sobre la imagen.

Si existe un overlay o degradado en la parte inferior de las tarjetas, puedes ajustar únicamente su intensidad para mejorar el contraste.

Si no existe un overlay adecuado, puedes agregar únicamente un efecto de degradado CSS a la tarjeta existente, sin modificar su estructura.

El objetivo visual debe ser:

IMAGEN → DEGRADADO/OVERLAY → ICONO → NOMBRE DE CATEGORÍA

El degradado debe ser sutil, elegante y únicamente lo suficientemente fuerte para garantizar que el texto sea visible.

NO quiero oscurecer completamente las fotografías.

NO quiero cambiar las fotografías.

NO quiero cambiar las tarjetas por otro componente.

5. TÍTULO "CATEGORÍAS DE ESTÉTICA"

El título "Categorías de Estética" también debe adaptarse correctamente a ambos temas.

En modo noche debe ser claro y visible sobre el fondo oscuro.

En modo día debe ser oscuro y tener suficiente contraste sobre el fondo claro.

No utilizar un gris demasiado claro para este título.

Debe mantener una apariencia elegante y premium.

6. LOGO LOOKBY

Este punto es MUY IMPORTANTE.

El logo actual de la plataforma es "LookBy".

NO quiero reemplazar el logo.

NO quiero rediseñar el logo.

NO quiero cambiar su tamaño.

NO quiero cambiar su posición.

NO quiero cambiar su forma.

NO quiero cambiar su estructura.

Únicamente quiero que el color del logo cambie automáticamente dependiendo del tema activo.

Actualmente el logo se ve correctamente en modo noche, pero cuando activo el modo día se ve demasiado claro y pierde contraste con el fondo claro.

Quiero crear una adaptación específica del logo para cada tema.

MODO NOCHE:

El logo debe mantener un tono dorado claro y elegante.

Puede utilizar un tono como:

#E6CA65

o un dorado claro similar que mantenga la estética actual.

MODO DÍA:

El logo debe cambiar automáticamente a un dorado más oscuro para aumentar el contraste sobre el fondo claro.

Puede utilizar un tono como:

#A67C00

o un dorado oscuro similar que conserve la identidad de marca.

La lógica debe ser:

MODO NOCHE → LOGO DORADO CLARO

MODO DÍA → LOGO DORADO OSCURO

Si el logo utiliza una clase específica, crea una regla CSS específica para html.light que modifique únicamente el color del logo.

Por ejemplo, conceptualmente:

html.light .logo {
  color: #A67C00;
}

Mientras que en modo noche debe conservar su color dorado claro actual.

No quiero que el cambio de tema afecte al tamaño, posición, fuente o estructura del logo.

SOLO debe cambiar su color para garantizar contraste.

7. HERO PRINCIPAL

La sección principal de la página ya está creada y funciona correctamente.

NO quiero cambiar su estructura.

NO quiero cambiar:

- La imagen principal.
- La posición del título.
- El subtítulo.
- El formulario de reserva.
- El botón Reservar.
- Las estadísticas.
- La navegación.
- La distribución general.

Solo quiero mejorar la legibilidad de los textos.

El título principal debe mantener una jerarquía visual fuerte y elegante.

El subtítulo que aparece debajo del título debe ser claramente visible.

Actualmente en algunos casos el subtítulo tiene poco contraste.

Quiero que el subtítulo utilice un color apropiado dependiendo del tema.

En modo noche debe ser un gris claro visible.

En modo día debe ser un gris oscuro visible.

No quiero utilizar el mismo color para ambos temas si esto hace que uno de ellos pierda contraste.

8. NAVEGACIÓN

Mantener exactamente la navegación actual:

LookBy
Categorías
Locales
Catálogo
Para Negocios
Carrito
Selector de modo
Admin
Cliente
Negocio
Proveedor

NO cambiar el orden.

NO cambiar la distribución.

NO eliminar elementos.

NO crear elementos nuevos.

Solo mejorar la tipografía y el contraste.

En modo noche:

Los textos deben ser claros y visibles sobre el fondo oscuro.

En modo día:

Los textos deben ser oscuros y visibles sobre el fondo claro.

Los elementos destacados pueden conservar el color dorado de la marca.

9. VARIABLES CSS

Quiero mantener el sistema actual de variables semánticas.

Actualmente tengo:

:root {
  --bg: #0A0A0A;
  --bg-mid: #141414;
  --bg-card: #1F1F1F;
  --bg-surface: #252525;
  --fg: #F8F9FA;
  --fg-muted: #AAAAAA;
  --fg-dim: #666666;
  --fg-ghost: #444444;
  --border: rgba(212, 175, 55, 0.20);
  --border-hover: rgba(212, 175, 55, 0.55);
  --shadow-card: 0 8px 40px rgba(212, 175, 55, 0.07);
  --nav-bg: rgba(10, 10, 10, 0.92);
  --input-bg: #0A0A0A;
  --scrollbar: #2A2A2A;
}

html.light {
  --bg: #F8F9FA;
  --bg-mid: #EFEFEF;
  --bg-card: #FFFFFF;
  --bg-surface: #F0EDE8;
  --fg: #141414;
  --fg-muted: #555555;
  --fg-dim: #888888;
  --fg-ghost: #BBBBBB;
  --border: rgba(212, 175, 55, 0.30);
  --border-hover: rgba(212, 175, 55, 0.70);
  --shadow-card: 0 4px 24px rgba(180, 130, 40, 0.10);
  --nav-bg: rgba(248, 249, 250, 0.95);
  --input-bg: #F0EDE8;
  --scrollbar: #D4AF37;
}

Mantén este sistema.

Puedes modificar únicamente los valores de las variables cuando sea necesario para mejorar el contraste.

No elimines el sistema de variables.

No reemplaces el sistema de temas por otro diferente.

10. REGLA PARA TEXTOS SOBRE IMÁGENES

Es muy importante diferenciar entre textos que están sobre fondos normales y textos que están sobre fotografías.

Los textos normales deben utilizar las variables del tema.

Pero los textos que estén directamente sobre fotografías, como los nombres de las categorías, deben utilizar colores independientes del tema para garantizar siempre la legibilidad.

Por ejemplo:

Texto normal:
var(--fg)

Texto secundario:
var(--fg-muted)

Texto sobre imagen:
#FFFFFF

No quiero que el cambio entre modo noche y modo día haga desaparecer textos que están sobre imágenes.

11. CONTRASTE

Quiero que revises toda la interfaz existente y corrijas cualquier texto que tenga poco contraste.

Especialmente:

- subtítulos
- descripciones
- textos secundarios
- etiquetas
- nombres de categorías
- logo LookBy
- navegación
- títulos de secciones

En modo día ningún texto debe quedar demasiado claro sobre un fondo claro.

En modo noche ningún texto debe quedar demasiado oscuro sobre un fondo oscuro.

El dorado debe utilizarse como color de acento, no como sustituto de todos los textos.

12. ESTILO VISUAL

Quiero mantener exactamente la identidad visual actual de LookBy:

- elegante
- premium
- sofisticada
- moderna
- relacionada con belleza y estética
- minimalista
- profesional

No quiero efectos exagerados.

No quiero agregar animaciones innecesarias.

No quiero agregar sombras excesivas.

No quiero agregar nuevos elementos.

Solo quiero mejorar la calidad visual de lo que ya existe.

13. REGLA MÁS IMPORTANTE

NO rediseñes la página.

NO generes una nueva interfaz.

NO generes imágenes.

NO cambies la estructura.

NO cambies el layout.

NO cambies la distribución.

NO cambies las imágenes.

NO cambies los componentes.

NO cambies las funcionalidades.

NO elimines contenido.

NO agregues nuevas secciones.

Trabaja únicamente sobre el CSS y los estilos existentes.

El resultado final debe verse como la MISMA página actual de LookBy, pero con:

- una tipografía más atractiva
- mejor jerarquía tipográfica
- mejor contraste
- mejor legibilidad
- modo día correctamente adaptado
- modo noche conservado
- nombres de categorías visibles sobre las imágenes
- logo LookBy adaptado automáticamente al modo día y noche
- subtítulos visibles en ambos temas
- navegación más clara

La prioridad es conservar el diseño existente y únicamente mejorar sus estilos visuales.

Si para solucionar un problema puedes hacerlo modificando CSS, variables de tema, colores, tipografía u overlay, utiliza esa opción antes de modificar cualquier estructura existente.