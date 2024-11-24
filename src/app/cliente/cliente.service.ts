import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Cliente } from './cliente.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente);
  }

  deleteCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getClientePorCi(ci: string): Observable<Cliente | null> {
    return this.http.get<Cliente[]>(`${this.apiUrl}?ci=${ci}`).pipe(
      map(clientes => clientes.length > 0 ? clientes[0] : null)
    );
  }

  getClientePorNombre(firstName: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}?firstName=${firstName}`);
  }

  getClientePorApellido(lastName: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}?lastName=${lastName}`);
  }
}