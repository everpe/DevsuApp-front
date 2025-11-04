export interface Cuenta {
  id: number;
  numeroCuenta: string;
  tipoCuenta: string;
  saldoInicial: number;
  saldoActual: number;
  estado: boolean;
  clienteId: number;
  nombreCliente?: string;
}

export interface CreateCuentaDto {
  numeroCuenta: string;
  tipoCuenta: number; // 1 = Ahorro, 2 = Corriente
  saldoInicial: number;
  estado: boolean;
  clienteId: number;
}

export interface UpdateCuentaDto {
  numeroCuenta?: string;
  tipoCuenta?: number;
  estado?: boolean;
}