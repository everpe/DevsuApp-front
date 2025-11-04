import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentaService } from '../../core/services/cuenta.service';
import { ClienteService } from '../../core/services/cliente.service';
import { Cuenta, CreateCuentaDto, UpdateCuentaDto } from '../../core/models/cuenta.model';
import { Cliente } from '../../core/models/cliente.model';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent],
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.css'
})
export class CuentasComponent implements OnInit {
  cuentas: Cuenta[] = [];
  cuentasFiltradas: Cuenta[] = [];
  clientes: Cliente[] = [];
  
  showModal = false;
  isEditMode = false;
  errorMessage = '';
  successMessage = '';
  
  cuentaForm: CreateCuentaDto = {
    numeroCuenta: '',
    tipoCuenta: 1,
    saldoInicial: 0,
    estado: true,
    clienteId: 0
  };

  cuentaIdToEdit?: number;

  tiposCuenta = [
    { value: Number(1), label: 'Ahorro' },
    { value: Number(2), label: 'Corriente' }
  ];

  constructor(
    private cuentaService: CuentaService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.loadCuentas();
    this.loadClientes();
  }

  loadCuentas(): void {
    this.cuentaService.getAll().subscribe({
      next: (data) => {
        this.cuentas = data;
        this.cuentasFiltradas = data;
      },
      error: (error) => {
        this.showError('Error al cargar cuentas: ' + error.message);
      }
    });
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

  onSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.cuentasFiltradas = this.cuentas;
      return;
    }

    const term = searchTerm.toLowerCase();
    this.cuentasFiltradas = this.cuentas.filter(cuenta =>
      cuenta.numeroCuenta.includes(term) ||
      cuenta.tipoCuenta.toLowerCase().includes(term) ||
      cuenta.nombreCliente?.toLowerCase().includes(term)
    );
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(cuenta: Cuenta): void {
    this.isEditMode = true;
    this.cuentaIdToEdit = cuenta.id;
    this.cuentaForm = {
      numeroCuenta: cuenta.numeroCuenta,
      tipoCuenta: cuenta.tipoCuenta === 'Ahorro' ? 1 : 2,
      saldoInicial: cuenta.saldoInicial,
      estado: cuenta.estado,
      clienteId: cuenta.clienteId
    };
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

    if (this.isEditMode && this.cuentaIdToEdit) {
      this.updateCuenta();
    } else {
      this.createCuenta();
    }
  }

  createCuenta(): void {
    this.cuentaService.create(this.cuentaForm).subscribe({
      next: () => {
        this.showSuccess('Cuenta creada exitosamente');
        this.loadCuentas();
        this.closeModal();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Error al crear cuenta');
      }
    });
  }

  updateCuenta(): void {
    if (!this.cuentaIdToEdit) return;

    const updateDto: UpdateCuentaDto = {
      numeroCuenta: this.cuentaForm.numeroCuenta,
      tipoCuenta: this.cuentaForm.tipoCuenta,
      estado: this.cuentaForm.estado
    };

    this.cuentaService.update(this.cuentaIdToEdit, updateDto).subscribe({
      next: () => {
        this.showSuccess('Cuenta actualizada exitosamente');
        this.loadCuentas();
        this.closeModal();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Error al actualizar cuenta');
      }
    });
  }

  deleteCuenta(id: number): void {
    if (!confirm('¿Está seguro de eliminar esta cuenta?')) {
      return;
    }

    this.cuentaService.delete(id).subscribe({
      next: () => {
        this.showSuccess('Cuenta eliminada exitosamente');
        this.loadCuentas();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Error al eliminar cuenta');
      }
    });
  }

  validateForm(): boolean {
    if (!this.cuentaForm.numeroCuenta.trim()) {
      this.showError('El número de cuenta es obligatorio');
      return false;
    }
    if (this.cuentaForm.clienteId === 0) {
      this.showError('Debe seleccionar un cliente');
      return false;
    }
    if (!this.isEditMode && this.cuentaForm.saldoInicial < 0) {
      this.showError('El saldo inicial no puede ser negativo');
      return false;
    }
    return true;
  }

  resetForm(): void {
    this.cuentaForm = {
      numeroCuenta: '',
      tipoCuenta: 1,
      saldoInicial: 0,
      estado: true,
      clienteId: 0
    };
    this.cuentaIdToEdit = undefined;
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  getTipoCuentaLabel(tipo: string): string {
    return tipo === 'Ahorro' ? 'Ahorro' : 'Corriente';
  }

  getType(value: any): string {
  return typeof value;
}
}