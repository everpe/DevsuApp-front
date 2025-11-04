import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientoService } from '../../core/services/movimiento.service';
import { CuentaService } from '../../core/services/cuenta.service';
import { Movimiento, CreateMovimientoDto } from '../../core/models/movimiento.model';
import { Cuenta } from '../../core/models/cuenta.model';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.css'
})
export class MovimientosComponent implements OnInit {
  movimientos: Movimiento[] = [];
  movimientosFiltrados: Movimiento[] = [];
  cuentas: Cuenta[] = [];
  
  showModal = false;
  errorMessage = '';
  successMessage = '';
  
  movimientoForm: CreateMovimientoDto = {
    tipoMovimiento: 1,
    valor: 0,
    cuentaId: 0
  };

  tiposMovimiento = [
    { value: 1, label: 'Crédito (Depósito)' },
    { value: 2, label: 'Débito (Retiro)' }
  ];

  constructor(
    private movimientoService: MovimientoService,
    private cuentaService: CuentaService
  ) {}

  ngOnInit(): void {
    this.loadMovimientos();
    this.loadCuentas();
  }

  loadMovimientos(): void {
    this.movimientoService.getAll().subscribe({
      next: (data) => {
        this.movimientos = data.sort((a, b) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.movimientosFiltrados = this.movimientos;
      },
      error: (error) => {
        this.showError('Error al cargar movimientos: ' + error.message);
      }
    });
  }

  loadCuentas(): void {
    this.cuentaService.getAll().subscribe({
      next: (data) => {
        this.cuentas = data.filter(c => c.estado);
      },
      error: (error) => {
        console.error('Error al cargar cuentas:', error);
      }
    });
  }

  onSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.movimientosFiltrados = this.movimientos;
      return;
    }

    const term = searchTerm.toLowerCase();
    this.movimientosFiltrados = this.movimientos.filter(movimiento =>
      movimiento.numeroCuenta?.includes(term) ||
      movimiento.tipoMovimiento.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
    this.clearMessages();
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.createMovimiento();
  }

  createMovimiento(): void {
    this.movimientoService.create(this.movimientoForm).subscribe({
      next: () => {
        this.showSuccess('Movimiento registrado exitosamente');
        this.loadMovimientos();
        this.closeModal();
      },
      error: (error) => {
        // Capturar los mensajes específicos de validación del backend
        const errorMsg = error.error?.details || error.error?.message || 'Error al registrar movimiento';
        this.showError(errorMsg);
      }
    });
  }

  deleteMovimiento(id: number): void {
    if (!confirm('¿Está seguro de eliminar este movimiento?')) {
      return;
    }

    this.movimientoService.delete(id).subscribe({
      next: () => {
        this.showSuccess('Movimiento eliminado exitosamente');
        this.loadMovimientos();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Error al eliminar movimiento');
      }
    });
  }

  validateForm(): boolean {
    if (this.movimientoForm.cuentaId === 0) {
      this.showError('Debe seleccionar una cuenta');
      return false;
    }
    if (this.movimientoForm.valor <= 0) {
      this.showError('El valor debe ser mayor a cero');
      return false;
    }
    return true;
  }

  resetForm(): void {
    this.movimientoForm = {
      tipoMovimiento: 1,
      valor: 0,
      cuentaId: 0
    };
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 16000);
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTipoMovimientoClass(tipo: string): string {
    return tipo === 'Credito' ? 'badge-credito' : 'badge-debito';
  }
}