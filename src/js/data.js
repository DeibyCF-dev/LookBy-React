/**
 * LookBy - Datos Iniciales y Constantes
 */

export const DEMO_ACCOUNTS = [
  { role: "admin", label: "Superadmin", email: "admin@lookby.com", password: "admin123" },
  { role: "profesional", label: "Negocio", email: "profesional@lookby.com", password: "prof123" },
  { role: "proveedor", label: "Proveedor", email: "proveedor@lookby.com", password: "prov123" },
  { role: "cliente", label: "Cliente", email: "sofia@email.cl", password: "cliente123" },
];

export const CATEGORIES = [
  {
    id: "salon",
    label: "Salón de Belleza",
    img: "https://images.unsplash.com/photo-1764475501545-d5cc9719af1a?w=500&h=360&fit=crop"
  },
  {
    id: "barberia",
    label: "Barbería Premium",
    img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=360&fit=crop"
  },
  {
    id: "spa",
    label: "Spa & Bienestar",
    img: "https://images.unsplash.com/photo-1770819372114-139fdf280a13?w=500&h=360&fit=crop"
  },
  {
    id: "makeup",
    label: "Estudio Makeup",
    img: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=500&h=360&fit=crop"
  },
  {
    id: "depilacion",
    label: "Depilación & Skin",
    img: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=500&h=360&fit=crop"
  },
  {
    id: "corporal",
    label: "Cuidado Corporal",
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=360&fit=crop"
  }
];

export const SALONS = [
  {
    idLocal: "loc-01",
    nombreLocal: "Atelier Doré",
    tipoCatalogo: "Salón de Belleza",
    horario: "09:00 – 20:00",
    calificacionPromedio: 4.9,
    reviews: 312,
    address: "Av. Providencia 2350, Santiago",
    img: "https://images.unsplash.com/photo-1764475501545-d5cc9719af1a?w=640&h=420&fit=crop",
    badge: "Top Local",
    servicios: ["Colorimetría", "Corte", "Keratina", "Tratamiento"],
    precioMin: 18000
  },
  {
    idLocal: "loc-02",
    nombreLocal: "Noir & Or Barbería",
    tipoCatalogo: "Barbería Premium",
    horario: "10:00 – 21:00",
    calificacionPromedio: 4.8,
    reviews: 198,
    address: "Los Leones 175, Providencia",
    img: "https://images.unsplash.com/photo-1621645582931-d1d3e6564943?w=640&h=420&fit=crop",
    badge: null,
    servicios: ["Corte Clásico", "Afeitado", "Barba", "Tratamiento capilar"],
    precioMin: 12000
  },
  {
    idLocal: "loc-03",
    nombreLocal: "Velvet Spa & Wellness",
    tipoCatalogo: "Spa & Bienestar",
    horario: "08:00 – 22:00",
    calificacionPromedio: 5.0,
    reviews: 87,
    address: "El Golf 40, Las Condes",
    img: "https://images.unsplash.com/photo-1784704161960-26770b684595?w=640&h=420&fit=crop",
    badge: "Nuevo",
    servicios: ["Masaje relajante", "Sauna", "Facial", "Aromaterapia"],
    precioMin: 35000
  },
  {
    idLocal: "loc-04",
    nombreLocal: "Studio Makeover Pro",
    tipoCatalogo: "Estudio Makeup",
    horario: "10:00 – 19:00",
    calificacionPromedio: 4.7,
    reviews: 142,
    address: "Loreto 150, Ñuñoa",
    img: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=640&h=420&fit=crop",
    badge: null,
    servicios: ["Maquillaje social", "Novia", "Airbrush", "Cejas"],
    precioMin: 25000
  },
  {
    idLocal: "loc-05",
    nombreLocal: "Barbería Clásica 1920",
    tipoCatalogo: "Barbería Premium",
    horario: "09:00 – 19:00",
    calificacionPromedio: 4.6,
    reviews: 231,
    address: "Merced 82, Santiago Centro",
    img: "https://images.unsplash.com/photo-1536520002442-39764a41e987?w=640&h=420&fit=crop",
    badge: null,
    servicios: ["Corte Retro", "Afeitado con toalla caliente", "Perfilado"],
    precioMin: 14000
  },
  {
    idLocal: "loc-06",
    nombreLocal: "Lumière Skin Studio",
    tipoCatalogo: "Depilación & Skin",
    horario: "09:30 – 20:30",
    calificacionPromedio: 4.9,
    reviews: 405,
    address: "Av. Vitacura 3600, Vitacura",
    img: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=640&h=420&fit=crop",
    badge: "Top Local",
    servicios: ["Limpieza profunda", "Peeling", "Depilación Láser"],
    precioMin: 29000
  }
];

