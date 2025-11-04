export interface Movimiento {
  id: number;
  fecha: string;
  tipoMovimiento: string;
  valor: number;
  saldo: number;
  cuentaId: number;
  numeroCuenta?: string;
}

export interface CreateMovimientoDto {
  tipoMovimiento: number; // 1 = Crédito, 2 = Débito
  valor: number;
  cuentaId: number;
}