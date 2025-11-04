export interface EstadoCuenta {
  fechaInicio: string;
  fechaFin: string;
  cliente: ClienteReporte;
  cuentas: CuentaReporte[];
  totalCreditos: number;
  totalDebitos: number;
}

export interface ClienteReporte {
  clienteId: number;
  nombre: string;
  identificacion: string;
}

export interface CuentaReporte {
  numeroCuenta: string;
  tipoCuenta: string;
  saldoInicial: number;
  saldoActual: number;
  movimientos: MovimientoReporte[];
}

export interface MovimientoReporte {
  fecha: string;
  tipoMovimiento: string;
  valor: number;
  saldo: number;
}

export interface PdfResponse {
  pdf: string;
  filename: string;
}