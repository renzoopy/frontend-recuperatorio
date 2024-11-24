import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../producto.service';
import { CategoriaService } from '../../categoria/categoria.service';
import { Producto } from '../producto.model';
import { Categoria } from '../../categoria/categoria.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ProductoListaComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  searchTerm: string = '';

  constructor(private productoService: ProductoService, private categoriaService: CategoriaService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCategorias();
    this.loadProductos();
  }

  loadCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching categorias', error);
      }
    });
  }

  loadProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching productos', error);
      }
    });
  }

  agregarProducto() {
    this.router.navigate(['/productos/formulario/0']);
  }

  getCategoriaNombre(idCategoria: number): string {
    const categoria = this.categorias.find(c => c.idCategoria === idCategoria);
    return categoria ? categoria.nombre : 'Desconocido';
  }

  get filteredProductos() {
    return this.productos.filter(producto => {
      const matchProducto = producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategoria = this.categorias.find(categoria => categoria.idCategoria === producto.idCategoria)?.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchProducto || matchCategoria;
    });
  }

  verDetalles(producto: Producto): void {
    this.router.navigate([`/productos/detalle/${producto.idProducto}`]);
  }

  eliminarProducto(id: string): void {
    this.productoService.deleteProducto(id).subscribe({
      next: () => this.loadProductos(),
      error: (error) => console.error('Error deleting producto', error)
    });
  }

  editarProducto(producto: Producto): void {
    this.router.navigate([`/productos/formulario/${producto.idProducto}`], { queryParams: { isEdit: true } });
  }
}
