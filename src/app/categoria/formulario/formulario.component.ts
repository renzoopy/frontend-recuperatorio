import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../categoria.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-categoria-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class CategoriaFormularioComponent implements OnInit {
  categoria: Categoria = { id:"", idCategoria: 0, nombre: ""};
  isEdit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.isEdit = id !== 0;
      if (this.isEdit) {
        this.categoriaService.getCategoria(id.toString()).subscribe({
          next: (data) => {
            this.categoria = data;
            this.cdr.detectChanges();
          },
          error: (error) => console.error('Error fetching categoria', error)
        });
      }
    });
  }

  onSubmit() {
    console.log('Categoria antes de guardar:', this.categoria);
    const categoriaToSave: Categoria = {
      ...this.categoria,
      id: this.categoria.idCategoria.toString(),
      nombre: this.categoria.nombre
    };

    if (this.isEdit) {
      this.categoriaService.updateCategoria(categoriaToSave).subscribe({
        next: () => this.router.navigate(['/categorias/lista']),
        error: (error) => console.error('Error updating categoria', error)
      });
    } else {
      this.categoriaService.getCategorias().subscribe({
        next: (categorias) => {
          const nextidCategoria = categorias.length > 0 ? Math.max(...categorias.map(p => p.idCategoria)) + 1 : 1;
          categoriaToSave.idCategoria = nextidCategoria;
          categoriaToSave.id = nextidCategoria.toString();
          this.categoriaService.addCategoria(categoriaToSave).subscribe({
            next: () => this.router.navigate(['/categorias/lista']),
            error: (error) => console.error('Error adding categoria', error)
          });
        },
        error: (error) => console.error('Error fetching categorias for new id', error)
      });
    }
  }

  cancelar() {
    this.router.navigate(['/categorias/lista']);
  }
}
