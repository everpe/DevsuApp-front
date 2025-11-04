export interface Cliente {
  clienteId: number;
  nombre: string;
  genero: string;
  edad: number;
  identificacion: string;
  direccion?: string;
  telefono?: string;
  estado: boolean;
}

export interface CreateClienteDto {
  nombre: string;
  genero: string;
  edad: number;
  identificacion: string;
  direccion?: string;
  telefono?: string;
  contrasena: string;
  estado: boolean;
}

export interface UpdateClienteDto {
  nombre?: string;
  genero?: string;
  edad?: number;
  direccion?: string;
  telefono?: string;
  contrasena?: string;
  estado?: boolean;
}