import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cliente, CreateClienteDto, UpdateClienteDto } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private endpoint = 'clientes';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(this.endpoint);
  }

  getById(id: number): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/${id}`);
  }

  create(cliente: CreateClienteDto): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.endpoint, cliente);
  }

  update(id: number, cliente: UpdateClienteDto): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}