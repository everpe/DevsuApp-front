import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { EstadoCuenta, PdfResponse } from '../models/reporte.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private endpoint = 'reportes';

  constructor(private apiService: ApiService) {}

  getEstadoCuenta(clienteId: number, fechaInicio: string, fechaFin: string): Observable<EstadoCuenta> {
    return this.apiService.get<EstadoCuenta>(
      `${this.endpoint}?clienteId=${clienteId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }

  getEstadoCuentaPdf(clienteId: number, fechaInicio: string, fechaFin: string): Observable<PdfResponse> {
    return this.apiService.get<PdfResponse>(
      `${this.endpoint}/pdf?clienteId=${clienteId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }

  getUrlDescargaPdf(clienteId: number, fechaInicio: string, fechaFin: string): string {
    return `http://localhost:5000/api/${this.endpoint}/pdf/download?clienteId=${clienteId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
  }
}