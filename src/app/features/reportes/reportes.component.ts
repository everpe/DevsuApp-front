import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../core/services/reporte.service';
import { ClienteService } from '../../core/services/cliente.service';
import { EstadoCuenta } from '../../core/models/reporte.model';
import { Cliente } from '../../core/models/cliente.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  clientes: Cliente[] = [];
  estadoCuenta: EstadoCuenta | null = null;
  
  // Formulario de búsqueda
  clienteId: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';
  
  // Estados
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  constructor(
    private reporteService: ReporteService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.loadClientes();
    this.setDefaultDates();
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data.filter(c => c.estado);
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });
  }

  setDefaultDates(): void {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
    this.fechaInicio = primerDiaMes.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];
  }

  generarReporte(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.estadoCuenta = null;

    this.reporteService.getEstadoCuenta(this.clienteId, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (data) => {
          this.estadoCuenta = data;
          this.loading = false;
          
          if (!this.tieneMovimientos()) {
            this.showInfo('No se encontraron movimientos en el período seleccionado');
          }
        },
        error: (error) => {
          this.loading = false;
          this.showError(error.error?.message || 'Error al generar el reporte');
        }
      });
  }

  descargarPdf(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.reporteService.getEstadoCuentaPdf(this.clienteId, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (response) => {
          this.loading = false;
          
          // Convertir base64 a blob y descargar
          const byteCharacters = atob(response.pdf);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          
          // Crear link de descarga
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = response.filename;
          link.click();
          
          window.URL.revokeObjectURL(url);
          
          this.showSuccess('PDF descargado exitosamente');
        },
        error: (error) => {
          this.loading = false;
          this.showError(error.error?.message || 'Error al descargar el PDF');
        }
      });
  }

  verPdfEnNuevaPestana(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const url = this.reporteService.getUrlDescargaPdf(this.clienteId, this.fechaInicio, this.fechaFin);
    window.open(url, '_blank');
  }

  validarFormulario(): boolean {
    if (this.clienteId === 0) {
      this.showError('Debe seleccionar un cliente');
      return false;
    }
    
    if (!this.fechaInicio || !this.fechaFin) {
      this.showError('Debe seleccionar el rango de fechas');
      return false;
    }
    
    if (new Date(this.fechaInicio) > new Date(this.fechaFin)) {
      this.showError('La fecha de inicio debe ser menor a la fecha fin');
      return false;
    }
    
    return true;
  }

  tieneMovimientos(): boolean {
    if (!this.estadoCuenta) return false;
    
    return this.estadoCuenta.cuentas.some(cuenta => 
      cuenta.movimientos && cuenta.movimientos.length > 0
    );
  }

  limpiar(): void {
    this.clienteId = 0;
    this.estadoCuenta = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.setDefaultDates();
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  showInfo(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 5000);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}