import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MovimientosComponent } from './movimientos.component';
import { MovimientoService } from '../../core/services/movimiento.service';
import { CuentaService } from '../../core/services/cuenta.service';
import { Movimiento } from '../../core/models/movimiento.model';
import { Cuenta } from '../../core/models/cuenta.model';

describe('MovimientosComponent', () => {
  let component: MovimientosComponent;
  let fixture: ComponentFixture<MovimientosComponent>;
  let movimientoService: jest.Mocked<MovimientoService>;
  let cuentaService: jest.Mocked<CuentaService>;

  const mockMovimientos: Movimiento[] = [
    {
      id: 1,
      fecha: '2025-01-01T10:00:00',
      tipoMovimiento: 'Credito',
      valor: 600,
      saldo: 2600,
      cuentaId: 1,
      numeroCuenta: '478758'
    }
  ];

  const mockCuentas: Cuenta[] = [
    {
      id: 1,
      numeroCuenta: '478758',
      tipoCuenta: 'Ahorro',
      saldoInicial: 2000,
      saldoActual: 2600,
      estado: true,
      clienteId: 1,
      nombreCliente: 'Jose Lema'
    }
  ];

  beforeEach(async () => {
    const movimientoServiceMock = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByCuentaId: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    };

    const cuentaServiceMock = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByClienteId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MovimientosComponent, FormsModule],
      providers: [
        { provide: MovimientoService, useValue: movimientoServiceMock },
        { provide: CuentaService, useValue: cuentaServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientosComponent);
    component = fixture.componentInstance;
    movimientoService = TestBed.inject(MovimientoService) as jest.Mocked<MovimientoService>;
    cuentaService = TestBed.inject(CuentaService) as jest.Mocked<CuentaService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movimientos on init', () => {
    movimientoService.getAll.mockReturnValue(of(mockMovimientos));
    cuentaService.getAll.mockReturnValue(of(mockCuentas));

    component.ngOnInit();

    expect(movimientoService.getAll).toHaveBeenCalled();
    expect(component.movimientos).toEqual(mockMovimientos);
    expect(component.movimientosFiltrados).toEqual(mockMovimientos);
  });

  it('should filter movimientos by search term', () => {
    component.movimientos = mockMovimientos;
    component.movimientosFiltrados = mockMovimientos;

    component.onSearch('478758');

    expect(component.movimientosFiltrados.length).toBe(1);
    expect(component.movimientosFiltrados[0].numeroCuenta).toBe('478758');
  });

  it('should open create modal', () => {
    component.openCreateModal();

    expect(component.showModal).toBe(true);
  });

  it('should validate form correctly', () => {
    // Formulario inválido - sin cuenta
    component.movimientoForm = {
      tipoMovimiento: 1,
      valor: 500,
      cuentaId: 0
    };

    expect(component.validateForm()).toBe(false);

    // Formulario inválido - valor cero
    component.clearMessages();
    component.movimientoForm = {
      tipoMovimiento: 1,
      valor: 0,
      cuentaId: 1
    };

    expect(component.validateForm()).toBe(false);

    // Formulario válido
    component.clearMessages();
    component.movimientoForm = {
      tipoMovimiento: 1,
      valor: 500,
      cuentaId: 1
    };

    expect(component.validateForm()).toBe(true);
  });

  it('should call service when creating movimiento', () => {
    const newMovimiento: Movimiento = {
      id: 2,
      fecha: '2025-01-01T11:00:00',
      tipoMovimiento: 'Credito',
      valor: 500,
      saldo: 3100,
      cuentaId: 1,
      numeroCuenta: '478758'
    };

    movimientoService.getAll.mockReturnValue(of([...mockMovimientos, newMovimiento]));
    movimientoService.create.mockReturnValue(of(newMovimiento));

    component.movimientoForm = {
      tipoMovimiento: 1,
      valor: 500,
      cuentaId: 1
    };

    component.createMovimiento();

    expect(movimientoService.create).toHaveBeenCalledWith({
      tipoMovimiento: 1,
      valor: 500,
      cuentaId: 1
    });
  });

  it('should call showError when service returns error', () => {
    const errorResponse = { error: { message: 'Saldo no disponible' } };
    movimientoService.create.mockReturnValue(throwError(() => errorResponse));

    const showErrorSpy = jest.spyOn(component, 'showError');

    component.movimientoForm = {
      tipoMovimiento: 2,
      valor: 1000,
      cuentaId: 1
    };

    component.createMovimiento();

    expect(showErrorSpy).toHaveBeenCalledWith('Saldo no disponible');
  });

  it('should delete movimiento after confirmation', () => {
    global.confirm = jest.fn(() => true);
    movimientoService.delete.mockReturnValue(of(void 0));
    movimientoService.getAll.mockReturnValue(of([]));

    component.deleteMovimiento(1);

    expect(movimientoService.delete).toHaveBeenCalledWith(1);
  });

  it('should not delete movimiento if not confirmed', () => {
    global.confirm = jest.fn(() => false);

    component.deleteMovimiento(1);

    expect(movimientoService.delete).not.toHaveBeenCalled();
  });
});