export const PRODUCTS = [
  {
    idProducto: "p-01",
    nombre: "Sérum Lumière Doré 30ml",
    descripcion: "Vitamina C + Niacinamida",
    precio: 89900,
    imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=400&h=400&fit=crop",
    categoria: "Tratamiento Facial"
  },
  {
    idProducto: "p-02",
    nombre: "Kit Renovación Profunda",
    descripcion: "Keratina + Óleo reparador",
    precio: 124500,
    imagen: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=400&h=400&fit=crop",
    categoria: "Capilar"
  },
  {
    idProducto: "p-03",
    nombre: "Mascarilla Oro 24K 250ml",
    descripcion: "Hidratación intensiva",
    precio: 54900,
    imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop",
    categoria: "Tratamiento Facial"
  },
  {
    idProducto: "p-04",
    nombre: "Óleo Reparador Premium",
    descripcion: "Argan + Aceite de Rosa",
    precio: 39900,
    imagen: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop",
    categoria: "Capilar"
  },
  {
    idProducto: "p-05",
    nombre: "Paleta Editorial Nude",
    descripcion: "12 tonos mate y satinado",
    precio: 67800,
    imagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
    categoria: "Maquillaje"
  },
  {
    idProducto: "p-06",
    nombre: "Contorno Perfeccionador",
    descripcion: "Fórmula buildable",
    precio: 45200,
    imagen: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400&h=400&fit=crop",
    categoria: "Maquillaje"
  },
  {
    idProducto: "p-07",
    nombre: "Shampoo Hidratación 500ml",
    descripcion: "Sin sulfatos · pH balanceado",
    precio: 28900,
    imagen: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop",
    categoria: "Capilar"
  },
  {
    idProducto: "p-08",
    nombre: "Crema Regenerativa Noche",
    descripcion: "Retinol + Péptidos",
    precio: 76500,
    imagen: "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=400&h=400&fit=crop",
    categoria: "Tratamiento Facial"
  }
];

export const INITIAL_CITAS = [
  { id: "CIT-001", idLocal: "loc-01", nombreLocal: "Atelier Doré", servicio: "Colorimetría Completa", fecha: "05 sep 2026", hora: "10:30", profesional: "Valentina Reyes", estado: "Confirmada", precio: 38000 },
  { id: "CIT-002", idLocal: "loc-03", nombreLocal: "Velvet Spa & Wellness", servicio: "Masaje Relajante 60min", fecha: "12 sep 2026", hora: "14:00", profesional: "Camila Muñoz", estado: "Pendiente", precio: 45000 },
  { id: "CIT-003", idLocal: "loc-04", nombreLocal: "Studio Makeover Pro", servicio: "Maquillaje Social", fecha: "18 sep 2026", hora: "11:00", profesional: "Andrea Silva", estado: "Confirmada", precio: 28000 }
];

export const INITIAL_PEDIDOS = [
  { idPedido: "PED-20481", fecha: "28 ago 2026", estado: "Completado", montoTotal: 144800, detalles: [{ nombre: "Sérum Lumière Doré", cantidad: 1, precioUnitario: 89900, subTotal: 89900 }, { nombre: "Mascarilla Oro 24K", cantidad: 1, precioUnitario: 54900, subTotal: 54900 }] },
  { idPedido: "PED-20365", fecha: "14 ago 2026", estado: "En Preparación", montoTotal: 124500, detalles: [{ nombre: "Kit Renovación Profunda", cantidad: 1, precioUnitario: 124500, subTotal: 124500 }] },
  { idPedido: "PED-20201", fecha: "02 ago 2026", estado: "Pendiente", montoTotal: 107700, detalles: [{ nombre: "Paleta Editorial Nude", cantidad: 1, precioUnitario: 67800, subTotal: 67800 }, { nombre: "Óleo Reparador Premium", cantidad: 1, precioUnitario: 39900, subTotal: 39900 }] }
];

export const INITIAL_REVIEWS = [
  { idCalificacion: "cal-01", idLocal: "loc-01", nombreLocal: "Atelier Doré", comentario: "Excelente atención, quedé encantada con la colorimetría. Valentina es increíble.", puntuacion: 5, fecha: "25 ago 2026" },
  { idCalificacion: "cal-02", idLocal: "loc-02", nombreLocal: "Noir & Or Barbería", comentario: "El corte quedó perfecto. Ambiente muy premium.", puntuacion: 4, fecha: "10 ago 2026" }
];
