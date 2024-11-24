import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VentaService } from '../venta.service';
import { ClienteService } from '../../cliente/cliente.service';
import { Venta } from '../venta.model';
import { Cliente } from '../../cliente/cliente.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-venta-lista',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class VentaListaComponent implements OnInit {
  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  searchTerm: string = '';
  selectedDate: string = '';

  constructor(private ventaService: VentaService, private clienteService: ClienteService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadVentas();
    this.loadClientes();
  }

  loadClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching clientes', error);
      }
    });
  }

  loadVentas() {
    this.ventaService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching ventas', error);
      }
    });
  }

  agregarCategoria() {
    this.router.navigate(['/ventas/formulario/0']);
  }

  get filteredVentas() {
    console.log("date: ",this.formatDate(this.selectedDate))
    return this.ventas.filter(venta => {
      const cliente = this.clientes.find(cliente => cliente.idCliente === venta.idCliente);
      const matchCliente = cliente?.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           cliente?.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           cliente?.ci.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchFecha = this.selectedDate ? venta.fecha === this.formatDate(this.selectedDate) : true;

      return matchCliente && matchFecha;
    });
  }

  verDetalles(venta: Venta): void {
    this.router.navigate([`/ventas/detalle/${venta.idVenta}`]);
  }

  eliminarVenta(id: string): void {
    this.ventaService.deleteVenta(id).subscribe({
      next: () => this.loadVentas(),
      error: (error) => console.error('Error deleting venta', error)
    });
  }

  editarVenta(venta: Venta): void {
    this.router.navigate([`/ventas/formulario/${venta.idVenta}`], { queryParams: { isEdit: true } });
  }

  getCliente(idCliente: number): string {
    const cliente = this.clientes.find(c => c.idCliente === idCliente);
    return cliente ? (cliente.nombre + " " + cliente.apellido) : 'Desconocido';
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  
}
