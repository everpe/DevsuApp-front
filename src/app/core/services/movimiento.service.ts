import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Movimiento, CreateMovimientoDto } from '../models/movimiento.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private endpoint = 'movimientos';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<Movimiento[]> {
    return this.apiService.get<Movimiento[]>(this.endpoint);
  }

  getById(id: number): Observable<Movimiento> {
    return this.apiService.get<Movimiento>(`${this.endpoint}/${id}`);
  }

  getByCuentaId(cuentaId: number): Observable<Movimiento[]> {
    return this.apiService.get<Movimiento[]>(`${this.endpoint}/cuenta/${cuentaId}`);
  }

  create(movimiento: CreateMovimientoDto): Observable<Movimiento> {
    return this.apiService.post<Movimiento>(this.endpoint, movimiento);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}