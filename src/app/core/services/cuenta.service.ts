import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cuenta, CreateCuentaDto, UpdateCuentaDto } from '../models/cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private endpoint = 'cuentas';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<Cuenta[]> {
    return this.apiService.get<Cuenta[]>(this.endpoint);
  }

  getById(id: number): Observable<Cuenta> {
    return this.apiService.get<Cuenta>(`${this.endpoint}/${id}`);
  }

  getByClienteId(clienteId: number): Observable<Cuenta[]> {
    return this.apiService.get<Cuenta[]>(`${this.endpoint}/cliente/${clienteId}`);
  }

  create(cuenta: CreateCuentaDto): Observable<Cuenta> {
    return this.apiService.post<Cuenta>(this.endpoint, cuenta);
  }

  update(id: number, cuenta: UpdateCuentaDto): Observable<Cuenta> {
    return this.apiService.put<Cuenta>(`${this.endpoint}/${id}`, cuenta);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}