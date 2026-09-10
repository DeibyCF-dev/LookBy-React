/**
 * Servicio de pedidos — replica /api/orders/* de Nuxt.
 * Crea PEDIDO + DET_PEDIDO calculando subTotal = precioUnitario * cantidad.
 */
import type { OrderStatus, IOrder } from "@/models";
import { ORDER_STATUSES } from "@/models";
import { getDB, saveDB, uid, now } from "./db";
import { ApiError, delay, requireString, requireNumber } from "./_utils";

function attachRelations(order: IOrder) {
  const db = getDB();
  const usuario = db.users.find((u) => u._id === order.idUsuario) ?? null;
  const local = order.idLocal ? (db.salons.find((s) => s._id === order.idLocal) ?? null) : null;
  const details = db.orderDetails
    .filter((d) => d.idPedido === order._id)
    .map((d) => ({ ...d, product: db.products.find((p) => p._id === d.idProducto) ?? null }));
  return { ...order, usuario, local, details };
}

/** GET /api/orders?myOrders=&localId= — cliente ve sus pedidos, resto todo. */
export async function listOrders(params: { myOrders?: boolean; localId?: string }, userId?: string, userRole?: string) {
  await delay(250);
  const db = getDB();
  let items = [...db.orders];
  if (params.myOrders || userRole === "cliente") {
    items = items.filter((o) => o.idUsuario === userId);
  }
  if (params.localId) {
    items = items.filter((o) => o.idLocal === params.localId);
  }
  return items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map(attachRelations);
}

/** POST /api/orders — requiere items[]. Valida producto y calcula subTotales. */
export async function createOrder(
  input: { idLocal?: string; items: Array<{ idProducto: string; cantidad: number }>; direccionEntrega?: string; notas?: string },
  userId: string,
) {
  await delay(300);
  const db = getDB();
  if (!input.items || input.items.length === 0) {
    throw new ApiError("El pedido debe incluir al menos un ítem.");
  }

  const details = input.items.map((it) => {
    const product = db.products.find((p) => p._id === it.idProducto);
    if (!product) throw new ApiError(`Producto no encontrado: ${it.idProducto}`, 404);
    const cantidad = requireNumber(it.cantidad, "cantidad", 1);
    return {
      _id: uid("od"),
      idPedido: "",
      idProducto: product._id,
      cantidad,
      precioUnitario: product.precio,
      subTotal: product.precio * cantidad,
    };
  });

  const order: IOrder = {
    _id: uid("PED"),
    idUsuario: userId,
    idLocal: input.idLocal ?? null,
    fecha: now(),
    estado: "Pendiente",
    montoTotal: details.reduce((s, d) => s + d.subTotal, 0),
    direccionEntrega: input.direccionEntrega ?? "",
    notas: input.notas ?? "",
  };
  db.orders.push(order);
  for (const d of details) {
    d.idPedido = order._id;
    db.orderDetails.push(d);
  }
  saveDB();
  return { success: true, order: attachRelations(order) };
}

/** PUT /api/orders/:id/status — actualiza el estado del pedido. */
export async function updateOrderStatus(id: string, estado: OrderStatus) {
  await delay(200);
  const db = getDB();
  if (!ORDER_STATUSES.includes(estado)) {
    throw new ApiError("Estado de pedido inválido.");
  }
  const order = db.orders.find((o) => o._id === id);
  if (!order) throw new ApiError("Pedido no encontrado.", 404);
  order.estado = estado;
  saveDB();
  return { success: true, order: attachRelations(order) };
}