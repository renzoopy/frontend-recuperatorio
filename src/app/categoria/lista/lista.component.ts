import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../categoria.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-categoria-lista',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class CategoriaListaComponent implements OnInit {
  categorias: Categoria[] = [];
  searchTerm: string = '';

  constructor(private categoriaService: CategoriaService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCategorias();
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

  agregarCategoria() {
    this.router.navigate(['/categorias/formulario/0']);
  }

  get filteredCategorias() {
    return this.categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  verDetalles(categoria: Categoria): void {
    this.router.navigate([`/categorias/detalle/${categoria.idCategoria}`]);
  }

  eliminarCategoria(id: string): void {
    this.categoriaService.deleteCategoria(id).subscribe({
      next: () => this.loadCategorias(),
      error: (error) => console.error('Error deleting categoria', error)
    });
  }

  editarCategoria(categoria: Categoria): void {
    this.router.navigate([`/categorias/formulario/${categoria.idCategoria}`], { queryParams: { isEdit: true } });
  }
}
