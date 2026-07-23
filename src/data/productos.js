// =============================================================
//  CATÁLOGO DE PRODUCTOS  ·  Tienda multimarca de perfumes
//  Copia un bloque { ... } completo para crear uno nuevo.
//
//  --- Datos básicos (se ven en la tarjeta del catálogo) ---
//   id        -> número único (no repetir)
//   nombre    -> nombre del perfume
//   marca     -> casa / diseñador (Dior, Chanel, Versace, etc.)
//   genero    -> 'mujer' | 'hombre' | 'unisex'
//   familia   -> familia olfativa (Floral, Amaderado, Cítrico, etc.)
//   notas     -> resumen corto de notas
//   ml        -> tamaño del frasco en mililitros
//   precio    -> precio en soles (solo número)
//   precioAntes -> precio tachado para ofertas (opcional)
//   destacado -> true para mostrar la etiqueta "Destacado"
//   imagen    -> URL de la foto (vertical, 800x1000 px recomendado)
//
//  --- Ficha completa (se ve al hacer clic en el producto) ---
//   descripcion   -> texto largo que describe la fragancia
//   concentracion -> 'Eau de Parfum', 'Eau de Toilette', 'Parfum'…
//   notasSalida   -> primeras notas que se perciben
//   notasCorazon  -> notas del centro de la fragancia
//   notasFondo    -> notas que quedan al final
//   duracion      -> cuánto dura puesto (ej. '8 a 10 horas')
//   estela        -> qué tanto proyecta (ej. 'Intensa')
//   ocasion       -> cuándo usarlo (ej. 'Noche y eventos')
//
//  NOTA: estos perfumes son EJEMPLOS. Cámbialos por tu stock real
//  (o edítalos desde el panel admin en /#/admin).
// =============================================================

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`

export const productos = [
  {
    id: 1,
    nombre: 'Sauvage EDP',
    marca: 'Dior',
    genero: 'hombre',
    familia: 'Amaderado Aromático',
    notas: 'Bergamota, pimienta de Sichuan, ambroxan',
    ml: 100,
    precio: 429,
    precioAntes: 499,
    destacado: true,
    imagen: img('1594035910387-fea47794261f'),
    descripcion:
      'Un clásico moderno inspirado en los espacios abiertos del desierto. Arranca fresco y cítrico, y a las pocas horas se vuelve cálido y especiado. Es de esos perfumes que funcionan para todo: oficina, salidas y clima cálido.',
    concentracion: 'Eau de Parfum',
    notasSalida: 'Bergamota de Calabria, mandarina',
    notasCorazon: 'Pimienta de Sichuan, lavanda, nuez moscada',
    notasFondo: 'Ambroxan, vainilla, haba tonka',
    duracion: '8 a 10 horas',
    estela: 'Intensa',
    ocasion: 'Diario y noche',
  },
  {
    id: 2,
    nombre: 'Good Girl',
    marca: 'Carolina Herrera',
    genero: 'mujer',
    familia: 'Floral Oriental',
    notas: 'Jazmín, haba tonka, cacao',
    ml: 80,
    precio: 459,
    destacado: true,
    imagen: img('1595425959632-34f2822322ce'),
    descripcion:
      'Dulce y elegante a la vez. Juega con el contraste entre el jazmín luminoso y un fondo goloso de cacao y haba tonka. Muy femenino y con una presencia que se nota al entrar a un lugar.',
    concentracion: 'Eau de Parfum',
    notasSalida: 'Almendra, café',
    notasCorazon: 'Jazmín sambac, nardo',
    notasFondo: 'Haba tonka, cacao, sándalo',
    duracion: '8 horas',
    estela: 'Intensa',
    ocasion: 'Noche y eventos',
  },
  {
    id: 3,
    nombre: 'Bleu de Chanel EDP',
    marca: 'Chanel',
    genero: 'hombre',
    familia: 'Amaderado Aromático',
    notas: 'Cítricos, incienso, sándalo',
    ml: 100,
    precio: 519,
    destacado: false,
    imagen: img('1585218334450-afcf929da36e'),
    descripcion:
      'Sobrio y muy bien equilibrado. Empieza cítrico y limpio, y termina en maderas suaves con un toque de incienso. Es la opción segura cuando quieres verte formal sin exagerar.',
    concentracion: 'Eau de Parfum',
    notasSalida: 'Toronja, limón, menta',
    notasCorazon: 'Jengibre, nuez moscada, jazmín',
    notasFondo: 'Incienso, sándalo, cedro',
    duracion: '8 a 10 horas',
    estela: 'Moderada',
    ocasion: 'Oficina y noche',
  },
  {
    id: 4,
    nombre: 'Libre EDP',
    marca: 'Yves Saint Laurent',
    genero: 'mujer',
    familia: 'Floral',
    notas: 'Lavanda, azahar, vainilla',
    ml: 90,
    precio: 479,
    precioAntes: 540,
    destacado: false,
    imagen: img('1541643600914-78b084683601'),
    descripcion:
      'La combinación de lavanda fresca con vainilla cálida lo hace distinto a los florales tradicionales. Tiene carácter, sin dejar de ser suave. Rinde muchísimo en la piel.',
    concentracion: 'Eau de Parfum',
    notasSalida: 'Mandarina, grosella negra, lavanda',
    notasCorazon: 'Lavanda, azahar, jazmín',
    notasFondo: 'Vainilla de Madagascar, almizcle, cedro',
    duracion: '7 a 9 horas',
    estela: 'Intensa',
    ocasion: 'Diario y noche',
  },
  {
    id: 5,
    nombre: 'Eros',
    marca: 'Versace',
    genero: 'hombre',
    familia: 'Aromático Fougère',
    notas: 'Menta, manzana verde, vainilla',
    ml: 100,
    precio: 329,
    destacado: false,
    imagen: img('1593487568720-92097fb460fb'),
    descripcion:
      'Fresco, dulce y muy llamativo. La menta y la manzana verde del inicio dan paso a una vainilla intensa. Es un perfume joven, ideal para salir de noche.',
    concentracion: 'Eau de Toilette',
    notasSalida: 'Menta, manzana verde, limón',
    notasCorazon: 'Haba tonka, ambroxan, geranio',
    notasFondo: 'Vainilla, cedro, vetiver, musgo de roble',
    duracion: '6 a 8 horas',
    estela: 'Intensa',
    ocasion: 'Noche y fiestas',
  },
  {
    id: 6,
    nombre: 'La Vie Est Belle',
    marca: 'Lancôme',
    genero: 'mujer',
    familia: 'Floral Gourmand',
    notas: 'Iris, praliné, pachulí',
    ml: 100,
    precio: 445,
    destacado: false,
    imagen: img('1622618991746-fe6004db3a47'),
    descripcion:
      'Uno de los más queridos y regalados. Dulce sin ser empalagoso, con el iris dándole elegancia al praliné. Perfecto si buscas algo cálido y reconocible.',
    concentracion: 'Eau de Parfum',
    notasSalida: 'Grosella negra, pera',
    notasCorazon: 'Iris, jazmín, azahar',
    notasFondo: 'Praliné, vainilla, pachulí, haba tonka',
    duracion: '8 horas',
    estela: 'Intensa',
    ocasion: 'Diario y eventos',
  },
  {
    id: 7,
    nombre: 'Baccarat Rouge 540',
    marca: 'Maison Francis Kurkdjian',
    genero: 'unisex',
    familia: 'Ambarado Floral',
    notas: 'Azafrán, jazmín, ámbar gris',
    ml: 70,
    precio: 1290,
    destacado: true,
    imagen: img('1543422655-ac1c6ca993ed'),
    descripcion:
      'Una joya de nicho, de las fragancias más reconocidas del mundo. Dulce, amaderado y ligeramente mineral. Con dos aplicaciones basta: su rendimiento es enorme y deja rastro por donde pasas.',
    concentracion: 'Eau de Parfum',
    notasSalida: 'Azafrán, jazmín',
    notasCorazon: 'Amberwood, ámbar gris',
    notasFondo: 'Madera de abeto, cedro',
    duracion: '10 a 12 horas',
    estela: 'Muy intensa',
    ocasion: 'Ocasiones especiales',
  },
  {
    id: 8,
    nombre: '1 Million',
    marca: 'Paco Rabanne',
    genero: 'hombre',
    familia: 'Especiado Cuero',
    notas: 'Toronja, canela, cuero',
    ml: 100,
    precio: 359,
    precioAntes: 410,
    destacado: false,
    imagen: img('1615634260167-c8cdede054de'),
    descripcion:
      'Un éxito de ventas desde hace años. Mezcla la frescura de la toronja con canela y cuero, dando un resultado dulce y especiado. Muy potente, poco es suficiente.',
    concentracion: 'Eau de Toilette',
    notasSalida: 'Toronja, menta, mandarina roja',
    notasCorazon: 'Canela, rosa, especias',
    notasFondo: 'Cuero, madera ámbar, pachulí',
    duracion: '7 a 9 horas',
    estela: 'Intensa',
    ocasion: 'Noche',
  },
]

// Imágenes usadas en secciones (hero y editorial). Reemplázalas también.
export const imagenes = {
  hero: img('1610461888750-10bfc601b874'),
  editorial: img('1594125311687-3b1b3eafa9f4'),
}
