import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../producto/producto.service';
import { Producto } from '../../producto/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../cliente/cliente.service';
import { VentaService } from '../venta.service';
import { CategoriaService } from '../../categoria/categoria.service';
import { Categoria } from '../../categoria/categoria.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venta-principal',
  standalone: true,
  templateUrl: './venta-principal.component.html',
  styleUrls: ['./venta-principal.component.css'],
  imports: [FormsModule,CommonModule]
})
export class VentaPrincipalComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  carrito: { [idProducto: number]: { cantidad: number, precio: number } } = {};
  searchTerm: string = ''; 
  mostrarCarrito: boolean = false;
  ci: string = '';
  nombre: string = '';
  apellido: string = '';
  clienteExistente: boolean = false;
  mostrarFormularioCliente: boolean = false; 

  constructor(private productoService: ProductoService, private categoriaService: CategoriaService, private clienteService: ClienteService, private ventaService: VentaService, public router: Router) {}

  ngOnInit() {
    this.loadProductos();
    this.loadCategorias();
  }

  loadProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (error) => console.error('Error fetching productos', error)
    });
  }

  loadCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (error) => console.error('Error fetching categorias', error)
    });
  }

  agregarProducto(producto: Producto) {
    if (!this.carrito[producto.idProducto]) {
      this.carrito[producto.idProducto] = { cantidad: 1, precio: producto.precio };
    } else {
      this.carrito[producto.idProducto].cantidad += 1;
    }
  }

  cambiarCantidad(idProducto: number, cantidad: number) {
    if (this.carrito[idProducto]) {
      this.carrito[idProducto].cantidad += cantidad;
      if (this.carrito[idProducto].cantidad <= 0) {
        delete this.carrito[idProducto];
      }
    }
  }

  getCantidad(idProducto: number): number {
    return this.carrito[idProducto]?.cantidad || 0;
  }

  get filteredProductos(): Producto[] {
    if (!this.searchTerm) {
      return this.productos;
    }
    return this.productos.filter(producto => {
      const matchNombre = producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const categoria = this.categorias.find(cat => cat.idCategoria === producto.idCategoria);
      const matchCategoria = categoria ? categoria.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) : false;

      return matchNombre || matchCategoria;
    });
  }

  /// CARRITO
  verCarrito() {
    if (Object.keys(this.carrito).length === 0) {
      alert("El carrito está vacío");
    } else {
      this.mostrarCarrito = true;
    }
  }

  ocultarCarrito() {
    if (Object.keys(this.carrito).length === 0) {
      alert("El carrito está vacío");
    } else {
      this.mostrarCarrito = false;
    }
  }
  
  get carritoArray() {
    return Object.entries(this.carrito).map(([idProducto, datos]) => {
      const producto = this.productos.find(p => p.idProducto === +idProducto);
      return {
        idProducto: +idProducto,
        nombre: producto?.nombre || 'Producto desconocido',
        precio: datos.precio,
        cantidad: datos.cantidad
      };
    });
  }
  
  cambiarCantidadCarrito(idProducto: number, cantidad: number) {
    if (this.carrito[idProducto]) {
      this.carrito[idProducto].cantidad += cantidad;
      if (this.carrito[idProducto].cantidad <= 0) {
        const confirmacion = confirm(`¿Deseas eliminar ${this.carrito[idProducto].cantidad} del carrito?`);
        if (confirmacion) {
          delete this.carrito[idProducto];
        } else {
          this.carrito[idProducto].cantidad = 1;
        }
      }
    }
  }
  
  calcularTotal(): number {
    return Object.values(this.carrito).reduce((total, item) => {
      return total + (item.cantidad * item.precio);
    }, 0);
  }


  //// FINALIZAR PEDIDO
  confirmarPedido() {
    if (Object.keys(this.carrito).length === 0) {
      alert("El carrito está vacío");
      return;
    }
    
    this.mostrarCarrito = false;
    this.mostrarFormularioCliente = true;
  }

  verificarClientePorCi() {
    if (this.ci.length === 0) {
      this.clienteExistente = false;
      return;
    }

    this.clienteService.getClientePorCi(this.ci).subscribe(cliente => {
      if (cliente) {
        this.clienteExistente = true;
        this.nombre = cliente.nombre;
        this.apellido = cliente.apellido;
      } else {
        this.clienteExistente = false;
      }
    });
  }

  finalizarPedido() {
    if (!this.ci || !this.nombre || !this.apellido) {
      alert("Por favor, complete todos los campos.");
      return;
    }
  
    console.log('Cliente antes de guardar:', { ci: this.ci, nombre: this.nombre, apellido: this.apellido });
  
    const clienteToSave = {
      ci: this.ci,
      nombre: this.nombre,
      apellido: this.apellido
    };
  
    this.clienteService.getClientes().subscribe({
      next: (client_list) => {
        const clientCount = client_list.length;
        const newIdCliente = clientCount + 1;
  
        this.clienteService.addCliente({
          ...clienteToSave,
          idCliente: newIdCliente,
          id: newIdCliente.toString()
        }).subscribe({
          next: (newCliente) => {
            this.crearVenta(newCliente.idCliente);
          },
          error: (error) => {
            console.error('Error al agregar cliente', error);
            alert("Hubo un error al agregar al cliente.");
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener clientes', error);
        alert("Hubo un error al verificar el cliente.");
      }
    });
  }
  
  crearVenta(idCliente: number) {
  const formattedDate = this.formatFecha(new Date());
  
  console.log('Venta antes de guardar:', {
    idCliente,
    total: this.calcularTotal(),
    detalleVenta: Object.entries(this.carrito).map(([idProducto, item]) => ({
      idProducto: +idProducto,
      cantidad: item.cantidad,
      precio: item.precio
    }))
  });

  this.ventaService.getVentas().subscribe({
    next: (ventas) => {
      const ventasCount = ventas.length;
      const newIdVenta = ventasCount + 1;

      const ventaToSave = {
        id: newIdVenta.toString(),
        idVenta: newIdVenta,
        fecha: formattedDate,
        idCliente: idCliente,
        total: this.calcularTotal(),
        detalleVenta: Object.entries(this.carrito).map(([idProducto, item]) => ({
          idDetalleVenta: Date.now(),
          idProducto: +idProducto,
          cantidad: item.cantidad,
          precio: item.precio
        }))
      };

      this.ventaService.addVenta(ventaToSave).subscribe({
        next: () => {
          alert("Pedido confirmado con éxito!");
          this.carrito = {};
          this.mostrarFormularioCliente = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error creando la venta', error);
          alert("Hubo un error al confirmar el pedido.");
        }
      });
    },
    error: (error) => {
      console.error('Error obteniendo las ventas', error);
      alert("Hubo un error al obtener las ventas existentes.");
    }
  });
}

  formatFecha(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
}
