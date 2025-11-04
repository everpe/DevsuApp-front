import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente, CreateClienteDto, UpdateClienteDto } from '../../core/models/cliente.model';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  
  showModal = false;
  isEditMode = false;
  errorMessage = '';
  successMessage = '';
  
  clienteForm: CreateClienteDto = {
    nombre: '',
    genero: '',
    edad: 0,
    identificacion: '',
    direccion: '',
    telefono: '',
    contrasena: '',
    estado: true
  };

  clienteIdToEdit?: number;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
      },
      error: (error) => {
        this.showError('Error al cargar clientes: ' + error.message);
      }
    });
  }

  onSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    const term = searchTerm.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(term) ||
      cliente.identificacion.includes(term) ||
      cliente.telefono?.includes(term)
    );
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(cliente: Cliente): void {
    this.isEditMode = true;
    this.clienteIdToEdit = cliente.clienteId;
    this.clienteForm = {
      nombre: cliente.nombre,
      genero: cliente.genero,
      edad: cliente.edad,
      identificacion: cliente.identificacion,
      direccion: cliente.direccion || '',
      telefono: cliente.telefono || '',
      contrasena: '',
      estado: cliente.estado
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

    if (this.isEditMode && this.clienteIdToEdit) {
      this.updateCliente();
    } else {
      this.createCliente();
    }
  }

  createCliente(): void {
    this.clienteService.create(this.clienteForm).subscribe({
      next: () => {
        this.showSuccess('Cliente creado exitosamente');
        this.loadClientes();
        this.closeModal();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Error al crear cliente');
      }
    });
  }

  updateCliente(): void {
    if (!this.clienteIdToEdit) return;

    const updateDto: UpdateClienteDto = {
      nombre: this.clienteForm.nombre,
      genero: this.clienteForm.genero,
      edad: this.clienteForm.edad,
      direccion: this.clienteForm.direccion,
      telefono: this.clienteForm.telefono,
      estado: this.clienteForm.estado
    };

    if (this.clienteForm.contrasena) {
      updateDto.contrasena = this.clienteForm.contrasena;
    }

    this.clienteService.update(this.clienteIdToEdit, updateDto).subscribe({
      next: () => {
        this.showSuccess('Cliente actualizado exitosamente');
        this.loadClientes();
        this.closeModal();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Error al actualizar cliente');
      }
    });
  }

  deleteCliente(id: number): void {
    if (!confirm('¿Está seguro de eliminar este cliente?')) {
      return;
    }

    this.clienteService.delete(id).subscribe({
      next: () => {
        this.showSuccess('Cliente eliminado exitosamente');
        this.loadClientes();
      },
      error: (error) => {
        this.showError(error.error?.message || 'Error al eliminar cliente');
      }
    });
  }

  validateForm(): boolean {
    if (!this.clienteForm.nombre.trim()) {
      this.showError('El nombre es obligatorio');
      return false;
    }
    if (!this.clienteForm.identificacion.trim()) {
      this.showError('La identificación es obligatoria');
      return false;
    }
    if (this.clienteForm.edad < 18) {
      this.showError('La edad debe ser mayor a 18 años');
      return false;
    }
    if (!this.isEditMode && !this.clienteForm.contrasena) {
      this.showError('La contraseña es obligatoria');
      return false;
    }
    return true;
  }

  resetForm(): void {
    this.clienteForm = {
      nombre: '',
      genero: '',
      edad: 0,
      identificacion: '',
      direccion: '',
      telefono: '',
      contrasena: '',
      estado: true
    };
    this.clienteIdToEdit = undefined;
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
}