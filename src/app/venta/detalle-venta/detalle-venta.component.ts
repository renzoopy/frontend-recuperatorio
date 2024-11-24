import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../venta.service';
import { ProductoService } from '../../producto/producto.service';
import { Producto } from '../../producto/producto.model';
import { Venta } from '../venta.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-venta',
  standalone: true,
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css'],
  imports: [CommonModule]
})
export class DetalleVentaComponent implements OnInit {
  venta!: Venta;
  productos: any[] = [];
  productosCatalogo: Producto[] = [];

  constructor(private route: ActivatedRoute, private ventaService: VentaService, private productoService: ProductoService, public router: Router) {}

  ngOnInit() {
    const idVenta = this.route.snapshot.paramMap.get('idVenta');
    this.loadVenta(idVenta!);
    this.loadProductos();
  }

  loadVenta(idVenta: string) {
    this.ventaService.getVenta(idVenta).subscribe({
      next: (data) => {
        this.venta = data;
        this.productos = this.venta.detalleVenta;
      },
      error: (error) => {
        console.error('Error fetching venta details', error);
      }
    });
  }

  loadProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productosCatalogo = data;
      },
      error: (error) => {
        console.error('Error fetching productos', error);
      }
    });
  }

  getNombreProducto(idProducto: number): string {
    const producto = this.productosCatalogo.find(p => p.idProducto === idProducto);
    return producto ? producto.nombre : 'Desconocido';
  }
}
