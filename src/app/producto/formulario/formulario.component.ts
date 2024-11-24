import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../producto.service';
import { Producto } from '../producto.model';
import { CategoriaService } from '../../categoria/categoria.service';
import { Categoria } from '../../categoria/categoria.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-producto-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class ProductoFormularioComponent implements OnInit {
  producto: Producto = { id:"", idProducto: 0, nombre: "", idCategoria:0, precio:0 };
  categorias: Categoria[] = [];
  isEdit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategorias();

    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.isEdit = id !== 0;
      if (this.isEdit) {
        this.productoService.getProducto(id.toString()).subscribe({
          next: (data) => {
            this.producto = data;
            this.cdr.detectChanges();
          },
          error: (error) => console.error('Error fetching producto', error)
        });
      }
    });
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

  onSubmit() {
    this.producto.idCategoria = +this.producto.idCategoria;
    const productoToSave: Producto = {
      ...this.producto,
      id: this.producto.idProducto.toString(),
    };
    if (this.isEdit) {
      this.productoService.updateProducto(productoToSave).subscribe({
        next: () => this.router.navigate(['/productos/lista']),
        error: (error) => console.error('Error updating producto', error)
      });
    } else {
      this.productoService.getProductos().subscribe({
        next: (productos) => {
          const nextidProducto = productos.length > 0 ? Math.max(...productos.map(p => p.idProducto)) + 1 : 1;
          productoToSave.idProducto = nextidProducto;
          productoToSave.id = nextidProducto.toString();
          this.productoService.addProducto(productoToSave).subscribe({
            next: () => this.router.navigate(['/productos/lista']),
            error: (error) => console.error('Error adding producto', error)
          });
        },
        error: (error) => console.error('Error fetching productos for new id', error)
      });
    }
  }

  cancelar() {
    this.router.navigate(['/productos/lista']);
  }
}
