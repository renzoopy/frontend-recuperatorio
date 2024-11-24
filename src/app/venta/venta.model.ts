export interface DetalleVenta {
  idDetalleVenta: number;
  idProducto: number;
  cantidad: number;
  precio: number;
}

export interface Venta {
  id: string;
  idVenta: number;
  fecha: string;
  idCliente: number;
  total: number;
  detalleVenta: DetalleVenta[];
}
